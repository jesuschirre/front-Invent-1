import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import PaginaRecarga from "../pages/PaginaRecarga";

interface Props {
  redirectTo: string;
  moduloRequerido?: string; // Nuevo: Nombre del módulo necesario
}

export default function ProtectRoute({ redirectTo, moduloRequerido }: Props) {
  const { user, loading, modulos } = UserAuth();
  const location = useLocation();

  if (loading) {
    return <PaginaRecarga/>;
  }

  // 1. Verificar Autenticación
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 2. Verificar Autorización (si se pide un módulo específico)
  if (moduloRequerido) {
    const tienePermiso = modulos.some(
      (m) => m.nombre.toLowerCase() === moduloRequerido.toLowerCase()
    );

    if (!tienePermiso) {
      // Si no tiene permiso, lo mandamos al Home o una página 403
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}