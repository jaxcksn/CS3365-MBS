/* eslint-disable max-params */
import { useCallback, useEffect, useMemo, useState } from "react";
import apiService from "../services/apiService";

import { ReactNode } from "react";
import { AuthContext } from "../hooks/ProviderHooks";
import { useLocalStorage } from "@mantine/hooks";

interface AuthProviderProps {
  children: ReactNode;
}

interface Profile {
  firstname: string;
  lastname: string;
  address: string;
  phone_number: string;
}

const noRefreshPaths = new Set(["/login", "/signup"]);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>({
    key: "mbs_access_token",
    defaultValue: null,
  });
  const [expires, setExpires] = useLocalStorage<Date | null>({
    key: "mbs_expires",
    defaultValue: null,
  });
  const [role, setRole] = useLocalStorage<string>({
    key: "mbs_role",
    defaultValue: "",
  });
  const [profile, setProfile] = useState<Profile>({
    firstname: "",
    lastname: "",
    address: "",
    phone_number: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const saveAuthData = (
    token: string,
    expiration: Date,
    userRole: string,
    profile: Profile
  ) => {
    setAccessToken(token);
    setExpires(new Date(expiration));
    setRole(userRole);
    setProfile({
      firstname: profile.firstname,
      lastname: profile.lastname,
      address: profile.address,
      phone_number: profile.phone_number,
    });
    apiService.setAccessToken(token);
    setIsLoggedIn(true);
  };

  const clearAuthData = () => {
    setAccessToken(null);
    setExpires(null);
    setRole("");
    localStorage.removeItem("mbs_access_token");
    localStorage.removeItem("mbs_expires");
    localStorage.removeItem("mbs_role");
    apiService.setAccessToken(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (
        expires &&
        accessToken &&
        role !== "" &&
        new Date() < new Date(expires)
      ) {
        apiService.setAccessToken(accessToken);
        setIsLoggedIn(true);
        setLoading(false);
        return;
      }

      try {
        // We shouldn't attempt to refresh the token if we're on the login or signup page.
        if (!noRefreshPaths.has(window.location.pathname)) {
          const result = await apiService.refresh();
          if (result.access_token) {
            saveAuthData(result.access_token, result.expires, result.role, {
              firstname: result.firstname,
              lastname: result.lastname,
              address: result.address,
              phone_number: result.phone_number,
            });
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
      const refreshTime = new Date(expires).getTime() - Date.now() - 60000;
      const timeoutId = setTimeout(async () => {
        try {
          const result = await apiService.refresh();
          if (result.access_token) {
            saveAuthData(result.access_token, result.expires, result.role, {
              firstname: result.firstname,
              lastname: result.lastname,
              address: result.address,
              phone_number: result.phone_number,
            });
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
      saveAuthData(result.access_token, result.expires, result.role, {
        firstname: result.firstname,
        lastname: result.lastname,
        address: result.address,
        phone_number: result.phone_number,
      });
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
      role,
      profile,
    }),
    [accessToken, isLoggedIn, loading, login, logout, role, profile]
  );

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
