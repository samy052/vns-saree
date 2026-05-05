const { sequelize } = require("../src/config/db");

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Drop weave_type and zari_type
    await sequelize.query('ALTER TABLE vns_saree.products DROP COLUMN IF EXISTS weave_type;');
    await sequelize.query('ALTER TABLE vns_saree.products DROP COLUMN IF EXISTS zari_type;');
    console.log('Dropped weave_type and zari_type columns.');

    // Add color_stocks JSONB column
    await sequelize.query('ALTER TABLE vns_saree.products ADD COLUMN IF NOT EXISTS color_stocks JSONB DEFAULT \'{}\'::jsonb;');
    console.log('Added color_stocks JSONB column.');

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

migrate();
