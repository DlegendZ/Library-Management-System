import { api } from "@/lib/api";
import type { LoginRequest, AuthResponse } from "@/types/api";

export interface LoginResponse extends AuthResponse {
  user?: {
    user_id: number;
    role_id: number;
  };
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/logout");
    return response.data;
  },

  refresh: async (): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/refresh");
    return response.data;
  },
};
