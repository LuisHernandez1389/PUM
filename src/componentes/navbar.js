import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useState, useEffect, } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Dropdown, Collapse, initMDB } from "mdb-ui-kit";

initMDB({ Dropdown, Collapse });

const Navbar = ({ user }) => {

  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);
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
    const unsubscribe = () => { };

    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        try {
          const userData = snapshot.val();
          if (userData) {
            setPhotoURL(userData.photoURL || "");
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
    console.log(unsubscribe)
  }, [currentUser, loading]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
<nav class="navbar navbar-expand-lg navbar-light bg-body-tertiary">
  <div class="container-fluid">
    <button
      data-mdb-collapse-init
      class="navbar-toggler"
      type="button"
      data-mdb-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <i class="fas fa-bars"></i>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <a class="navbar-brand mt-2 mt-lg-0" href="#">
        <img
          src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp"
          height="15"
          alt="MDB Logo"
          loading="lazy"
        />
      </a>
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <Link class="nav-link" to='/'>Inicio</Link>
        </li>
        <li class="nav-item">
        <Link class="nav-link" to='/productos'>Productos</Link>
        </li>
        <li class="nav-item">
        <Link class="nav-link" to='/paquetes'>Paquetes</Link>
        </li>
        <li class="nav-item">
        <Link class="nav-link" to='/eventos'>Eventos</Link>
        </li>
        <li class="nav-item">
        <Link class="nav-link" to='/contacto'>Contacto</Link>
        </li>
        <li class="nav-item">
        <Link class="nav-link" to='/misfavoritos'>Mis favoritos</Link>
        </li>
        <li class="nav-item">
        <Link class="nav-link" to='/miscompras'>Mis compras</Link>
        </li>
        <li class="nav-item">
        <Link class="nav-link" to='/micuenta'>Mi cuenta</Link>
        </li>
      </ul>
    </div>
    <Link to='/search-page' class="input-group-text border-0" id="search-addon">
        <i class="fas fa-search"></i>
      </Link>
    <div class="d-flex align-items-center">
      <Link class="text-reset me-3"  to='/micarrito'>
        <i class="fas fa-shopping-cart"></i>
      </Link>

      <div class="dropdown">
        <a
          data-mdb-dropdown-init
          class="dropdown-toggle d-flex align-items-center hidden-arrow"
          href="#"
          id="navbarDropdownMenuAvatar"
          role="button"
          aria-expanded="false"
        >
          <img
            src={photoURL}
            class="rounded-circle"
            height="25"
            loading="lazy"
          />
        </a>
        <ul
          class="dropdown-menu dropdown-menu-end"
          aria-labelledby="navbarDropdownMenuAvatar"
        >
          <li>
            <Link class="dropdown-item" to='/micuenta'>Mi Perfil</Link>
          </li>
          <li>
            <Link class="dropdown-item" to='/misfavoritos' >Mis favoritos</Link>
          </li>
          <li>
            <Link class="dropdown-item" to='/miscompras' >Mis compras</Link>
          </li>
          <li>
            <Link class="dropdown-item"  onClick={handleLogout} >Cerrar cesion</Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>

  )
};

export default Navbar;
