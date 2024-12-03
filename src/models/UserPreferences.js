const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
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
    // Add more preference fields here as needed
  },
  {
    tableName: "user_preferences",
    timestamps: true,
  }
);

// Set up associations
UserPreferences.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasOne(UserPreferences, {
  foreignKey: 'userId',
  as: 'preferences'
});

module.exports = UserPreferences;
