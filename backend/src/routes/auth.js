const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Authentication Error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Register User
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'password_hash', 'createdAt', 'updatedAt']
      });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create new user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
        email,
        password_hash: hashedPassword,
      });

      // Create and return JWT token
      const payload = {
        id: user.id,
        email: user.email,
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user.id, email: user.email } });
        }
      );
    } catch (err) {
      console.error("Error in register:", err);
      res.status(500).json({ error: "Server error during registration" });
    }
  }
);

// Login User
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'password_hash', 'createdAt', 'updatedAt'],
      });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Create and return JWT token
      const payload = {
        id: user.id,
        email: user.email,
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user.id, email: user.email } });
        }
      );
    } catch (err) {
      console.error("Error in login:", err);
      res.status(500).json({ error: "Server error during login" });
    }
  }
);

// Verify Token
router.get("/verify", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email']
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ error: "Server error during verification" });
  }
});

// Get current user
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error while fetching user" });
  }
});

module.exports = router;
