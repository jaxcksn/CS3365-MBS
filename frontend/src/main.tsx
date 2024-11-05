/// <reference types="vite-plugin-svgr/client" />
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./views/home/Home";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
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

import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import Showing from "./views/showing/Showing.tsx";
import ErrorMessage from "./components/layout/ErrorMessage.tsx";
import AppRoot from "./components/layout/AppRoot.tsx";

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
    // Render a loading screen or spinner while checking the authentication status
    return <div />;
  }

  if (!auth.isLoggedIn) {
    // If the user is not authenticated, redirect to login page and save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the protected page
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
          <Checkout />
        </AppRoot>
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <DatesProvider settings={{ locale: "en-us" }}>
        <MBSProvider>
          <Notifications />
          <RouterProvider router={router} />
        </MBSProvider>
      </DatesProvider>
    </MantineProvider>
  </AuthProvider>
);
