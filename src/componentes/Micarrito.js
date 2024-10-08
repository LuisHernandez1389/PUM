import React, { useState, useEffect, useRef, useCallback } from 'react';
import { database } from '../firebase';
import { ref, onValue, push } from 'firebase/database';
import ReactDOM from "react-dom";
import "../estilos/carrito.css"
import { auth } from '../firebase';
import { getAuth } from 'firebase/auth';
import { get } from 'firebase/database';
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,MDBIcon
} from 'mdb-react-ui-kit';
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

function Micarrito() {
  const [productosDatabase, setProductosDatabase] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoPeso, setCarritoPeso] = useState(0);
  const divisa = '$';
  const [isPayPalButtonRendered, setIsPayPalButtonRendered] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const popoverRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();

  }, []);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Si el clic se origina fuera del popover, ciérralo
      if (isPopoverVisible && popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsPopoverVisible(false);
        setIsPayPalButtonRendered(false);
      }
    };

    // Agrega el event listener cuando el popover está visible
    if (isPopoverVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isPopoverVisible]);

  const handleOpenPopover = () => {
    setIsPopoverVisible(true);
    setIsPayPalButtonRendered(true);
    console.log(user)

  };

  const handleClosePopover = () => {
    setIsPopoverVisible(false);
    setIsPayPalButtonRendered(false);
  };

  const calcularTotal = useCallback(() => {
    return carrito.reduce((total, item) => {
      const miItem = productosDatabase.find((itemBaseDatos) => itemBaseDatos.id === item);
      if (miItem) {
        return total + miItem.precio;
      } else {
        return total;
      }
    }, 0).toFixed(2);
  }, [carrito, productosDatabase]);

  const [total, setTotal] = useState(calcularTotal());
  useEffect(() => {
    setTotal(calcularTotal());
    console.log(carritoPeso);
  }, [carrito, productosDatabase, calcularTotal, carritoPeso]);


  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: calcularTotal()
          }
        }
      ]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userUid = user.uid;
        const userRef = ref(database, 'users/' + userUid);

        try {
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();

            // Crear el array de detalles del pago
            const detailsArray = Object.entries(details).map(([key, value]) => ({ key, value }));

            // Crear la orden con la fecha actual
            const orden = {
              usuario: {
                uid: user.uid,
                nombre: userData.nombre,
                apellido: userData.apellido,
                direccion: userData.direccion,
                numeroTelefono: userData.numeroTelefono,
                email: user.email,
              },
              productos: carrito,  // Asegúrate de que carrito esté definido en el ámbito
              total: calcularTotal(),  // Asegúrate de que calcularTotal esté definido en el ámbito
              detallesPago: detailsArray,  // Detalles del pago
              fechaCompra: new Date().toISOString(),  // Fecha de compra actual
            };

            // Referencia a la base de datos para guardar la orden
            const ordenesRef = ref(database, 'ordenes');

            // Guardar la orden en Firebase
            await push(ordenesRef, orden);
            console.log('Orden guardada en Firebase:', orden);

            // Resetear el carrito local después de guardar la orden
            setCarrito([]);  // Asegúrate de que setCarrito esté definido en el ámbito
            guardarCarritoEnLocalStorage([]);  // Asegúrate de que esta función esté definida

          } else {
            console.log('No se encontraron datos del usuario.');
          }
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error.message);
        }
      } else {
        console.log('Usuario no autenticado.');
      }
    });
  };

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    const pesoGuardado = JSON.parse(localStorage.getItem('carritoPeso')) || 0;
    setCarrito(carritoGuardado);
    setCarritoPeso(pesoGuardado);

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
      setProductosDatabase(productos);
    });
  }, []);

  /////Guarda en localStorage
  const guardarCarritoEnLocalStorage = (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };


  /////////////////////// Borra productos del carrito
  const borrarItemCarrito = (productoId) => {
    const nuevoCarrito = carrito.filter((item) => item !== productoId);
    setCarrito(nuevoCarrito);
    guardarCarritoEnLocalStorage(nuevoCarrito);

    // Actualizar el peso del carrito
    const itemCarrito = productosDatabase.find((item) => item.id === productoId);
    const pesoProducto = itemCarrito?.peso || 0;
    const pesoCarritoActualizado = carritoPeso - (pesoProducto * carrito.filter((id) => id === productoId).length);
    setCarritoPeso(pesoCarritoActualizado);
    localStorage.setItem('carritoPeso', JSON.stringify(pesoCarritoActualizado));
  };

  ///////Agrega producto del carrito
  const agregarItemCarrito = (productoId) => {
    const itemCarrito = productosDatabase.find((item) => item.id === productoId);
    const pesoProducto = itemCarrito?.peso || 0;

    if (carritoPeso + pesoProducto > 9000) {
      // Mostrar un mensaje de advertencia
      alert('No puedes agregar más productos. El peso total del carrito supera los 9000 gramos.');
      return; // No agregar más productos
    }

    // Agregar el producto al carrito
    const nuevoCarrito = [...carrito, productoId];
    setCarrito(nuevoCarrito);
    guardarCarritoEnLocalStorage(nuevoCarrito);

    // Actualizar el peso del carrito
    const pesoCarritoActualizado = carritoPeso + pesoProducto;
    setCarritoPeso(pesoCarritoActualizado);
    localStorage.setItem('carritoPeso', JSON.stringify(pesoCarritoActualizado));
  };

  ///////Reducir producto
  const reducirItemCarrito = (productoId) => {
    const indiceProducto = carrito.indexOf(productoId);

    if (indiceProducto !== -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito.splice(indiceProducto, 1); // Elimina una unidad del producto
      setCarrito(nuevoCarrito);
      guardarCarritoEnLocalStorage(nuevoCarrito);

      // Actualizar el peso del carrito
      const itemCarrito = productosDatabase.find((item) => item.id === productoId);
      const pesoProducto = itemCarrito?.peso || 0;
      const pesoCarritoActualizado = carritoPeso - pesoProducto;
      setCarritoPeso(pesoCarritoActualizado);
      localStorage.setItem('carritoPeso', JSON.stringify(pesoCarritoActualizado));
    }
  };


  //////// Vaicia le carrito
  const vaciarCarrito = () => {
    setCarrito([]);
    setCarritoPeso(0); // Reiniciar el peso del carrito
    guardarCarritoEnLocalStorage([]);
  };


  const calcularTotalUnidades = useCallback(() => {
    return carrito.reduce((total, item) => {
      return total + 1; // Suma 1 por cada item en el carrito
    }, 0);
  }, [carrito]);


  const [totalUnidades, setTotalUnidades] = useState(calcularTotalUnidades());

  useEffect(() => {
    setTotalUnidades(calcularTotalUnidades());
  }, [carrito, calcularTotalUnidades]);
  const renderizarCarrito = () => {
    const carritoSinDuplicados = [...new Set(carrito)];

    return carritoSinDuplicados.map((item) => {
      const miItem = productosDatabase.find((itemBaseDatos) => itemBaseDatos.id === item);

      if (miItem) {
        const numeroUnidadesItem = carrito.filter((itemId) => itemId === item).length;

        return (
          <MDBCard className="mb-4">
            <MDBRow className="g-0 align-items-center">

              {/* Contenedor de la imagen con tamaño fijo */}
              <MDBCol md="4">
                <MDBCardImage
                  src={miItem.imagenUrl}
                  alt={miItem.nombre}
                  position="top"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </MDBCol>

              {/* Contenido del lado derecho */}
              <MDBCol md="8">
              <MDBCardBody className="d-flex justify-content-between align-items-center">
  <div>
    <MDBCardText>{miItem.nombre}</MDBCardText>
    <MDBCardText>Unidades: {numeroUnidadesItem}</MDBCardText>
    <MDBCardText>Gramos: {miItem.peso}</MDBCardText>
    <MDBCardText>{divisa} {miItem.precio}</MDBCardText>
  </div>

  <div className="d-flex gap-3"> {/* Contenedor con más separación */}
    <MDBBtn className="custom-btn add-btn" onClick={() => agregarItemCarrito(miItem.id)}>
      <MDBIcon fas icon="plus" />
    </MDBBtn>
    
    <MDBBtn className="custom-btn subtract-btn" onClick={() => reducirItemCarrito(miItem.id)}>
      <MDBIcon fas icon="minus" />
    </MDBBtn>
    
    <MDBBtn className="custom-btn delete-btn" onClick={() => borrarItemCarrito(miItem.id)}>
      <MDBIcon fas icon="trash-alt" />
    </MDBBtn>
  </div>
  {/* Estilos personalizados */}
  <style jsx>{`
    .custom-btn {
      padding: 10px 15px;
      border-radius: 50px;
      transition: all 0.3s ease;
      font-size: 1.2rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Sombra suave */
    }

    .custom-btn:hover {
      transform: scale(1.1); /* Animación de agrandar */
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); /* Más sombra al pasar el ratón */
    }

    .add-btn {
      background-color: #28a745; /* Verde personalizado */
      color: white;
    }

    .add-btn:hover {
      background-color: #218838; /* Más oscuro al hacer hover */
    }

    .subtract-btn {
      background-color: #ffc107; /* Amarillo personalizado */
      color: black;
    }

    .subtract-btn:hover {
      background-color: #e0a800; /* Más oscuro al hacer hover */
    }

    .delete-btn {
      background-color: #dc3545; /* Rojo personalizado */
      color: white;
    }

    .delete-btn:hover {
      background-color: #c82333; /* Más oscuro al hacer hover */
    }
  `}</style>
</MDBCardBody>

              </MDBCol>
            </MDBRow>
          </MDBCard>
        );
      } else {
        return (
          <li key={item} className="list-group-item text-right mx-2">
            Producto no encontrado
          </li>
        );
      }
    });
  };


  return (
    <div className="container">
      <div className="row mt-4">
        <aside className="col-sm-12">
          <div className="row">
            <div className="col-sm-9">
              <ul id="carrito" className="list-group">
                {renderizarCarrito()}
              </ul>
            </div>
            <div className="col-sm-3">
              <h2>Resumen</h2>
              <p>Cantidad de artículos: {totalUnidades}</p>
              <p className="text-right">
                <span id="total">
                  <h2>Total: {divisa} {total} </h2>
                </span>
              </p>
              <MDBBtn color="danger" onClick={vaciarCarrito}>Vaciar</MDBBtn>
              <MDBBtn color="primary" onClick={handleOpenPopover}>Comprar</MDBBtn>
            </div>
          </div>
        </aside>
      </div>

      {isPopoverVisible && (
        <div className="popover-container">
          <div className="popover-content">
            {/* Contenido del popover */}
            {isPayPalButtonRendered && (
              <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
                className="paypal-button"
              />
            )}
            <button className="close-button" onClick={handleClosePopover}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Micarrito;
