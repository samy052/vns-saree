const { sequelize } = require('./src/config/db');

async function fixSchema() {
  try {
    await sequelize.authenticate();
    console.log('Connected.');

    // Fix Colors table
    console.log('Fixing colors table...');
    try {
      await sequelize.query('ALTER TABLE "vns_saree"."colors" ADD COLUMN IF NOT EXISTS "description" TEXT');
    } catch (e) { console.log('Colors fix skipped or failed:', e.message); }

    // Fix Coupons table
    console.log('Fixing coupons table...');
    const couponColumns = [
      ['description', 'VARCHAR(255)'],
      ['discount_type', 'VARCHAR(50) DEFAULT \'percentage\''],
      ['discount_amount', 'DECIMAL(10, 2)'],
      ['max_discount_amount', 'DECIMAL(10, 2)'],
      ['usage_limit', 'INTEGER'],
      ['usage_limit_per_user', 'INTEGER DEFAULT 1'],
      ['usage_count', 'INTEGER DEFAULT 0'],
      ['applicable_product_id', 'INTEGER'],
      ['valid_from', 'TIMESTAMP WITH TIME ZONE'],
      ['display_on_homepage', 'BOOLEAN DEFAULT false'],
      ['banner_text', 'VARCHAR(255)']
    ];

    for (const [col, type] of couponColumns) {
      try {
        await sequelize.query(`ALTER TABLE "vns_saree"."coupons" ADD COLUMN IF NOT EXISTS "${col}" ${type}`);
        console.log(`Added ${col} to coupons`);
      } catch (e) {
        console.log(`Failed to add ${col} to coupons:`, e.message);
      }
    }

    console.log('Schema fix completed.');
  } catch (error) {
    console.error('Fix failed:', error);
  } finally {
    await sequelize.close();
  }
}

fixSchema();
