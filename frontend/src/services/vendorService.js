import api from './api';

export const vendorService = {
  // Listar todos los vendedores
  getVendors: async () => {
    const response = await api.get('/vendors/');
    return response.data;
  },

  // Obtener un vendedor por ID
  getVendor: async (id) => {
    const response = await api.get(`/vendors/${id}/`);
    return response.data;
  },

  // Crear perfil de vendedor
  createVendor: async (vendorData) => {
    const response = await api.post('/vendors/', vendorData);
    return response.data;
  },

  // Obtener mi perfil de vendedor
  getMyVendorProfile: async () => {
    const response = await api.get('/vendors/me/');
    return response.data;
  },

  // Actualizar mi perfil de vendedor
  updateVendor: async (id, vendorData) => {
    const response = await api.patch(`/vendors/${id}/`, vendorData);
    return response.data;
  },
};

export default vendorService;
