// src/services/authService.ts
import { API_BASE_URL } from "../config/api";

export interface RegisterData {
  nombreCompleto: string;
  correoElectronico: string;
  password: string;
  confirmarPassword: string;
}

export interface LoginData {
  correoElectronico: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  correoElectronico: string;
  nombreCompleto: string;
  role: string;
  mensaje: string;
}

export interface ErrorResponse {
  mensaje: string;
  status: number;
  timestamp?: string;
  errores?: Record<string, string>;
}

class AuthService {
  // Registrar nuevo usuario
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      this.saveAuthData(result);

      return result;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Iniciar sesión
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      this.saveAuthData(result);

      return result;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }

  // Obtener token actual
  getToken(): string | null {
    const token = localStorage.getItem("token");
    return token;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Verificar si el token está expirado
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      const isValid = Date.now() < exp;

      return isValid;
    } catch (error) {
      return false;
    }
  }

  // Obtener rol del usuario
  getUserRole(): string | null {
    const role = localStorage.getItem("role");
    return role;
  }

  // Verificar si es admin
  isAdmin(): boolean {
    const role = this.getUserRole();
    const isAdminUser = role === "ADMIN";
    return isAdminUser;
  }

  // Obtener datos del usuario
  getUserData(): any {
    const userData = localStorage.getItem("user");
    const parsed = userData ? JSON.parse(userData) : null;
    return parsed;
  }

  // Guardar datos de autenticación
  private saveAuthData(authResponse: AuthResponse): void {
    console.log("  - Token:", authResponse.token.substring(0, 20) + "...");
    console.log("  - Role:", authResponse.role);
    console.log("  - Usuario:", authResponse.nombreCompleto);

    localStorage.setItem("token", authResponse.token);
    localStorage.setItem("role", authResponse.role);
    localStorage.setItem(
      "user",
      JSON.stringify({
        correoElectronico: authResponse.correoElectronico,
        nombreCompleto: authResponse.nombreCompleto,
      })
    );
  }

  // Manejar errores
  private handleError(error: any): Error {
    if (error.errores) {
      const messages = Object.values(error.errores).join(", ");
      return new Error(messages);
    } else if (error.mensaje) {
      return new Error(error.mensaje);
    } else if (error.message) {
      return new Error(error.message);
    } else {
      return new Error("Error de conexión con el servidor");
    }
  }
}

export default new AuthService();
