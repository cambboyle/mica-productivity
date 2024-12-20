'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserPreferences = sequelize.define('UserPreferences', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
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
      type: DataTypes.JSONB,
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
    tableName: 'user_preferences',
    timestamps: true
  });

  UserPreferences.associate = function(models) {
    UserPreferences.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return UserPreferences;
};
