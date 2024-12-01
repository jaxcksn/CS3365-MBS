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
import AdminDashboard from "./views/admin/AdminDashboard.tsx";
import AdminAddEdit from "./views/admin/AdminAddEdit.tsx";

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
  "#f1f1ff",
  "#e0dff2",
  "#bfbdde",
  "#9b98ca",
  "#7d79b9",
  "#6a66af",
  "#605cac",
  "#504c97",
  "#464388",
  "#3b3979",
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor",
});

const adminLoader = async () => {
  const role = JSON.parse(localStorage.getItem("mbs_role") ?? "");
  if (role && role === "admin") {
    return null;
  } else {
    throw new Response("Forbidden", { status: 403 });
  }
};

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
  {
    path: "/admin",
    loader: adminLoader,
    element: (
      <ProtectedRoute>
        <AppRoot>
          <Outlet />
        </AppRoot>
      </ProtectedRoute>
    ),
    errorElement: (
      <ErrorMessage
        code={403}
        shortMessage="Forbidden"
        longMessage="You are not authorized to access this page."
      />
    ),
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "showing/add",
        element: <AdminAddEdit mode="add" />,
      },
      {
        path: "showing/:id",
        element: <AdminAddEdit mode="edit" />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <MantineProvider theme={theme} defaultColorScheme="light">
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
