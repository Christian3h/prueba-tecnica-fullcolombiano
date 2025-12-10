import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    username: '',
    first_name: '',
    last_name: '',
  });
  const [formError, setFormError] = useState('');

  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      }
    } else {
      // Validar contraseñas
      if (formData.password !== formData.password_confirm) {
        setFormError('Las contraseñas no coinciden');
        return;
      }

      const result = await register({
        email: formData.email,
        username: formData.username || formData.email.split('@')[0],
        password: formData.password,
        password_confirm: formData.password_confirm,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      if (result.success) {
        // Auto login después de registro
        const loginResult = await login(formData.email, formData.password);
        if (loginResult.success) {
          navigate('/');
        }
      } else {
        if (typeof result.error === 'object') {
          const errors = Object.entries(result.error)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
          setFormError(errors);
        }
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🇨🇴 Full Colombiano</h1>
          <p>{isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {(error || formError) && (
            <div className="form-error">
              {error || formError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@correo.com"
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">Nombre</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Apellido</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Nombre de usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="usuario123"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength={8}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="password_confirm">Confirmar contraseña</label>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={8}
              />
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button type="button" onClick={toggleMode} className="btn-toggle">
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
