const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { generateSeedProjects } = require('./projectSeeder');
const sequelize = require('../config/database');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

async function seedDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create a test user
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      id: uuidv4(),
      email: 'test@example.com',
      password_hash: hashedPassword,
      name: 'Test User'
    });
    console.log('Test user created');

    // Generate seed projects
    const projectsData = generateSeedProjects(user.id);

    // Create projects and their tasks
    for (const projectData of projectsData) {
      const { tasks: tasksData, ...projectFields } = projectData;
      
      // Create project
      const project = await Project.create(projectFields);
      console.log(`Created project: ${project.title}`);

      // Create tasks for the project
      if (tasksData && tasksData.length > 0) {
        for (const taskData of tasksData) {
          const task = await Task.create({
            ...taskData,
            projectId: project.id,
            userId: user.id
          });
          console.log(`Created task: ${task.title}`);
        }
      }
    }

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder if this script is executed directly
if (require.main === module) {
  seedDatabase();
}
