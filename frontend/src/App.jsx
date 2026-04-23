import './App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';

const normalizeText = (value) =>
  value
    ?.toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const normalizeId = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

function App() {
  const navigate = useNavigate(); // Usamos el hook para navegar

  // Función para manejar el clic en el botón
  const handleClick = () => {
    navigate('/sesion'); // Redirige al componente SesionUsuario
  };

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar errores

  const fetchProductos = async () => {
    try {
      // Solicitar los productos a la API
      const response = await axios.get('/api/productos/');
      setProductos(response.data); // Almacenar los productos en el estado
    } catch (err) {
      setError('Error al obtener los productos');
      console.error('Error fetching productos:', err);
    }
  };
  const handleCategoryClick = (categoryId) => {
    if (!categoryId) {
      return;
    }
    navigate(`/categoria/${categoryId}`);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('/api/categorias/');
        setCategorias(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching categorias:', err);
      }
    };

    fetchCategorias();
  }, []);

  const findCategoriaId = (candidatos) => {
    const nombres = Array.isArray(candidatos) ? candidatos : [candidatos];
    const categoria = categorias.find(
      (item) =>
        nombres.some(
          (nombre) => normalizeText(item.nombre) === normalizeText(nombre)
        )
    );
    return categoria ? categoria.id : null;
  };

  const categoryIds = {
    tecnologia: findCategoriaId(['Smartphones', 'Laptops', 'Mobile Accessories']),
    auto: findCategoriaId(['Vehicle', 'Motorcycle']),
    hogar: findCategoriaId(['Home Decoration', 'Furniture']),
    alimentos: findCategoriaId(['Groceries']),
    ropa: findCategoriaId(['Mens Shirts', 'Womens Dresses', 'Tops']),
    deportes: findCategoriaId(['Sports Accessories']),
    otros: findCategoriaId(['Beauty', 'Fragrances']),
  };

  // Filtrar los productos más nuevos
  const productosMasNuevos = [...productos]
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 16);
  console.log(productosMasNuevos);

  const matchesCategory = (producto, categoryId) =>
    normalizeId(producto.categoria_id) === normalizeId(categoryId);

  // Filtrar los productos de la categoría "Otros"
  const productosOtros = productos.filter((producto) => matchesCategory(producto, categoryIds.otros)).slice(0, 16);
  console.log(productosOtros);

  const productosalimentos = productos.filter((producto) => matchesCategory(producto, categoryIds.alimentos)).slice(0, 16);
  console.log(productosOtros);

  const productohogar = productos.filter((producto) => matchesCategory(producto, categoryIds.hogar)).slice(0, 16);
  console.log(productosOtros);

  const productotecnologia = productos.filter((producto) => matchesCategory(producto, categoryIds.tecnologia)).slice(0, 16);
  console.log(productosOtros);

  const productoauto = productos.filter((producto) => matchesCategory(producto, categoryIds.auto)).slice(0, 16);
  console.log(productosOtros);

  const productoropa = productos.filter((producto) => matchesCategory(producto, categoryIds.ropa)).slice(0, 16);
  console.log(productosOtros);

  const productodeportes = productos.filter((producto) => matchesCategory(producto, categoryIds.deportes)).slice(0, 16);
  console.log(productosOtros);

  return (
    <>
      <div>
        <div>
          <Navbar /> {/* Aquí se usa el Navbar */}
        </div>

        <div className="background">
          <image src='./image/fondocercamio.png' alt="background" />
        </div>
        
        <div className="main">
          <main>
            <div className="categorias">
              <h2>Categorías</h2>
              <ul>
                <li onClick={() => handleCategoryClick(categoryIds.tecnologia)}>
                  <h3>Tecnología</h3>
                  <img src=".\image\tecnologia.avif" alt="Tecnología" style={{ paddingTop: '20px' }}/>
                </li>
                <li  onClick={() => handleCategoryClick(categoryIds.auto)}>
                  <h3>Auto</h3>
                  <img src=".\image\camionet.png" alt="Auto" />
                </li>
                <li onClick={() => handleCategoryClick(categoryIds.hogar)}> 
                  <h3>Hogar e Inmuebles</h3>
                  <img src=".\image\sofa4.png" alt="Hogar e Inmuebles" style={{ paddingTop: '30px' }} />
                </li>
                <li onClick={() => handleCategoryClick(categoryIds.alimentos)}>
                  <h3>Alimentos</h3>
                  <img src=".\image\alimentos.png" alt="Alimentos" />
                </li>
                <li onClick={() => handleCategoryClick(categoryIds.ropa)}>
                  <h3>Ropa</h3>
                  <img src=".\image\ropa.png" alt="Ropa" style={{ width: '60%' , height: '60%', paddingTop: '10px'}} />
                </li>
                <li onClick={() => handleCategoryClick(categoryIds.deportes)}>
                  <h3>Deportes</h3>
                  <img src=".\image\deportes.png" alt="Deportes" style={{ width: '70%' , height: '70%', paddingTop: '10px'}} />
                </li>
                <li onClick={() => handleCategoryClick(categoryIds.otros)}>
                  <h3>Otros</h3>
                  <img src=".\image\eladagiodejuan.png" alt="Otros" style={{ width: '70%' , height: '70%', paddingTop: '1px'}} />
                </li>
              </ul>
            </div>

            <div className="rectangles-container">
              {/* Pasamos los productos más nuevos como prop al rectángulo */}
              <Rectangle key={0} title="Mas nuevos" productos={productosMasNuevos} />
              <Rectangle key={1} title="Tecnologia" productos={productotecnologia} />
              <Rectangle key={2} title="Auto" productos={productoauto}/>
              <Rectangle key={3} title="Hogar e Inmuebles" productos={productohogar} />
              <Rectangle key={4} title="Alimentos" productos={productosalimentos} />
              <Rectangle key={5} title="Ropa" productos={productoropa} />
              <Rectangle key={6} title="Deportes" productos={productodeportes} />
              <Rectangle key={7} title="Otros" productos={productosOtros}/>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
}

function Rectangle({ title, productos = [] }) {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate(); // Usamos el hook useNavigate aquí

  const handleProductClick = (productoId) => {
    navigate(`/producto/${productoId}`); // Redirige a la página del producto con el productoId
  };

  return (
    <div className="rectangle">
      <div className="rectangle-title">{title}</div>

      {productos.length > 0 ? (
        <div className="products-container">
          <div className="square-container">
            <div className={`square-wrapper ${showMore ? 'move-right' : ''}`}>
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="square"
                  onClick={() => handleProductClick(producto.id)} // Clic en el producto
                >
                  <div className="square-content">
                    <img
                      src={producto.imagen}
                      alt={producto.titulo}
                      className="product-image"
                    />
                    <div className="product-details">
                      <h3>{producto.titulo}</h3>
                      <p>${producto.precio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No hay productos disponibles.</p>
      )}

      <button className="toggle-btn" onClick={() => setShowMore(!showMore)}>
        {showMore ? '←' : '→'}
      </button>
    </div>
  );
}


export default App;