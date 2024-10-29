/// <reference types="vite-plugin-svgr/client" />
import { StrictMode } from "react";
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
  AppShell,
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import Login from "./views/login/Login.tsx";
import Signup from "./views/signup/Signup.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { useAuth } from "./hooks/ProviderHooks.ts";
import { MBSProvider } from "./contexts/MBSContext.tsx";
import { AppHeader } from "./components/layout/AppHeader.tsx";
import { Checkout } from "./views/checkout/Checkout.tsx";
import Movie from "./views/movie/Movie.tsx";

export const RootView = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell
      header={{ height: 60 }}
      style={{ width: "100%", minHeight: "100%" }}
    >
      <AppHeader showSearch={false} />
      {children}
    </AppShell>
  );
};

export const RedirectIfAuthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { accessToken, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div />;
  }

  if (accessToken) {
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
  },
  {
    path: "/movie/:id",
    element: (
      <ProtectedRoute>
        <RootView>
          <Movie />
        </RootView>
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
        <RootView>
          <Checkout />
        </RootView>
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <MBSProvider>
          <RouterProvider router={router} />
        </MBSProvider>
      </MantineProvider>
    </AuthProvider>
  </StrictMode>
);
