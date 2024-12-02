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
  useMantineTheme,
  Divider,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import Dinero from "dinero.js";
import { InProgressBooking } from "../../contexts/MBSContext";
import {
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
      {isSmall && (
        <Title order={1} c="var(--headingColor)">
          Checkout
        </Title>
      )}
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
      <Title order={3}>Paypal</Title>
      <Button
        mt="sm"
        fullWidth
        leftSection={<i className="bi bi-paypal" />}
        onClick={() => {
          window.open("https://sandbox.paypal.com/", "_blank");
        }}
      >
        Checkout with Paypal
      </Button>
      <Divider mt="md" mb="md" />
      <Title order={3}>Credit/Debit Card</Title>
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
          {!(isSmall ?? true) && (
            <Title order={1} c="var(--headingColor)">
              Checkout
            </Title>
          )}
          <PaymentForm />
        </Paper>

        <Stack flex={3}>
          <CheckoutSummary isSmall={isSmall ?? false} ipBooking={ipBooking} />
        </Stack>
      </Flex>
    </Container>
  );
};
