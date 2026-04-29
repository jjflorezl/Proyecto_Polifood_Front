import type { AuthUser, LoginDTO, RegisterDTO } from "../types/auth";
import { apiConfig, apiRequest } from "./api";

type LoginResponse = { token?: string; Token?: string };
type RegisterResponse = { message?: string; Message?: string; userId?: string; UserId?: string };

function inferRoleFromEmail(email: string): AuthUser["role"] {
  if (email.includes("admin")) return "Admin";
  if (email.includes("vendor") || email.includes("vendedor")) return "Vendor";
  return "Student";
}

export const authService = {
  async login(dto: LoginDTO): Promise<AuthUser> {
    if (apiConfig.useMocks) {
      const token = `mock-token-${Date.now()}`;
      return { email: dto.email, role: inferRoleFromEmail(dto.email), token };
    }

    const data = await apiRequest<LoginResponse>("/Auth/login", {
      method: "POST",
      body: JSON.stringify(dto)
    });

    return {
      email: dto.email,
      role: inferRoleFromEmail(dto.email),
      token: data.token ?? data.Token ?? ""
    };
  },

  async register(dto: RegisterDTO): Promise<RegisterResponse> {
    if (apiConfig.useMocks) {
      return { Message: `Usuario ${dto.email} creado con éxito.`, UserId: crypto.randomUUID() };
    }

    return apiRequest<RegisterResponse>("/Auth/register", {
      method: "POST",
      body: JSON.stringify(dto)
    });
  }
};
