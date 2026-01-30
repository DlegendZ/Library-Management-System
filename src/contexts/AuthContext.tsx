import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "@/services/auth.service";
import { handleApiError } from "@/lib/api";

interface AuthUser {
  user_id: number;
  role_id: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getRoleName: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode JWT payload (without verification - that's done server-side)
const decodeJwtPayload = (token: string): AuthUser | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    return { user_id: payload.user_id, role_id: payload.role_id };
  } catch {
    return null;
  }
};

// Get cookie value by name
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to refresh token to validate session
        const response = await authService.refresh();

        // Use user data from response
        if (response.user) {
          setUser(response.user);
        }
      } catch {
        // Not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      // Use user data from response
      if (response.user) {
        setUser(response.user);
      } else {
        // Fallback: try to refresh to get the token
        await authService.refresh();
        const accessToken = getCookie("accessToken");
        if (accessToken) {
          const decoded = decodeJwtPayload(accessToken);
          setUser(decoded);
        }
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      setUser(null);
    }
  }, []);

  const getRoleName = useCallback((): string => {
    if (!user) return "";
    switch (user.role_id) {
      case 1:
        return "Admin";
      case 2:
        return "Librarian";
      case 3:
        return "Member";
      default:
        return "Unknown";
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        getRoleName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
