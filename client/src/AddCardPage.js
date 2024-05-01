import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext'; // Assuming useAuth provides user details

function AddCardPage() {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expirationDate: '',
        cvv: '',
        zipCode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(cardDetails); // Log the card details to ensure they are all populated
        if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expirationDate || !cardDetails.cvv || !cardDetails.zipCode) {
            alert('Please fill in all fields');
            return; // Prevent submission if any field is empty
        }
        try {
            const response = await axios.post('http://localhost:9000/addCard', {
                userId: authState.user._id, // Make sure this is populated
                cardDetails // Ensure this is structured correctly
            });
            if (response.status === 201) { // Ensure this matches the expected success status code
                alert('Card added successfully!');
                navigate('/editProfile');
            } else {
                alert('Failed to add card');
            }
        } catch (error) {
            console.error('Failed to add card:', error);
            alert('Failed to add card: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="add-card-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h2>Add Card</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
                <label style={{ marginBottom: '10px' }}>
                    Card Number:
                    <input type="text" name="cardNumber" value={cardDetails.cardNumber} onChange={handleChange} required />
                </label>
                <label style={{ marginBottom: '10px' }}>
                    Card Name:
                    <input type="text" name="cardName" value={cardDetails.cardName} onChange={handleChange} required />
                </label>
                <label style={{ marginBottom: '10px' }}>
                    Expiration Date (MM/YY):
                    <input type="text" name="expirationDate" value={cardDetails.expirationDate} onChange={handleChange} required pattern="^(0[1-9]|1[0-2])/([0-9]{2})$" />
                </label>
                <label style={{ marginBottom: '10px' }}>
                    CVV:
                    <input type="text" name="cvv" value={cardDetails.cvv} onChange={handleChange} required pattern="^\d{3}$" />
                </label>
                <label style={{ marginBottom: '10px' }}>
                    ZIP Code:
                    <input type="text" name="zipCode" value={cardDetails.zipCode} onChange={handleChange} required pattern="^\d{5}$" />
                </label>
                <button type="submit" style={{ margin: '20px 0' }}>Add Card</button>
                <button type="button" onClick={() => navigate(-1)} style={{ margin: '10px 0' }}>Back</button>
            </form>
        </div>
    );
}

export default AddCardPage;