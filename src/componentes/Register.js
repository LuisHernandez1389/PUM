import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigate = useNavigate(); //Hook para la navegación

  // Función para validar la contraseña
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar la contraseña antes de enviar el formulario
    if (!validatePassword(password)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y un carácter especial."
      );
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("¡Registro exitoso! Ahora puedes iniciar sesión.");
      console.log("Usuario registrado exitosamente");
      setEmail("");
      setPassword("");
      setError(null);
      setPasswordError(""); // Limpiar error de contraseña
      navigate("/login"); //Redirigir al login después del registro exitoso
    } catch (error) {
      console.error("Error al registrar el usuario:", error.message);
      setError(error.message);
      toast.error("Error al registrar: " + error.message);
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
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-8 col-lg-6 col-xl-4">
            <div
              className="card text-black shadow-lg"
              style={{ borderRadius: "10px" }}
            >
              <div className="card-body p-4">
                <div className="text-center">
                  {/* Logo del Registro */}
                  <img
                    src="/LOGOLeyker.png"
                    alt="Logo"
                    className="mb-4"
                    style={{ width: "100px" }}
                  />
                  <h3 className="mb-4">Registro</h3>
                  <p className="text-muted">
                    Crea una cuenta para acceder a nuestros servicios
                  </p>
                </div>
                <form onSubmit={handleRegister}>
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
                          paddingRight: "2.5rem", // Espacio para el ícono
                        }}
                        placeholder="Crea una contraseña segura"
                        value={password}
                        onFocus={(e) =>
                          Object.assign(e.target.style, inputFocusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (!validatePassword(e.target.value)) {
                            setPasswordError(
                              "La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y un carácter especial."
                            );
                          } else {
                            setPasswordError("");
                          }
                        }}
                      />
                      <span
                        className="position-absolute"
                        style={{
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#007bff",
                          fontSize: "1.2rem",
                        }}
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </span>
                    </div>
                    {passwordError && (
                      <p className="text-danger mt-1">{passwordError}</p>
                    )}
                  </div>

                  {error && <p className="text-danger mb-3">{error}</p>}

                  <button
                    type="submit"
                    className="btn btn-primary btn-block w-100"
                  >
                    Registrarme
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p>
                    ¿Ya tienes una cuenta?{" "}
                    <button
                      className="btn btn-link p-0"
                      style={{
                        textDecoration: "none",
                        color: "#007bff",
                        fontWeight: "bold",
                      }}
                      onClick={() => navigate("/login")}
                    >
                      Inicia sesión aquí
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
