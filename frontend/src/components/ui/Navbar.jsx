import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isVendor } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🇨🇴 Full Colombiano
        </Link>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Productos</Link>
          <Link to="/external-api" className="nav-link" onClick={closeMenu}>Rick & Morty</Link>

          {isAuthenticated ? (
            <>
              {isVendor && (
                <Link to="/create-product" className="nav-link nav-link-primary" onClick={closeMenu}>
                  + Nuevo Producto
                </Link>
              )}
              <span className="nav-user">
                {user?.first_name || user?.username || user?.email}
              </span>
              <button onClick={handleLogout} className="nav-btn nav-btn-logout">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link nav-link-primary" onClick={closeMenu}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
