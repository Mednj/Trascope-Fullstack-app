import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("transcope_user");
    const storedToken = localStorage.getItem("transcope_token");
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem("transcope_user", JSON.stringify(user));
    localStorage.setItem("transcope_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("transcope_user");
    localStorage.removeItem("transcope_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
