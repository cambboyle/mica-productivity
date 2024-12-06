const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tasks', 'isRecurring', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('Tasks', 'recurringSchedule', {
      type: DataTypes.ENUM("daily", "weekly", "monthly"),
      allowNull: true
    });

    await queryInterface.addColumn('Tasks', 'reminder', {
      type: DataTypes.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tasks', 'isRecurring');
    await queryInterface.removeColumn('Tasks', 'recurringSchedule');
    await queryInterface.removeColumn('Tasks', 'reminder');
  }
};
