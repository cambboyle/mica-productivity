'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tasks', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'todo'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tasks', 'status');
  }
};
