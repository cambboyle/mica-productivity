'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'isRecurring', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('Tasks', 'recurringSchedule', {
      type: Sequelize.ENUM("daily", "weekly", "monthly"),
      allowNull: true
    });

    await queryInterface.addColumn('Tasks', 'reminder', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'isRecurring');
    await queryInterface.removeColumn('Tasks', 'recurringSchedule');
    await queryInterface.removeColumn('Tasks', 'reminder');
  }
};
