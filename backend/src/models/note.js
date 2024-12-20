'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      Note.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  
  Note.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: '📝'
    },
    isFavorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Note',
    tableName: 'Notes',
    timestamps: true,
    underscored: true,
  });
  
  return Note;
};
