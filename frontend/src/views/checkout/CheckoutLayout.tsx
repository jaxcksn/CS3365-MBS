import { ReactNode, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import setBodyColor, { showErrorModal } from "../../utils/helpers";
import apiService from "../../services/apiService";
import { InProgressBooking } from "../../contexts/MBSContext";
import {
  LoadingOverlay,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Elements } from "@stripe/react-stripe-js";
import { APP_MODE, stripePromise } from "../../constants/Constants";
import { useMBS } from "../../hooks/ProviderHooks";
import mockService from "../../services/mockService";
import { Appearance } from "@stripe/stripe-js";

interface CheckoutLayoutProps {
  children?: ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  setBodyColor({ color: "var(--mantine-color-body)" });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useComputedColorScheme();
  const mantineTheme = useMantineTheme();
  const mbs = useMBS();

  useEffect(() => {
    const loadPaymentIntent = async () => {
      const orderString = localStorage.getItem("mbs_ipBooking");
      if (orderString) {
        const order: InProgressBooking = JSON.parse(orderString);
        try {
          const paymentIntent = await apiService.getPaymentIntent(order);
          if (paymentIntent.client_secret) {
            setClientSecret(paymentIntent.client_secret);
          } else {
            throw new Error("No client secret in payment intent");
          }
        } catch {
          setLoading(false);
          navigate("/");
          showErrorModal(
            "Could not create order, redirecting to home.",
            () => {}
          );
        }
      } else {
        setLoading(false);
        navigate("/");
        showErrorModal(
          "Could not load checkout screen, in-progress order was not found, redirecting to home.",
          () => {}
        );
      }
      setLoading(false);
    };

    const mockBooking = async () => {
      const ipBooking = JSON.parse(
        localStorage.getItem("mbs_ipBooking") as string
      ) as InProgressBooking;
      if (ipBooking) {
        const response = await mockService.createBooking({
          showing_id: ipBooking.movieId,
          booking_date: new Date(ipBooking.date),
          seats: ipBooking.quantity,
          theater: ipBooking.theater,
        });

        if (response) {
          navigate("/success");
        } else {
          showErrorModal(
            "Could not create order, redirecting to home.",
            () => {}
          );
        }

        setLoading(false);
      } else {
        setLoading(false);
        navigate("/");
        console.error("No in-progress order found, redirecting to home.");
        showErrorModal(
          "Could not load checkout screen, in-progress order was not found, redirecting to home.",
          () => {}
        );
      }
    };

    if (import.meta.env.VITE_STRIPE_API === undefined || mbs.isMockPayment) {
      if (!mbs.isMockPayment) {
        console.error("Stripe API key not found, redirecting to home.");
        showErrorModal(
          "Stripe API key not found, redirecting to home." + APP_MODE === "DEV"
            ? "You can bypass this by turning on mock payment in the dev settings."
            : "",
          () => {
            navigate("/");
          }
        );
      } else {
        mockBooking();
      }
    } else {
      loadPaymentIntent();
    }
  }, [navigate]);

  if (loading) {
    return <LoadingOverlay visible />;
  }

  if (!clientSecret) {
    return null; // Optionally, render an error message here if needed
  }

  const appearance: () => Appearance = () => {
    if (theme === "dark") {
      return {
        theme: "stripe",
        variables: {
          colorPrimary: mantineTheme.colors["myColor"][8],
          colorBackground: mantineTheme.colors.dark[6],
          colorText: mantineTheme.colors.dark[0],
          colorDanger: mantineTheme.colors.red[6],
        },
      };
    } else {
      return {
        theme: "stripe",
        variables: {
          colorPrimary: mantineTheme.colors["myColor"][5],
          colorBackground: mantineTheme.white,
          colorText: mantineTheme.black,
          colorDanger: mantineTheme.colors.red[6],
        },
      };
    }
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: appearance() }}
    >
      {children || <Outlet />}
    </Elements>
  );
}
