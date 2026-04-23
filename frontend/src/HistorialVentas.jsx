import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './HistorialVentas.css';

const ESTADOS_VENTA = ['en proceso', 'cancelada', 'entregada'];

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

  const handleCantidadChange = (ventaId, cantidad) => {
    const cantidadNormalizada = Math.max(1, Number(cantidad) || 1);
    setVentasEnProceso((prev) =>
      prev.map((venta) =>
        venta.id === ventaId ? { ...venta, cantidad: cantidadNormalizada } : venta
      )
    );
  };

  const handleEstadoChange = (ventaId, nuevoEstado) => {
    if (nuevoEstado === 'entregada') {
      setVentasEnProceso((prevVentas) => {
        const ventaEntregada = prevVentas.find((venta) => venta.id === ventaId);
        if (!ventaEntregada) {
          return prevVentas;
        }

        const ventaParaHistorial = {
          ...ventaEntregada,
          estado: 'entregada',
          id: `HV-${Date.now()}`,
        };
        setHistorialVentas((prevHistorial) => [ventaParaHistorial, ...prevHistorial]);

        return prevVentas.filter((venta) => venta.id !== ventaId);
      });
      return;
    }

    setVentasEnProceso((prev) =>
      prev.map((venta) =>
        venta.id === ventaId ? { ...venta, estado: nuevoEstado } : venta
      )
    );
  };

  const capitalizeState = (estado) =>
    estado.charAt(0).toUpperCase() + estado.slice(1);

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
                      <td>{venta.id}</td>
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
                      <td>${venta.monto.toFixed(2)}</td>
                      <td>
                        <select
                          className="sales-select"
                          value={venta.estado}
                          onChange={(event) =>
                            handleEstadoChange(venta.id, event.target.value)
                          }
                        >
                          {ESTADOS_VENTA.map((estado) => (
                            <option key={estado} value={estado}>
                              {capitalizeState(estado)}
                            </option>
                          ))}
                        </select>
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
                      <td>{venta.id}</td>
                      <td>{venta.fecha}</td>
                      <td>{venta.cliente}</td>
                      <td>{venta.producto}</td>
                      <td>{venta.cantidad}</td>
                      <td>${venta.monto.toFixed(2)}</td>
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
