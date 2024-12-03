import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const verifyToken = async () => {
        try {
          setAuthToken(storedToken);
          const response = await api.get("/auth/verify");
          setUser(response.data.user);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      };
      verifyToken();
    }
  }, []);

  const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common["x-auth-token"] = token;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["x-auth-token"];
      localStorage.removeItem("token");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data;
      setAuthToken(newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Login failed. Please try again.");
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data;
      setAuthToken(newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Registration failed. Please try again.");
    }
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
