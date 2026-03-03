import { Routes, Route, BrowserRouter } from "react-router";
import ProtectedRoute from "./protectedRoute";
import { ROUTES_ARRAY } from "./routes";
import type { ReactElement } from "react";
import { Layout } from "../components/layout/layout";

export const Router = () => {
  const OpenRoutes = ROUTES_ARRAY.filter((route) => !route.isProtected).map(
    (route) => (
      <Route element={route.element} path={route.path} key={route.path} />
    ),
  ) as ReactElement[];
  const ProtectedRoutes = ROUTES_ARRAY.filter((route) => route.isProtected).map(
    (route) => (
      <Route element={route.element} path={route.path} key={route.path} />
    ),
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {OpenRoutes}
          <Route element={<ProtectedRoute />}>{ProtectedRoutes}</Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
