'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Tasks');
    if (!tableDescription.userId) {
      await queryInterface.addColumn('Tasks', 'userId', {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Tasks');
    if (tableDescription.userId) {
      await queryInterface.removeColumn('Tasks', 'userId');
    }
  }
};