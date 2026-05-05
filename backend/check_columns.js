const { sequelize } = require('./src/config/db');

async function test() {
  try {
    const [results] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'colors' AND table_schema = 'vns_saree'");
    console.log('Columns in colors table:', results);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

test();
