import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css'; // Asegúrate de tener los estilos correctos

function Navbar() {
  const navigate = useNavigate(); // Usamos el hook para navegar
  const [user, setUser] = useState(null); // Estado para almacenar el objeto del usuario
  const [menuVisible, setMenuVisible] = useState(false); // Controla si el menú está visible
  const [avatar, setAvatar] = useState('');
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  // Verificar si hay un usuario almacenado en el localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // Obtiene el objeto completo del localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parsea y establece el objeto del usuario
    }
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }

    const fetchProductos = async () => {
      try {
        const response = await axios.get('/api/productos/');
        setProductos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error al cargar productos para la busqueda:', error);
      }
    };

    fetchProductos();
  }, []);

  // Función para manejar el clic en el botón de iniciar sesión
  const handleClick = () => {
    navigate('/sesion'); // Redirige al componente SesionUsuario
  };

  // Función para manejar el clic en el logo (regresar al inicio)
  const handleBackClick = () => {
    navigate('/'); // Redirige al inicio
    setSearchVisible(false);
  };

  // Función para manejar el clic en "Añadir Producto"
  const handleRegisterProductClick = () => {
    navigate('/CrearProductos'); // Redirige a la página de crear productos
  };
  const handlePerfilClick = () => {
    navigate('/perfil'); // Redirige a la página de crear productos
    setSearchVisible(false);
    setMenuVisible(false);
  };
  const handleSalesHistoryClick = () => {
    navigate('/historial-ventas');
    setSearchVisible(false);
    setMenuVisible(false);
  };
  // Función para alternar la visibilidad del menú desplegable
  const handleUserCircleClick = () => {
    setMenuVisible(!menuVisible); // Alterna la visibilidad del menú
  };

  // Función para manejar la opción de salir
  const handleLogout = () => {
    localStorage.clear(); // Elimina todo el contenido del localStorage
    setUser(null); // Restablece el estado del usuario
    setMenuVisible(false); // Oculta el menú
    navigate('/'); // Opcional: Redirige al inicio después de cerrar sesión
  };

  const filteredProducts = productos
    .filter((producto) =>
      producto.titulo?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .slice(0, 8);

  const handleProductSelect = (productoId) => {
    setSearchVisible(false);
    setSearchTerm('');
    navigate(`/producto/${productoId}`);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (filteredProducts.length > 0) {
      handleProductSelect(filteredProducts[0].id);
    }
  };

  return (
    <nav className="navbar">
      <img
        src="/image/logopsinf.webp"
        alt="Logo CercaMio"
        className="logo"
        onClick={handleBackClick}
      />
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setSearchVisible(true);
            }}
            onFocus={() => setSearchVisible(true)}
          />
        </form>
        {searchVisible && searchTerm.trim() && (
          <div className="search-results">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((producto) => (
                <button
                  key={producto.id}
                  type="button"
                  className="search-result-item"
                  onClick={() => handleProductSelect(producto.id)}
                >
                  <span>{producto.titulo}</span>
                  <small>${producto.precio}</small>
                </button>
              ))
            ) : (
              <div className="search-no-results">No se encontraron productos</div>
            )}
          </div>
        )}
      </div>
      <ul className="nav-links">
      
        <li>
          {user ? (
            <div className="user-container">
              {/* Círculo con la primera letra del username */}
              <div className="user-circle" onClick={handleUserCircleClick}>
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="user-circle__image" />
                ) : (
                  user.username[0].toUpperCase()
                )}
              </div>
              {/* Menú desplegable */}
              {menuVisible && (
                <div className="dropdown-menu">
                  <ul>
                    <li onClick={handlePerfilClick}>Perfil</li>
                    <li onClick={handleSalesHistoryClick}>Historial de ventas</li>
                    <li onClick={handleRegisterProductClick}>Añadir Producto</li>
                    <li onClick={handleLogout}>Salir</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-primary" onClick={handleClick}>
              Usuario
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

