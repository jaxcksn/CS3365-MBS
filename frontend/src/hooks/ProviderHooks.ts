import { createContext, useContext } from "react";
import { InProgressBooking } from "../contexts/MBSContext";
import { MovieInformation } from "../types/api.model";

// Movie Booking System Context Hook

export interface MBSContextType {
  ipBooking: InProgressBooking | null;
  cachedShowing: MovieInformation | undefined;
  updateIpBooking: (ip: InProgressBooking) => void;
  setCachedShowing: (showing: MovieInformation | undefined) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const MBSContext = createContext<MBSContextType | undefined>(undefined);
export const useMBS = () => {
  const context = useContext(MBSContext);
  if (!context) {
    throw new Error("useMBS must be used within an MBSProvider");
  }
  return context;
};

// Auth Provider Context Hook

export interface AuthContextType {
  accessToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
