const { Sequelize } = require('sequelize');
require('dotenv').config({ path: __dirname + '/../.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    schema: 'vns_saree',
    timestamps: false // The SQL didn't show timestamps, but we can add them later if needed
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // This will create tables if they don't exist
    console.log('PostgreSQL connected and synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
