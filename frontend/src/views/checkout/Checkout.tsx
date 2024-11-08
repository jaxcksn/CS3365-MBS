import {
  Container,
  Paper,
  Title,
  Text,
  Flex,
  NumberFormatter,
  Group,
  Stack,
  Button,
  Divider,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import Dinero from "dinero.js";
import { InProgressBooking } from "../../contexts/MBSContext";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { showErrorModal } from "../../utils/helpers";
import { theaters } from "../../constants/Constants";

const CheckoutSummary = ({
  isSmall,
  ipBooking,
}: {
  isSmall: boolean;
  ipBooking: InProgressBooking | null;
}) => {
  return (
    <Paper
      shadow="xs"
      radius="lg"
      h={{ base: "auto", md: "fit-content" }}
      withBorder
      p={{
        base: "md",
        xs: "xl",
      }}
    >
      {isSmall && <Title order={1}>Checkout</Title>}
      <Title order={2} pb="sm">
        Summary
      </Title>
      <Group justify="space-between" align="center" gap={0} wrap="nowrap">
        <Text size="lg" fw="bold">
          x{ipBooking?.quantity}
          {" - "}
          {ipBooking?.movieName}
        </Text>
        <Text size="lg" fw="bold">
          <NumberFormatter
            prefix="$"
            decimalScale={2}
            value={Dinero(ipBooking?.price as Dinero.Options)
              .multiply(ipBooking?.quantity ?? 0)
              .toFormat()}
          />
        </Text>
      </Group>
      <Group justify="space-between" align="center" fs="1rem">
        <Text fw={600}>
          {theaters[ipBooking?.theater ?? ""] ?? "Unknown"} - {ipBooking?.time}
        </Text>
        <Text>
          {Dinero(ipBooking?.price as Dinero.Options).toFormat()} Each
        </Text>
      </Group>
    </Paper>
  );
};

/*

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

  const mbsContext = useMBS();

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


*/

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/checkout/complete",
      },
      redirect: "if_required",
    });

    if (result.error) {
      showErrorModal(
        result.error.message ?? "There was an error processing the payment",
        () => {}
      );
    } else {
      localStorage.removeItem("mbs_ipBooking");
      navigate("/success");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title order={3}>Billing address</Title>
      <AddressElement options={{ mode: "billing" }} />
      <Divider mt="md" mb="md" />
      <Title order={3}>Payment info</Title>
      <PaymentElement />
      <div style={{ display: "flex" }}>
        <Button fullWidth mt="sm" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export const Checkout = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const [ipBooking, setIpBooking] = useState<InProgressBooking | null>(null);

  useEffect(() => {
    const orderString = localStorage.getItem("mbs_ipBooking");
    if (orderString) {
      setIpBooking(JSON.parse(orderString) as InProgressBooking);
    } else {
      navigate("/");
    }
  }, []);

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
          p={{
            base: "md",
            sm: "xl",
            xs: "lg",
          }}
          radius="lg"
          h={{ base: "auto", md: "fit-content" }}
          withBorder
        >
          {!(isSmall ?? true) && <Title order={1}>Checkout</Title>}
          <PaymentForm />
        </Paper>

        <Stack flex={3}>
          <CheckoutSummary isSmall={isSmall ?? false} ipBooking={ipBooking} />
        </Stack>
      </Flex>
    </Container>
  );
};
