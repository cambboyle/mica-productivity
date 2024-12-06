const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class UserPreferences extends Model {}

UserPreferences.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    unique: true
  },
  accentColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#6366f1'
  },
  colorPresets: {
    type: DataTypes.JSONB,  // Using JSONB for better performance
    allowNull: false,
    defaultValue: [],
    get() {
      const rawValue = this.getDataValue('colorPresets');
      return rawValue ? (Array.isArray(rawValue) ? rawValue : []) : [];
    },
    set(value) {
      this.setDataValue('colorPresets', Array.isArray(value) ? value : []);
    }
  }
}, {
  sequelize,
  modelName: 'UserPreferences',
  tableName: 'user_preferences'
});

module.exports = UserPreferences;
