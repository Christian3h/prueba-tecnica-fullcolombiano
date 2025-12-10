import api from './api';

export const productService = {
  // Listar todos los productos
  getProducts: async (params = {}) => {
    const response = await api.get('/products/', { params });
    return response.data;
  },

  // Obtener un producto por ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  // Crear un producto
  createProduct: async (productData) => {
    const response = await api.post('/products/', productData);
    return response.data;
  },

  // Actualizar un producto
  updateProduct: async (id, productData) => {
    const response = await api.patch(`/products/${id}/`, productData);
    return response.data;
  },

  // Eliminar un producto
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}/`);
    return response.data;
  },

  // Obtener mis productos
  getMyProducts: async () => {
    const response = await api.get('/products/my_products/');
    return response.data;
  },

  // Obtener productos por vendedor
  getProductsByVendor: async (vendorId) => {
    const response = await api.get(`/products/by-vendor/${vendorId}/`);
    return response.data;
  },
};

export default productService;
