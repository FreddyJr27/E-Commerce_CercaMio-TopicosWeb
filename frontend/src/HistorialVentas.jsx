import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import './HistorialVentas.css';

const ventasEnProcesoInicial = [
  {
    id: 'VP-1001',
    fecha: '2026-04-20',
    cliente: 'Carlos Mendoza',
    producto: 'iPhone 15',
    cantidad: 1,
    monto: 2000,
    estado: 'en proceso',
  },
  {
    id: 'VP-1002',
    fecha: '2026-04-21',
    cliente: 'Daniela Perez',
    producto: 'Piscina inflable',
    cantidad: 2,
    monto: 200,
    estado: 'en proceso',
  },
  {
    id: 'VP-1003',
    fecha: '2026-04-22',
    cliente: 'Juan Torres',
    producto: 'Franelas deportivas',
    cantidad: 1,
    monto: 92,
    estado: 'cancelada',
  },
];

const historialVentasInicial = [
  {
    id: 'HV-0901',
    fecha: '2026-04-10',
    cliente: 'Mariana Rojas',
    producto: 'Sofa modular',
    cantidad: 1,
    monto: 780,
    estado: 'entregada',
  },
  {
    id: 'HV-0902',
    fecha: '2026-04-12',
    cliente: 'Jose Diaz',
    producto: 'Motorcycle X1',
    cantidad: 1,
    monto: 4600,
    estado: 'entregada',
  },
  {
    id: 'HV-0903',
    fecha: '2026-04-14',
    cliente: 'Luisa Aguilar',
    producto: 'Mens Watches Premium',
    cantidad: 3,
    monto: 149,
    estado: 'entregada',
  },
  {
    id: 'HV-0904',
    fecha: '2026-04-16',
    cliente: 'Rafael Suarez',
    producto: 'Groceries Pack',
    cantidad: 2,
    monto: 64,
    estado: 'entregada',
  },
];

function HistorialVentas() {
  const [ventasEnProceso, setVentasEnProceso] = useState(ventasEnProcesoInicial);
  const [historialVentas, setHistorialVentas] = useState(historialVentasInicial);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const response = await axios.get(
          storedUser?.id
            ? `/api/historial-ventas/?usuario=${storedUser.id}`
            : '/api/historial-ventas/'
        );
        const ventas = Array.isArray(response.data) ? response.data : [];

        if (ventas.length > 0) {
          setVentasEnProceso(ventas.filter((venta) => venta.estado === 'en proceso'));
          setHistorialVentas(ventas.filter((venta) => venta.estado !== 'en proceso'));
        }
      } catch (error) {
        console.error('Error al cargar historial de ventas:', error);
      }
    };

    fetchVentas();
  }, []);

  const handleCantidadChange = (ventaId, cantidad) => {
    const cantidadNormalizada = Math.max(1, Number(cantidad) || 1);
    setVentasEnProceso((prev) =>
      prev.map((venta) =>
        venta.id === ventaId ? { ...venta, cantidad: cantidadNormalizada } : venta
      )
    );
  };

  const handleEstadoChange = (ventaId, nuevoEstado) => {
    const updateVenta = async () => {
      try {
        const response = await axios.patch(`/api/historial-ventas/${ventaId}/`, {
          estado: nuevoEstado,
        });

        const ventaActualizada = response.data;
        setVentasEnProceso((prev) => prev.filter((venta) => venta.id !== ventaId));
        setHistorialVentas((prev) => [ventaActualizada, ...prev]);
      } catch (error) {
        console.error('Error al actualizar la venta:', error);
        alert('No se pudo actualizar la venta.');
      }
    };

    updateVenta();
  };

  const capitalizeState = (estado) =>
    estado.charAt(0).toUpperCase() + estado.slice(1);

  const formatMonto = (monto) => Number(monto || 0).toFixed(2);

  return (
    <div className="sales-page">
      <Navbar />
      <main className="sales-content">
        <h1>Historial de ventas</h1>
        <section className="sales-table-section">
          <h2>Ventas en proceso</h2>
          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ventasEnProceso.length > 0 ? (
                  ventasEnProceso.map((venta) => (
                    <tr key={venta.id}>
                      <td>{venta.codigo || venta.id}</td>
                      <td>{venta.fecha}</td>
                      <td>{venta.cliente}</td>
                      <td>{venta.producto}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="sales-input"
                          value={venta.cantidad}
                          onChange={(event) =>
                            handleCantidadChange(venta.id, event.target.value)
                          }
                        />
                      </td>
                      <td>${formatMonto(venta.monto)}</td>
                      <td>
                        <div className="sales-actions">
                          <button
                            type="button"
                            className="sales-action-button sales-action-button--accept"
                            onClick={() => handleEstadoChange(venta.id, 'aceptada')}
                          >
                            Aceptar
                          </button>
                          <button
                            type="button"
                            className="sales-action-button sales-action-button--cancel"
                            onClick={() => handleEstadoChange(venta.id, 'cancelada')}
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="sales-empty-row">
                      No hay ventas en proceso por ahora.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="sales-table-section">
          <h2>Historial de ventas</h2>
          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {historialVentas.length > 0 ? (
                  historialVentas.map((venta) => (
                    <tr key={venta.id}>
                      <td>{venta.codigo || venta.id}</td>
                      <td>{venta.fecha}</td>
                      <td>{venta.cliente}</td>
                      <td>{venta.producto}</td>
                      <td>{venta.cantidad}</td>
                      <td>${formatMonto(venta.monto)}</td>
                      <td>{capitalizeState(venta.estado)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="sales-empty-row">
                      Aun no hay ventas registradas en el historial.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default HistorialVentas;
