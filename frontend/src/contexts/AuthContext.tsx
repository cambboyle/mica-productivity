import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
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

const AuthContext = createContext<AuthContextType>({
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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);

  const setAuthToken = useCallback((token: string | null) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, []);

  const verifyToken = useCallback(async (storedToken: string) => {
    try {
      setAuthToken(storedToken);
      const response = await api.get("/auth/verify");
      setUser(response.data.user);
      setToken(storedToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token verification failed:", error);
      setAuthToken(null);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  }, [setAuthToken]);

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token, verifyToken]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = response.data;
      setAuthToken(newToken);
      setUser(userData);
      setToken(newToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, [setAuthToken]);

  const register = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { email, password });
      const { token: newToken, user: userData } = response.data;
      setAuthToken(newToken);
      setUser(userData);
      setToken(newToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }, [setAuthToken]);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }, [setAuthToken]);

  const value = useMemo(() => ({
    isAuthenticated,
    token,
    user,
    login,
    register,
    logout
  }), [isAuthenticated, token, user, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
