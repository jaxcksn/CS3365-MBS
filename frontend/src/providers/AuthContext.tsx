import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../services/apiService";

interface AuthContextType {
  accessToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expires, setExpires] = useState<Date | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const result = await apiService.refreshToken();
        if (result.access_token) {
          setAccessToken(result.access_token);
          setExpires(new Date(result.expires));
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (accessToken && expires) {
      const refreshTime = expires.getTime() - Date.now() - 60000; // Refresh 1 minute before expiry
      const timeoutId = setTimeout(async () => {
        await apiService.refreshToken();
      }, refreshTime);

      return () => clearTimeout(timeoutId); // Clean up on component unmount
    }
  }, [accessToken, expires]);

  const login = async (email: string, password: string) => {
    const result = await apiService.login(email, password);
    if (result.access_token) {
      setAccessToken(result.access_token);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    apiService.logout(accessToken ?? ""); // Call the logout API, revoke refresh tokens, etc.
    setAccessToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, isLoggedIn, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
