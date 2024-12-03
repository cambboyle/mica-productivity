import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios, { AxiosError } from "axios";

interface AuthContextProps {
  user: any;
  token: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  email: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;

      // Verify token and fetch user data
      const verifyToken = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/auth/verify",
            {
              headers: {
                "x-auth-token": token,
              },
            }
          );
          setUser(response.data); // Set user data from the response
        } catch (error) {
          console.error("Token verification failed:", error);
          handleLogout(); // Call logout if verification fails
        }
      };

      verifyToken();
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setEmail(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      setEmail(email);
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["x-auth-token"] = newToken;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email,
          password,
        }
      );
      
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      setEmail(email);
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["x-auth-token"] = newToken;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error("Registration failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        email,
        login,
        register,
        logout: handleLogout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
