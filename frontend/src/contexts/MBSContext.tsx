import { useMemo, useState } from "react";
import { MBSContext } from "../hooks/ProviderHooks";

export interface InProgressBooking {
  movieId: number;
  theater: string;
  time: string;
  quantity: number;
}

export const MBSProvider = ({ children }: { children: React.ReactNode }) => {
  const [ipBooking, setIpBooking] = useState<InProgressBooking | null>(null);
  const context = useMemo(() => ({ ipBooking, updateIpBooking }), [ipBooking]);

  const updateIpBooking = (ip: InProgressBooking) => {
    setIpBooking((prev) => {
      if (prev) {
        return {
          ...prev,
          ...ip,
        };
      } else {
        return ip;
      }
    });
  };

  return <MBSContext.Provider value={context}>{children}</MBSContext.Provider>;
};
