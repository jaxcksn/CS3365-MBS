import { useCallback, useEffect, useMemo, useState } from "react";
import apiService from "../services/apiService";

import { ReactNode } from "react";
import { AuthContext } from "../hooks/ProviderHooks";

interface AuthProviderProps {
  children: ReactNode;
}

const noRefreshPaths = new Set(["/login", "/signup"]);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expires, setExpires] = useState<Date | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const saveAuthData = (token: string, expiration: Date) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("expires", expiration.toString());
    setAccessToken(token);
    setExpires(new Date(expiration));
    apiService.setAccessToken(token);
    setIsLoggedIn(true);
  };

  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expires");
    setAccessToken(null);
    setExpires(null);
    apiService.setAccessToken(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("accessToken");
      const expiration = localStorage.getItem("expires");

      if (expiration && token && new Date() < new Date(expiration)) {
        setExpires(new Date(expiration));
        setAccessToken(token);
        apiService.setAccessToken(token);
        setIsLoggedIn(true);
        setLoading(false);
        return;
      }

      try {
        // We shouldn't attempt to refresh the token if we're on the login or signup page.
        if (!noRefreshPaths.has(window.location.pathname)) {
          const result = await apiService.refresh();
          if (result.access_token) {
            saveAuthData(result.access_token, result.expires);
          } else {
            clearAuthData();
          }
        }
      } catch {
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (accessToken && expires) {
      const refreshTime = expires.getTime() - Date.now() - 60000;
      const timeoutId = setTimeout(async () => {
        try {
          const result = await apiService.refresh();
          if (result.access_token) {
            saveAuthData(result.access_token, result.expires);
          } else {
            clearAuthData();
          }
        } catch {
          clearAuthData();
        }
      }, refreshTime);

      return () => clearTimeout(timeoutId);
    }
  }, [accessToken, expires]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiService.login(email, password);
    if (result.access_token) {
      saveAuthData(result.access_token, result.expires);
    }
  }, []);

  const logout = useCallback(() => {
    apiService.logout();
    clearAuthData();
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }, []);

  const context = useMemo(
    () => ({
      accessToken,
      isLoggedIn,
      loading,
      login,
      logout,
    }),
    [accessToken, isLoggedIn, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
