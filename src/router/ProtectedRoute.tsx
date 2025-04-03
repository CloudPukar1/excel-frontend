import { Navigate, Outlet } from "react-router-dom";

import { cookie } from "@/lib/utils";

export default function ProtectedRoute() {
  const authToken = cookie.get("auth_token");

  if (!authToken) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
}
