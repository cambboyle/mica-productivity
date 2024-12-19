'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, add the column as nullable
    await queryInterface.addColumn('Tasks', 'userId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Get the first user's ID (for existing tasks)
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" LIMIT 1;`
    );
    const defaultUserId = users[0]?.id;

    if (defaultUserId) {
      // Update existing tasks with the default user ID
      await queryInterface.sequelize.query(
        `UPDATE "Tasks" SET "userId" = :userId WHERE "userId" IS NULL`,
        {
          replacements: { userId: defaultUserId }
        }
      );
    }

    // Now make the column non-nullable
    await queryInterface.changeColumn('Tasks', 'userId', {
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
    await queryInterface.removeColumn('Tasks', 'userId');
  }
};
