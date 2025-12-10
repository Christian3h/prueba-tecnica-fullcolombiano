import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useProducts from '../../hooks/useProducts';
import Loading from '../../components/ui/Loading';
import ErrorMessage from '../../components/ui/ErrorMessage';
import './Products.css';

const Products = () => {
  const { isAuthenticated, isVendor } = useAuth();
  const { products, loading, error, refetch, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const result = await deleteProduct(productId);
      if (!result.success) {
        alert('Error al eliminar el producto');
      }
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return <Loading message="Cargando productos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Productos Colombianos</h1>
        <p>Descubre los mejores productos de nuestros vendedores</p>
      </div>

      <div className="products-filters">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-select"
        >
          <option value="">Todas las categorías</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {isAuthenticated && isVendor && (
          <Link to="/create-product" className="btn-add-product">
            + Agregar Producto
          </Link>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No se encontraron productos</p>
          {isAuthenticated && isVendor && (
            <Link to="/create-product" className="btn-create-first">
              Crear tu primer producto
            </Link>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="product-image-placeholder">📦</div>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-vendor">Por: {product.vendor_name}</p>
                <p className="product-description">
                  {product.description.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product.description}
                </p>

                {product.category && (
                  <span className="product-category">{product.category}</span>
                )}

                <div className="product-footer">
                  <span className="product-price">
                    ${parseFloat(product.price).toLocaleString('es-CO')}
                  </span>
                  <span className="product-stock">
                    {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
