import { createBrowserRouter } from "react-router-dom";

import Login from "@/pages/Login";
import Sheets from "@/pages/Sheets";

import Sheet from "@/pages/Sheets/Sheet";
import Register from "@/pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import PageNotFound from "@/pages/PageNotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "sheet",
        children: [
          {
            path: "",
            element: <Sheets />,
          },
          {
            path: ":sheetId",
            element: <Sheet />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
