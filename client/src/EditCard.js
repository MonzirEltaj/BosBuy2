import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/EditProduct.css';

function EditCard() {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expirationDate: '',
        cvv: '',
        zipCode: ''
    });

    useEffect(() => {
        const fetchCardDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/getCard/${cardId}`);
                setCardData(response.data.card);
            } catch (error) {
                console.error('Failed to fetch card details:', error);
                alert('Failed to fetch card details.');
            }
        };
        fetchCardDetails();
    }, [cardId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:9000/editCard/${cardId}`, cardData);
            if (response.data.success) {
                alert('Card updated successfully!');
                navigate('/manageCards');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Failed to update card:', error);
            alert('Failed to update card.');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Edit Card</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Card Number:</label>
                    <input type="text" name="cardNumber" value={cardData.cardNumber} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Card Name:</label>
                    <input type="text" name="cardName" value={cardData.cardName} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Expiration Date:</label>
                    <input type="text" name="expirationDate" value={cardData.expirationDate} onChange={handleInputChange} />
                </div>
                <div>
                    <label>CVV:</label>
                    <input type="text" name="cvv" value={cardData.cvv} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Zip Code:</label>
                    <input type="text" name="zipCode" value={cardData.zipCode} onChange={handleInputChange} />
                </div>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate(-1)} style={{ margin: '10px 0' }}>Back</button>
                <button type="button" onClick={() => navigate('/')} style={{ margin: '10px 0' }}>Home</button>
            </form>
        </div>
    );
}

export default EditCard;