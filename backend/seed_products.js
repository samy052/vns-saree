const { sequelize } = require("./src/config/db");
const Product = require("./src/models/Product");
const Material = require("./src/models/Material");
const Variety = require("./src/models/Variety");
const Occasion = require("./src/models/Occasion");
const Color = require("./src/models/Color");
const Category = require("./src/models/Category");

async function seed() {
  try {
    console.log("Starting seeding process...");
    const timestamp = Date.now();

    const materials = ["Pure Silk", "Cotton Silk", "Organza", "Chiffon", "Georgette"];
    const varieties = ["Katan", "Kadhwa", "Tissue", "Tanchoi", "Jamdani"];
    const occasions = ["Wedding", "Festive", "Party Wear", "Casual", "Bridal"];
    const colors = [
      { name: "Maroon", hex: "#800000" },
      { name: "Gold", hex: "#D4AF37" },
      { name: "Emerald Green", hex: "#50C878" },
      { name: "Midnight Blue", hex: "#191970" },
      { name: "Magenta", hex: "#FF00FF" }
    ];

    const [category] = await Category.findOrCreate({
      where: { name: "Banarasi Saree" },
      defaults: { slug: "banarasi-saree" }
    });

    const matIds = [];
    for (const m of materials) {
      const [rec] = await Material.findOrCreate({
        where: { name: m },
        defaults: { slug: m.toLowerCase().replace(/ /g, "-") }
      });
      matIds.push(rec.id);
    }
    const varIds = [];
    for (const v of varieties) {
      const [rec] = await Variety.findOrCreate({
        where: { name: v },
        defaults: { slug: v.toLowerCase().replace(/ /g, "-") }
      });
      varIds.push(rec.id);
    }
    const occIds = [];
    for (const o of occasions) {
      const [rec] = await Occasion.findOrCreate({
        where: { name: o },
        defaults: { slug: o.toLowerCase().replace(/ /g, "-") }
      });
      occIds.push(rec.id);
    }
    const colIds = [];
    for (const c of colors) {
      const [rec] = await Color.findOrCreate({
        where: { name: c.name },
        defaults: {
          hex_code: c.hex,
          slug: c.name.toLowerCase().replace(/ /g, "-")
        }
      });
      colIds.push(rec.id);
    }

    const placeholderImages = [
      "https://tilfi.com/cdn/shop/products/KOH0003Red_Kashi_PureKatanSilkKashiGhatSaree_1200x.jpg",
      "https://www.holyweaves.com/cdn/shop/files/HW4488-1.jpg",
      "https://www.holyweaves.com/cdn/shop/files/HW4502-1.jpg",
      "https://www.holyweaves.com/cdn/shop/files/HW4481-1.jpg",
      "https://www.holyweaves.com/cdn/shop/files/HW4495-1.jpg"
    ];

    console.log("Creating 50 products...");

    for (let i = 1; i <= 50; i++) {
      const mrp = Math.floor(Math.random() * 10000) + 10000;
      const selling = mrp - (Math.floor(Math.random() * 3000) + 1000);
      const name = `${occasions[i % occasions.length]} ${varieties[i % varieties.length]} ${materials[i % materials.length]} Saree ${i}`;

      await Product.create({
        name: name,
        slug: name.toLowerCase().replace(/ /g, "-") + "-" + i + "-" + timestamp,
        short_description: `Exquisite ${name} with intricate zari work and premium finish.`,
        description: `This ${name} represents the fine craftsmanship of Banaras. Made with ${materials[i % materials.length]}, it features traditional patterns perfect for ${occasions[i % occasions.length]}.`,
        selling_price: selling,
        mrp_price: mrp,
        stock_quantity: Math.floor(Math.random() * 50) + 10,
        material_id: matIds[i % matIds.length],
        variety_id: varIds[i % varIds.length],
        occasion_id: occIds[i % occIds.length],
        category_id: category.id,
        is_special_collection: i % 5 === 0,
        special_collection: i % 5 === 0,
        store_front_visibility: false,
        images: [
          {
            url: placeholderImages[i % placeholderImages.length],
            is_cover: true,
            color_id: colIds[i % colIds.length]
          }
        ]
      });

      if (i % 10 === 0) console.log(`Created ${i} products...`);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await sequelize.close();
  }
}

seed();
