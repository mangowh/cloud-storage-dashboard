import { UserResponseDto } from "@bonusx/cloud-storage-dashboard-api-client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiService } from "../services/api.service";

type AuthContextType = {
  user: UserResponseDto | null;
  accessToken: string | null;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    apiService.setToken(accessToken);
  });

  const login = async (username: string, password: string) => {
    const data = await apiService.auth.signIn({
      signInDto: { username, password },
    });
    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
