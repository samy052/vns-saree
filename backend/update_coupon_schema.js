const { sequelize } = require('./src/config/db');

async function fixSchema() {
  try {
    await sequelize.authenticate();
    console.log('Connected.');

    const couponColumns = [
      ['min_delivery_km', 'INTEGER'],
      ['applicable_variety_id', 'INTEGER'],
      ['applicable_color_id', 'INTEGER'],
      ['applicable_occasion_id', 'INTEGER']
    ];

    for (const [col, type] of couponColumns) {
      try {
        await sequelize.query(`ALTER TABLE "vns_saree"."coupons" ADD COLUMN IF NOT EXISTS "${col}" ${type}`);
        console.log(`Added ${col} to coupons`);
      } catch (e) {
        console.log(`Failed to add ${col} to coupons:`, e.message);
      }
    }

    console.log('Schema update completed.');
  } catch (error) {
    console.error('Update failed:', error);
  } finally {
    await sequelize.close();
  }
}

fixSchema();
