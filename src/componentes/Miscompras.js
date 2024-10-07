import { database } from '../firebase';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardHeader, MDBCardFooter, MDBTypography, MDBBtn, MDBListGroup, MDBListGroupItem, MDBSpinner, MDBBadge, MDBIcon } from 'mdb-react-ui-kit';

const Miscompras = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
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
        const productosEnOrden = orden.productos.map((productoId) => {
          const producto = productos.find((prod) => prod.id === productoId);
          return producto ? producto.nombre : 'Desconocido';
        });

        return {
          ...orden,
          productos: productosEnOrden,
        };
      });

      setOrdenes(ordenesConNombres);
      setLoading(false);
    });
  }, [userUID, productos]);

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
              <MDBBtn color="primary" className="mt-2 animate__animated animate__pulse animate__infinite">
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
