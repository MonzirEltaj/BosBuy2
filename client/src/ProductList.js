import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import './styles/ProductStyles.css';  
function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:9000/getProducts')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch products:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div>
            <h1>Product List</h1>
            <div className="product-container">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <p>Category: {product.category} -- {product.subcategory}</p>
                            <p>Sold by: {product.soldBy}</p>
                            <button onClick={() => addToCart(product)}>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;