import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from './CartContext';
import './styles/ProductStyles.css';  

const CompanyDetail = () => {
    const { companyName } = useParams();
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart(); 

    useEffect(() => {
        axios.get(`http://localhost:9000/getCompanyProducts/${companyName}`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch products', error);
            });
    }, [companyName]);

    return (
        <div>
            <h1>{companyName}</h1>
            <div className="product-container">
                {products.map(product => (
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
                ))}
            </div>
        </div>
    );
};

export default CompanyDetail;