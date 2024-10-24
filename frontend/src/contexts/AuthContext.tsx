import { useCallback, useEffect, useMemo, useState } from "react";
import apiService, { registerInformation } from "../services/apiService";

import { ReactNode } from "react";
import { AuthContext } from "../hooks/ProviderHooks";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expires, setExpires] = useState<Date | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [hasRefresh, setHasRefresh] = useState(false);

  useEffect(() => {
    const isAuthRoute =
      window.location.pathname === "/login" ||
      window.location.pathname === "/signup";

    const checkLoggedIn = async () => {
      try {
        const result = await apiService.refreshToken();
        if (result.access_token) {
          setAccessToken(result.access_token);
          setExpires(new Date(result.expires));
          setHasRefresh(true);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setHasRefresh(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthRoute) {
      checkLoggedIn();
    } else {
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (accessToken && expires) {
      const refreshTime = expires.getTime() - Date.now() - 60000;
      const timeoutId = setTimeout(async () => {
        await apiService.refreshToken();
      }, refreshTime);

      return () => clearTimeout(timeoutId);
    }
  }, [accessToken, expires]);

  const login = async (email: string, password: string) => {
    const result = await apiService.login(email, password);
    if (result.access_token) {
      setAccessToken(result.access_token);
      setHasRefresh(true);
      setIsLoggedIn(true);
    }
  };

  const logout = useCallback(() => {
    apiService.logout(accessToken ?? ""); // Call the logout API, revoke refresh tokens, etc.
    setAccessToken(null);
    setHasRefresh(false);
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
  }, [accessToken]);

  const register = async (data: registerInformation) => {
    const result = await apiService.register(data);
    return result;
  };

  const context = useMemo(
    () => ({
      accessToken,
      isLoggedIn,
      loading,
      hasRefresh,
      login,
      logout,
      register,
    }),
    [accessToken, isLoggedIn, loading, hasRefresh, logout]
  );

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
