// config/routes.ts или constants/routes.ts

import { AuthPage } from "../pages/auth/AuthPage";
import { NotFound } from "../pages/NotFoundPage";
import { TablePage } from "../pages/table/TablePage";
import { RootHandler } from "./rootHandler";

type Route = {
  path: string;
  element: React.ReactNode;
  isProtected: boolean;
};

export const ROUTES: Record<string, Route> = {
  ROOT: { path: "/", element: <RootHandler />, isProtected: false },
  LOGIN: { path: "/auth", element: <AuthPage />, isProtected: false },
  TABLE: { path: "/table", element: <TablePage />, isProtected: true },
  NOT_FOUND: { path: "/*", element: <NotFound />, isProtected: true },
} as const;

export const ROUTES_ARRAY = Object.values(ROUTES) as Route[];

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
