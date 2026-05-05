const { sequelize } = require('./src/config/db');

async function test() {
  try {
    const tables = ['colors', 'occasions', 'products', 'coupons'];
    for (const table of tables) {
      const [results] = await sequelize.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${table}' AND table_schema = 'vns_saree'`);
      console.log(`Columns in ${table} table:`, results.map(r => r.column_name));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

test();
