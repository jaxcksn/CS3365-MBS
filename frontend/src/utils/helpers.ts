export default function setBodyColor({ color }: { color: string }) {
  document.documentElement.style.setProperty("--bodyColor", color);
}
