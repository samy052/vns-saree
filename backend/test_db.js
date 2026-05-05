const { sequelize } = require('./src/config/db');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    const [results, metadata] = await sequelize.query("SELECT table_name, table_schema FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog')");
    console.log('Tables in database:', results);
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

test();
