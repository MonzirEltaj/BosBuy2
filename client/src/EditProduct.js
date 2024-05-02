import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from './UserContext';
import './styles/EditProduct.css';


const EditProduct = () => {
const { authState } = useAuth(); 
const [products, setProducts] = useState([]);

useEffect(() => {
        if (authState.isAuthenticated && authState.type === 'company') {
            const companyName = authState.user.name; 
        axios.get(`http://localhost:9000/getCompanyProducts/${companyName}`)
        .then(response => setProducts(response.data))
        .catch(error => console.error('Failed to fetch products', error));

    }
}, [authState]);


const deleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:9000/deleteProduct/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Failed to delete product', error);
        }
};

return (
     <div>
        {authState.type === 'company' && (
        <>
        <h1>Products of {authState.user.name}</h1>
        <div className="product-container">
            {products.map(product => (
        <div key={product._id} className="product-card">
        <h2>{product.name}</h2>
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <Link to={`/editProduct/${product._id}`}>Edit</Link>
        <button onClick={() => deleteProduct(product._id)}>Delete</button>
        </div>
        ))}
        </div>
        </>
    )}
    </div>
);
};

export default EditProduct;
