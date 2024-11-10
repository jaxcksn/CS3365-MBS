/// <reference types="vite-plugin-svgr/client" />
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./views/home/Home";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import Login from "./views/login/Login.tsx";
import Signup from "./views/signup/Signup.tsx";
import { useAuth } from "./hooks/ProviderHooks.ts";
import { MBSProvider } from "./contexts/MBSContext.tsx";
import { Checkout } from "./views/checkout/Checkout.tsx";
import Movie from "./views/movie/Movie.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import Showing from "./views/showing/Showing.tsx";
import ErrorMessage from "./components/layout/ErrorMessage.tsx";
import AppRoot from "./components/layout/AppRoot.tsx";
import { ErrorModal } from "./components/modals.tsx";
import Complete, { CompleteSuccessScreen } from "./views/checkout/Complete.tsx";
import CheckoutLayout from "./views/checkout/CheckoutLayout.tsx";
import MyTickets from "./views/mytickets/MyTickets.tsx";

export const RedirectIfAuthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div />;
  }

  if (isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading || auth === undefined) {
    return <div />;
  }

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const myColor: MantineColorsTuple = [
  "#ffeaea",
  "#fed4d4",
  "#f4a8a8",
  "#eb7979",
  "#e45151",
  "#e03737",
  "#df292a",
  "#c61b1d",
  "#b11318",
  "#9c0512",
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor",
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    errorElement: (
      <ErrorMessage
        code={404}
        shortMessage="Not Found"
        longMessage="Well this is awkward, we couldn't find the page you were looking for."
      />
    ),
  },
  {
    path: "/movie/:id",
    element: (
      <ProtectedRoute>
        <AppRoot>
          <Movie />
        </AppRoot>
      </ProtectedRoute>
    ),
  },
  {
    path: "/movie/:id/book",
    element: (
      <ProtectedRoute>
        <AppRoot>
          <Showing />
        </AppRoot>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <RedirectIfAuthenticated>
        <Login />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: "/signup",
    element: (
      <RedirectIfAuthenticated>
        <Signup />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <AppRoot>
          <CheckoutLayout>
            <Outlet />
          </CheckoutLayout>
        </AppRoot>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "", // This will render the Checkout component at /checkout
        element: <Checkout />,
      },
      {
        path: "complete", // This will render the Complete component at /checkout/complete
        element: <Complete />,
      },
    ],
  },
  {
    path: "/success",
    element: (
      <ProtectedRoute>
        <AppRoot>
          <CompleteSuccessScreen />
        </AppRoot>
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-tickets",
    element: (
      <ProtectedRoute>
        <AppRoot>
          <MyTickets />
        </AppRoot>
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <MantineProvider theme={theme}>
      <ModalsProvider modals={{ error: ErrorModal }}>
        <DatesProvider settings={{ locale: "en-us" }}>
          <MBSProvider>
            <Notifications />
            <RouterProvider router={router} />
          </MBSProvider>
        </DatesProvider>
      </ModalsProvider>
    </MantineProvider>
  </AuthProvider>
);
