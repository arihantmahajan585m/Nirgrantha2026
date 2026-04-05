import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserRole = "student" | "teacher" | "institute" | "parent";

interface AuthContextType {
  currentRole: UserRole | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const STORAGE_KEY = "nirgrantha_role";

export const AuthContext = createContext<AuthContextType>({
  currentRole: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (
        stored &&
        ["student", "teacher", "institute", "parent"].includes(stored)
      ) {
        return stored as UserRole;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const login = useCallback((role: UserRole) => {
    setCurrentRole(role);
    try {
      localStorage.setItem(STORAGE_KEY, role);
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentRole(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
