import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CrearProducto.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const CrearProducto = () => {
    const navigate = useNavigate();

    const formatApiErrors = (data, status) => {
        if (!data) {
            return status ? `Error ${status} al crear producto.` : 'Error al crear producto.';
        }

        if (typeof data === 'string') {
            return data;
        }

        if (Array.isArray(data)) {
            return data.join('\n');
        }

        if (data.detail) {
            return data.detail;
        }

        return Object.entries(data)
            .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                    return `${field}: ${messages.join(', ')}`;
                }
                return `${field}: ${messages}`;
            })
            .join('\n');
    };

    const translateCategoryName = (name) => {
        if (!name) return '';
        const key = name.trim().toLowerCase();
        const translations = {
            furniture: 'Muebles',
            groceries: 'Comestibles',
            'home decoration': 'Decoracion del hogar',
            'kitchen accessories': 'Accesorios de cocina',
            laptops: 'Portatiles',
            'mens shirts': 'Camisas de hombre',
            'mens shoes': 'Zapatos de hombre',
            'mens watches': 'Relojes de hombre',
            'mobile accessories': 'Accesorios moviles',
            motorcycle: 'Motocicleta',
            'skin care': 'Cuidado de la piel',
            smartphones: 'Telefonos inteligentes',
            'sports accessories': 'Accesorios deportivos',
            sunglasses: 'Gafas de sol',
            tablets: 'Tabletas',
            tops: 'Blusas',
            vehicle: 'Vehiculos',
            'womens bags': 'Bolsos de mujer',
        };

        return translations[key] || name;
    };

    const generateRandomSku = () => {
        const length = Math.floor(Math.random() * 5) + 8; // Genera un número entre 8 y 12
        return Math.floor(Math.random() * Math.pow(10, length)).toString();
    };

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        descuento: '',
        stock: '',
        categoria_id: 1,
        marca: '',
        imagen: '',
        dimensiones: { ancho: '', alto: '', profundidad: '', peso: '' },
        estado_disponibilidad: 'disponible',
        politica_devolucion: 'no',
        cantidad_minima: 1,
        sku: generateRandomSku(),
    });
    const [imagenPreview, setImagenPreview] = useState('');

    const [categorias, setCategorias] = useState([]);
    const [categoriasError, setCategoriasError] = useState('');

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('/api/categorias/');
                const data = Array.isArray(response.data) ? response.data : [];
                setCategorias(data);
                if (data.length > 0) {
                    setFormData((prev) => ({ ...prev, categoria_id: data[0].id }));
                }
            } catch (error) {
                console.error('Error al cargar categorias:', error.response?.data || error.message);
                setCategoriasError('No se pudieron cargar las categorias.');
            }
        };

        fetchCategorias();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id.includes('dimensiones')) {
            const dimension = id.split('.')[1];
            setFormData({
                ...formData,
                dimensiones: {
                    ...formData.dimensiones,
                    [dimension]: value
                }
            });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Selecciona un archivo de imagen valido.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setFormData({ ...formData, imagen: reader.result });
                setImagenPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo || !formData.descripcion || !formData.precio || !formData.stock) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Obtener usuario del localStorage
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user || !user.id) {
            alert('Usuario no encontrado. Por favor, inicia sesión.');
            return;
        }

        const producto = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            precio: formData.precio,
            descuento: formData.descuento || "0.00",
            stock: parseInt(formData.stock),
            categoria_id: parseInt(formData.categoria_id),
            marca: formData.marca,
            imagen: formData.imagen,
            dimensiones: {
                ancho: parseInt(formData.dimensiones.ancho, 10),
                alto: parseInt(formData.dimensiones.alto, 10),
                profundidad: parseInt(formData.dimensiones.profundidad, 10),
                peso: parseInt(formData.dimensiones.peso, 10)
            },
            estado_disponibilidad: formData.estado_disponibilidad,
            politica_devolucion: formData.politica_devolucion,
            cantidad_minima: formData.cantidad_minima,
            sku: formData.sku,
            usuario: user.id, // Añadir el ID del usuario al objeto producto
            fecha_creacion: new Date().toISOString(),
            fecha_actualizacion: new Date().toISOString(),
            resenas: []
        };

        try {
            const response = await axios.post('/api/productos/', producto);
            console.log('Producto creado:', response.data);
            alert('Producto creado con éxito.');
            setFormData({
                titulo: '',
                descripcion: '',
                precio: '',
                descuento: '',
                stock: '',
                categoria_id: 1,
                marca: '',
                imagen: '',
                dimensiones: { ancho: '', alto: '', profundidad: '', peso: '' },
                estado_disponibilidad: 'disponible',
                politica_devolucion: 'no',
                cantidad_minima: 1,
                sku: generateRandomSku(),
            });
            setImagenPreview('');
            navigate('/'); // Corrige el uso de `useNavigate` como función
        } catch (error) {
            console.error('Error al crear el producto:', error.response?.data);
            alert(formatApiErrors(error.response?.data, error.response?.status));
        }
    };

    return (
        <div>
            <Navbar />
            <div className="hoja">
                <div className="crear-producto-container">
                    <h1 className="titulo">Crear Producto</h1>
                    <form className="formulario" onSubmit={handleSubmit}>
                        <div className="campo mediano">
                            <label htmlFor="titulo">Título del Producto</label>
                            <input
                                type="text"
                                id="titulo"
                                placeholder="Título del producto"
                                value={formData.titulo}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="campo-grande">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                placeholder="Descripción del producto"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="campo-doble">
                            <div className="campo pequeno">
                                <label htmlFor="precio">Precio</label>
                                <input
                                    type="number"
                                    id="precio"
                                    placeholder="Precio"
                                    value={formData.precio}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="campo pequeno">
                                <label htmlFor="descuento">Descuento</label>
                                <input
                                    type="number"
                                    id="descuento"
                                    placeholder="Descuento"
                                    value={formData.descuento}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="campo pequeno">
                                <label htmlFor="stock">Stock</label>
                                <input
                                    type="number"
                                    id="stock"
                                    placeholder="Stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="campo mediano">
                            <label htmlFor="marca">Marca</label>
                            <input
                                type="text"
                                id="marca"
                                placeholder="Marca del producto"
                                value={formData.marca}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="campo mediano">
                            <label htmlFor="imagen">Imagen del producto</label>
                            <input
                                type="file"
                                id="imagen"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagenPreview ? (
                                <img
                                    src={imagenPreview}
                                    alt="Vista previa"
                                    className="crear-producto-preview"
                                />
                            ) : null}
                        </div>
                        <div className="campo-doble">
                            <div className='dimensiones'> 
                                <div className="campo pequeno">
                                    <label htmlFor="dimensiones.ancho">Ancho(cm)</label>
                                    <input
                                        type="number"
                                        id="dimensiones.ancho"
                                        placeholder="Ancho"
                                        value={formData.dimensiones.ancho}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="campo pequeno">
                                    <label htmlFor="dimensiones.alto">Alto(cm)</label>
                                    <input
                                        type="number"
                                        id="dimensiones.alto"
                                        placeholder="Alto"
                                        value={formData.dimensiones.alto}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="campo pequeno">
                                    <label htmlFor="dimensiones.profundidad">Profundidad(cm)</label>
                                    <input
                                        type="number"
                                        id="dimensiones.profundidad"
                                        placeholder="Profundidad"
                                        value={formData.dimensiones.profundidad}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="campo pequeno">
                                <label htmlFor="dimensiones.peso">Peso(kg)</label>
                                <input
                                    type="number"
                                    id="dimensiones.peso"
                                    placeholder="Peso"
                                    value={formData.dimensiones.peso}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="campo mediano">
                            <label htmlFor="estado_disponibilidad">Estado de Disponibilidad</label>
                            <select
                                id="estado_disponibilidad"
                                value={formData.estado_disponibilidad}
                                onChange={handleInputChange}
                            >
                                <option value="disponible">Disponible</option>
                                <option value="no_disponible">No Disponible</option>
                            </select>
                        </div>
                        <div className="campo mediano">
                            <label htmlFor="politica_devolucion">Política de Devolución</label>
                            <select
                                id="politica_devolucion"
                                value={formData.politica_devolucion}
                                onChange={handleInputChange}
                            >
                                <option value="si">Sí</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                        
                        <div className="campo mediano">
                            <label htmlFor="categoria_id">Categoría</label>
                            <select
                                id="categoria_id"
                                value={formData.categoria_id}
                                onChange={handleInputChange}
                                disabled={categorias.length === 0}
                            >
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {translateCategoryName(categoria.nombre)}
                                    </option>
                                ))}
                            </select>
                            {categoriasError ? (
                                <p className="error-message">{categoriasError}</p>
                            ) : null}
                        </div>
                        <button type="submit" className="boton-crear-producto">
                            Crear Producto
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CrearProducto;