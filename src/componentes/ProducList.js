import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, remove, set } from 'firebase/database';
import ExcelJS from 'exceljs';
import readXlsxFile from 'read-excel-file';
import { update } from 'firebase/database';
import ProductDetails from './ProductDetails';

function ProductList({
  showDeleteButton,
  agregarProductoAlCarrito,
  carrito,
  setCarrito,
  onImport,
}) {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    peso: 0,
    precio: 0,
    cantidad: 0,
    // ... other properties you might have
  });
  const [excelFile, setExcelFile] = useState(null);

  const handleUpdateProduct = async () => {
    // Lógica para actualizar el producto en la base de datos
    if (selectedProduct) {
      try {
        const productRef = ref(database, `productos/${selectedProduct.id}`);
        await update(productRef, selectedProduct);
        alert('Producto actualizado exitosamente');
        // Cerrar el modal después de actualizar el producto si es necesario
        // setModalOpen(false);
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Hubo un error al actualizar el producto. Por favor, inténtalo de nuevo.');
      }
    } else {
      alert('No se ha seleccionado ningún producto para actualizar.');
    }
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    console.log("Producto Seleccionado:", product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };


  useEffect(() => {
    const productListRef = ref(database, `productos`);

    const unsubscribe = onValue(productListRef, (snapshot) => {
      const productList = [];

      snapshot.forEach((childSnapshot) => {
        const product = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };

        productList.push(product);
      });

      setProducts(productList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDeleteProduct = async (productId) => {
    console.log('Product ID to delete:', productId);

    try {
      const productRef = ref(database, 'productos/' + productId);
      await remove(productRef);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert(
        'Hubo un error al eliminar el producto. Por favor, inténtalo de nuevo.'
      );
    }
  };

  const handleAddToCart = (productId, productWeight) => {
    const currentCartWeight = carrito.reduce((totalWeight, itemId) => {
      const item = products.find((product) => product.id === itemId);
      return totalWeight + item.peso;
    }, 0);

    if (currentCartWeight + productWeight > 9000) {
      alert('El peso total en el carrito no puede superar los 9 kg.');
      return;
    }

    agregarProductoAlCarrito(productId);
    setCarrito([...carrito, productId]);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Realizar operaciones con el archivo de imagen, como cargarlo en un servidor o mostrar una vista previa.
      // Puedes usar FileReader para mostrar una vista previa del archivo de imagen.
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result; // URL de la imagen cargada
        setSelectedProduct({ ...selectedProduct, imagenUrl: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');

    // Encabezados de la tabla
    worksheet.addRow(['id', 'nombre', 'descripcion', 'peso', 'precio', 'cantidad', 'photoURL']);

    // Agregar datos de productos a la hoja de cálculo
    products.forEach((product) => {
      worksheet.addRow([product.id, product.nombre, product.descripcion, product.peso, product.precio, product.cantidad, product.photoURL]);
    });

    // Crear un Blob con el contenido del archivo Excel
    const blob = await workbook.xlsx.writeBuffer();

    // Crear un objeto URL para el Blob y crear un enlace de descarga
    const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'productos.xlsx';
    link.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(blobUrl);
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];

    try {
      const rows = await readXlsxFile(file);
      // El primer elemento de rows es el encabezado, así que omitimos ese elemento
      const [, ...data] = rows;
      const importedProductIds = [];

      // Actualizar la base de datos con los datos importados
      data.forEach(async (row) => {
        const [id, nombre, descripcion, peso, precio, cantidad, photoURL, ...restoDePropiedades] = row;
        importedProductIds.push(id);

        // Obtener el producto actual en Firebase para verificar si existe
        const existingProduct = products.find(product => product.id === id);

        const productRef = ref(database, `productos/${id}`);

        // Crear un objeto con las propiedades que deseas actualizar
        const productDataToUpdate = {
          id,
          nombre,
          descripcion,
          peso,
          precio,
          cantidad,

          // Conserva la photoURL existente o actualiza con la nueva del archivo Excel
          // ...restoDePropiedades, // Descomenta esta línea si deseas incluir otras propiedades en el producto
        };

        // Actualizar solo las propiedades especificadas en la base de datos
        await update(productRef, productDataToUpdate);
      });

      // Obtener IDs actuales de los productos en Firebase
      const currentProductIds = products.map(product => product.id);

      // Identificar IDs que han sido eliminados
      const deletedProductIds = currentProductIds.filter(id => !importedProductIds.includes(id));

      // Eliminar productos en Firebase que han sido eliminados del archivo Excel
      deletedProductIds.forEach(async (productId) => {
        const productRef = ref(database, `productos/${productId}`);
        await remove(productRef);
      });

      alert('Datos importados exitosamente');
    } catch (error) {
      console.error('Error al importar datos desde el archivo Excel:', error);
      alert('Hubo un error al importar los datos. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-3">Lista de Productos</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card" style={{ width: '100%' }}>
              <img
                className="card-img-top"
                src={product.imagenUrl}
                alt="Producto"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.nombre}</h5>
                <p className="card-text">{product.descripcion}</p>
                <p className="card-text">{product.peso} Gramos</p>
                <p className="card-text">Precio: ${product.precio}</p>
                {showDeleteButton && (
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      console.log('Deleting product with ID:', product.id);
                      handleDeleteProduct(product.id);
                    }}
                  >
                    Eliminar
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(product.id, product.peso)}
                >
                  Agregar al carrito
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Editar Producto</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre del Producto</label>
                  <input className="form-control" id="nombre" value={selectedProduct.nombre} onChange={(e) => setSelectedProduct({ ...selectedProduct, nombre: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea className="form-control" id="descripcion" value={selectedProduct.descripcion} onChange={(e) => setSelectedProduct({ ...selectedProduct, descripcion: e.target.value })}></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="peso" className="form-label">Peso (gramos)</label>
                  <input type="number" className="form-control" id="peso" value={selectedProduct.peso} onChange={(e) => setSelectedProduct({ ...selectedProduct, peso: parseInt(e.target.value) })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="precio" className="form-label">Precio ($)</label>
                  <input type="number" className="form-control" id="precio" value={selectedProduct.precio} onChange={(e) => setSelectedProduct({ ...selectedProduct, precio: parseFloat(e.target.value) })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="imagen" className="form-label">Cambiar Foto</label>
                  <input type="file" className="form-control" id="imagen" onChange={handleImageChange} accept="image/*" />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleUpdateProduct}>Guardar Cambios</button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">nombre</th>
            <th scope="col">descripcion</th>
            <th scope="col">peso</th>
            <th scope="col">precio</th>
            <th scope="col">cantidad</th>
            {showDeleteButton && <th scope="col">acciones</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.nombre}</td>
              <td>{product.descripcion}</td>
              <td>{product.peso}</td>
              <td>{product.precio}</td>
              <td>{product.cantidad}</td>
              {showDeleteButton && (
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Eliminar
                  </button>
                  <button className='btn btn-primary' onClick={() => openProductDetails(product)} data-bs-toggle="modal" data-bs-target=".modal" >Editar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={exportToExcel}>
        Exportar a Excel
      </button>
      <input type="file" accept=".xlsx" onChange={handleImportExcel} />
    </div>
  );
}

export default ProductList;
