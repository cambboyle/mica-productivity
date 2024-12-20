require('dotenv').config();

const { Sequelize } = require('sequelize');
const path = require('path');

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.error('Missing required environment variables:');
  console.error('DB_USER:', process.env.DB_USER);
  console.error('DB_PASSWORD:', process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]');
  console.error('DB_NAME:', process.env.DB_NAME);
  process.exit(1);
}

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

// Create Sequelize instance
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    port: config.development.port,
    dialect: config.development.dialect,
    logging: config.development.logging,
    define: config.development.define,
    pool: config.development.pool
  }
);

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.error('Connection details:', {
      host: config.development.host,
      port: config.development.port,
      username: config.development.username,
      database: config.development.database,
    });
  }
}

// Call the test function
testConnection();

// Export both the Sequelize instance and the config
module.exports = sequelize;
module.exports.config = config;
