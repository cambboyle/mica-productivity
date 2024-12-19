const { Project, Task } = require('../models');
const { generateSeedProjects } = require('./projectSeeder');

const seedDatabase = async (userId) => {
  try {
    // Generate seed data
    const projects = generateSeedProjects(userId);

    // Create projects and their tasks
    for (const projectData of projects) {
      const tasks = projectData.tasks;
      delete projectData.tasks;

      // Create project
      const project = await Project.create(projectData);

      // Create tasks for the project
      for (const taskData of tasks) {
        await Task.create({
          ...taskData,
          projectId: project.id
        });
      }
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = {
  seedDatabase
};
