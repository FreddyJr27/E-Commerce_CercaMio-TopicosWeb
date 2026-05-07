import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'; // Verifica si este componente existe
import Footer from './Footer'; // Verifica si este componente existe
import './ProductoPage.css';
import SesionUsuario from './SesionUsuario';

const ProductoPage = () => {
    const { productoId } = useParams();
    const [producto, setProducto] = useState(null);
    const [reseñas, setReseñas] = useState([]); // Estado para guardar las reseñas
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Modal de pago
    const [cantidadCompra, setCantidadCompra] = useState(1); // Cantidad seleccionada
    const [pagoRealizado, setPagoRealizado] = useState(false);
    const [calificacion, setCalificacion] = useState(0);
    const [comentario, setComentario] = useState('');
    const [reseñaEnviado, setReseñaEnviado] = useState(false);
    const [usuarioProducto, setUsuarioProducto] = useState(null);

        const reseñasConCalificacion = reseñas.filter((reseña) => Number(reseña.calificacion) > 0);
        const promedioCalificacion = reseñasConCalificacion.length
                ? reseñasConCalificacion.reduce((suma, reseña) => suma + Number(reseña.calificacion), 0) /
                    reseñasConCalificacion.length
                : 0;

    const renderStars = (value) => {
        const rating = Number(value) || 0;
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={index < rating ? 'star star--filled' : 'star'}
                aria-hidden="true"
            >
                ★
            </span>
        ));
    };

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };
    const fetchUsuarioProducto = async (usuarioId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/usuarios/${usuarioId}/`);
            setUsuarioProducto(response.data);
        } catch (error) {
            console.error("Error al obtener el usuario del producto:", error);
        }
    };
    const handleReseñaClick = () => {
        const user = localStorage.getItem('user');
        if (!user || user === "") {
            alert('Debes estar logueado para dejar una reseña');
            return;
        }
        setIsModalOpen(true); // Abre el modal de reseña
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Cierra el modal de reseña
    };

    const handleSendReseña = async () => {
        if (calificacion < 1 && comentario.trim() === '') {
            alert('Selecciona una valoración o escribe un comentario.');
            return;
        }
        const user = JSON.parse(localStorage.getItem('user'));
        // Si no hay un usuario logueado, mostrar un mensaje de error
        if (!user) {
            alert('Debes estar logueado para dejar una reseña');
            return;
        }
        const nuevaReseña = {
            calificacion: calificacion > 0 ? calificacion : null,
            comentario: comentario.trim(),
            nombre_usuario: user.username, // Nombre ficticio, reemplázalo por el sistema de autenticación
            email_usuario: user.email, // Email ficticio
        };

        try {
            const productoIdInt2 = parseInt(productoId, 10); // Declaración correcta
            if (isNaN(productoIdInt2)) {
                console.error('El ID del producto no es válido:', productoIdInt2);
                return;
            }

            // Realiza la solicitud POST para enviar la reseña
            const response = await axios.post(`http://127.0.0.1:8000/api/productos/${productoIdInt2}/resenas/`, nuevaReseña);
            console.log("Reseña creada:", response.data);

            // Si la reseña fue enviada con éxito
            setReseñaEnviado(true);
            setIsModalOpen(false);
            setCalificacion(0);
            setComentario('');
            fetchReseñas();
        } catch (error) {
            alert("Ocurrió un error al enviar la reseña. Por favor, inténtalo de nuevo.");
            console.error("Error al crear la reseña:", error.response?.data || error.message);
            setReseñaEnviado(false);
        }
    };

    const fetchReseñas = async () => {
        try {
            const productoIdInt2 = parseInt(productoId, 10);
            const response = await axios.get(`/api/productos/${productoIdInt2}/resenas/`);
            setReseñas(response.data);
        } catch (error) {
            console.error('Error al obtener las reseñas:', error);
        }
    };

    const handleComprarClick = () => {
        const user = localStorage.getItem('user');
        if (!user || user === "") {
            alert('Debes estar logueado para realizar una compra');
            return;
        }
        setIsPaymentModalOpen(true); // Abre el modal de pago
    };

    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false); // Cierra el modal de pago
    };

    const handleCantidadChange = (e) => {
        const cantidadIngresada = parseInt(e.target.value, 10) || 1;
        const nuevaCantidad = Math.max(1, Math.min(producto.stock, cantidadIngresada));
        setCantidadCompra(nuevaCantidad);
    };

    const handleProcesarPago = async () => {
        if (cantidadCompra > producto.stock) {
            alert("No hay suficiente stock disponible.");
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !usuarioProducto) {
            alert('Debes estar logueado para enviar una compra.');
            return;
        }

        const montoTotal = Number(producto.precio) * Number(cantidadCompra);
        const codigo = `VP-${Date.now()}`;

        try {
            await axios.post('/api/historial-ventas/', {
                codigo,
                usuario: usuarioProducto.id,
                cliente: user.username,
                producto: producto.titulo,
                cantidad: cantidadCompra,
                monto: montoTotal,
                estado: 'en proceso',
            });
            setPagoRealizado(true);
            setIsPaymentModalOpen(false);
            setCantidadCompra(1);
            alert('Compra enviada al vendedor. Queda en proceso para que la acepte o cancele.');
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            setPagoRealizado(false);
            alert('No se pudo registrar la compra. Intenta nuevamente.');
        }
    };

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/productos/${productoId}`);
                setProducto(response.data);
                fetchReseñas();
    
                // Obtener el usuario asociado al producto
                const usuarioId = response.data.usuario;
                if (usuarioId) {
                    await fetchUsuarioProducto(usuarioId);
                }
            } catch (err) {
                console.error('Error fetching producto:', err);
                setError('Error al obtener los detalles del producto');
            } finally {
                setLoading(false);
            }
        };
    
        fetchProducto();
    }, [productoId]);
    

    if (loading) return <p className="loading">Cargando...</p>;
    if (error) return <p className="error">{error}</p>;


    return (
        <div>
            <Navbar />
            <div className="producto-page">
                {producto && (
                    <div className="producto-detail">
                        <div className='imagen'>
                            <img src={producto.imagen} alt={producto.titulo} />
                        </div>

                        <div className="producto-info">
                            <h1>{producto.titulo}</h1>
                            <p>{producto.descripcion}</p>
                            <p><strong>Precio:</strong> ${producto.precio}</p>
                            <p><strong>Descuento:</strong> ${producto.descuento}</p>
                            <p><strong>Marca:</strong> {producto.marca}</p>
                            <p><strong>Stock:</strong> {producto.stock} unidades</p>
                            <div>
                                <strong>Dimensiones:</strong>
                                <ul>
                                    <li><strong>Ancho:</strong> {producto.dimensiones.ancho} cm</li>
                                    <li><strong>Alto:</strong> {producto.dimensiones.alto} cm</li>
                                    <li><strong>Profundidad:</strong> {producto.dimensiones.profundidad} cm</li>
                                    <li><strong>Peso:</strong> {producto.dimensiones.peso} kg</li>
                                </ul>
                            </div>
                            <h3>Información del Vendedor</h3>
                            <p><strong>Usuario:</strong> {usuarioProducto?.username || 'No disponible'}</p>
                            <p><strong>Correo:</strong> {usuarioProducto?.email || 'No disponible'}</p>
                            <p><strong>Teléfono:</strong> {usuarioProducto?.telefono || 'No registrado'}</p>
                            <p><strong>Dirección:</strong> {usuarioProducto?.direccion || 'No disponible'}</p>
                            <div className="seller-rating">
                                <p><strong>Valoración del vendedor:</strong> {promedioCalificacion ? `${promedioCalificacion.toFixed(1)} / 5` : 'Sin votos aún'}</p>
                                <div className="seller-rating__stars" aria-label="Promedio de valoración">
                                    {promedioCalificacion ? renderStars(Math.round(promedioCalificacion)) : null}
                                </div>
                                <div className="rating-stars" role="radiogroup" aria-label="Valoración del vendedor">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            className={value <= calificacion ? 'star-button star-button--active' : 'star-button'}
                                            onClick={() => setCalificacion(value)}
                                            aria-label={`${value} estrella${value > 1 ? 's' : ''}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <button className="boton-ventana seller-vote-button" onClick={handleSendReseña}>Votar</button>
                            </div>
                            <div className="producto-buttons">
                                <button className="buy-button" onClick={handleComprarClick}>Comprar</button>
                                <button className="review-button" onClick={handleReseñaClick}>Reseña</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Sección de reseñas */}
            {reseñas.length > 0 ? (
                <div className='reseña-item'>
                    <div className="reseñas-section">
                        <h2>Reseña:</h2>
                        {reseñas.map((reseña, index) => (
                            <div key={index} className="reseña">
                                <p><strong>Usuario:</strong> {reseña.nombre_usuario}</p>
                                <p><strong>Email:</strong> {reseña.email_usuario}</p>
                                <p><strong>Calificación:</strong> {renderStars(reseña.calificacion)}</p>
                                <p><strong>Comentario:</strong> {reseña.comentario}</p>
                                <p><strong>Fecha:</strong> {new Date(reseña.fecha).toLocaleDateString()}</p>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="no-reseñas">Aún no hay reseñas para este producto.</p>
            )}

            {/* Modal de reseña */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={handleCloseModal}>X</button>
                        <h2>Escribe tu reseña</h2>
                        <div>
                            <p><strong>Calificación actual:</strong> {calificacion > 0 ? renderStars(calificacion) : 'Sin seleccionar'}</p>
                            <p>La valoración se selecciona en la tarjeta del vendedor.</p>
                        </div>
                        <div>
                            <label>Comentario:</label>
                            <textarea
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                            />
                        </div>
                        <button onClick={handleSendReseña} className='boton-ventana'>Enviar Reseña</button>
                    </div>
                </div>
            )}

            {/* Modal de pago */}
            {isPaymentModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={handleClosePaymentModal}>X</button>
                        <h2>Confirmar Compra</h2>
                        <p><strong>Cantidad:</strong>
                            <input
                                type="number"
                                value={cantidadCompra}
                                onChange={handleCantidadChange}
                                min="1"
                                max={producto.stock} // Limita la cantidad al stock disponible
                            />
                        </p>
                        <p><strong>Precio total:</strong> ${(Number(producto.precio) * Number(cantidadCompra)).toFixed(2)}</p>
                        <div className="modal-actions">
                            <button onClick={handleProcesarPago} className='boton-ventana'>Aceptar</button>
                            <button onClick={handleClosePaymentModal} className='boton-ventana boton-ventana--secondary'>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ProductoPage;

