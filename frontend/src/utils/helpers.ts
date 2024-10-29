import { countries } from "../constants/Constants";

export default function setBodyColor({ color }: { color: string }) {
  document.documentElement.style.setProperty("--bodyColor", color);
}

export const countryCodes = new Set(Object.keys(countries));
