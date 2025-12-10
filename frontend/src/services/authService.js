import api from './api';

export const authService = {
  // Iniciar sesión
  login: async (email, password) => {
    const response = await api.post('/users/token/', { email, password });
    return response.data;
  },

  // Registrar usuario
  register: async (userData) => {
    const response = await api.post('/users/register/', userData);
    return response.data;
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    const response = await api.patch('/users/profile/', userData);
    return response.data;
  },

  // Refrescar token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/users/token/refresh/', { refresh: refreshToken });
    return response.data;
  },

  // Cerrar sesión (limpiar tokens locales)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};

export default authService;
