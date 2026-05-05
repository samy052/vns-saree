const { sequelize } = require("./db");
const Category = require("../models/Category");
const Color = require("../models/Color");
const Material = require("../models/Material");
const Variety = require("../models/Variety");
const Product = require("../models/Product");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

const seedData = async () => {
  try {
    // 0. TRUNCATE all tables with CASCADE to clear existing data
    console.log("Clearing existing data...");
    try {
      await sequelize.query('TRUNCATE TABLE "vns_saree"."order_items" CASCADE');
      await sequelize.query('TRUNCATE TABLE "vns_saree"."orders" CASCADE');
      await sequelize.query('TRUNCATE TABLE "vns_saree"."products" CASCADE');
      await sequelize.query('TRUNCATE TABLE "vns_saree"."varieties" CASCADE');
      await sequelize.query('TRUNCATE TABLE "vns_saree"."materials" CASCADE');
      await sequelize.query('TRUNCATE TABLE "vns_saree"."colors" CASCADE');
      await sequelize.query('TRUNCATE TABLE "vns_saree"."categories" CASCADE');
      await sequelize.query('TRUNCATE TABLE "vns_saree"."coupons" CASCADE');
      await sequelize.query('TRUNCATE TABLE "vns_saree"."occasions" CASCADE');
   
      console.log("All existing data cleared with CASCADE.");
    } catch (err) {
      console.log("Some tables may not exist, continuing...");
    }

    // 1. Seed Categories - Only 2 main product types
    console.log("Inserting new categories...");
    const categories = await Category.bulkCreate([
      {
        name: "Banarasi Saree",
        slug: "banarasi-saree",
        description: "Traditional handwoven sarees from Varanasi",
      },
      { name: "Suit", slug: "suit", description: "Salwar suits and kurtis" },
    ]);
    console.log(`Created ${categories.length} categories.`);

    // 2. Seed Colors
    const colors = await Color.bulkCreate(
      [
        { name: "Black", hex_code: "#000000", slug: "black" },
        { name: "Red", hex_code: "#FF0000", slug: "red" },
        { name: "Gold", hex_code: "#D4AF37", slug: "gold" },
        { name: "Green", hex_code: "#008000", slug: "green" },
        { name: "Pink", hex_code: "#FFC0CB", slug: "pink" },
      ],
      { ignoreDuplicates: true },
    );

    // 3. Seed Materials
    const materials = await Material.bulkCreate(
      [
        {
          name: "Pure Silk",
          slug: "pure-silk",
          description: "Fine quality pure silk",
        },
        {
          name: "Cotton Silk",
          slug: "cotton-silk",
          description: "Blend of cotton and silk",
        },
        {
          name: "Organza",
          slug: "organza",
          description: "Thin, plain weave, sheer fabric",
        },
      ],
      { ignoreDuplicates: true },
    );

    // 4. Seed Varieties (under Banarasi Saree category which is index 0)
    const varieties = await Variety.bulkCreate(
      [
        { category_id: categories[0].id, name: "Katan", slug: "katan" },
        { category_id: categories[0].id, name: "Kadhwa", slug: "kadhwa" },
        { category_id: categories[0].id, name: "Tissue", slug: "tissue" },
      ],
      { ignoreDuplicates: true },
    );

    // 5. Seed Products with provided Image URLs
    const imageUrls = [
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777833885/main-sample.png",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777817039/DSC_8477_bxvrky.jpg",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777816962/rnjs8_512_kia9ex.webp",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777816886/images_zvwg98.jpg",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777816854/Handwoven_Banarasi_Ghat_Warm_Silk_Saree_Black_1_jlwo39.png",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777816809/DSC_0718-copy_jerjbw.jpg",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777816687/0029_037A2889_2048x_bm8p0d.jpg",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777816659/N_1_bbitni.jpg",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777816614/BNMU118_3_zkm1ev.jpg",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777816581/0M1A9483_fb6sxx.jpg",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777816201/DSC_4281_u9qpyv.jpg",
      "https://res.cloudinary.com/dyovgyfsi/image/upload/q_auto/f_auto/v1777815730/DSC_4947_kuavov.jpg",
    ];

    const products = imageUrls.map((url, index) => {
      const price = 2999 + index * 500;
      const discount = 15 + (index % 10);
      const oldPrice = price / (1 - discount / 100);

      return {
        name: `Heritage Saree ${index + 1}`,
        slug: `heritage-saree-${index + 1}`,
        description:
          "Exquisite hand-woven masterpiece from the heart of Varanasi. Crafted with pure gold zari and fine mulberry silk, this saree represents centuries of artisanal heritage passed down through generations. Perfect for weddings, festivals, and royal occasions.",
        price: price,
        old_price: oldPrice,
        discount_percent: discount,
        image_url: url,
        category_id: categories[index % categories.length].id,
        material_id: materials[index % materials.length].id,
        variety_id: varieties[index % varieties.length].id,
        color_id: colors[index % colors.length].id,
        is_featured: index < 4,
      };
    });

    await Product.bulkCreate(products, { ignoreDuplicates: true });

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
