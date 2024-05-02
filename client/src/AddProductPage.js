import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { useAuth } from './UserContext';
import { categories } from './categories';
import './styles/AddProductPage.css';

function AddProductPage() {
  const { authState } = useAuth();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    soldBy: authState.user.name, 
    category: '',
    subcategory: ''
  });
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProduct({ ...product, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProduct({ ...product, imageUrl: '' });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setProduct({ ...product, category: value, subcategory: '' });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === 'price') {
      const formattedValue = Math.max(0, parseFloat(value)).toFixed(2);
      setProduct({ ...product, [name]: formattedValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9000/addProduct', product);
      navigate('/'); 
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  return (
    <div id="addProductPage">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="name">Product Name</label>
          <input className="input" type="text" id="name" name="name" value={product.name} onChange={handleInputChange} required />

          <label className="label" htmlFor="description">Description</label>
          <textarea className="textarea" id="description" name="description" value={product.description} onChange={handleInputChange} required />

          <label className="label" htmlFor="category">Category</label>
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

          <label className="label" htmlFor="price">Price ($)</label>
          <input className="input" type="number" id="price" name="price" placeholder="Price" value={product.price} onChange={handleInputChange} onBlur={handleBlur} min="0" step="0.01" required />

          <label className="label">Product Image (JPEG, PNG)</label>
          <div className="image-dropzone-container">
            {product.imageUrl ? (
              <div className="image-preview-container">
                <img src={product.imageUrl} alt="Uploaded" className="uploaded-image-preview" />
                <button type="button" onClick={handleRemoveImage} className="remove-image-button">X</button>
              </div>
            ) : (
              <Dropzone onDrop={onDrop} accept="image/jpeg, image/png, image/webp">
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Click to insert an image here</p>
                  </div>
                )}
              </Dropzone>
            )}
          </div>

          <label className="label">Sold By: {product.soldBy}</label>

          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
}

export default AddProductPage;