import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom"; // Necesario para redirigir a la pagina de registro
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false); // Controla la visibilidad del modal de restablecimiento
  const [resetEmail, setResetEmail] = useState(""); // Email para restablecer contraseña
  const navigate = useNavigate(); // Hook para la navegación

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("¡Inicio de sesión exitoso!");
      console.log("Usuario autenticado exitosamente");
      // Limpiar campos después del inicio de sesión exitoso
      setEmail("");
      setPassword("");
      setError(null);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError(error.message); // Mostrar mensaje de error al usuario
      toast.error("Error al iniciar sesión: " + error.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Correo de restablecimiento enviado. ¡Revisa tu correo electrónico!");
      setResetEmail("");
      setShowResetModal(false);
    } catch (error) {
      console.error("Error al enviar correo de restablecimiento:", error.message);
      toast.error("Error: " + error.message);
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#f4f4f9" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-8 col-lg-6 col-xl-4">
            <div
              className="card text-black shadow-lg"
              style={{ borderRadius: "10px" }}
            >
              <div className="card-body p-4">
                <div className="text-center">
                  {/* Logo del login */}
                  <img
                    src="/LOGOLeyker.png"
                    alt="Logo"
                    className="mb-4"
                    style={{ width: "100px" }}
                  />
                  <h3 className="mb-4">Iniciar Sesión</h3>
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
                      style={{
                        border: "1px solid #ced4da",
                        padding: "0.375rem 0.75rem",
                        borderRadius: "0.25rem",
                      }}
                      placeholder="Ingresa tu correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="password">
                      <i className="fas fa-lock me-2"></i>
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      style={{
                        border: "1px solid #ced4da",
                        padding: "0.375rem 0.75rem",
                        borderRadius: "0.25rem",
                      }}
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {error && <p className="text-danger mb-3">{error}</p>}

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Recordarme
                      </label>
                    </div>
                    <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{ fontSize: "0.9rem", textDecoration: "none", color: "#007bff" }}
                    onClick={() => setShowResetModal(true)} // Mostrar modal de restablecimiento
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block w-100"
                    style={{
                      backgroundColor: "#007bff", borderColor: "#007bff" }}
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
          className="modal d-block"
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
