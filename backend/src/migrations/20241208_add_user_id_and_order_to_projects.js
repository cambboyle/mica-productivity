module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Projects', 'userId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Projects', 'order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    // Add index for userId for better query performance
    await queryInterface.addIndex('Projects', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Projects', ['userId']);
    await queryInterface.removeColumn('Projects', 'order');
    await queryInterface.removeColumn('Projects', 'userId');
  }
};
