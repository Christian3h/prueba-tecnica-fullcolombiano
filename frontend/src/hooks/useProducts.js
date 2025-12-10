import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getProducts({ ...initialParams, ...params });

      // Si la API devuelve datos paginados
      if (data.results) {
        setProducts(data.results);
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
        });
      } else {
        // Si devuelve un array directo
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (productData) => {
    try {
      const newProduct = await productService.createProduct(productData);
      await fetchProducts(); // Recargar lista
      return { success: true, product: newProduct };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data || 'Error al crear producto'
      };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      await fetchProducts(); // Recargar lista
      return { success: true, product: updatedProduct };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data || 'Error al actualizar producto'
      };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      await fetchProducts(); // Recargar lista
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data || 'Error al eliminar producto'
      };
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};

export default useProducts;
