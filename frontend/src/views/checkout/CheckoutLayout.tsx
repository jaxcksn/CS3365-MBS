import React, { ReactNode, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { showErrorModal } from "../../utils/helpers";
import apiService from "../../services/apiService";
import { InProgressBooking } from "../../contexts/MBSContext";
import { LoadingOverlay } from "@mantine/core";
import { Elements } from "@stripe/react-stripe-js";
import { APP_MODE, stripePromise } from "../../constants/Constants";
import { useMBS } from "../../hooks/ProviderHooks";
import mockService from "../../services/mockService";

interface CheckoutLayoutProps {
  children?: ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          navigate("/");
          showErrorModal(
            "Could not create order, redirecting to home.",
            () => {}
          );
        }
      } else {
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
        navigate("/");
        showErrorModal(
          "Could not load checkout screen, in-progress order was not found, redirecting to home.",
          () => {}
        );
      }
    };

    if (import.meta.env.VITE_STRIPE_API === undefined || mbs.isMockPayment) {
      if (!mbs.isMockPayment) {
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

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children || <Outlet />}
    </Elements>
  );
}
