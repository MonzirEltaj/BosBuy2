import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';

function ManageCards() {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/getCards/${authState.user._id}`);
            setCards(response.data.cards);
        } catch (error) {
            console.error('Failed to fetch cards:', error);
        }
    };

    const handleDeleteCard = async (cardId) => {
        try {
            const response = await axios.delete(`http://localhost:9000/deleteCard/${cardId}`);
            if (response.data.success) {
                fetchCards(); 
                alert('Card deleted successfully!');
                navigate(`/editProfile`);
            }
        } catch (error) {
            console.error('Failed to delete card:', error);
            alert('Failed to delete card: ' + error.message);
        }
    };

    const navigateToEditCard = (cardId) => {
        navigate(`/editCard/${cardId}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h2>Manage Cards</h2>
            {cards.map(card => (
                <div key={card._id} style={{ margin: '10px' }}>
                    <span>{card.cardName} - {card.expirationDate}</span>
                    <button onClick={() => navigateToEditCard(card._id)} style={{ marginLeft: '10px' }}>Edit</button>
                    <button onClick={() => handleDeleteCard(card._id)} style={{ marginLeft: '10px' }}>Delete</button>
                </div>
            ))}
            <button onClick={() => navigate('/addCardPage')} style={{ margin: '20px' }}>Add New Card</button>
            <button onClick={() => navigate(-1)} style={{ margin: '10px' }}>Back</button>
        </div>
    );
}

export default ManageCards;