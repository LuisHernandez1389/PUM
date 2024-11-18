import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardHeader, MDBCardFooter, MDBTypography, MDBBtn, MDBListGroup, MDBListGroupItem, MDBSpinner, MDBBadge, MDBIcon } from 'mdb-react-ui-kit';

// Función para calcular el peso actual del carrito desde el localStorage
const calcularPesoActualCarrito = () => {
  const pesoCarrito = localStorage.getItem('carritoPeso');
  return pesoCarrito ? JSON.parse(pesoCarrito) : 0;
};

// Función para guardar el carrito en el localStorage
const guardarCarritoEnLocalStorage = (carrito) => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

// Función para añadir un paquete al carrito
const anyadirPaqueteAlCarrito = (paqueteid, pesoPaquete) => {
  const pesoMaximo = 9000; // Peso máximo permitido
  const pesoEnGramos = Number(pesoPaquete); // Asegúrate de que sea un número
  const pesoActual = calcularPesoActualCarrito();

  if (pesoActual + pesoEnGramos <= pesoMaximo) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const nuevoCarrito = [...carrito, paqueteid];
    guardarCarritoEnLocalStorage(nuevoCarrito);

    const pesoCarritoActualizado = pesoActual + pesoEnGramos;
    localStorage.setItem('carritoPeso', JSON.stringify(pesoCarritoActualizado));
  } else {
    alert('Has alcanzado el límite de peso en el carrito (9000 gramos)');
  }
};

// Función para añadir un producto al carrito
const anyadirProductoAlCarrito = (productoId) => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.push(productoId);
  guardarCarritoEnLocalStorage(carrito);
};

const Miscompras = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [paquetes, setPaquetes] = useState([]);  // Nuevo estado para los paquetes
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userUID = auth.currentUser?.uid;

  useEffect(() => {
    const databaseRef = ref(database, 'productos');
    onValue(databaseRef, (snapshot) => {
      const productosArray = [];
      snapshot.forEach((childSnapshot) => {
        const producto = { id: childSnapshot.key, ...childSnapshot.val() };
        productosArray.push(producto);
      });
      setProductos(productosArray);
    });

    const paquetesRef = ref(database, 'paquetes');  // Consulta los paquetes
    onValue(paquetesRef, (snapshot) => {
      const paquetesArray = [];
      snapshot.forEach((childSnapshot) => {
        const paquete = { id: childSnapshot.key, ...childSnapshot.val() };
        paquetesArray.push(paquete);
      });
      setPaquetes(paquetesArray);  // Almacena los paquetes en el estado
    });
  }, []);

  useEffect(() => {
    const databaseRef = ref(database, 'ordenes');
    onValue(databaseRef, (snapshot) => {
      const ordenes = [];
      snapshot.forEach((childSnapshot) => {
        const orden = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        if (orden.usuario && orden.usuario.uid === userUID) {
          ordenes.push(orden);
        }
      });

      const ordenesOrdenadas = ordenes
        .filter(orden => orden.fechaCompra && !isNaN(new Date(orden.fechaCompra).getTime()))
        .sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));

      const ordenesConNombres = ordenesOrdenadas.map((orden) => {
        // Combina productos y paquetes en la misma lista
        const productosYPaquetesEnOrden = orden.productos.map((productoId) => {
          const producto = productos.find((prod) => prod.id === productoId);
          if (producto) return producto.nombre; // Si es un producto, devuelve su nombre
          
          const paquete = paquetes.find((paq) => paq.id === productoId);  // Busca paquetes
          return paquete ? paquete.nombre : 'Desconocido';  // Si es un paquete, devuelve su nombre
        });

        return {
          ...orden,
          productos: productosYPaquetesEnOrden,  // Añade los nombres de productos y paquetes
        };
      });

      setOrdenes(ordenesConNombres);
      setLoading(false);
    });
  }, [userUID, productos, paquetes]);

  const handleVolverAComenzar = (orden) => {
    // Lógica para volver a comprar
    orden.productos.forEach((producto) => {
      const productoEncontrado = productos.find(prod => prod.nombre === producto);  // Busca el producto por nombre
      const paqueteEncontrado = paquetes.find(paq => paq.nombre === producto);  // Busca el paquete por nombre

      if (productoEncontrado) {
        anyadirProductoAlCarrito(productoEncontrado.id);  // Añade el producto al carrito
      } else if (paqueteEncontrado) {
        anyadirPaqueteAlCarrito(paqueteEncontrado.id, paqueteEncontrado.peso);  // Añade el paquete al carrito
      }
    });
  };

  if (loading) {
    return (
      <MDBContainer className="d-flex justify-content-center align-items-center my-5">
        <MDBSpinner grow role="status">
          <span className="visually-hidden">Cargando...</span>
        </MDBSpinner>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer className="my-5">
      <MDBTypography tag="h3" className="text-center mb-4">
        <MDBIcon fas icon="shopping-cart" className="me-2" /> MIS COMPRAS
      </MDBTypography>
      {ordenes.length > 0 ? (
        ordenes.map((orden, index) => (
          <MDBCard key={orden.id} className={`mb-4 shadow-3 animate__animated animate__fadeIn animate__delay-${index}s`}>
            <MDBCardHeader className="text-center bg-light">
              <MDBTypography tag="h5" className="text-primary">
                <MDBIcon fas icon="user" className="me-2" />
                {orden.usuario.nombre} {orden.usuario.apellido}
              </MDBTypography>
            </MDBCardHeader>
            <MDBCardBody>
              <p><MDBIcon fas icon="envelope" className="me-2" /><strong>Email:</strong> {orden.usuario.email}</p>
              <p><strong>Productos:</strong></p>
              <MDBListGroup className="mb-3">
                {orden.productos.map((producto, index) => (
                  <MDBListGroupItem key={index} className="d-flex justify-content-between align-items-center animate__animated animate__fadeInRight">
                    <span>{producto}</span>
                    <MDBBadge color="info" pill>Comprado</MDBBadge>
                  </MDBListGroupItem>
                ))}
              </MDBListGroup>
              <p className="mt-3"><MDBIcon fas icon="money-bill" className="me-2" /><strong>Total:</strong> ${orden.total}</p>
              <MDBBtn color="primary" className="mt-2 animate__animated animate__pulse animate__infinite" onClick={() => handleVolverAComenzar(orden)}>
                <MDBIcon fas icon="shopping-bag" className="me-2" /> VOLVER A COMPRAR
              </MDBBtn>
            </MDBCardBody>
            <MDBCardFooter className="text-muted text-center">
              <MDBIcon fas icon="calendar-alt" className="me-2" />
              Fecha de Compra: {orden.fechaCompra 
                ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(orden.fechaCompra)) 
                : 'Sin fecha de compra'}
            </MDBCardFooter>
          </MDBCard>
        ))
      ) : (
        <MDBTypography tag="p" className="text-center">No hay pedidos disponibles</MDBTypography>
      )}
    </MDBContainer>
  );
};

export default Miscompras;
