import { createBrowserRouter } from "react-router-dom";

import Login from "@/pages/Login";
import Spreadsheet from "@/pages/Spreadsheet";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/spreadsheet",
    element: <Spreadsheet />,
  },
]);
