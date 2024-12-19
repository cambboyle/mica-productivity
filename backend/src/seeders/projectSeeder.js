const { v4: uuidv4 } = require('uuid');
const { addDays, subDays } = require('date-fns');

const generateSeedProjects = (userId) => {
  const today = new Date();
  
  return [
    {
      id: uuidv4(),
      userId,
      title: 'E-commerce Platform Redesign',
      description: 'Modernize the existing e-commerce platform with a new UI/UX design, improved performance, and mobile responsiveness.',
      status: 'active',
      tags: ['React', 'TypeScript', 'UI/UX', 'E-commerce'],
      color: '#4CAF50',
      order: 0,
      createdAt: subDays(today, 30).toISOString(),
      updatedAt: today.toISOString(),
      tasks: [
        {
          id: uuidv4(),
          title: 'Design System Implementation',
          description: 'Create a comprehensive design system with reusable components, color schemes, and typography guidelines.',
          status: 'in_progress',
          priority: 'high',
          dueDate: addDays(today, 7).toISOString(),
          order: 0
        },
        {
          id: uuidv4(),
          title: 'Product Page Optimization',
          description: 'Optimize product pages for better performance and SEO. Implement lazy loading and image optimization.',
          status: 'todo',
          priority: 'medium',
          dueDate: addDays(today, 14).toISOString(),
          order: 1
        },
        {
          id: uuidv4(),
          title: 'Shopping Cart Redesign',
          description: 'Redesign shopping cart with improved UX, real-time updates, and better mobile experience.',
          status: 'done',
          priority: 'high',
          dueDate: subDays(today, 2).toISOString(),
          order: 2
        }
      ]
    },
    {
      id: uuidv4(),
      userId,
      title: 'API Microservices Migration',
      description: 'Migrate monolithic backend to microservices architecture for better scalability and maintainability.',
      status: 'active',
      tags: ['Node.js', 'Microservices', 'Docker', 'Kubernetes'],
      color: '#2196F3',
      order: 1,
      createdAt: subDays(today, 45).toISOString(),
      updatedAt: today.toISOString(),
      tasks: [
        {
          id: uuidv4(),
          title: 'Service Decomposition',
          description: 'Identify and plan the decomposition of monolithic services into microservices.',
          status: 'done',
          priority: 'high',
          dueDate: subDays(today, 5).toISOString(),
          order: 0
        },
        {
          id: uuidv4(),
          title: 'Docker Container Setup',
          description: 'Set up Docker containers for each microservice with proper networking and volume management.',
          status: 'in_progress',
          priority: 'high',
          dueDate: addDays(today, 3).toISOString(),
          order: 1
        },
        {
          id: uuidv4(),
          title: 'API Gateway Implementation',
          description: 'Implement API gateway for routing and load balancing between microservices.',
          status: 'todo',
          priority: 'medium',
          dueDate: addDays(today, 10).toISOString(),
          order: 2
        }
      ]
    },
    {
      id: uuidv4(),
      userId,
      title: 'Analytics Dashboard',
      description: 'Build a real-time analytics dashboard for monitoring system performance and user behavior.',
      status: 'active',
      tags: ['React', 'D3.js', 'WebSocket', 'Analytics'],
      color: '#9C27B0',
      order: 2,
      createdAt: subDays(today, 15).toISOString(),
      updatedAt: today.toISOString(),
      tasks: [
        {
          id: uuidv4(),
          title: 'Data Visualization Components',
          description: 'Create reusable chart components using D3.js for various metrics visualization.',
          status: 'in_progress',
          priority: 'high',
          dueDate: addDays(today, 5).toISOString(),
          order: 0
        },
        {
          id: uuidv4(),
          title: 'Real-time Data Integration',
          description: 'Implement WebSocket connection for real-time data updates and live dashboard features.',
          status: 'todo',
          priority: 'medium',
          dueDate: addDays(today, 8).toISOString(),
          order: 1
        },
        {
          id: uuidv4(),
          title: 'User Behavior Tracking',
          description: 'Add user behavior tracking and implement analytics event collection system.',
          status: 'todo',
          priority: 'low',
          dueDate: addDays(today, 12).toISOString(),
          order: 2
        }
      ]
    },
    {
      id: uuidv4(),
      userId,
      title: 'Authentication System Upgrade',
      description: 'Upgrade the authentication system with OAuth 2.0, MFA, and improved security features.',
      status: 'active',
      tags: ['Security', 'OAuth', 'Node.js', 'JWT'],
      color: '#FF5722',
      order: 3,
      createdAt: subDays(today, 10).toISOString(),
      updatedAt: today.toISOString(),
      tasks: [
        {
          id: uuidv4(),
          title: 'OAuth Provider Integration',
          description: 'Integrate major OAuth providers (Google, GitHub, Microsoft) for social login.',
          status: 'done',
          priority: 'high',
          dueDate: subDays(today, 3).toISOString(),
          order: 0
        },
        {
          id: uuidv4(),
          title: 'Multi-factor Authentication',
          description: 'Implement MFA with support for authenticator apps and SMS verification.',
          status: 'in_progress',
          priority: 'high',
          dueDate: addDays(today, 4).toISOString(),
          order: 1
        },
        {
          id: uuidv4(),
          title: 'Security Audit',
          description: 'Conduct comprehensive security audit and implement recommended security measures.',
          status: 'todo',
          priority: 'medium',
          dueDate: addDays(today, 15).toISOString(),
          order: 2
        }
      ]
    }
  ];
};

module.exports = {
  generateSeedProjects
};
