import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Dropdown, Collapse, initMDB } from "mdb-ui-kit";

initMDB({ Dropdown, Collapse });

const Navbar = ({ user }) => {
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar el colapso
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isMobile, setIsMobile] = useState(false); // Estado para detectar dispositivo móvil

  useEffect(() => {
    initMDB({ Dropdown, Collapse });

    // Detectar si el dispositivo es móvil
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Escuchar el cambio de tamaño de pantalla
    window.addEventListener('resize', handleResize);
    
    // Ejecutar la función una vez para establecer el valor inicial
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDropdownClick = (e) => {
    // Evitar la navegación si está en móvil
    if (isMobile) {
      e.preventDefault();
    }
  };

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
            setUsername(userData.username || "");
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
        unsubscribe();
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

  const getInitials = (name) => {
    const nameArray = name.trim().split(" ");
    const initials = nameArray.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  const handleMouseEnter = () => {
    const dropdown = document.getElementById('navbarDropdownMenuLink');
    const menu = dropdown.nextElementSibling;

    dropdown.classList.add('show');
    menu.classList.add('show');
  };

  const handleMouseLeave = () => {
    const dropdown = document.getElementById('navbarDropdownMenuLink');
    const menu = dropdown.nextElementSibling;

    dropdown.classList.remove('show');
    menu.classList.remove('show');
  };

  return (
    <div>
      {/* Navbar */}
       <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary" style={{ height: '60px' }}>
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className={`collapse navbar-collapse ${isExpanded ? 'show' : ''}`} id="navbarSupportedContent">
            <a className="navbar-brand mt-2 mt-lg-0" href="/">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/pirotecniacq.appspot.com/o/Noche_de_amor_1706133687956-removebg-preview.png?alt=media&token=2b8c1968-44ee-486b-869d-2b2ad289bf40"
                alt="Logo"
                loading="lazy"
                style={{ maxHeight: '70px', objectFit: 'contain' }}
              />
            </a>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a
                  className="nav-link dropdown-toggle"
                  href="/productos"
                  id="navbarDropdownMenuLink"
                  role="button"
                  aria-expanded="false"
                  onClick={handleDropdownClick} // Desactiva el enlace en móvil
                >
                  Productos
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="/productos">Pirotecnia</a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/luz">Luz</a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/trueno">Trueno</a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/baterias">Baterías</a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/paquetes">Paquetes</a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/eventos">Eventos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contacto">Contactanos</Link>
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
                href="/micuenta"
                id="navbarDropdownMenuAvatar"
                role="button"
                aria-expanded="false"
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    className="rounded-circle"
                    alt="User Avatar"
                    loading="lazy"
                    style={{ 
                      width: "25px", // Fijo ancho
                      height: "25px", // Fijo alto
                      objectFit: "cover" // Para que la imagen se ajuste al contenedor
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                    style={{ width: "25px", height: "25px", fontSize: "12px" }}
                  >
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
      {/* Contenedor ajustable con padding dinámico */}
      <div style={{ paddingTop: isExpanded ? '300px' : '0px', transition: 'padding-top 0.5s ease' }}>
        {/* Resto del contenido de la página */}
      </div>
    </div>
  );
};

export default Navbar;
