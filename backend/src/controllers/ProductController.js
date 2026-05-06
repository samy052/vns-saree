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
  
  // Existing images from the client (already in the DB or already uploaded)
  const existingImages = Array.isArray(productData.images) ? productData.images : [];
  
  const newImages = [];
  const files = Array.isArray(req.files) ? req.files : [];

  for (const file of files) {
    const match = /^color_(\d+)$/.exec(file.fieldname || "");
    if (!match) continue;

    const colorId = parseInt(match[1], 10);
    const uploadResult = await uploadBufferToCloudinary(file.buffer);
    newImages.push({
      color_id: colorId,
      url: uploadResult.secure_url,
      is_cover: false // Default to false, will be set later
    });
  }

  // Combined existing and new images
  let finalImages = [...existingImages, ...newImages];

  const selectedColorIds = Object.entries(productData.color_stocks || {})
    .filter(([, qty]) => parseInt(qty, 10) > 0)
    .map(([colorId]) => parseInt(colorId, 10));

  // Validation: Check if each selected color has at least one image
  for (const colorId of selectedColorIds) {
    const hasImage = finalImages.some(img => img.color_id === colorId);
    if (!hasImage) {
      throw new Error(`Color ${colorId} must have at least 1 image`);
    }
  }

  if (finalImages.length < 1) {
    throw new Error("At least one product image is required");
  }

  // Handle cover image selection
  const coverSelection = productData.cover_image_selection; // e.g., "existing:1:0" or "new:1:0"
  let coverSet = false;

  if (typeof coverSelection === "string" && coverSelection.includes(":")) {
    const [source, colorIdStr, indexRaw] = coverSelection.split(":");
    const colorId = parseInt(colorIdStr, 10);
    const index = parseInt(indexRaw, 10);

    if (source === "existing") {
      // Find the image in existingImages by color and index
      const colorImages = existingImages.filter(img => img.color_id === colorId);
      const targetImage = colorImages[index];
      if (targetImage) {
        // Reset all covers
        finalImages.forEach(img => img.is_cover = false);
        // Find this specific image in finalImages and set as cover
        const imgInFinal = finalImages.find(img => img.url === targetImage.url);
        if (imgInFinal) {
          imgInFinal.is_cover = true;
          coverSet = true;
        }
      }
    } else if (source === "new") {
      const colorNewImages = newImages.filter(img => img.color_id === colorId);
      const targetImage = colorNewImages[index];
      if (targetImage) {
        finalImages.forEach(img => img.is_cover = false);
        targetImage.is_cover = true;
        coverSet = true;
      }
    }
  }

  // If cover was not set explicitly, or selection was invalid, pick the first one
  if (!coverSet) {
    // If there was an existing cover, try to keep it
    const existingCover = finalImages.find(img => img.is_cover);
    if (!existingCover) {
      finalImages[0].is_cover = true;
    }
  }

  return {
    ...productData,
    images: finalImages,
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
