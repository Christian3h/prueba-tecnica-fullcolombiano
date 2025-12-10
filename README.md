# 🇨🇴 Full Colombiano - Marketplace MVP

Prueba técnica para el marketplace Full Colombiano. Aplicación full-stack con Django REST Framework (backend) y React (frontend).

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [API Documentation](#-api-documentation)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Despliegue](#-despliegue)
- [Credenciales de Prueba](#-credenciales-de-prueba)

## ✨ Características

### Backend
- ✅ API REST con Django REST Framework
- ✅ Autenticación JWT (JSON Web Tokens)
- ✅ Modelos: User (extendido), Vendor, Product
- ✅ CRUD completo de productos
- ✅ Permisos: Solo vendedores pueden crear/editar sus productos
- ✅ Documentación automática con Swagger/OpenAPI
- ✅ Filtros, búsqueda y paginación

### Frontend
- ✅ React 18 con Vite
- ✅ Pantalla de Login/Registro
- ✅ Listado de productos con filtros
- ✅ Formulario para crear productos
- ✅ Creación de perfil de vendedor
- ✅ Manejo de estados de carga y errores
- ✅ Integración con API pública (Rick & Morty)

## 🛠 Tecnologías

### Backend
- Python 3.12+
- Django 5.0
- Django REST Framework 3.16
- SimpleJWT (autenticación)
- drf-spectacular (documentación)
- SQLite (base de datos)

### Frontend
- React 18
- Vite 5
- React Router DOM 6
- Axios
- CSS Nativo

## 📦 Requisitos Previos

- Python 3.10+
- Node.js 18+
- npm o yarn

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd full-colombiano
```

### 2. Backend

```bash
# Entrar al directorio del backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Linux/Mac:
source venv/bin/activate
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env (copiar de .env.example)
cp .env.example .env

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser
```

### 3. Frontend

```bash
# Entrar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env (copiar de .env.example)
cp .env.example .env
```

## ▶️ Ejecución

### Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate  # Linux/Mac
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 📚 API Documentation

Una vez el backend esté corriendo, puedes acceder a la documentación:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/users/register/` | Registrar usuario |
| POST | `/api/users/token/` | Obtener tokens JWT |
| POST | `/api/users/token/refresh/` | Refrescar token |
| GET | `/api/users/profile/` | Perfil del usuario |
| GET | `/api/vendors/` | Listar vendedores |
| POST | `/api/vendors/` | Crear perfil vendedor |
| GET | `/api/vendors/me/` | Mi perfil vendedor |
| GET | `/api/products/` | Listar productos |
| POST | `/api/products/` | Crear producto |
| GET | `/api/products/{id}/` | Detalle producto |
| PATCH | `/api/products/{id}/` | Actualizar producto |
| DELETE | `/api/products/{id}/` | Eliminar producto |
| GET | `/api/products/my_products/` | Mis productos |
| GET | `/api/products/by-vendor/{id}/` | Productos por vendedor |

## 📁 Estructura del Proyecto

```
full-colombiano/
├── backend/
│   ├── apps/
│   │   ├── users/          # App de usuarios
│   │   ├── vendors/        # App de vendedores
│   │   └── products/       # App de productos
│   ├── config/
│   │   ├── settings/       # Configuración modular
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── context/        # React Context (Auth)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Páginas/Vistas
│   │   ├── services/       # Servicios API
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
├── .gitignore
└── README.md
```

## 🌐 Despliegue

### Backend (Railway/Render)

1. Crear cuenta en [Railway](https://railway.app) o [Render](https://render.com)
2. Conectar repositorio de GitHub
3. Configurar variables de entorno:
   ```
   DEBUG=False
   SECRET_KEY=<tu-secret-key-segura>
   ALLOWED_HOSTS=<tu-dominio>.railway.app
   CORS_ALLOWED_ORIGINS=https://<tu-frontend>.vercel.app
   ```
4. El servicio detectará automáticamente Django

### Frontend (Vercel)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Importar repositorio
3. Configurar:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Agregar variable de entorno:
   ```
   VITE_API_URL=https://<tu-backend>.railway.app/api
   ```

## 🔑 Credenciales de Prueba

### Vendedores (Frontend + API)

**Vendedor 1: Café del Eje**
- **Email**: maria@fullcolombiano.com
- **Password**: Colombia2024!
- **Negocio**: Café del Eje (3 productos de café)
- **Ciudad**: Armenia

**Vendedor 2: Artesanías Wayuu**
- **Email**: carlos@fullcolombiano.com
- **Password**: Colombia2024!
- **Negocio**: Artesanías Wayuu (3 productos artesanales)
- **Ciudad**: Riohacha

### Admin (Django Admin)
- **Email**: admin@fullcolombiano.com
- **Username**: admin
- **Password**: admin123

**Acceso al panel de administración**: http://localhost:8000/admin/

**Productos de prueba**: La base de datos incluye 6 productos colombianos (café y artesanías) listos para probar

## 📝 Notas Adicionales

- La base de datos SQLite se genera automáticamente
- Los tokens JWT expiran en 60 minutos
- El refresh token dura 7 días
- Las imágenes de productos se almacenan como URLs externas

## 👤 Autor

Desarrollado como prueba técnica para Full Colombiano.

---

**🇨🇴 Hecho con ❤️ en Colombia**
