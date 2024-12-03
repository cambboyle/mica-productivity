const { Sequelize } = require("sequelize");
require("dotenv").config();

// Ensure all required environment variables are present
const requiredEnvVars = ['DB_USER', 'DB_PASS', 'DB_NAME', 'DB_HOST'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const development = {
  username: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || '',
  host: process.env.DB_HOST || 'localhost',
  dialect: "postgres"
};

const production = {
  use_env_variable: "DATABASE_URL",
  dialect: "postgres",
  dialectOptions: {
    ssl: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

let sequelize;

// Check if running in production (Heroku)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, production);
} else {
  // Local development database configuration using environment variables
  sequelize = new Sequelize(
    development.database,
    development.username,
    development.password,
    {
      host: development.host,
      dialect: development.dialect
    }
  );
}

module.exports = {
  development,
  production,
  sequelize
};