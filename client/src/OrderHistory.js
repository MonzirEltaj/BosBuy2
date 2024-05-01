import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext'; // Make sure this path is correct

const OrderHistory = () => {
    const navigate = useNavigate();
    const [receipts, setReceipts] = useState([]);
    const { authState } = useAuth();

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/getReceipts/${authState.user._id}`);
                setReceipts(response.data);
            } catch (error) {
                console.error('Error fetching receipts:', error);
            }
        };

        fetchReceipts();
    }, [authState.user._id]);

    return (
        <div>
            <h1>Order History</h1>
            <button onClick={() => navigate(-1)} style={{ margin: '10px' }}>Go Back</button>
            <ul>
                {receipts.map(receipt => (
                    <li key={receipt._id}>
                        <Link to={`/receipt/${receipt._id}`}>Receipt {receipt.receiptNumber} - {new Date(receipt.date).toLocaleDateString()}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderHistory;