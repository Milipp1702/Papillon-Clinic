import { createContext, ReactNode, useEffect, useState } from 'react';
import { usePersistedState } from '../utils/usePersistedState';
import { AuthData, useClinicApi } from '../services/api/useClinicApi';
import { USER_KEY } from '../constants/keys';

interface AuthProviderProps {
  children: ReactNode;
}

export type User = {
  id: string;
  user: string;
  role: string;
  token: string;
};

interface AuthContextData {
  user: User | null;
  login: (data: AuthData) => Promise<void>;
  logout: () => void;
  isAuth: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = usePersistedState<User | null>(USER_KEY, null);
  const [isAuth, setAuth] = useState<boolean>(false);
  const { auth, verifyToken } = useClinicApi();

  const login = async (data: AuthData) => {
    try {
      const user = await auth(data);
      setUser(user);
    } catch (e) {
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    if (user) {
      verifyToken().then((isValid) => {
        if (isValid) {
          setAuth(true);
        }
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
