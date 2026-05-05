const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load from CWD by default

if (!process.env.DATABASE_URL) {
  console.error("CRITICAL ERROR: DATABASE_URL is not defined in environment variables.");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: process.env.DATABASE_URL.includes("supabase.co") || process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false,
    } : false,
  },
  define: {
    schema: "vns_saree",
    timestamps: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");
    
    // Schema has been updated manually. sync() will create tables if they don't exist.
    await sequelize.sync(); 
    console.log("Database schema synchronized.");

    // Keep schema compatible when new optional product columns are introduced.
    await sequelize.query(`
      ALTER TABLE "vns_saree"."products"
      ADD COLUMN IF NOT EXISTS "product_images_by_color" JSONB DEFAULT '{}'::jsonb
    `);
    await sequelize.query(`
      ALTER TABLE "vns_saree"."products"
      ADD COLUMN IF NOT EXISTS "cover_image_url" VARCHAR(255)
    `);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
