import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from './CartContext';
import './styles/ProductStyles.css'; 

const ProductSort = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { category, subcategory } = useParams();
    const { addToCart } = useCart();

    useEffect(() => {
        setLoading(true);
        const url = subcategory ? `http://localhost:9000/products/category/${category}/${subcategory}` : `http://localhost:9000/products/category/${category}`;
        axios.get(url)
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log('Error fetching products:', error);
                setLoading(false);
            });
    }, [category, subcategory]);

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div>
            <h1>Products in {category} {subcategory ? `- ${subcategory}` : ''}</h1>
            <div className="product-container">
                {products.length > 0 ? products.map(product => (
                    <div key={product._id} className="product-card">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <p>Sold by: {product.soldBy}</p>
                            <button onClick={() => addToCart(product)}>Add to Cart</button>
                        </div>
                    </div>
                )) : <p>No products found in this category.</p>}
            </div>
        </div>
    );
};

export default ProductSort;