import { useMemo, useState } from "react";
import { MBSContext } from "../hooks/ProviderHooks";
import { LoadingOverlay } from "@mantine/core";
import { MovieInformation } from "../types/api.model";

export interface InProgressBooking {
  movieId: string;
  movieName: string;
  theater: string;
  time: string;
  date: string;
  quantity: number;
  price: number;
}

export const MBSProvider = ({ children }: { children: React.ReactNode }) => {
  const [ipBooking, setIpBooking] = useState<InProgressBooking | null>(null);
  const [cachedShowing, setCachedShowing] = useState<
    MovieInformation | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);

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

  const context = useMemo(
    () => ({
      ipBooking,
      cachedShowing,
      updateIpBooking,
      setCachedShowing,
      loading,
      setLoading,
    }),
    [ipBooking, loading, cachedShowing]
  );

  return (
    <MBSContext.Provider value={context}>
      <LoadingOverlay
        visible={context.loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        pos="fixed"
      />
      {children}
    </MBSContext.Provider>
  );
};
