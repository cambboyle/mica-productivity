const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");

const UserPreferences = sequelize.define(
  "UserPreferences",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'userId',
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    accentColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "#6366f1", // Default indigo color
    },
  },
  {
    tableName: "user_preferences",
    underscored: false,
  }
);

// Define the association
UserPreferences.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    field: 'userId'
  },
  as: 'user',
  constraints: true
});

module.exports = UserPreferences;
