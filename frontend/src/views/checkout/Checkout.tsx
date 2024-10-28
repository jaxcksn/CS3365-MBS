import {
  Container,
  Paper,
  Title,
  Text,
  Flex,
  NumberFormatter,
  Group,
  Stack,
  TextInput,
  Button,
  Divider,
  useMantineTheme,
} from "@mantine/core";
import { MBSContextType, useMBS } from "../../hooks/ProviderHooks";
import { z } from "zod";
import { countryCodes } from "../../utils/helpers";
import CountryInput from "../../components/inputs/CountryInput";
import validator from "validator";
import { useForm, zodResolver } from "@mantine/form";
import { states } from "../../constants/Constants";
import ZipCodeInput from "../../components/inputs/ZipCodeInput";
import { useEffect, useState } from "react";
import { useDebouncedCallback, useMediaQuery } from "@mantine/hooks";
import StateInput from "../../components/inputs/StateInput";
import "./Checkout.css";
import CreditCardInput from "../../components/inputs/CreditCardInput";
import creditCardType from "credit-card-type";
import { CreditCardType } from "credit-card-type/dist/types";
import MaskedInput from "../../components/inputs/MaskedInput";
import { useNavigate } from "react-router-dom";
import Amex from "../../assets/amex.svg?react";
import Mastercard from "../../assets/mastercard.svg?react";
import Visa from "../../assets/visa.svg?react";
import Discover from "../../assets/discover.svg?react";

const CheckoutSummary = ({
  isSmall,
  mbsContext,
}: {
  isSmall: boolean;
  mbsContext: MBSContextType;
}) => {
  return (
    <Paper
      shadow="xs"
      p="xl"
      radius="lg"
      h={{ base: "auto", md: "fit-content" }}
      withBorder
    >
      {isSmall && <Title order={1}>Checkout</Title>}
      <Title order={2} pb="sm">
        Summary
      </Title>
      <Group justify="space-between" align="center" gap={0}>
        <Text size="lg" fw="bold">
          x{mbsContext.ipBooking?.quantity}
          {" - "}
          {mbsContext.ipBooking?.movieName}
        </Text>
        <Text size="lg" fw="bold">
          <NumberFormatter
            prefix="$"
            decimalScale={2}
            value={
              mbsContext.ipBooking
                ? mbsContext.ipBooking.price * mbsContext.ipBooking.quantity
                : 0
            }
          />
        </Text>
      </Group>
      <Group justify="space-between" align="center" fs="1rem">
        <Text fw={600}>
          {mbsContext.ipBooking?.theater} - {mbsContext.ipBooking?.time}
        </Text>
        <Text>
          <NumberFormatter
            value={mbsContext.ipBooking ? mbsContext.ipBooking.price : 0}
            decimalScale={2}
            prefix="$"
          />{" "}
          Each
        </Text>
      </Group>
    </Paper>
  );
};

export const Checkout = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const billingAddressSchema = z.object({
    country: z
      .string({ message: "Invalid Country" })
      .refine((val) => countryCodes.has(val ?? ""), "Invalid Country"),
    address1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().refine((val) => {
      if (billingAddressForm.values.country === "US") {
        return validator.isIn(val, Object.keys(states));
      }
      return true;
    }, "Invalid state"),
    zip: z.string().refine((val) => {
      if (billingAddressForm.values.country === "US") {
        return validator.isPostalCode(val, "US");
      }
      return true;
    }),
  });

  const billingAddressForm = useForm({
    mode: "controlled",
    validate: zodResolver(billingAddressSchema),
    initialValues: {
      country: "US",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
    },
    validateInputOnBlur: true,
  });

  const [cardType, setCardType] = useState<CreditCardType | null>(null);

  const ccFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    ccNumber: z.string().refine(validator.isCreditCard, "Invalid Credit Card"),
    ccExp: z.string().regex(/^(0?[1-9]|1[0-2])\/(\d{1,2})$/),
    ccCVV: z
      .string()
      .length(
        cardType?.code.size ?? 3,
        `Invalid ${cardType?.code.name ?? "CVV"}`
      ),
  });

  const onSubmit = () => {
    ccForm.clearErrors();
    billingAddressForm.clearErrors();
    ccForm.validate();
    billingAddressForm.validate();

    if (!ccForm.isValid() || !billingAddressForm.isValid()) {
      return;
    }

    mbsContext.setLoading(true);
    setTimeout(() => {
      mbsContext.setLoading(false);
      navigate("/");
    }, 10000);
  };

  const ccForm = useForm({
    mode: "uncontrolled",
    validate: zodResolver(ccFormSchema),
    initialValues: {
      name: "",
      ccNumber: "",
      ccExp: "",
      ccCVV: "",
    },
    validateInputOnBlur: true,
  });

  const debouncedCardChange = useDebouncedCallback(
    ({ value, touched }: { value: string; touched: boolean }) => {
      if (touched && value.length > 2) {
        const ccType = creditCardType(value.replace(/\s/g, ""));

        if (ccType[0]) {
          if (cardType?.type !== ccType[0].type) {
            ccForm.clearFieldError("ccCVV");
            ccForm.clearFieldError("ccExp");
          }
          setCardType(ccType[0]);
        } else {
          setCardType(null);
        }
      } else {
        setCardType(null);
      }
    },
    1000
  );

  ccForm.watch("ccNumber", debouncedCardChange);

  const mbsContext = useMBS();

  useEffect(() => {
    if (!mbsContext.ipBooking) {
      navigate("/");
    }
  }, [mbsContext.ipBooking, navigate]);

  return (
    <Container
      pt="lg"
      pb="lg"
      fluid
      w={{
        base: "100%",
        lg: "70vw",
      }}
    >
      <Flex
        direction={{
          base: "column-reverse",
          md: "row",
        }}
        gap="md"
        w="100%"
        mih="100%"
      >
        <Paper
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          flex={4}
          shadow="xs"
          p="xl"
          radius="lg"
          h={{ base: "auto", md: "fit-content" }}
          withBorder
        >
          {!(isSmall ?? true) && <Title order={1}>Checkout</Title>}
          <form>
            <Group justify="space-between" align="center" pb="sm">
              <Title order={3}>Payment info</Title>
              <Group gap={10}>
                <Visa width="2rem" />
                <Mastercard width="2rem" />
                <Amex width="2rem" />
                <Discover width="2rem" />
              </Group>
            </Group>
            <div className="checkout-form">
              <TextInput
                label="Full Name"
                withAsterisk
                key={ccForm.key("name")}
                {...ccForm.getInputProps("name")}
                className="take-full"
              />
              <CreditCardInput
                cardtype={cardType?.type ?? "unknown"}
                label="Credit Card"
                key={ccForm.key("ccNumber")}
                {...ccForm.getInputProps("ccNumber")}
                withAsterisk
                className="take-3"
                change={(value) => {
                  // ccForm.clearFieldError("ccNumber");
                  ccForm.setValues({ ccNumber: value });
                }}
              />
              <MaskedInput
                placeholder="MM/YY"
                label="Exp. Date"
                mask="[0]0/[0]0"
                key={ccForm.key("ccExp")}
                {...ccForm.getInputProps("ccExp")}
                withAsterisk
                className="take-2 split"
              />
              <MaskedInput
                label={cardType?.code.name ?? "CVV"}
                mask={cardType?.code.size === 4 ? "0000" : "000"}
                key={ccForm.key("ccCVV")}
                {...ccForm.getInputProps("ccCVV")}
                withAsterisk
                placeholder={cardType?.code.name ?? "CVV"}
                className="take-1 split"
              />
            </div>
          </form>

          <Divider />
          <form>
            <Title order={3} pb="sm">
              Billing address
            </Title>
            <div className="checkout-form">
              <CountryInput
                label="Country"
                key={billingAddressForm.key("country")}
                {...billingAddressForm.getInputProps("country")}
                withAsterisk
                className="take-full"
              />
              <TextInput
                label="Address"
                withAsterisk
                key={billingAddressForm.key("address1")}
                {...billingAddressForm.getInputProps("address1")}
                className="take-2-3"
                placeholder="Street Address"
              />
              <TextInput
                label="Apt, Suite, Etc"
                key={billingAddressForm.key("address2")}
                {...billingAddressForm.getInputProps("address2")}
                className="take-1-3"
              />
              <TextInput
                label="City"
                withAsterisk={billingAddressForm.values.country === "US"}
                key={billingAddressForm.key("city")}
                {...billingAddressForm.getInputProps("city")}
                className="take-1-3"
                placeholder="City"
              />
              {billingAddressForm.values.country === "US" ? (
                <StateInput
                  label="State"
                  withAsterisk
                  placeholder="State"
                  useShortLabelMode
                  key={billingAddressForm.key("state")}
                  {...billingAddressForm.getInputProps("state")}
                  className="take-1-3 split"
                  comboboxProps={{ width: "fit-content" }}
                />
              ) : (
                <TextInput label="State/Province" className="take-1-3 split" />
              )}
              {billingAddressForm.values.country === "US" ? (
                <ZipCodeInput
                  withAsterisk
                  label="Zip Code"
                  key={billingAddressForm.key("zip")}
                  {...billingAddressForm.getInputProps("zip")}
                  className="take-1-3 split"
                />
              ) : (
                <TextInput
                  label="Postal Code"
                  key={billingAddressForm.key("zip")}
                  {...billingAddressForm.getInputProps("zip")}
                  className="take-1-3 split"
                />
              )}
            </div>
          </form>
          <div style={{ display: "flex" }}>
            <Button
              fullWidth
              mt="sm"
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              Submit
            </Button>
          </div>
        </Paper>

        <Stack flex={3}>
          <CheckoutSummary isSmall={isSmall ?? false} mbsContext={mbsContext} />
        </Stack>
      </Flex>
    </Container>
  );
};
