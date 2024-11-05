import { AppShell } from "@mantine/core";
import { AppHeader } from "./AppHeader";

const AppRoot = ({
  children,
  showSearch,
}: {
  children: React.ReactNode;
  showSearch?: boolean;
}) => {
  return (
    <AppShell
      header={{ height: 60 }}
      style={{ width: "100%", minHeight: "100%" }}
    >
      <AppHeader showSearch={showSearch ?? false} />
      {children}
    </AppShell>
  );
};

export default AppRoot;
