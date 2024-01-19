import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import "../estilos/navbar.css";

const Navbar = ({ user }) => {
  const [photoURL, setPhotoURL] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

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
          console.log(loading);
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

    <>
      <div>
        <header class="navbar navbar-expand-lg bg-dark ">
        
          <button
            className="btn btn-light"
            id='boton_offcanva'
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button> 
          <div class="container-fluid">
            <a class="navbar-brand text-light" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link active text-light " aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-light" href="#">Features</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-light" href="#">Pricing</a>
                </li>
                <li class="nav-item dropdown text-light ">
                  <a class="nav-link dropdown-toggle " href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown link
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div className="d-flex align-items-center">

            <form className="w-100 me-3" role="search">
              <input type="search" className="form-control" placeholder="Buscar..." aria-label="Buscar" />
            </form>

            {user ? (
              <>
                <div className="d-flex align-items-center ">


                  <div className="flex-shrink-0 dropdown">
                    <div className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={photoURL} alt="mdo" width="42" height="42" className="rounded-circle" />
                    </div>
                    <ul className="dropdown-menu text-small shadow">
                      <li><Link className="dropdown-item" >Nuevo proyecto...</Link></li>
                      <li><Link className="dropdown-item" >Configuración</Link></li>
                      <li><Link className="dropdown-item" >Perfil</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link className="dropdown-item" >Cerrar sesión</Link></li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-outline-primary me-2">
                  <Link className="dropdown-item" to="/login">
                    <span>Iniciar sesión</span>
                  </Link>
                </button>
                <button type="button" className="btn btn-primary">
                  <Link className="dropdown-item" to="/register">
                    <span className="text-navbar">Registrarse</span>
                  </Link>
                </button>
              </>
            )}
          </div>
        </header>
      </div>



      <div className="offcanvas offcanvas-start bg-dark" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="cover-photo">
          <div className="user-profile-container">
            <img
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                display: "block",
                margin: "auto",
              }}
              src={photoURL}
              alt="User Profile"
            />
          </div>
        </div>


        <div className="btn-group">

          <button style={{ margin: "13px" }} className="btn btn-secondary dropdown-toggle text-dark bg-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Opciones de cuenta
          </button>
          <ul className="dropdown-menu dropdown-menu-light">
            {user ? (
              <>
                <li>
                  <Link className="dropdown-item" to="/admin">
                    <span className='text-navbar'>Admin</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/micuenta">
                    <span className="text-navbar">Mi Cuenta</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/micarrito">
                    <span className="text-navbar">Mi Carrito</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/mispedidos">
                    <span className="text-navbar">Mis Pedidos</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/recomendaciones">
                    <span className="text-navbar">Mis Recomendaciones</span>
                  </Link>
                </li>

              </>
            ) : (
              <>
                <li>
                  <Link className="dropdown-item" to="/login">
                    <span className="text-navbar">Iniciar sesión</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/register">
                    <span className="text-navbar">Registrarse</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="offcanvas-body bg-dark">

          <ul className="list-group ">
            <li className="list-group-item  justify-content-between align-items-center ">
              <Link className="nav-link" to="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-house" viewBox="0 0 16 16">
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                </svg>     Home
              </Link>

            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <Link className="nav-link" to="/cohetes">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-fire" viewBox="0 0 16 16">
                  <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15" />
                </svg>    Cohetes
              </Link>
              <span className="badge bg-primary rounded-pill">2</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <Link className="nav-link" to="/paquetes">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-boxes" viewBox="0 0 16 16">
                  <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z" />
                </svg>    Paquetes
              </Link>
              <span className="badge bg-primary rounded-pill">1</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <Link className="nav-link" to="/eventos">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-date" viewBox="0 0 16 16">
                  <path d="M6.445 11.688V6.354h-.633A12.6 12.6 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                </svg>    Eventos
              </Link>
              <span className="badge bg-primary rounded-pill">1</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <Link className="nav-link" to="/contacto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-badge" viewBox="0 0 16 16">
                  <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492z" />
                </svg>    Contacto
              </Link>
              <span className="badge bg-primary rounded-pill">1</span>
            </li>

          </ul>


        </div>
        <button style={{ margin: "13px" }} className="btn btn-danger btn-md" type="button" onClick={handleLogout} aria-expanded="false">
          Cerrar Sesion
        </button>
      </div></>

  )

};

export default Navbar;
