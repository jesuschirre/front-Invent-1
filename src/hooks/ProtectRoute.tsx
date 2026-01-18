import { Navigate, Outlet } from "react-router-dom";
import { type ReactNode } from "react";

interface ProtectRouteProps {
  user: unknown | null;     // puedes cambiar el tipo luego
  redirectTo: string;
  children?: ReactNode;
}

export default function ProtectRoute({
  user,
  redirectTo,
  children,
}: ProtectRouteProps) {
  if (user === null) {
    return <Navigate replace to={redirectTo} />;
  }

  return children ? children : <Outlet />;
}
