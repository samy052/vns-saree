const { Sequelize } = require("sequelize");
const { config } = require("./env");

if (!config.databaseUrl) {
  console.error("CRITICAL ERROR: DATABASE_URL is not defined in environment variables.");
}

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: "postgres",
  logging: config.dbLogging ? console.log : false,
  dialectOptions: {
    ssl: config.dbSsl === "true" ||
         (config.dbSsl === "auto" &&
           (config.databaseUrl.includes("supabase.co") ||
            config.databaseUrl.includes("render.com"))) ? {
      require: true,
      rejectUnauthorized: false,
    } : false,
  },
  define: {
    schema: config.dbSchema,
    timestamps: false,
  },
});

const runSchemaSync = async () => {
  const syncMode = config.dbSyncMode;
  if (config.isProduction && syncMode !== "none" && !config.allowProductionDbSync) {
    throw new Error("Refusing production DB sync. Set ALLOW_PRODUCTION_DB_SYNC=true only when intentional.");
  }

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
    console.log(`Database schema: ${config.dbSchema}`);

    await runSchemaSync();
  
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
