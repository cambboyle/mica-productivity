const { Project, Task, Op } = require('../models');

// Get all projects for a user
exports.getProjects = async (userId) => {
  try {
    return await Project.findAll({
      where: { userId },
      order: [['order', 'ASC']],
      include: [{
        model: Task,
        as: 'tasks',
      }],
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Get a single project
exports.getProject = async (projectId, userId) => {
  try {
    const project = await Project.findOne({
      where: {
        id: projectId,
        userId,
      },
      include: [{
        model: Task,
        as: 'tasks',
      }],
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

// Create a new project
exports.createProject = async (projectData) => {
  try {
    // Get the highest order number
    const maxOrder = await Project.max('order', {
      where: { userId: projectData.userId },
    });

    const project = await Project.create({
      ...projectData,
      order: (maxOrder || 0) + 1,
    });

    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update a project
exports.updateProject = async (projectId, userId, updateData) => {
  try {
    const [updated] = await Project.update(updateData, {
      where: {
        id: projectId,
        userId,
      },
    });
    return updated > 0;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
exports.deleteProject = async (projectId, userId) => {
  try {
    const deleted = await Project.destroy({
      where: {
        id: projectId,
        userId,
      },
    });
    return deleted > 0;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Reorder projects
exports.reorderProject = async (projectId, userId, { newOrder }) => {
  try {
    const project = await Project.findOne({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const currentOrder = project.order;

    if (newOrder === currentOrder) {
      return true;
    }

    // Update orders of other projects
    if (newOrder > currentOrder) {
      await Project.update(
        { order: Project.literal('order - 1') },
        {
          where: {
            userId,
            order: {
              [Op.gt]: currentOrder,
              [Op.lte]: newOrder,
            },
          },
        }
      );
    } else {
      await Project.update(
        { order: Project.literal('order + 1') },
        {
          where: {
            userId,
            order: {
              [Op.gte]: newOrder,
              [Op.lt]: currentOrder,
            },
          },
        }
      );
    }

    // Update the project's order
    await project.update({ order: newOrder });
    return true;
  } catch (error) {
    console.error('Error reordering project:', error);
    throw error;
  }
};
