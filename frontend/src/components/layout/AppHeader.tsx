import { AppShell, TextInput, Button, useMantineTheme } from "@mantine/core";
import Logo from "../../assets/RaiderWatchLogo.svg?react";
import MiniLogo from "../../assets/MiniLogo.svg?react";
import { useMediaQuery } from "@mantine/hooks";
import { useAuth } from "../../hooks/ProviderHooks";

import "./AppHeader.css";

export interface AppHeaderProps {
  showSearch: boolean;
  inputValue?: string;
  setValue?: (value: string) => void;
}

export const AppHeader = (props: AppHeaderProps) => {
  const auth = useAuth();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  return (
    <AppShell.Header pos="relative" className="header">
      <div className="app-header">
        <div className="logo">
          {!isMobile && isMd ? (
            <MiniLogo fill="white" height={40} width={40} />
          ) : (
            <Logo fill="white" width={200} />
          )}
        </div>
        <div className="search">
          {props.showSearch && !isMobile && (
            <TextInput
              w="100%"
              placeholder="Search for a movie"
              leftSection={<i className="bi bi-search" />}
              value={props.inputValue}
              onChange={(event) => props.setValue?.(event.currentTarget.value)}
            />
          )}
        </div>
        <div className="actions">
          <Button variant="subtle" color="white" onClick={auth.logout}>
            Logout
          </Button>
        </div>
      </div>
    </AppShell.Header>
  );
};
