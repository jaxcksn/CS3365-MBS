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
  Select,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";
import Logo from "../assets/RaiderWatchLogo.svg?react";
import setBodyColor, { APP_MODE } from "../main";
import { registerInformation } from "../services/apiService";
import PhoneNumberInput from "../components/PhoneNumberInput";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import validator from "validator";
import ZipCodeInput from "../components/ZipCodeInput";

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function Signup() {
  const schema = z.object({
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
    city: z.string().min(1),
    state: z.string().refine((val) => states.includes(val), "Invalid State"),
    zip: z
      .string()
      .refine((val) => validator.isPostalCode(val, "US"), "Invalid Zip Code"),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      phone_number: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    validate: zodResolver(schema),
  });
  const onSubmit = (data: registerInformation) => {
    auth.register(data).then((status) => {
      if (status === 201 || status === 200) {
        navigate("/");
      }
    });
  };

  const auth = useAuth();
  const navigate = useNavigate();

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
            <Logo
              fill="var(--mantine-color-myColor-filled)"
              width={"100%"}
              height={"auto"}
            />
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
          <Flex gap={{ base: "sm", sm: "md" }} direction={"column"}>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Password"
              type="password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <PhoneNumberInput
              key={form.key("phone_number")}
              {...form.getInputProps("phone_number")}
            />
            <TextInput
              withAsterisk
              label="Address"
              placeholder="Address"
              type="text"
              key={form.key("address")}
              {...form.getInputProps("address")}
            />
            <Flex
              w={"100%"}
              pb={"md"}
              direction={{ base: "column", sm: "row" }}
              gap={{ base: "sm", sm: "md" }}
              justify="space-between"
            >
              <TextInput
                withAsterisk
                label="City"
                placeholder="City"
                type="text"
                key={form.key("city")}
                {...form.getInputProps("city")}
                w={{ base: "100%", sm: "50%" }}
              />
              <Flex
                direction={"row"}
                gap={{ base: "sm", sm: "lg" }}
                justify="space-between"
                w={{ base: "100%", sm: "50%" }}
              >
                <Select
                  withAsterisk
                  label="State"
                  placeholder="State"
                  type="text"
                  data={states}
                  searchable
                  key={form.key("state")}
                  {...form.getInputProps("state")}
                  w={{ base: "100%", sm: "50%" }}
                />
                <ZipCodeInput
                  withAsterisk
                  label="Zip"
                  key={form.key("zip")}
                  {...form.getInputProps("zip")}
                  w={{ base: "100%", sm: "50%" }}
                />
              </Flex>
            </Flex>

            <Button fullWidth variant="filled" type="submit">
              Login
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
