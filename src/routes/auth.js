const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { Pool } = require("pg");
require("dotenv").config();

const router = express.Router();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Register User
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();

    // Check if the user already exists
    const userExists = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      client.release();
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const result = await client.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    client.release();
    res.json({ token });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).send("Server error");
  }
});

// Login User
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const client = await pool.connect();

      // Check if the user exists
      const userResult = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      const user = userResult.rows[0];

      if (!user) {
        client.release();
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        client.release();
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Generate token
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

      client.release();
      res.json({ 
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (err) {
      console.error("Login Error:", err.message);
      res.status(500).send("Server error");
    }
  }
);

// Verify Token
router.get("/verify", authMiddleware, (req, res) => {
  res.json(req.user); // Send back the user data if the token is valid
});

// New endpoint to get user data
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const client = await pool.connect();
    const userId = req.user.id; // Get user ID from the token

    // Fetch user data
    const userResult = await client.query(
      "SELECT email FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const userEmail = userResult.rows[0].email; // Get the user's email
    res.json({ email: userEmail }); // Return the user's email
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = {
  router,
  authMiddleware
};
