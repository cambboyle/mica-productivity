const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors"); // Import cors
const taskRoutes = require("./routes/tasks");

const app = express();

// Middleware for CORS
app.use(cors()); // Allow all origins by default

// Middleware for parsing JSON requests
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    // Sync models with the database
    await sequelize.sync({ alter: true }); // Ensure the database schema matches the models
    console.log("Models synchronized!");

    // Start the server
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
