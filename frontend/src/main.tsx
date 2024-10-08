import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import Movie from "./views/Movie.tsx";
import Login from "./views/Login.tsx";
import Signup from "./views/Signup.tsx";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5050";

const myColor: MantineColorsTuple = [
  "#ffe8e9",
  "#ffd1d1",
  "#fba0a0",
  "#f76d6d",
  "#f44141",
  "#f22625",
  "#f21616",
  "#d8070b",
  "#c10007",
  "#a90003",
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
    element: <App />,
  },
  {
    path: "/movie/:id",
    element: <Movie />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {<RouterProvider router={router} />}
    </MantineProvider>
  </StrictMode>
);
