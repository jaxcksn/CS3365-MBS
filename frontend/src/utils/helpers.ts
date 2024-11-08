import { modals } from "@mantine/modals";
import { countries } from "../constants/Constants";

export default function setBodyColor({ color }: { color: string }) {
  document.documentElement.style.setProperty("--bodyColor", color);
}

export const countryCodes = new Set(Object.keys(countries));

export const showErrorModal = (error: string, onClose: () => void) => {
  modals.openContextModal({
    modal: "error",
    title: "Error",
    innerProps: { errorMessage: error },
    onClose: onClose,
  });
};
