'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove project and task columns
    await queryInterface.removeColumn('Notes', 'projectId');
    await queryInterface.removeColumn('Notes', 'taskId');

    // Add new columns
    await queryInterface.addColumn('Notes', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    });

    await queryInterface.addColumn('Notes', 'icon', {
      type: Sequelize.STRING,
      defaultValue: '📝'
    });

    await queryInterface.addColumn('Notes', 'isFavorite', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove new columns
    await queryInterface.removeColumn('Notes', 'tags');
    await queryInterface.removeColumn('Notes', 'icon');
    await queryInterface.removeColumn('Notes', 'isFavorite');

    // Add back project and task columns
    await queryInterface.addColumn('Notes', 'projectId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Projects',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Notes', 'taskId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'ProjectTasks',
        key: 'id'
      }
    });
  }
};
