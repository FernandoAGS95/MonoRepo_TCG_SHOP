// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import authService from "../services/AuthService";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("=== ProtectedRoute - Verificando acceso ===");
    console.log("Ruta actual:", location.pathname);
    console.log("Requiere admin:", requireAdmin);

    const authenticated = authService.isAuthenticated();
    const admin = authService.isAdmin();
    const role = authService.getUserRole();
    const token = authService.getToken();

    console.log("Token existe:", token ? "SÍ" : "NO");
    console.log("Está autenticado:", authenticated);
    console.log("Rol en localStorage:", role);
    console.log("Es admin:", admin);

    setIsAuthenticated(authenticated);
    setIsAdmin(admin);
    setIsChecking(false);

    console.log("===========================================");
  }, [location, requireAdmin]);

  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Verificando acceso...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
