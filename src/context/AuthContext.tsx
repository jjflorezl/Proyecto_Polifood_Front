import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser, LoginDTO, RegisterDTO } from "../types/auth";
import { authService } from "../services/auth.service";

type AuthContextValue = {
  user: AuthUser | null;
  login: (dto: LoginDTO) => Promise<void>;
  register: (dto: RegisterDTO) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = "polifood_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    async login(dto) {
      const loggedUser = await authService.login(dto);
      localStorage.setItem("polifood_token", loggedUser.token);
      localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
      setUser(loggedUser);
    },
    async register(dto) {
      await authService.register(dto);
      const loggedUser = await authService.login({ email: dto.email, password: dto.password });
      const userWithRole = { ...loggedUser, role: dto.role };
      localStorage.setItem("polifood_token", userWithRole.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userWithRole));
      setUser(userWithRole);
    },
    logout() {
      localStorage.removeItem("polifood_token");
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
