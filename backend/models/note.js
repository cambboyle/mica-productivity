const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Note extends Model {}

Note.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: '📝',
    },
    isFavorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Note',
    tableName: 'notes',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Note;
