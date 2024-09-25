import React, { useState, useEffect, useRef, useCallback } from 'react';
import { database } from '../firebase';
import { ref, onValue, push } from 'firebase/database';
import ReactDOM from "react-dom";
import "../estilos/carrito.css"
import { auth } from '../firebase';
import { getAuth } from 'firebase/auth';
import { get } from 'firebase/database';

const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

function Micarrito() {
  const [productosDatabase, setProductosDatabase] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoPeso, setCarritoPeso] = useState(0);
  const divisa = '$';
  const pesoMaximo = 9000;
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


  const guardarCarritoEnLocalStorage = (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };
  const pesoActualCarrito = carrito.reduce((totalPeso, itemId) => {
    const itemCarrito = productosDatabase.find((item) => item.id === itemId);
    if (itemCarrito && itemCarrito.peso) {
      return totalPeso + itemCarrito.peso;
    }
    return totalPeso;
  }, 0);

  const anyadirProductoAlCarrito = useCallback((productoId, pesoProducto) => {
    const pesoEnGramos = pesoProducto;

    if (pesoActualCarrito + pesoEnGramos <= pesoMaximo) {
      const nuevoCarrito = [...carrito, productoId];
      setCarrito(nuevoCarrito);

      guardarCarritoEnLocalStorage(nuevoCarrito);

      const pesoCarritoActualizado = pesoActualCarrito + pesoEnGramos;
      setCarritoPeso(pesoCarritoActualizado);
      localStorage.setItem('carritoPeso', JSON.stringify(pesoCarritoActualizado));
    } else {
      alert('Has alcanzado el límite de peso en el carrito (9000 gramos)');
    }
  }, [carrito, pesoActualCarrito, pesoMaximo]);

  const renderizarProductos = React.useCallback(() => {
    // Filtrar los productos que están en el carrito
    const productosEnCarrito = productosDatabase.filter((producto) => carrito.includes(producto.id));

    return productosEnCarrito.map((info) => (
      <div key={info.id} className="card col-sm-4">
        <div className="card-body">
          <h5 className="card-title text-center">{info.nombre}</h5>
          <div className="text-center">
            <img src={info.imagenUrl} alt={info.nombre} className="img-fluid" />
            <p>{info.peso} gramos</p>
            <p className="card-text">{info.precio}{divisa}</p>
            <button
              className="btn btn-primary"
              onClick={() => anyadirProductoAlCarrito(info.id, info.peso)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    ));
  }, [carrito, productosDatabase, anyadirProductoAlCarrito]);
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
          <li key={item} className="list-group-item text-right mx-2 p-0">
            <div className="d-flex align-items-center">
              
              {/* Contenedor de la imagen */}
              <div className="col-sm-6 p-0">
                <img 
                  className="img-product" 
                  src={miItem.imagenUrl} 
                  style={{ 
                    width: '300px', 
                    height: '100%', 
                    objectFit: 'cover', 
                    borderRadius: '3px', 
                    display: 'block', // Asegura que no haya espacio debajo de la imagen
                  }} 
                />
              </div>
              
              {/* Contenido del lado derecho */}
              <div className="col-sm-6 d-flex align-items-center">
                <div className="me-auto">
                  <div>Unidades: {numeroUnidadesItem}</div>
                  <div>{miItem.nombre}</div>
                  <div>{miItem.precio}{divisa}</div>
                </div>
                <button
                  className="btn btn-danger mx-5"
                  onClick={() => borrarItemCarrito(item)}
                >
                  x
                </button>
              </div>
            </div>
          </li>
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

  const borrarItemCarrito = (productoId) => {
    const itemCarrito = productosDatabase.find((item) => item.id === productoId);
    if (itemCarrito && itemCarrito.peso) {
      const pesoProducto = itemCarrito.peso;
      const nuevoCarrito = carrito.filter((itemId) => itemId !== productoId);
      setCarrito(nuevoCarrito);

      guardarCarritoEnLocalStorage(nuevoCarrito);

      const pesoCarritoActualizado = pesoActualCarrito - pesoProducto;
      setCarritoPeso(pesoCarritoActualizado);
      localStorage.setItem('carritoPeso', JSON.stringify(pesoCarritoActualizado));
    }
  };


  const vaciarCarrito = () => {
    setCarrito([]);
    setCarritoPeso(0); // Reiniciar el peso del carrito
    guardarCarritoEnLocalStorage([]);
  };


  return (
    <div className="container">
      <br />
      <div className="row">
        <aside className="col-sm-12">

          <div className='row flex-sm-row'>
            <div className='col-sm-9'>
              <ul id="carrito" className="list-group">
                {renderizarCarrito()}
              </ul>
            </div>
            <div className='col-sm-3'>
              <h2>Resumen</h2>
              <p>Cantidad de articulos: {totalUnidades}</p>
              <p className="text-right"><span id="total"> <h2>Total:{total}{divisa}</h2></span></p>
              <button id="boton-vaciar" className="btn btn-danger" onClick={vaciarCarrito}>Vaciar</button>
              <button className='btn btn-primary' onClick={handleOpenPopover}>Comprar</button>
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
