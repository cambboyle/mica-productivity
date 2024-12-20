const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const models = {};

// Import all models
fs.readdirSync(__dirname)
  .filter(file => 
    file.indexOf('.') !== 0 && 
    file !== 'index.js' && 
    file.slice(-3) === '.js'
  )
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const model = require(modelPath)(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
