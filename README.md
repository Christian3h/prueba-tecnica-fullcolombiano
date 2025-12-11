# 🇨🇴 Full Colombiano - Marketplace MVP

Prueba técnica para el marketplace Full Colombiano. Aplicación full-stack con Django REST Framework (backend) y React (frontend).

## 🌐 Aplicación en Vivo

- **Frontend (React)**: https://prueba-tecnica-fullcolombiano.vercel.app
- **Backend API**: https://prueba-tecnica-fullcolombiano.onrender.com/api
- **Documentación Swagger**: https://prueba-tecnica-fullcolombiano.onrender.com/api/docs/

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

**Aplicación en producción:**
- **Swagger UI**: https://prueba-tecnica-fullcolombiano.onrender.com/api/docs/
- **ReDoc**: https://prueba-tecnica-fullcolombiano.onrender.com/api/redoc/
- **OpenAPI Schema**: https://prueba-tecnica-fullcolombiano.onrender.com/api/schema/

**Desarrollo local:**
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

### Endpoints Principales

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/api/users/register/` | Registrar usuario | No |
| POST | `/api/users/token/` | Obtener tokens JWT | No |
| POST | `/api/users/token/refresh/` | Refrescar token | No |
| GET | `/api/users/profile/` | Perfil del usuario | Sí |
| GET | `/api/vendors/` | Listar vendedores | No |
| POST | `/api/vendors/` | Crear perfil vendedor | Sí |
| GET | `/api/vendors/me/` | Mi perfil vendedor | Sí |
| GET | `/api/products/` | Listar productos | No |
| POST | `/api/products/` | Crear producto | Sí (Vendedor) |
| GET | `/api/products/{id}/` | Detalle producto | No |
| PUT/PATCH | `/api/products/{id}/` | Actualizar producto | Sí (Solo dueño) |
| DELETE | `/api/products/{id}/` | Eliminar producto | Sí (Solo dueño) |
| GET | `/api/products/my_products/` | Mis productos | Sí (Vendedor) |
| GET | `/api/products/by-vendor/{id}/` | Productos por vendedor | No |

### 🔧 Cómo Editar/Eliminar Productos

**Opción 1: Desde Swagger UI (Recomendado)**

1. Ve a: https://prueba-tecnica-fullcolombiano.onrender.com/api/docs/
2. Click en **"Authorize"** (candado arriba)
3. Inicia sesión para obtener token:
   - Click en `POST /api/users/token/`
   - **Try it out**
   - Body:
     ```json
     {
       "email": "maria@fullcolombiano.com",
       "password": "Colombia2024!"
     }
     ```
   - **Execute**
   - Copia el `access` token
4. Pega el token en el campo de autorización: `Bearer tu-token-aqui`
5. Click **Authorize**

**Editar producto:**
- `PATCH /api/products/{id}/` → Try it out → Modifica los campos → Execute

**Eliminar producto:**
- `DELETE /api/products/{id}/` → Try it out → Execute

**Opción 2: Con cURL (Terminal)**

```bash
# 1. Obtener token
curl -X POST https://prueba-tecnica-fullcolombiano.onrender.com/api/users/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@fullcolombiano.com","password":"Colombia2024!"}'

# 2. Editar producto (reemplaza TOKEN y ID)
curl -X PATCH https://prueba-tecnica-fullcolombiano.onrender.com/api/products/1/ \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"price":50000}'

# 3. Eliminar producto
curl -X DELETE https://prueba-tecnica-fullcolombiano.onrender.com/api/products/1/ \
  -H "Authorization: Bearer TOKEN_AQUI"
```

**Opción 3: Desde el Frontend (Futuro)**

⚠️ Actualmente el frontend solo permite crear productos. Para editar/eliminar usa Swagger o la API directamente.

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
