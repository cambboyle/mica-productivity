const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

// Check if running in production (Heroku)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Local development database configuration
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres"
  });
}

module.exports = sequelize;
