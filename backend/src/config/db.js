const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load from CWD by default

if (!process.env.DATABASE_URL) {
  console.error("CRITICAL ERROR: DATABASE_URL is not defined in environment variables.");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: process.env.DATABASE_URL.includes("supabase.co") || 
         process.env.DATABASE_URL.includes("render.com") || 
         process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false,
    } : false,
  },
  define: {
    schema: "vns_saree",
    timestamps: false,
  },
});

const runSchemaSync = async () => {
  const syncMode = (process.env.DB_SYNC || "none").trim().toLowerCase();
  if (syncMode === "alter") {
    console.log("Database schema sync started in alter mode.");
    await sequelize.sync({ alter: true });
    console.log("Database schema synchronized with alter mode.");
    return;
  }

  if (syncMode === "create" || syncMode === "true") {
    console.log("Database schema sync started in create-only mode.");
    await sequelize.sync();
    console.log("Database schema synchronized in create-only mode.");
    return;
  }

  console.log("Database schema sync skipped. Set DB_SYNC=alter only when schema changes need to be applied.");
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");

    await runSchemaSync();
  
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
