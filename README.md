# Plataforma E-Commerce CercaMio

<div align="center">
  <h1 align="center">
    <a href="https://github.com/FreddyJr27/E-Commerce_CercaMio-TopicosWeb">
      <img width="751" height="211" alt="cercamio-ecommerce-logo" src="https://user-images.githubusercontent.com/placeholder/cercamio_logo.png" />
    </a>
  </h1>
  <p>Tu marketplace local en línea: compra y vende fácilmente productos cerca de ti.</p>
  
  <p align="center">
    <a href="https://github.com/FreddyJr27/E-Commerce_CercaMio-TopicosWeb/stargazers">
      <img src="https://img.shields.io/github/stars/FreddyJr27/E-Commerce_CercaMio-TopicosWeb?style=for-the-badge&logo=github&color=4e73df" alt="GitHub Stars">
    </a>
    <a href="https://github.com/FreddyJr27/E-Commerce_CercaMio-TopicosWeb/issues">
      <img src="https://img.shields.io/github/issues/FreddyJr27/E-Commerce_CercaMio-TopicosWeb?style=for-the-badge&color=1cc88a" alt="Issues">
    </a>
    <a href="https://github.com/FreddyJr27/E-Commerce_CercaMio-TopicosWeb/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/FreddyJr27/E-Commerce_CercaMio-TopicosWeb?style=for-the-badge&color=f6c23e" alt="License">
    </a>
    <a href="https://github.com/FreddyJr27/E-Commerce_CercaMio-TopicosWeb/pulls">
      <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" alt="PRs Welcome">
    </a>
  </p>
</div>

## Introducción

CercaMio es una plataforma e-commerce desarrollada para conectar compradores y vendedores de productos a nivel local. El proyecto incluye catálogo de productos por categorías, gestión de usuarios y reseñas, y una interfaz web para explorar, publicar y gestionar productos.

**Características destacadas:**
- ✅ Catálogo de productos con imágenes y filtrado por categorías
- ✅ Gestión de usuarios (registro, login y edición de perfil)
- ✅ Publicación de productos desde la interfaz
- ✅ Detalle de producto con reseñas
- ✅ API REST para productos, categorías, dimensiones, reseñas y usuarios
- ✅ Interfaz intuitiva y responsive

> [!IMPORTANT]
> Una vez instalado el sistema localmente, accede a:
> **Frontend**: [http://localhost:5173](http://localhost:5173)  
> **Backend**: [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Tecnologías Utilizadas

| Frontend                | Backend                 | Base de Datos   | Herramientas y Utilidades         |
|-------------------------|-------------------------|-----------------|-----------------------------------|
| <img src="https://img.shields.io/badge/react-18.x-61DAFB?logo=react" alt="React.js"> | <img src="https://img.shields.io/badge/django-5.x-092E20?logo=django" alt="Django"> | <img src="https://img.shields.io/badge/mysql-8.x-4479A1?logo=mysql&logoColor=white" alt="MySQL"> | <img src="https://img.shields.io/badge/vite-5.x-646CFF?logo=vite" alt="Vite"> |
| <img src="https://img.shields.io/badge/react_router-6.x-CA4245?logo=reactrouter" alt="React Router"> | <img src="https://img.shields.io/badge/django_rest_framework-3.x-A30000?logo=django" alt="Django REST Framework"> | <img src="https://img.shields.io/badge/mysqlclient-2.x-4479A1?logo=mysql&logoColor=white" alt="mysqlclient"> | <img src="https://img.shields.io/badge/axios-1.x-5A29E4?logo=axios" alt="Axios"> |
| <img src="https://img.shields.io/badge/javascript-ES6+-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript"> | <img src="https://img.shields.io/badge/django--cors--headers-4.x-0C4B33?logo=django" alt="django-cors-headers"> | <img src="https://img.shields.io/badge/sql-MySQL-4479A1?logo=mysql&logoColor=white" alt="SQL (MySQL)"> | <img src="https://img.shields.io/badge/eslint-9.x-4B32C3?logo=eslint" alt="ESLint"> |

## Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/FreddyJr27/E-Commerce_CercaMio-TopicosWeb.git
cd E-Commerce_CercaMio-TopicosWeb

# 1) Backend (Django)
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate

pip install -r requirements.txt

# (Opcional) Usar SQLite temporalmente si no tienes MySQL
# En backend/.env usa: USE_SQLITE=1

# Ajusta credenciales de BD en backend/backend/settings.py si es necesario
python manage.py migrate

# (Opcional) Cargar datos de ejemplo
python manage.py shell < scripts/load_categories.py
python manage.py shell < scripts/load_products.py

python manage.py runserver

# 2) Frontend (Vite + React) en otra terminal
cd ../frontend
npm install
npm run dev
```

> [!NOTE]
> El frontend usa proxy en Vite para enrutar `/api` hacia `http://127.0.0.1:8000` durante desarrollo.

## Capturas de Pantalla

<div align="center">
  <table>
    <tr>
      <td align="center">Página Principal</td>
      <td align="center">Catálogo de Productos</td>
    </tr>
    <tr>
      <td>
        <img width="600" alt="home" src="https://user-images.githubusercontent.com/placeholder/captura_home.png" />
      </td>
      <td>
        <img width="600" alt="catalogo" src="https://user-images.githubusercontent.com/placeholder/captura_catalogo.png" />
      </td>
    </tr>
    <tr>
      <td align="center">Carrito de Compras</td>
      <td align="center">Panel de Administración</td>
    </tr>
    <tr>
      <td>
        <img width="600" alt="carrito" src="https://user-images.githubusercontent.com/placeholder/captura_carrito.png" />
      </td>
      <td>
        <img width="600" alt="admin_dashboard" src="https://user-images.githubusercontent.com/placeholder/captura_admin.png" />
      </td>
    </tr>
  </table>
</div>

## Estructura del Proyecto

```
E-Commerce_CercaMio-TopicosWeb/
├── backend/
│   ├── backend/              # Configuración principal de Django
│   ├── products/             # App principal (modelos, views, serializers, rutas)
│   ├── scripts/              # Scripts para carga de categorías y productos
│   ├── requirements.txt      # Dependencias Python
│   └── manage.py             # Punto de entrada del backend
├── frontend/
│   ├── src/                  # Componentes y páginas React
│   ├── api/                  # Cliente API (Axios)
│   ├── public/               # Recursos estáticos
│   ├── vite.config.js        # Configuración Vite + proxy
│   └── package.json          # Dependencias frontend
├── setup.ps1                 # Script de apoyo para entorno
└── README.md
```

> [!TIP]
> Si quieres contribuir, puedes abrir un Issue o enviar un Pull Request.

## Contribuidores

¡Gracias a tod@s l@s que han colaborado en este proyecto!

| | | |
| :---: | :---: | :---: |
| [<img src="https://avatars.githubusercontent.com/u/118347528?v=4" width="115"><br><sub>Freddy Jaimez</sub>](https://github.com/FreddyJr27) | [<img src="https://avatars.githubusercontent.com/u/153969551?v=4" width="115"><br><sub>Gabo Sandoval</sub>](https://github.com/GaboSandova1) | [<img src="https://avatars.githubusercontent.com/u/81979915?v=4" width="115"><br><sub>Angel De Leon</sub>](https://github.com/angelddeleon) |
| [<img src="https://avatars.githubusercontent.com/u/127276661?v=4" width="115"><br><sub>Andrés Ng</sub>](https://github.com/ngandres2003) | [<img src="https://avatars.githubusercontent.com/u/142904780?v=4" width="115"><br><sub>Juan Rodríguez</sub>](https://github.com/Juanrh71) | [<img src="https://avatars.githubusercontent.com/u/200012941?v=4" width="115"><br><sub>Yull Rodríguez</sub>](https://github.com/yull-rodriguez) |

## Licencia

Este proyecto está bajo licencia GNU Affero General Public License v3.0 (AGPL-3.0) - revisa el archivo [LICENSE](LICENSE) para más información.

## Contacto

> [!NOTE]
> Queremos que CercaMio ayude a potenciar los comercios y la economía local. Cualquier sugerencia mejora la plataforma.

- **Reportar problemas:** [Issues del Proyecto](https://github.com/FreddyJr27/E-Commerce_CercaMio-TopicosWeb/issues)
- **Contacto directo:** freddyrodriguez@example.com
- **Desarrolladores Principales:** [@FreddyJr27](https://github.com/FreddyJr27), [@GaboSandova1](https://github.com/GaboSandova1), [@angeldeleon](https://github.com/angelddeleon), [@ngandres2003](https://github.com/ngandres2003), [@Juanrh71](https://github.com/Juanrh71) y [@Yull-Rodriguez](https://github.com/yull-rodriguez)

---

**CercaMio E-Commerce** © 2026 - Impulsando la economía local con tecnología.