import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import axios from 'axios';
import './styles/ProductStyles.css';
import { useAuth } from './UserContext';

function HomePage() {
  const { authState } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState({
    Grocery: [],
    Clothing: [],
    Technology: []
  });

  useEffect(() => {
    Object.keys(categories).forEach(category => {
      axios.get(`http://localhost:9000/products/random/${category}`)
        .then(response => {
          setCategories(prev => ({ ...prev, [category]: response.data }));
        })
        .catch(error => console.error('Failed to fetch products:', error));
    });
  }, []);

  const getWelcomeMessage = () => {
    if (!authState.user) return 'Welcome to the HomePage';
    return authState.type === 'user' ? 
      `Welcome ${authState.user.firstName} ${authState.user.lastName} to the HomePage` :
      `Welcome ${authState.user.name} to the HomePage`;
  };

  return (
    <div id="HomePage">
      <h1 style={{ textAlign: 'center' }}>{getWelcomeMessage()}</h1>
      {Object.entries(categories).map(([category, products]) => (
        <div key={category}>
          <h2 className="category-header" onClick={() => navigate(`/${category}`)}>{category}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {products.map(product => (
              <div key={product._id} className="product-card">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Price: ${product.price}</p>
                  <p>Sold by: {product.soldBy}</p>
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;