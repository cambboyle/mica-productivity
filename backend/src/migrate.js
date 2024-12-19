const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');
const sequelize = require('./config/database');

const umzug = new Umzug({
  migrations: {
    glob: ['migrations/*.js', { cwd: __dirname }],
    resolve: ({ name, path, context }) => {
      const migration = require(path);
      return {
        name,
        up: async () => {
          console.log(`Running migration: ${name}`);
          return migration.up(context, Sequelize);
        },
        down: async () => migration.down(context, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

(async () => {
  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('Database connection successful');

    // Get specific migration name from command line args
    const migrationName = process.argv[2];
    
    if (migrationName) {
      // Run specific migration
      console.log(`Running specific migration: ${migrationName}`);
      const migrations = await umzug.up({ to: migrationName });
      console.log('Migration executed:', migrations.map(m => m.name));
    } else {
      // Run all pending migrations
      const migrations = await umzug.up();
      console.log('All migrations executed:', migrations.map(m => m.name));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
})();
