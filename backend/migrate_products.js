const { sequelize } = require("./src/config/db");
const { DataTypes } = require("sequelize");

async function migrate() {
  try {
    console.log("Starting migration in vns_saree schema...");

    // 1. Add 'images' column if it doesn't exist
    await sequelize.query(`
      ALTER TABLE "vns_saree"."products"
      ADD COLUMN IF NOT EXISTS "images" JSONB DEFAULT '[]'::jsonb
    `);
    console.log("Added 'images' column.");

    // 2. Migrate existing data
    const [products] = await sequelize.query(`
      SELECT id, product_images_by_color, cover_image_url, image_url 
      FROM "vns_saree"."products"
    `);
    
    for (const product of products) {
      const imagesByColor = product.product_images_by_color || {};
      const coverUrl = product.cover_image_url || product.image_url;
      const consolidatedImages = [];

      Object.entries(imagesByColor).forEach(([colorId, urls]) => {
        if (Array.isArray(urls)) {
          urls.forEach((url) => {
            consolidatedImages.push({
              color_id: parseInt(colorId, 10),
              url: url,
              is_cover: url === coverUrl,
            });
          });
        }
      });

      // If no cover is set but we have images, set the first one as cover
      if (consolidatedImages.length > 0 && !consolidatedImages.some(img => img.is_cover)) {
        consolidatedImages[0].is_cover = true;
      }

      await sequelize.query(
        'UPDATE "vns_saree"."products" SET images = :images WHERE id = :id',
        {
          replacements: {
            images: JSON.stringify(consolidatedImages),
            id: product.id,
          },
        }
      );
    }
    console.log(`Migrated images for ${products.length} products.`);

    // 3. Remove unnecessary columns
    const columnsToRemove = [
      "image_url",
      "product_images_by_color",
      "cover_image_url",
      "sku",
      "meta_title",
      "meta_description"
    ];

    for (const col of columnsToRemove) {
      try {
        await sequelize.query(`ALTER TABLE "vns_saree"."products" DROP COLUMN IF EXISTS "${col}"`);
        console.log(`Removed column: ${col}`);
      } catch (e) {
        console.log(`Could not remove ${col}: ${e.message}`);
      }
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await sequelize.close();
  }
}

migrate();
