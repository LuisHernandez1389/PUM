import React, { useState } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  // Función para validar la contraseña
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
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
      console.log("Usuario registrado exitosamente");
      setEmail("");
      setPassword("");
      setError(null);
      setPasswordError(""); // Limpiar error de contraseña
    } catch (error) {
      console.error("Error al registrar el usuario:", error.message);
      setError(error.message);
    }
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-6 col-lg-5 d-none d-lg-flex">
            <img
              src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg"
              alt="Trendy Pants and Shoes"
              className="w-100 rounded-t-5 rounded-tr-lg-0 rounded-bl-lg-5"
              height='600px'
            />
          </div>
          <div className="col-md-6 col-lg-7">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="card-body">
                <h2 className="card-title text-center">Registro</h2>
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div id="emailHelp" className="form-text">
                      Nunca compartiremos tu correo electrónico con nadie más.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Contraseña"
                      value={password}
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
                    {passwordError && (
                      <p className="text-danger mt-1">{passwordError}</p>
                    )}
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck1"
                    />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                      Recordarme
                    </label>
                  </div>
                  <button 
                  type="submit" 
                  className="btn btn-primary btn-block" 
                  disable={!!passwordError} // Deshabilitar botón si hay errores
                  >
                    Registrarse
                  </button>
                  {error && <p className="text-danger mt-3">{error}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
