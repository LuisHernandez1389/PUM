import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import jsPDF from 'jspdf';

const FormOrdenes = () => {
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [mostrarFactura, setMostrarFactura] = useState(false);

  useEffect(() => {
    const databaseRef = ref(database, 'productos');
    onValue(databaseRef, (snapshot) => {
      const productos = [];
      snapshot.forEach((childSnapshot) => {
        const producto = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        productos.push(producto);
      });
      setProductosOriginales(productos);
      setProductosFiltrados(productos);
    });
  }, []);

  useEffect(() => {
    // Filtrar productos según la búsqueda
    const productosFiltradosResultado = productosOriginales.filter((producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setProductosFiltrados(productosFiltradosResultado);
  }, [busqueda, productosOriginales]);

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleNombreClienteChange = (event) => {
    setNombreCliente(event.target.value);
  };

  const agregarProducto = (producto) => {
    const cantidadInput = prompt(`Ingrese la cantidad para "${producto.nombre}":`, '1');
    const cantidad = parseInt(cantidadInput, 10);

    if (!isNaN(cantidad) && cantidad > 0 && cantidad <= producto.cantidad) {
      // Restar la cantidad al inventario del producto
      const nuevosProductos = productosOriginales.map((p) =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad - cantidad } : p
      );
      setProductosOriginales(nuevosProductos);

      // Agregar el producto con la cantidad al formulario de pedido
      const productoAgregado = { ...producto, cantidad };
      setProductosAgregados([...productosAgregados, productoAgregado]);

      // Actualizar la base de datos con los nuevos datos
      const databaseRef = ref(database, 'productos');
      set(databaseRef, nuevosProductos);
    } else {
      alert('Ingrese una cantidad válida.');
    }
  };

  const mostrarFacturaHandler = () => {
    setMostrarFactura(true);
  };

  const calcularTotal = () => {
    return productosAgregados.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  };

  const generarPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'letter');
    pdf.text('Factura', 15, 10);
    pdf.text(`Cliente: ${nombreCliente}`, 15, 20);

    let y = 30;
    productosAgregados.forEach((producto, index) => {
      pdf.text(`${producto.nombre} - Cantidad: ${producto.cantidad} - Subtotal: $${producto.precio * producto.cantidad}`, 15, y);
      y += 10;
    });

    pdf.text(`Total: $${calcularTotal()}`, 15, y + 10);

    pdf.save('factura.pdf');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Búsqueda de Productos</h2>
      <form className="mb-4">
        <div className="mb-3">
          <label htmlFor="busqueda" className="form-label">Buscar Producto:</label>
          <input
            type="text"
            id="busqueda"
            value={busqueda}
            onChange={handleBusquedaChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nombreCliente" className="form-label">Nombre del Cliente:</label>
          <input
            type="text"
            id="nombreCliente"
            value={nombreCliente}
            onChange={handleNombreClienteChange}
            className="form-control"
          />
        </div>
      </form>
      <ul className="list-group">
        {busqueda.trim() === ''
          ? null
          : productosFiltrados.length === 0
          ? <p className="text-muted">No se encontraron productos.</p>
          : productosFiltrados.map((producto) => (
            <li key={producto.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{producto.nombre}</strong> - Cantidad disponible: {producto.cantidad}
              </div>
              <button onClick={() => agregarProducto(producto)} className="btn btn-primary">Agregar</button>
            </li>
          ))}
      </ul>

      <h2 className="mt-4">Productos Agregados al Pedido</h2>
      <ul className="list-group">
        {productosAgregados.map((producto, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{producto.nombre}</strong> - Cantidad: {producto.cantidad}
            </div>
          </li>
        ))}
      </ul>

      {productosAgregados.length > 0 && (
        <div className="mt-4">
          <button onClick={mostrarFacturaHandler} className="btn btn-success">Mostrar Factura</button>
        </div>
      )}

      {mostrarFactura && (
        <div className="mt-4">
          <button onClick={generarPDF} className="btn btn-primary">Generar PDF</button>
        </div>
      )}
    </div>
  );
};

export default FormOrdenes;
