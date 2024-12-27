import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom"; // Necesario para redirigir a la pagina de registro
import { toast } from "react-toastify";
import "animate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Estado para "Recordarme"
  const [error, setError] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false); // Controla la visibilidad del modal de restablecimiento
  const [resetEmail, setResetEmail] = useState(""); // Email para restablecer contraseña
  const navigate = useNavigate(); // Hook para la navegación
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar contraseña

  // Prellenar el correo si "Recordarme" esta activado
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Funcion para botón de mostrar contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    if (!email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("¡Inicio de sesión exitoso!");
      console.log("Usuario autenticado exitosamente");

      // Guardar o eliminar el correo basado en "Recordarme"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Limpiar campos después del inicio de sesión exitoso
      setEmail("");
      setPassword("");
      setError(null);
      navigate("/");
      window.scrollTo(0, 0); // Desplaza la vista al inicio de la página
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError(error.message); // Mostrar mensaje de error al usuario
      toast.error("Error al iniciar sesión: " + error.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      toast.error("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success(
        "Correo de restablecimiento enviado. ¡Revisa tu correo electrónico!"
      );
      setResetEmail("");
      setShowResetModal(false);
    } catch (error) {
      console.error(
        "Error al enviar correo de restablecimiento:",
        error.message
      );
      toast.error("Error: " + error.message);
    }
  };

  const inputStyle = {
    border: "1px solid #ced4da",
    padding: "0.375rem 0.75rem",
    borderRadius: "0.25rem",
    transition: "box-shadow 0.3s ease, border-color 0.3s ease",
  };

  const inputFocusStyle = {
    borderColor: "#007bff",
    animation: "glow 1.5s infinite ease-in-out", // Agregamos la animación
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#f4f4f9" }}>
      <div className="container py-3 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-8 col-lg-6 col-xl-4">
            <div
              className="card text-black shadow-lg animate__animated animate__fadeIn"
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="card-body p-4">
                <div className="text-center">
                  {/* Logo del login */}
                  <img
                    src="/LOGOLeyker.png"
                    alt="Logo"
                    className="mb-4 animate__animated animate__bounce"
                    style={{
                      width: "120px",
                      height: "auto",
                    }}
                  />
                  <h3
                    className="mb-4"
                    style={{ fontWeight: "bold", color: "#333" }}
                  >
                    Iniciar Sesión
                  </h3>
                  <p className="text-muted">
                    Ingresa tus datos para acceder a tu cuenta
                  </p>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="email">
                      <i className="fas fa-envelope me-2"></i>
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      style={inputStyle}
                      placeholder="Ingresa tu correo electrónico"
                      value={email}
                      onFocus={(e) =>
                        Object.assign(e.target.style, inputFocusStyle)
                      }
                      onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-outline mb-4 position-relative">
                    <label className="form-label" htmlFor="password">
                      <i className="fas fa-lock me-2"></i>
                      Contraseña
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control"
                        style={{
                          ...inputStyle,
                          paddingRight: "2.5rem", // Espacio extra a la derecha para el icono
                        }}
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onFocus={(e) =>
                          Object.assign(e.target.style, inputFocusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        className="position-absolute"
                        style={{
                          top: "50%", // Alinea el ícono verticalmente
                          right: "10px", // Lo coloca al borde derecho del input
                          transform: "translateY(-50%)", // Centra el ícono verticalmente
                          cursor: "pointer", // Hace que sea clickeable
                          color: "#007bff", // Color azul para que resalte
                          fontSize: "1.2rem", // Ajusta el tamaño del ícono
                        }}
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </span>
                    </div>
                  </div>

                  {error && <p className="text-danger mb-3">{error}</p>}

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)} // Actualiza el estado
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Recordarme
                      </label>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      style={{
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        color: "#007bff",
                      }}
                      onClick={() => setShowResetModal(true)} // Mostrar modal de restablecimiento
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block w-100"
                    style={{
                      backgroundColor: "#007bff",
                      borderColor: "#007bff",
                      padding: "0.6rem 1.2rem",
                      fontSize: "1rem",
                      borderRadius: "5px",
                    }}
                  >
                    Iniciar sesión
                  </button>
                </form>
                <div className="text-center mt-4">
                  <p>
                    ¿No tienes una cuenta?{" "}
                    <button
                      className="btn btn-link p-0"
                      style={{
                        textDecoration: "none",
                        color: "#007bff",
                        fontWeight: "bold",
                      }}
                      onClick={() => navigate("/register")}
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para restablecimiento de contraseña */}
      {showResetModal && (
        <div
          className="modal d-block animate__animated animate__fadeIn"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Restablecer Contraseña</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowResetModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handlePasswordReset}>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="resetEmail">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="resetEmail"
                      className="form-control"
                      placeholder="Ingresa tu correo electrónico"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Enviar Correo de Restablecimiento
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Login;
