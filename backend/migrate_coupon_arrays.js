const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  define: {
    schema: 'vns_saree'
  }
});

async function migrate() {
  try {
    console.log("Starting Target Array Migration...");
    
    const columns = [
      'applicable_category_id',
      'applicable_product_id',
      'applicable_variety_id',
      'applicable_color_id',
      'applicable_occasion_id'
    ];

    for (const col of columns) {
      console.log(`Converting ${col} to array...`);
      // Change type and handle conversion
      await sequelize.query(`ALTER TABLE vns_saree.coupons ALTER COLUMN ${col} TYPE integer[] USING ARRAY[${col}]::integer[]`);
      // Remove constraints if any (they were referring to single IDs)
      try {
         await sequelize.query(`ALTER TABLE vns_saree.coupons DROP CONSTRAINT IF EXISTS coupons_${col}_fkey`);
      } catch (e) {}
    }

    // Add material_id if it doesn't exist
    await sequelize.query(`ALTER TABLE vns_saree.coupons ADD COLUMN IF NOT EXISTS applicable_material_id integer[]`);

    console.log("Migration Complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration Failed:", err);
    process.exit(1);
  }
}

migrate();
