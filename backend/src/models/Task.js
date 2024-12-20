'use strict';

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'medium',
      validate: {
        isIn: [['low', 'medium', 'high']]
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'todo',
      validate: {
        isIn: [['todo', 'in-progress', 'done']]
      }
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Projects',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    }
  }, {
    tableName: 'Tasks',
    timestamps: true
  });

  Task.associate = function(models) {
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Task.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project'
    });
  };

  return Task;
};
