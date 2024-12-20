'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Users',
    timestamps: true,
  });

  User.associate = function(models) {
    User.hasMany(models.Task, {
      foreignKey: 'userId',
      as: 'tasks'
    });

    User.hasMany(models.Project, {
      foreignKey: 'userId',
      as: 'projects'
    });

    User.hasOne(models.UserPreferences, {
      foreignKey: 'userId',
      as: 'preferences'
    });
  };

  return User;
};
