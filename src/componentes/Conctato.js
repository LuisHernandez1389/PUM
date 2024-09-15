import React, { useState } from 'react';
import './Contacto.css'; // Importa el archivo CSS para estilos

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log('Formulario enviado:', formData);
  };

  return (
    <div className="contact-form-container">
      <h2 className="contact-form-title">Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="contact-form-group">
          <label htmlFor="name" className="contact-form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="contact-form-input"
            required
          />
        </div>
        <div className="contact-form-group">
          <label htmlFor="email" className="contact-form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="contact-form-input"
            required
          />
        </div>
        <div className="contact-form-group">
          <label htmlFor="message" className="contact-form-label">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="contact-form-textarea"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="contact-form-button">Send Message</button>
      </form>
    </div>
  );
};

export default Contacto;
