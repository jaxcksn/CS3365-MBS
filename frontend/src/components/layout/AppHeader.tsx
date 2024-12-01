import {
  AppShell,
  TextInput,
  Button,
  useMantineTheme,
  ActionIcon,
  Drawer,
  NavLink,
  Title,
  Checkbox,
  SegmentedControl,
  Stack,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import Logo from "../../assets/RaiderWatchLogo.svg?react";
import MiniLogo from "../../assets/MiniLogo.svg?react";
import { useMediaQuery } from "@mantine/hooks";
import { useAuth, useMBS } from "../../hooks/ProviderHooks";
import "./AppHeader.css";
import { useNavigate } from "react-router-dom";

export interface AppHeaderProps {
  showSearch: boolean;
  inputValue?: string;
  setValue?: (value: string) => void;
}

const DevSettings = () => {
  const mbs = useMBS();
  return (
    <>
      <Checkbox
        label="Enable Debug Notifications"
        checked={mbs.isDebug}
        onChange={(event) => mbs.setIsDebug(event.currentTarget.checked)}
      />
      <Checkbox
        label="Enable Mock Payments"
        checked={mbs.isMockPayment}
        onChange={(event) => mbs.setIsMockPayment(event.currentTarget.checked)}
      />
      <Checkbox
        label="Enable Mock Mode"
        checked={mbs.isMockMode}
        onChange={(event) => mbs.setIsMockMode(event.currentTarget.checked)}
      />
    </>
  );
};

export const AppHeader = (props: AppHeaderProps) => {
  const auth = useAuth();
  const mbs = useMBS();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const { toggleColorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  return (
    <AppShell.Header pos="relative" className="header">
      <div className="app-header">
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
          }}
        >
          {!isMobile && isMd && props.showSearch ? (
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
          {!isMd && !isMobile && (
            <Button
              variant="outline"
              color="white"
              onClick={() => navigate("/my-tickets")}
            >
              My Tickets
            </Button>
          )}
          {!isMobile && (
            <ActionIcon
              variant="subtle"
              color="white"
              size="lg"
              ml="md"
              onClick={() => {
                toggleColorScheme();
              }}
            >
              {computedColorScheme === "dark" ? (
                <i className="bi bi-sun" style={{ fontSize: "1.2rem" }} />
              ) : (
                <i className="bi bi-moon" style={{ fontSize: "1.2rem" }} />
              )}
            </ActionIcon>
          )}
          <ActionIcon
            variant="subtle"
            color="white"
            size="lg"
            ml="md"
            onClick={() => {
              mbs.openOptions();
            }}
          >
            <i className="bi bi-list" style={{ fontSize: "1.5rem" }} />
          </ActionIcon>
        </div>
      </div>
      <Drawer
        opened={mbs.optionsDrawer}
        onClose={() => mbs.closeOptions()}
        title="Options Menu"
        position="right"
      >
        <Title order={4} mb="sm">
          Navigate
        </Title>
        <NavLink
          label="Home"
          leftSection={<i className="bi bi-house" />}
          onClick={() => {
            navigate("/");
            mbs.closeOptions();
          }}
          active={window.location.pathname === "/"}
        />
        <NavLink
          label="My Tickets"
          leftSection={<i className="bi bi-ticket-perforated" />}
          onClick={() => {
            navigate("/my-tickets");
            mbs.closeOptions();
          }}
          active={window.location.pathname === "/my-tickets"}
        />
        {auth.role === "admin" && (
          <NavLink
            label="Admin"
            leftSection={<i className="bi bi-sliders" />}
            onClick={() => {
              navigate("/admin");
              mbs.closeOptions();
            }}
            active={window.location.pathname === "/admin"}
          />
        )}
        <NavLink
          label="Logout"
          leftSection={<i className="bi bi-box-arrow-right" />}
          onClick={() => {
            auth.logout();
            mbs.closeOptions();
          }}
        />
        {isMobile && (
          <>
            <Title order={4} mb="sm">
              UI Settings
            </Title>
            <SegmentedControl
              value={computedColorScheme}
              onChange={(value) => {
                setColorScheme(value as "light" | "dark");
              }}
              fullWidth
              data={[
                { label: "Dark", value: "dark" },
                { label: "Light", value: "light" },
              ]}
            />
          </>
        )}
        <>
          <Title order={4} mt="sm" mb="sm">
            Developer Settings
          </Title>
          <Stack>
            <DevSettings />
          </Stack>
        </>
      </Drawer>
    </AppShell.Header>
  );
};
