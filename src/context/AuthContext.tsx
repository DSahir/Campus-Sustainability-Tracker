import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { UserRole } from '../types';

interface AuthState {
  token:           string | null;
  role:            UserRole | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  setAuth:   (token: string, role: UserRole) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token:           null,
    role:            null,
    isAuthenticated: false,
  });

  const setAuth = useCallback((token: string, role: UserRole) => {
    setState({ token, role, isAuthenticated: true });
  }, []);

  const clearAuth = useCallback(() => {
    setState({ token: null, role: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be called inside <AuthProvider>');
  return ctx;
};