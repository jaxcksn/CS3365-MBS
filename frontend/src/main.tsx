import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
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
import Movie from "./views/Movie.tsx";
import Login from "./views/Login/Login.tsx";
import Signup from "./views/Signup.tsx";
import { AuthProvider, useAuth } from "./providers/AuthContext.tsx";

export const APP_MODE = import.meta.env.VITE_MODE;
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5050";

const RedirectIfAuthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { accessToken, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div></div>;
  }

  if (accessToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Render a loading screen or spinner while checking the authentication status
    return <div></div>;
  }

  if (!isLoggedIn) {
    // If the user is not authenticated, redirect to login page and save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the protected page
  return children;
};

export default function setBodyColor({ color }: { color: string }) {
  document.documentElement.style.setProperty("--bodyColor", color);
}

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
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/movie/:id",
    element: (
      <ProtectedRoute>
        <Movie />
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
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <RouterProvider router={router} />
      </MantineProvider>
    </AuthProvider>
  </StrictMode>
);
