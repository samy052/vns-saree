const ProductService = require('../services/ProductService');
const { uploadBufferToCloudinary } = require("../config/cloudinary");

const logServerError = (scope, error) => {
  console.error(`[ProductController:${scope}]`, error);
};

const userFacingMessage = (error, fallback) => {
  if (!error) return fallback;
  const raw = error.message || "";

  if (raw.includes("must have at least 1 image")) return raw;
  if (raw.includes("maximum 6 images")) return raw;
  if (raw.includes("At least one product image is required")) return raw;
  if (raw.includes("Product not found")) return "Product not found.";

  return fallback;
};

const buildProductPayloadWithImages = async (req) => {
  const rawProductData = req.body.productData;
  if (!rawProductData) {
    throw new Error("productData is required");
  }

  const productData = typeof rawProductData === "string" ? JSON.parse(rawProductData) : rawProductData;
  const existingImagesByColor =
    productData.product_images_by_color && typeof productData.product_images_by_color === "object"
      ? productData.product_images_by_color
      : {};

  const uploadedImagesByColor = {};
  const files = Array.isArray(req.files) ? req.files : [];

  for (const file of files) {
    const match = /^color_(\d+)$/.exec(file.fieldname || "");
    if (!match) continue;

    const colorId = match[1];
    if (!uploadedImagesByColor[colorId]) uploadedImagesByColor[colorId] = [];
    if (uploadedImagesByColor[colorId].length >= 6) {
      throw new Error(`Color ${colorId} supports maximum 6 images`);
    }

    const uploadResult = await uploadBufferToCloudinary(file.buffer);
    uploadedImagesByColor[colorId].push(uploadResult.secure_url);
  }

  const mergedImagesByColor = {};
  const allImageUrls = [];

  const allColorKeys = new Set([
    ...Object.keys(existingImagesByColor),
    ...Object.keys(uploadedImagesByColor),
  ]);

  allColorKeys.forEach((colorKey) => {
    const existingList = Array.isArray(existingImagesByColor[colorKey]) ? existingImagesByColor[colorKey] : [];
    const uploadedList = Array.isArray(uploadedImagesByColor[colorKey]) ? uploadedImagesByColor[colorKey] : [];
    const merged = [...existingList, ...uploadedList].filter(Boolean);
    if (merged.length > 0) {
      if (merged.length > 6) {
        throw new Error(`Color ${colorKey} supports maximum 6 images`);
      }
      mergedImagesByColor[colorKey] = merged;
      allImageUrls.push(...merged);
    }
  });

  const selectedColorIds = Object.entries(productData.color_stocks || {})
    .filter(([, qty]) => parseInt(qty, 10) > 0)
    .map(([colorId]) => colorId);

  for (const colorId of selectedColorIds) {
    const colorImages = mergedImagesByColor[colorId] || [];
    if (colorImages.length < 1) {
      throw new Error(`Color ${colorId} must have at least 1 image`);
    }
  }

  if (allImageUrls.length < 1) {
    throw new Error("At least one product image is required");
  }

  const requestedCover = productData.cover_image_url;
  const coverSelection = productData.cover_image_selection;
  let coverImageUrl = "";

  if (typeof coverSelection === "string") {
    const [source, colorId, indexRaw] = coverSelection.split(":");
    const index = parseInt(indexRaw, 10);
    if (Number.isInteger(index) && index >= 0) {
      if (source === "existing") {
        const existingList = Array.isArray(existingImagesByColor[colorId]) ? existingImagesByColor[colorId] : [];
        coverImageUrl = existingList[index] || "";
      } else if (source === "new") {
        const uploadedList = Array.isArray(uploadedImagesByColor[colorId]) ? uploadedImagesByColor[colorId] : [];
        coverImageUrl = uploadedList[index] || "";
      }
    }
  }

  if (!coverImageUrl && requestedCover && allImageUrls.includes(requestedCover)) {
    coverImageUrl = requestedCover;
  }

  if (!coverImageUrl) {
    coverImageUrl = allImageUrls[0];
  }

  return {
    ...productData,
    product_images_by_color: mergedImagesByColor,
    cover_image_url: coverImageUrl,
    image_url: coverImageUrl, // Backward compatibility with legacy image field
  };
};

class ProductController {
  async getAll(req, res) {
    try {
      const products = await ProductService.getAllProducts(req.query);
      res.status(200).json(products);
    } catch (error) {
      logServerError("getAll", error);
      res.status(500).json({ message: "Failed to load products." });
    }
  }

  async getSummary(req, res) {
    try {
      const summary = await ProductService.getProductSummary();
      res.status(200).json(summary);
    } catch (error) {
      logServerError("getSummary", error);
      res.status(500).json({ message: "Failed to load product summary." });
    }
  }

  async getById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      logServerError("getById", error);
      res.status(500).json({ message: "Failed to load product." });
    }
  }

  async getBySlug(req, res) {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      logServerError("getBySlug", error);
      res.status(500).json({ message: "Failed to load product." });
    }
  }

  async create(req, res) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      logServerError("create", error);
      res.status(400).json({ message: userFacingMessage(error, "Could not create product. Please check the form values.") });
    }
  }

  async update(req, res) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json(product);
    } catch (error) {
      logServerError("update", error);
      res.status(400).json({ message: userFacingMessage(error, "Could not update product. Please check the form values.") });
    }
  }

  async delete(req, res) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      logServerError("delete", error);
      res.status(400).json({ message: userFacingMessage(error, "Could not delete product.") });
    }
  }

  async createWithImages(req, res) {
    try {
      const payload = await buildProductPayloadWithImages(req);
      const product = await ProductService.createProduct(payload);
      res.status(201).json(product);
    } catch (error) {
      logServerError("createWithImages", error);
      res.status(400).json({ message: userFacingMessage(error, "Could not create product. Please review entered values and images.") });
    }
  }

  async updateWithImages(req, res) {
    try {
      const payload = await buildProductPayloadWithImages(req);
      const product = await ProductService.updateProduct(req.params.id, payload);
      res.status(200).json(product);
    } catch (error) {
      logServerError("updateWithImages", error);
      res.status(400).json({ message: userFacingMessage(error, "Could not update product. Please review entered values and images.") });
    }
  }
}

module.exports = new ProductController();
