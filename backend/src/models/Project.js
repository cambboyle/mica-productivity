'use strict';

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
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
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#4A90E2'
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'completed', 'archived']]
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'Projects',
    timestamps: true
  });

  Project.associate = function(models) {
    Project.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Project.hasMany(models.Task, {
      foreignKey: 'projectId',
      as: 'tasks',
      onDelete: 'SET NULL'
    });
  };

  return Project;
};
