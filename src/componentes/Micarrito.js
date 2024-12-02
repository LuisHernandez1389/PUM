import React, { useState, useEffect, useRef, useCallback } from 'react';
import { database } from '../firebase';
import { ref, onValue, push, set } from 'firebase/database';
import ReactDOM from "react-dom";
import "../estilos/carrito.css"
import { auth } from '../firebase';
import { getAuth } from 'firebase/auth';
import { get } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify'; // Importar ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toast  
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
  const [paquetesDatabase, setPaquetesDatabase] = useState([]);

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

 // Función para guardar el carrito y el peso en localStorage
const actualizarCarrito = (nuevoCarrito, pesoActualizado) => {
  setCarrito(nuevoCarrito);
  setCarritoPeso(pesoActualizado);
  guardarCarritoEnLocalStorage(nuevoCarrito);
  localStorage.setItem('carritoPeso', JSON.stringify(pesoActualizado));
};

// Función para obtener el peso de un producto
const obtenerPesoProducto = (productoId) => {
  const producto = productosDatabase.find((item) => item.id === productoId);
  return producto?.peso || 0;
};

// Función para obtener el peso de un paquete
const obtenerPesoPaquete = (paqueteId) => {
  const paquete = paquetesDatabase.find((item) => item.id === paqueteId);
  return paquete?.peso || 0;
};


// Borra productos o paquetes del carrito
const borrarItemCarrito = (itemId) => {
  // Verifica si es un producto o un paquete
  const esProducto = productosDatabase.some((item) => item.id === itemId);
  const esPaquete = paquetesDatabase.some((item) => item.id === itemId);

  if (!esProducto && !esPaquete) {
    console.warn('El ítem no es un producto ni un paquete válido.');
    return;
  }

  const nuevoCarrito = carrito.filter((item) => item !== itemId);

  // Obtiene el peso según el tipo de ítem
  const pesoItem = esProducto 
    ? obtenerPesoProducto(itemId) 
    : obtenerPesoPaquete(itemId);

  const pesoActualizado = carritoPeso - (pesoItem * carrito.filter((id) => id === itemId).length);

  actualizarCarrito(nuevoCarrito, pesoActualizado);
};

// Aumenta una unidad de un producto o paquete
const aumentarItemCarrito = (itemId) => {
  // Verifica si es un producto o un paquete
  const esProducto = productosDatabase.some((item) => item.id === itemId);
  const esPaquete = paquetesDatabase.some((item) => item.id === itemId);

  if (!esProducto && !esPaquete) {
    console.warn('El ítem no es un producto ni un paquete válido.');
    return;
  }

  // Agrega una unidad más del ítem al carrito
  const nuevoCarrito = [...carrito, itemId];

  // Obtiene el peso según el tipo de ítem
  const pesoItem = esProducto 
    ? obtenerPesoProducto(itemId) 
    : obtenerPesoPaquete(itemId);

  const pesoActualizado = carritoPeso + pesoItem;

  actualizarCarrito(nuevoCarrito, pesoActualizado);
};



// Reduce una unidad de un producto o paquete
const reducirItemCarrito = (itemId) => {
  // Verifica si es un producto o un paquete
  const esProducto = productosDatabase.some((item) => item.id === itemId);
  const esPaquete = paquetesDatabase.some((item) => item.id === itemId);

  if (!esProducto && !esPaquete) {
    console.warn('El ítem no es un producto ni un paquete válido.');
    return;
  }

  // Encuentra el índice del ítem en el carrito
  const indiceItem = carrito.indexOf(itemId);

  if (indiceItem !== -1) {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(indiceItem, 1); // Elimina una unidad

    // Obtiene el peso según el tipo de ítem
    const pesoItem = esProducto 
      ? obtenerPesoProducto(itemId) 
      : obtenerPesoPaquete(itemId);

    const pesoActualizado = carritoPeso - pesoItem;

    actualizarCarrito(nuevoCarrito, pesoActualizado);
  }
};


// Vaciar el carrito
const vaciarCarrito = () => {
  setCarrito([]);
  setCarritoPeso(0);
  localStorage.removeItem('carrito');
  localStorage.removeItem('carritoPeso');
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
  


  const calcularTotal = useCallback(() => {
    return carrito.reduce((total, item) => {
      // Buscar en productosDatabase
      const miItemProducto = productosDatabase.find((itemBaseDatos) => itemBaseDatos.id === item);
      
      // Buscar en paquetesDatabase
      const miItemPaquete = paquetesDatabase.find((itemBaseDatos) => itemBaseDatos.id === item);
  
      if (miItemProducto) {
        // Si se encuentra en productosDatabase, sumar el precio de ese item
        return total + miItemProducto.precio;
      } else if (miItemPaquete) {
        // Si se encuentra en paquetesDatabase, sumar el precio de ese paquete
        return total + miItemPaquete.precio;
      } else {
        // Si no se encuentra en ninguno, devolver el total sin cambios
        return total;
      }
    }, 0).toFixed(2);
  }, [carrito, productosDatabase, paquetesDatabase]);
  
  const [total, setTotal] = useState(calcularTotal());
  
  useEffect(() => {
    setTotal(calcularTotal());
    console.log(carritoPeso);
  }, [carrito, productosDatabase, paquetesDatabase, calcularTotal, carritoPeso]);
  

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
        const contadorRef = ref(database, 'contadorOrdenes'); // Nodo para el contador de IDs
        const ordenesRef = ref(database, 'ordenes');
  
        try {
          const snapshot = await get(userRef);
  
          if (snapshot.exists()) {
            const userData = snapshot.val();
  
            // Extraer información de la dirección de compra desde PayPal
            const shipping = details?.purchase_units?.[0]?.shipping || {};
            const payer = details?.payer || {};
  
            const DireccionCompra = {
              nombre: shipping?.name?.full_name || "N/A",
              direccion: shipping?.address?.address_line_1 || "N/A",
              colonia: shipping?.address?.address_line_2 || "N/A",
              ciudad: shipping?.address?.admin_area_2 || "N/A",
              estado: shipping?.address?.admin_area_1 || "N/A",
              codigoPostal: shipping?.address?.postal_code || "N/A",
              pais: shipping?.address?.country_code || "N/A",
              celular: payer?.phone?.phone_number?.national_number || "N/A",
              correo: payer?.email_address || "N/A",
            };
  
            // Obtener y actualizar el contador para generar un ID numérico único
            const contadorSnapshot = await get(contadorRef);
            let nuevoID = 1;
  
            if (contadorSnapshot.exists()) {
              nuevoID = contadorSnapshot.val() + 1;
            }
  
            // Actualizar el contador en Firebase
            await set(contadorRef, nuevoID);
  
            // Crear la orden con el ID numérico generado
            const orden = {
              id: nuevoID, // ID numérico único
              usuario: {
                uid: user.uid,
                nombre: userData.nombre,
                apellido: userData.apellido,
                direccion: userData.direccion,
                numeroTelefono: userData.numeroTelefono,
                email: user.email,
              },
              DireccionCompra,
              productos: carrito,
              total: calcularTotal(),
              detallesPago: details,
              fechaCompra: new Date().toISOString(),
            };
            toast.success("Compra realizada correctamente"); // Mensaje de éxito

            // Guardar la orden en Firebase usando el ID numérico como clave
            await set(ref(database, `ordenes/${nuevoID}`), orden);
            console.log('Orden guardada en Firebase con ID:', nuevoID);
  
            // Resetear carrito local
            setCarrito([]);
            guardarCarritoEnLocalStorage([]);
          } else {
            console.log('No se encontraron datos del usuario.');
          }
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error.message);
          toast.error("Error de compra"); // Mensaje de error
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

    const databaseRefProductos = ref(database, 'productos');
    const databaseRefPaquetes = ref(database, 'paquetes');

    const fetchData = async () => {
        // Cargar productos
        onValue(databaseRefProductos, (snapshot) => {
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

        // Cargar paquetes
        onValue(databaseRefPaquetes, (snapshot) => {
            const paquetes = [];
            snapshot.forEach((childSnapshot) => {
                const paquete = {
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                };
                paquetes.push(paquete);
            });
            setPaquetesDatabase(paquetes);
        });
    };

    fetchData();
}, []);

  /////Guarda en localStorage
  const guardarCarritoEnLocalStorage = (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };


// Función para obtener el peso total del carrito
const calcularPesoTotalCarrito = useCallback(() => {
  let pesoTotal = 0;
  
  carrito.forEach(itemId => {
    // Buscar en productosDatabase
    const producto = productosDatabase.find((item) => item.id === itemId);
    
    // Buscar en paquetesDatabase
    const paquete = paquetesDatabase.find((item) => item.id === itemId);

    if (producto) {
      pesoTotal += producto.peso || 0;  // Sumar el peso del producto
    } else if (paquete) {
      pesoTotal += paquete.peso || 0;  // Sumar el peso del paquete
    }
  });

  return pesoTotal;
}, [carrito, productosDatabase, paquetesDatabase]);

useEffect(() => {
  // Actualizar el peso del carrito cada vez que cambie el carrito
  const pesoTotal = calcularPesoTotalCarrito();
  setCarritoPeso(pesoTotal);  // Actualizar el estado del peso total
}, [carrito, calcularPesoTotalCarrito]);


  const renderizarCarrito = () => {
    const carritoSinDuplicados = [...new Set(carrito)];

    return carritoSinDuplicados.map((item) => {
      const miItem = {
        ...productosDatabase.find((itemBaseDatos) => itemBaseDatos.id === item),
        ...paquetesDatabase.find((itemBaseDatos) => itemBaseDatos.id === item)
    };
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
    <MDBBtn className="custom-btn add-btn" onClick={() => aumentarItemCarrito(miItem.id)}>
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
              <p>Peso total del carrito: {carritoPeso} gramos</p>
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
            <ToastContainer /> {/* Agregar el ToastContainer de confirmacion */}
    </div>
  );
}

export default Micarrito;
