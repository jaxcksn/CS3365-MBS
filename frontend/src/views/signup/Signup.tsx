import {
  Button,
  Group,
  Paper,
  PasswordInput,
  Space,
  TextInput,
  Text,
  Title,
  Flex,
  useMantineTheme,
  Checkbox,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/RaiderWatchLogo.svg?react";
import setBodyColor from "../../utils/helpers";
import PhoneNumberInput from "../../components/inputs/PhoneNumberInput";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import validator from "validator";
import { useMediaQuery } from "@mantine/hooks";
import { APP_MODE } from "../../constants/Constants";

import "../login/Login.css";
import { useState } from "react";
import { RegisterRequest } from "../../types/api.model";
import apiService from "../../services/apiService";

export default function Signup() {
  const schema = z.object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.string().email(),
    password:
      APP_MODE === "PROD"
        ? z
            .string()
            .refine(
              validator.isStrongPassword,
              "Must have at least 8 characters, 1 uppercase, 1 number, and 1 special character"
            )
        : z.string().min(6),
    phone_number: z
      .string()
      .refine(validator.isMobilePhone, "Invalid Phone Number"),
    address: z.string().min(1),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      phone_number: "",
      firstname: "",
      lastname: "",
      address: "",
    },
    validateInputOnBlur: true,
    validate: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const registerStatus = await apiService.register({
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
        firstname: data.firstname,
        lastname: data.lastname,
        address: data.address,
      });

      if (registerStatus === 201 || registerStatus === 200) {
        navigate("/login?registered=true");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [didAgree, setDidAgree] = useState(false);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  setBodyColor({ color: "var(--mantine-color-myColor-filled)" });

  return (
    <div
      style={{
        minHeight: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        padding: "1rem 0",
      }}
    >
      <Paper shadow="md" p="xl" className="login-card" radius="lg">
        <Group justify="center" style={{ maxHeight: "100%" }}>
          <div style={{ width: "50%" }}>
            <Logo fill="var(--mantine-color-myColor-filled)" width="100%" />
          </div>
        </Group>
        <Title order={1} pt={10}>
          Sign Up
        </Title>
        <Space h="lg" />
        <form
          onSubmit={form.onSubmit((data) => {
            onSubmit(data);
          })}
        >
          <Flex gap="xs" direction="column">
            <Flex
              direction={{
                base: "column",
                md: "row",
              }}
              gap="xs"
            >
              <TextInput
                withAsterisk
                label="First Name"
                placeholder="First Name"
                key={form.key("firstname")}
                {...form.getInputProps("firstname")}
                size={isMobile ? "md" : "sm"}
                flex={1}
              />
              <TextInput
                withAsterisk
                label="Last Name"
                placeholder="Last Name"
                key={form.key("lastname")}
                {...form.getInputProps("lastname")}
                size={isMobile ? "md" : "sm"}
                flex={1}
              />
            </Flex>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Email"
              key={form.key("email")}
              {...form.getInputProps("email")}
              size={isMobile ? "md" : "sm"}
            />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Password"
              type="password"
              key={form.key("password")}
              {...form.getInputProps("password")}
              size={isMobile ? "md" : "sm"}
            />
            <PhoneNumberInput
              withAsterisk
              key={form.key("phone_number")}
              {...form.getInputProps("phone_number")}
              size={isMobile ? "md" : "sm"}
            />
            <TextInput
              withAsterisk
              label="Address"
              placeholder="Address"
              key={form.key("address")}
              {...form.getInputProps("address")}
              size={isMobile ? "md" : "sm"}
              flex={1}
            />
            <Checkbox
              label="I agree to follow the Terms of Service"
              checked={didAgree}
              onChange={(e) => {
                setDidAgree(e.currentTarget.checked);
              }}
            />
            <Button
              fullWidth
              variant="filled"
              type="submit"
              mt="sm"
              disabled={!didAgree}
            >
              Create Account
            </Button>

            <Group justify="flex-end">
              <Text>
                Already have an account?{" "}
                <Link
                  className="link"
                  to="/login"
                  replace
                  style={{ fontWeight: "bold" }}
                >
                  Log In Here
                </Link>
              </Text>
            </Group>
          </Flex>
        </form>
      </Paper>
    </div>
  );
}
