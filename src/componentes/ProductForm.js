import React, { useState } from 'react';
import { database, storage } from '../firebase';
import { ref, push, set } from 'firebase/database';
import { uploadBytes, ref as storageReference, getDownloadURL } from 'firebase/storage'; // Cambia el nombre de ref a storageReference

function ProductForm() {
  const [product, setProduct] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    peso: '',
    imagenUrl: '', // Agrega el campo para la URL de la imagen
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    try {
      const storageRef = storageReference(storage, `productos/${product.nombre}_${Date.now()}.jpg`); // Cambia el nombre de la constante

      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      setProduct({
        ...product,
        imagenUrl: imageUrl,
      });
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
    }
  };

  const agregarProducto = async (e) => {
    e.preventDefault();

    try {
      const productoData = {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: parseFloat(product.precio),
        peso: parseFloat(product.peso),
        imagenUrl: product.imagenUrl,
      };

      const newProductRef = push(ref(database, 'productos'));


      await set(newProductRef, productoData);
      console.log('Producto agregado con éxito');

      setProduct({
        nombre: '',
        descripcion: '',
        precio: '',
        peso: '',
        imagenUrl: '', // Limpia la URL de la imagen después de agregar
      });
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center ">
      <div className="form-control">
        <h2 className="text-center">Agregar Producto</h2>
        <form onSubmit={agregarProducto}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre:</label>
            <input

              className="form-control"
              id="nombre"
              name="nombre"
              value={product.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">Descripción:</label>
            <input

              className="form-control"
              id="descripcion"
              name="descripcion"
              value={product.descripcion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="precio" className="form-label">Precio:</label>
            <input
              type="number"
              className="form-control"
              id="precio"
              name="precio"
              value={product.precio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="peso" className="form-label">Peso:</label>
            <input
              type="number"
              className="form-control"
              id="peso"
              name="peso"
              value={product.peso}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="imagen" className="form-label">Imagen:</label>
            <input
              type="file"
              className="form-control"
              id="imagen"
              name="imagen"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block container d-flex justify-content-center align-items-center">Agregar Producto</button>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
