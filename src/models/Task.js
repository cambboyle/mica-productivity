const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Title is required
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Optional description
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false,
      defaultValue: "medium",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Store tags as an array of strings
      allowNull: true,
    },
    userId: {
      // Add userId field to associate tasks with users
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tasks",
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = Task;
