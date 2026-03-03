import { Navigate } from "react-router";
import { useAuthStore } from "../pages/auth/authSlice";

export function RootHandler() {
  const isAuthenticated = useAuthStore((state) => state.user);

  if (isAuthenticated) {
    return <Navigate to="/table" replace />;
  }
  return <Navigate to="/auth" replace />;
}
