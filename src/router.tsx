import { createBrowserRouter } from "react-router-dom";

import Login from "@/pages/Login";
import Sheets from "@/pages/Sheets";

import Sheet from "@/pages/Sheets/Sheet";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/sheet",
    children: [
      {
        path: "",
        element: <Sheets />
      },
      {
        path: ":sheetId",
        element: <Sheet />
      }
    ]
  },
]);
