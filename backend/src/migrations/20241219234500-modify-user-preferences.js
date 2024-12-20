'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, drop the foreign key constraint
    await queryInterface.removeConstraint('user_preferences', 'user_preferences_userId_fkey');

    // Change id column type to UUID
    await queryInterface.changeColumn('user_preferences', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    });

    // Change userId column type to UUID
    await queryInterface.changeColumn('user_preferences', 'userId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // First, drop the foreign key constraint
    await queryInterface.removeConstraint('user_preferences', 'user_preferences_userId_fkey');

    // Change id column back to INTEGER
    await queryInterface.changeColumn('user_preferences', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    });

    // Change userId column back to INTEGER
    await queryInterface.changeColumn('user_preferences', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    });
  }
};
