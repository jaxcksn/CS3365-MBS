import { useAuth } from "../../hooks/ProviderHooks";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Group,
  Paper,
  PasswordInput,
  Space,
  Stack,
  TextInput,
  Title,
  Text,
  useMantineTheme,
} from "@mantine/core";
import Logo from "../../assets/RaiderWatchLogo.svg?react";
import setBodyColor from "../../utils/helpers";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";

import "./Login.css";

interface LoginFormInputs {
  username: string;
  password: string;
}

export default function Login() {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    auth?.login(data.username, data.password).then(() => {
      navigate("/");
    });
  };

  const auth = useAuth();
  const navigate = useNavigate();

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  setBodyColor({ color: "var(--mantine-color-myColor-filled)" });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
      }}
    >
      <Paper shadow="md" p="xl" className="login-card" radius="lg">
        <Group justify="center">
          <div style={{ width: "50%" }}>
            <Logo
              fill="var(--mantine-color-myColor-filled)"
              width="100%"
              height="auto"
            />
          </div>
        </Group>
        <Title order={1} pt={10}>
          Login
        </Title>
        <Space h="lg" />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Your email"
              type="email"
              key={form.key("username")}
              {...form.getInputProps("username")}
              size={isMobile ? "md" : "sm"}
            />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Your password"
              type="password"
              key={form.key("password")}
              {...form.getInputProps("password")}
              pb="md"
              size={isMobile ? "md" : "sm"}
            />

            <Button fullWidth variant="filled" type="submit">
              Login
            </Button>

            <Group justify="flex-end">
              <Text>
                Don&apos;t have an account?{" "}
                <Link
                  className="link"
                  to="/signup"
                  replace
                  style={{ fontWeight: "bold" }}
                >
                  Sign Up Here
                </Link>
              </Text>
            </Group>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
