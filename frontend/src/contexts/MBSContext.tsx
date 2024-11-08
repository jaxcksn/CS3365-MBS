import { useMemo, useState } from "react";
import { MBSContext } from "../hooks/ProviderHooks";
import { LoadingOverlay } from "@mantine/core";
import { MovieInformation } from "../types/api.model";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { APP_MODE } from "../constants/Constants";
import apiService from "../services/apiService";

export interface InProgressBooking {
  movieId: string;
  movieName: string;
  theater: string;
  time: string;
  date: string;
  quantity: number;
  price: Dinero.Dinero;
}

export const MBSProvider = ({ children }: { children: React.ReactNode }) => {
  const [ipBooking, setIpBooking] = useState<InProgressBooking | null>(null);
  const [cachedShowing, setCachedShowing] = useState<
    MovieInformation | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMockPayment, setIsMockPayment] = useLocalStorage<boolean>({
    key: "devSettings_mbs_isMockPayment",
    defaultValue: false,
  });

  const [optionsDrawer, optionsHandler] = useDisclosure(false);
  const [isDebug, setIsDebug] = useLocalStorage<boolean>({
    key: "devSettings_mbs_isDebug",
    defaultValue: APP_MODE === "DEV",
  });
  const [isMockMode, setIsMockMode] = useLocalStorage<boolean>({
    key: "devSettings_mbs_isMockMode",
    defaultValue: false,
  });

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

  const updateIsDebug = (debug: boolean) => {
    setIsDebug(debug);
    apiService.isDebug = debug;
  };

  const context = useMemo(
    () => ({
      ipBooking,
      cachedShowing,
      updateIpBooking,
      setCachedShowing,
      loading,
      setLoading,
      optionsDrawer,
      openOptions: optionsHandler.open,
      closeOptions: optionsHandler.close,
      isDebug,
      setIsDebug: updateIsDebug,
      isMockMode,
      setIsMockMode,
      isMockPayment,
      setIsMockPayment,
    }),
    [
      ipBooking,
      loading,
      cachedShowing,
      optionsDrawer,
      isDebug,
      isMockMode,
      isMockPayment,
    ]
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
