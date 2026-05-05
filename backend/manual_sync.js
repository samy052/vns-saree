const { sequelize } = require('./src/config/db');
// Import all models to ensure they are registered with Sequelize
require('./src/models/Category');
require('./src/models/Material');
require('./src/models/Variety');
require('./src/models/Color');
require('./src/models/Occasion');
require('./src/models/Product');
require('./src/models/Coupon');
require('./src/models/Order');

async function sync() {
  try {
    await sequelize.authenticate();
    console.log('Connected.');
    await sequelize.sync({ alter: true });
    console.log('All models synchronized with alter:true');
  } catch (error) {
    console.error('Sync failed:', error);
  } finally {
    await sequelize.close();
  }
}

sync();
