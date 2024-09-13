import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado exitosamente");
      // Limpiar campos después del inicio de sesión exitoso
      setEmail("");
      setPassword("");
      setError(null);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError(error.message); // Mostrar mensaje de error al usuario
    }
  };

  return (
    <section className="vh-100" >
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
              <div className="card-body py-5 px-md-5">
                <form onSubmit={handleLogin}>

                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="form2Example1"
                      className="form-control"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form2Example1">Correo electrónico</label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="form2Example2"
                      className="form-control"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form2Example2">Contraseña</label>
                  </div>

                  <div className="row mb-4">
                    <div className="col d-flex justify-content-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="form2Example31" checked />
                        <label className="form-check-label" htmlFor="form2Example31">Recordarme</label>
                      </div>
                    </div>
                    <div className="col">
                      <a href="#!" className="text-decoration-none">¿Olvidaste tu contraseña?</a>
                    </div>
                  </div>

                  {error && <p className="text-danger">{error}</p>}
                  <button type="submit" className="btn btn-primary btn-block mb-4">Iniciar sesión</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
