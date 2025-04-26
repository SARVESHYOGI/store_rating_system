import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { API_URL } from "../utils/constants";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "STORE_OWNER";
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    address: string
  ) => Promise<void>;
  logout: () => void;
  updateUserPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      checkAuthStatus(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuthStatus = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check failed", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);
      setIsAuthenticated(true);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return user;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    address: string
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        address,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);
      setIsAuthenticated(true);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return user;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const updateUserPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/auth/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Password update failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
