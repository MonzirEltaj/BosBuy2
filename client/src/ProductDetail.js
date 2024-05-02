import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import './styles/ProductDetail.css';
import { categories } from './categories';
const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    subcategory: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:9000/getProduct/${productId}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => console.error('Failed to fetch product details', error));
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9000/updateProduct/${productId}`, product);
      alert('Product updated successfully!');
      navigate('/editProduct');
    } catch (error) {
      console.error('Failed to update product', error);
    }
  };
  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setProduct({ ...product, category: value, subcategory: '' });
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProduct({ ...product, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Product</h1>
      <label>Name: <input type="text" name="name" value={product.name} onChange={handleInputChange} /></label>
      <label>Description: <input type="text" name="description" value={product.description} onChange={handleInputChange} /></label>
      <label>Price: <input type="number" name="price" value={product.price} onChange={handleInputChange} /></label>
      <select className="input" name="category" value={product.category} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {Object.keys(categories).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <label className="label" htmlFor="subcategory">Subcategory</label>
          <select className="input" name="subcategory" value={product.subcategory} onChange={handleInputChange} required>
            <option value="">Select Subcategory</option>
            {product.category && categories[product.category].map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
      <Dropzone onDrop={handleDrop} accept="image/jpeg, image/png, image/webp">
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Click to insert image here</p>
          </div>
        )}
      </Dropzone>

      <button type="submit">Update Product</button>
    </form>
  );
};

export default ProductDetail;
