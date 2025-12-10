import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un usuario logueado al cargar
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Opcionalmente verificar el token obteniendo el perfil
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (err) {
          // Si falla, limpiar todo
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const data = await authService.login(email, password);

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError(null);
    setLoading(true);

    try {
      await authService.register(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data || 'Error al registrar usuario';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isVendor: user?.is_vendor || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
