import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Dropdown, Collapse, initMDB } from "mdb-ui-kit";

initMDB({ Dropdown, Collapse });

const Navbar = ({ user }) => {

  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(""); // Para almacenar el nombre de usuario
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    initMDB({ Dropdown, Collapse });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setPhotoURL('');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        try {
          const userData = snapshot.val();
          if (userData) {
            setPhotoURL(userData.photoURL || "");
            setUsername(userData.username || ""); // Asegúrate de tener el nombre de usuario en tu base de datos
          }
          setLoading(false);
        } catch (error) {
          console.error("Error al procesar datos del usuario:", error);
          setLoading(false);
        }
      }, (error) => {
        console.error("Error al obtener datos del usuario:", error);
        setLoading(false);
      });

      return () => {
        unsubscribe(); // Limpia el listener cuando el componente se desmonta
      };
    } else {
      setLoading(false);
    }
  }, [currentUser, loading]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Obtener las iniciales del nombre de usuario
  const getInitials = (name) => {
    const nameArray = name.trim().split(" ");
    const initials = nameArray.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary" style={{ height: '60px' }}>
  <div className="container-fluid">
    <button
      data-mdb-collapse-init
      className="navbar-toggler"
      type="button"
      data-mdb-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <i className="fas fa-bars"></i>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <a className="navbar-brand mt-2 mt-lg-0" href="#">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/pirotecniacq.appspot.com/o/productos%2Fsadasd_1705947808901.jpg?alt=media&token=f3e0bdef-282d-4dfc-9cff-622e69f66bef"
          alt="Logo"
          loading="lazy"
          style={{ maxHeight: '70px', objectFit: 'contain' }} 
        />
          </a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to='/'>Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/productos'>Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/paquetes'>Paquetes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/eventos'>Eventos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/contacto'>Contacto</Link>
            </li>
          </ul>
        </div>
        <Link to='/search-page' className="input-group-text border-0" id="search-addon">
          <i className="fas fa-search"></i>
        </Link>
        <div className="d-flex align-items-center">
          <Link className="text-reset me-3" to='/micarrito'>
            <i className="fas fa-shopping-cart"></i>
          </Link>

          <div className="dropdown">
            <a
              data-mdb-dropdown-init
              className="dropdown-toggle d-flex align-items-center hidden-arrow"
              href="#"
              id="navbarDropdownMenuAvatar"
              role="button"
              aria-expanded="false"
            >
              {photoURL ? (
                <img
                  src={photoURL}
                  className="rounded-circle"
                  height="25"
                  alt="User Avatar"
                  loading="lazy"
                />
              ) : (
                // Mostrar iniciales o imagen por defecto si no hay foto de perfil
                <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                     style={{ width: "25px", height: "25px", fontSize: "12px" }}>
                  {username ? getInitials(username) : <i className="fas fa-user"></i>}
                </div>
              )}
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdownMenuAvatar"
            >
              <li>
                <Link className="dropdown-item" to='/micuenta'>Mi Perfil</Link>
              </li>
              <li>
                <Link className="dropdown-item" to='/misfavoritos'>Mis favoritos</Link>
              </li>
              <li>
                <Link className="dropdown-item" to='/miscompras'>Mis compras</Link>
              </li>
              <li>
                <Link className="dropdown-item" onClick={handleLogout}>Cerrar sesión</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
};

export default Navbar;
