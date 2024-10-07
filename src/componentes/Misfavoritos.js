import React, { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { ref, onValue, get, set, remove } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.css';

const MisFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Estado para controlar si es móvil

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      // Si el usuario no está autenticado, maneja el caso según tus necesidades.
      return;
    }

    const userId = user.uid;
    const userFavoritesRef = ref(database, `users/${userId}/favoritos`);

    onValue(userFavoritesRef, async (snapshot) => {
      const favoritosUsuario = snapshot.val() || {};
      const productos = [];
      for (const productoId in favoritosUsuario) {
        if (favoritosUsuario[productoId]) {
          // Obtiene la información del producto desde la base de datos
          const productoSnapshot = await get(ref(database, `productos/${productoId}`));

          if (productoSnapshot.exists()) {
            const producto = {
              id: productoSnapshot.key,
              ...productoSnapshot.val(),
              favorito: true, // Agrega el indicador de favorito
            };
            productos.push(producto);
          }
        }
      }
      setFavoritos(productos);
    });
  }, []);

  // Función para manejar el clic en el ícono de favoritos
  const handleToggleFavorite = async (productoId) => {
    const user = auth.currentUser;

    if (!user) {
      // Si el usuario no está autenticado, maneja el caso según tus necesidades.
      return;
    }

    const userId = user.uid;
    const userFavoritesRef = ref(database, `users/${userId}/favoritos/${productoId}`);

    // Obtiene el estado actual de los favoritos del usuario
    const favoritoActual = (await get(userFavoritesRef)).val() || false;

    // Actualiza el estado del favorito en la base de datos
    if (favoritoActual) {
      // Si el producto es un favorito, lo elimina de la base de datos
      remove(userFavoritesRef);
    } else {
      // Si el producto no es un favorito, lo agrega a la base de datos
      set(userFavoritesRef, true);
    }
  };

  // Función para renderizar la lista de productos favoritos
  const renderizarFavoritos = () => {
    return favoritos.map((info) => (
      <div key={info.id} className="card mb-3" style={{ maxWidth: '700px', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0' }}>
          {/* Contenedor de la imagen */}
          <div style={{
            flex: '0 0 300px',
            height: '200px',
            overflow: 'hidden',
            display: 'flex', // Para centrar la imagen verticalmente
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={info.imagenUrl}
              alt={info.nombre}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain', // Cambia a 'contain' para ajustar la imagen al contenedor
                borderRadius: '8px 0 0 8px',
                margin: '0', // Establece el margen de la imagen como 0
              }}
            />
          </div>

          {/* Contenido a la derecha */}
          <div style={{ flex: 1, padding: '10px', position: 'relative' }}>
            <div className="card-body" style={{ padding: '0' }}>
              <h5 className="card-title">{info.nombre}</h5>
              <p>{info.peso} gramos</p>
              <p className="card-text">{info.precio}$</p>
              <p className="card-text">
                <small className="text-muted">Pirotecnia Leyker</small>
              </p>
            </div>

            {/* Ícono de corazón en la esquina superior derecha */}
            <FontAwesomeIcon
              icon={faHeart}
              className={`heart-icon ${info.favorito ? 'liked' : ''}`}
              onClick={() => handleToggleFavorite(info.id)}
              style={{
                color: 'red',
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      </div>
    ));
  };

  // Use effect para manejar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container mt-4">
      <div>
        <main id="items" className="col-sm-12">
          <h2>Mis Favoritos</h2>
          {/* Renderiza la lista de productos favoritos */}
          {renderizarFavoritos()}
        </main>
      </div>
    </div>
  );
};

export default MisFavoritos;
