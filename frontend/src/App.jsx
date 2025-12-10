import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/ui/Navbar';
import Login from './pages/Login';
import Products from './pages/Products';
import CreateProduct from './pages/CreateProduct';
import ExternalAPI from './pages/ExternalAPI';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-product" element={<CreateProduct />} />
              <Route path="/external-api" element={<ExternalAPI />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
