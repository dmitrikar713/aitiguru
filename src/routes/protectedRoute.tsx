// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../pages/auth/authSlice";

const ProtectedRoute = () => {
  const { user } = useAuthStore();

  // Если пользователь не авторизован - отправляем на логин
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Если авторизован - показываем запрашиваемую страницу
  return <Outlet />;
};

export default ProtectedRoute;
