import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext); // If you want to add context logic
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Registering user with email:", email); // Debugging log

    const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    if (!isValidEmail(email)) {
      console.error("Invalid email format");
      return; // Prevent submission if email is invalid
    }

    const userData = {
      email,
      password,
    };

    console.log("User data being sent:", userData); // Log the data being sent

    try {
      await register(email, password); // Call register function
      navigate("/dashboard"); // Redirect to Dashboard after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="button">
          Register
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>.
      </p>
    </div>
  );
};

export default Register;
