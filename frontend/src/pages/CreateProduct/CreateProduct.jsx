import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import vendorService from '../../services/vendorService';
import Loading from '../../components/ui/Loading';
import './CreateProduct.css';

const CreateProduct = () => {
  const { isAuthenticated, isVendor, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Estado para crear perfil de vendedor
  const [showVendorForm, setShowVendorForm] = useState(!isVendor);
  const [vendorData, setVendorData] = useState({
    business_name: '',
    description: '',
    city: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendorData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await vendorService.createVendor(vendorData);
      setShowVendorForm(false);
      // Recargar la página para actualizar el estado del usuario
      window.location.reload();
    } catch (err) {
      const errorData = err.response?.data;
      if (typeof errorData === 'object') {
        const errors = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        setError(errors);
      } else {
        setError('Error al crear perfil de vendedor');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await productService.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data;
      if (typeof errorData === 'object') {
        const errors = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        setError(errors);
      } else {
        setError('Error al crear el producto');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="create-product-page">
        <div className="auth-required">
          <h2>Inicia sesión para crear productos</h2>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  if (showVendorForm || !isVendor) {
    return (
      <div className="create-product-page">
        <div className="form-container">
          <h1>Crear Perfil de Vendedor</h1>
          <p className="form-subtitle">
            Para crear productos, primero debes registrarte como vendedor
          </p>

          <form onSubmit={handleCreateVendor} className="product-form">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="business_name">Nombre del Negocio *</label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                value={vendorData.business_name}
                onChange={handleVendorChange}
                required
                placeholder="Mi Tienda Colombiana"
              />
            </div>

            <div className="form-group">
              <label htmlFor="vendor_description">Descripción del Negocio</label>
              <textarea
                id="vendor_description"
                name="description"
                value={vendorData.description}
                onChange={handleVendorChange}
                placeholder="Describe tu negocio..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Ciudad</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={vendorData.city}
                  onChange={handleVendorChange}
                  placeholder="Bogotá"
                />
              </div>
              <div className="form-group">
                <label htmlFor="vendor_phone">Teléfono</label>
                <input
                  type="tel"
                  id="vendor_phone"
                  name="phone"
                  value={vendorData.phone}
                  onChange={handleVendorChange}
                  placeholder="300 123 4567"
                />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Perfil de Vendedor'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="create-product-page">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>¡Producto creado exitosamente!</h2>
          <p>Redirigiendo a la lista de productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-product-page">
      <div className="form-container">
        <h1>Crear Nuevo Producto</h1>
        <p className="form-subtitle">
          Agrega un nuevo producto a tu catálogo
        </p>

        <form onSubmit={handleSubmit} className="product-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Nombre del Producto *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Café Colombiano Premium"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe tu producto..."
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Precio (COP) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="50000"
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="100"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Alimentos, Artesanías, Ropa..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">URL de Imagen</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Vista previa" />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
