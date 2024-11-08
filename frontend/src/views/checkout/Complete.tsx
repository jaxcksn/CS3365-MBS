import { Button, Container, Flex } from "@mantine/core";
import { useStripe } from "@stripe/react-stripe-js";
import { PaymentIntent } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function CompleteSuccessScreen() {
  const navigate = useNavigate();

  return (
    <Container
      display="flex"
      style={{
        height: "calc(100svh - 60px)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Flex direction="column" align="center">
        <i
          className="bi bi-check"
          style={{
            fontSize: "9rem",
            color: "green",
          }}
        />
        <h2 id="status-text">
          Your payment was sucessful, and your tickets are ready.
        </h2>
        <Button
          onClick={() => {
            navigate("/my-tickets");
          }}
        >
          Go to My Tickets
        </Button>
      </Flex>
    </Container>
  );
}

const STATUS_CONTENT_MAP: Record<
  PaymentIntent.Status | "default",
  { text: string; iconColor: string; icon: string }
> = {
  succeeded: {
    text: "Payment Successful. Your tickets are booked!",
    iconColor: "#30B130",
    icon: "bi bi-check",
  },
  processing: {
    text: "Your payment is processing. Please check your email for confirmation.",
    iconColor: "#6D6E78",
    icon: "bi bi-clock",
  },
  requires_payment_method: {
    text: "Your payment was not successful, please try again.",
    iconColor: "#DF1B41",
    icon: "bi bi-x",
  },
  default: {
    text: "Loading...",
    iconColor: "#gray",
    icon: "bi bi-question",
  },
  canceled: {
    text: "",
    iconColor: "",
    icon: "",
  },
  requires_action: {
    text: "",
    iconColor: "",
    icon: "",
  },
  requires_capture: {
    text: "",
    iconColor: "",
    icon: "",
  },
  requires_confirmation: {
    text: "",
    iconColor: "",
    icon: "",
  },
};

export default function Complete() {
  const [status, setStatus] = useState<PaymentIntent.Status | "default">(
    "default"
  );

  const stripe = useStripe();
  const navigate = useNavigate();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    localStorage.removeItem("mbs_ipBooking");

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        return;
      }

      setStatus(paymentIntent.status);
    });
  }, [stripe]);
  return (
    <Container
      display="flex"
      style={{
        height: "calc(100svh - 60px)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Flex direction="column" align="center">
        <i
          className={STATUS_CONTENT_MAP[status].icon}
          style={{
            fontSize: "9rem",
            color: STATUS_CONTENT_MAP[status].iconColor,
          }}
        />
        <h2 id="status-text">{STATUS_CONTENT_MAP[status].text}</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </Flex>
    </Container>
  );
}
