import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ReceiptDetails = () => {
    const navigate = useNavigate();
    const { receiptId } = useParams();
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/getReceipt/${receiptId}`);
                setReceipt(response.data);
            } catch (error) {
                console.error('Error fetching receipt details:', error);
            }
        };

        fetchReceipt();
    }, [receiptId]);

    if (!receipt) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <button onClick={() => navigate(-1)} style={{ margin: '10px' }}>Go Back</button>
            <h1>Receipt Details</h1>
            <h2>Receipt Number: {receipt.receiptNumber}</h2>
            <h3>Date: {new Date(receipt.date).toLocaleString()}</h3>
            <ul>
                {receipt.products.map(product => (
                    <li key={product.productId._id}>
                        {product.productId.name} - {product.quantity} x ${product.unitPrice.toFixed(2)} = ${product.totalPrice.toFixed(2)}
                    </li>
                ))}
            </ul>
            <h2>Total: ${receipt.totalAmount.toFixed(2)}</h2>
        </div>
    );
};

export default ReceiptDetails;