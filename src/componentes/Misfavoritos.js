import React, { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { ref, onValue, get, set, remove } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '@fortawesome/fontawesome-free/css/all.css';

const MisFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate(); // Crea una instancia de navigate

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const userId = user.uid;
    const userFavoritesRef = ref(database, `users/${userId}/favoritos`);

    onValue(userFavoritesRef, async (snapshot) => {
      const favoritosUsuario = snapshot.val() || {};
      const productos = [];
      for (const productoId in favoritosUsuario) {
        if (favoritosUsuario[productoId]) {
          const productoSnapshot = await get(ref(database, `productos/${productoId}`));
          if (productoSnapshot.exists()) {
            const producto = {
              id: productoSnapshot.key,
              ...productoSnapshot.val(),
              favorito: true,
            };
            productos.push(producto);
          }
        }
      }
      setFavoritos(productos);
    });
  }, []);

  const handleToggleFavorite = async (productoId) => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const userId = user.uid;
    const userFavoritesRef = ref(database, `users/${userId}/favoritos/${productoId}`);

    const favoritoActual = (await get(userFavoritesRef)).val() || false;

    if (favoritoActual) {
      remove(userFavoritesRef);
    } else {
      set(userFavoritesRef, true);
    }
  };

  // Maneja el clic en el contenedor para redirigir al detalle del producto
  const handleContainerClick = (productoId) => {
    navigate(`/producto/${productoId}`); // Cambia a la ruta correspondiente
  };

  const renderizarFavoritos = () => {
    return favoritos.map((info) => (
      <div
        key={info.id}
        className="card mb-3"
        style={{ maxWidth: '700px', position: 'relative', cursor: 'pointer', transition: 'transform 0.2s' }} // Agregado cursor de puntero
        onClick={() => handleContainerClick(info.id)} // Agrega el manejador de clics
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} // Aumenta ligeramente el tamaño al pasar el mouse
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Restaura el tamaño al salir el mouse
      >
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0' }}>
          <div style={{
            flex: '0 0 300px',
            height: '200px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={info.imagenUrl}
              alt={info.nombre}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '8px 0 0 8px',
                margin: '0',
              }}
            />
          </div>
          <div style={{ flex: 1, padding: '10px', position: 'relative' }}>
            <div className="card-body" style={{ padding: '0' }}>
              <h5 className="card-title">{info.nombre}</h5>
              <p>{info.peso} gramos</p>
              <p className="card-text">{info.precio}$</p>
              <p className="card-text">
                <small className="text-muted">Pirotecnia Leyker</small>
              </p>
            </div>
            <FontAwesomeIcon
              icon={faHeart}
              className={`heart-icon ${info.favorito ? 'liked' : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Evita que el clic en el corazón cierre el contenedor
                handleToggleFavorite(info.id);
              }}
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container mt-4">
      <div>
        <main id="items" className="col-sm-12">
          <h2>Mis Favoritos</h2>
          {renderizarFavoritos()}
        </main>
      </div>
    </div>
  );
};

export default MisFavoritos;
