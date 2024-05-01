import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext'; // Ensure this path is correct
import { useAuth } from './UserContext'; // If user context holds authentication and user info

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const { authState } = useAuth();
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:9000/getCards/${authState.user?._id}`)
            .then(response => {
                setCards(response.data.cards);
                setSelectedCard(authState.user?.defaultCard || (response.data.cards[0]?._id));
            })
            .catch(error => console.error('Failed to fetch cards:', error));
    }, [authState.user?._id, authState.user?.defaultCard]);

    const handlePayment = async () => {
        if (!cartItems.length) {
            alert('Your cart is empty.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:9000/saveReceipt', {
                products: cartItems.map(item => ({
                    productId: item._id,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    totalPrice: item.quantity * item.price
                })),
                totalAmount: totalSum,
                cardUsed: selectedCard,
                user: authState.user._id
            });
    
            if (response.data.success) {
                alert('Payment successful!');
                clearCart();
                navigate('/');
            } else {
                alert('Failed to save receipt.');
            }
        } catch (error) {
            console.error('Error saving receipt:', error);
            alert('Failed to save receipt: ' + error.response?.data?.message || error.message);
        }
    };

    const totalSum = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div>
            <h1>Checkout</h1>
            <ul>
                {cartItems.map(item => (
                    <li key={item._id}>
                        {item.name} - {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                    </li>
                ))}
            </ul>
            <h2>Total: ${totalSum.toFixed(2)}</h2>
            <select value={selectedCard} onChange={e => setSelectedCard(e.target.value)}>
                {cards.map(card => (
                    <option key={card._id} value={card._id}>{card.cardName} -- Expires on {card.expirationDate}</option>
                ))}
            </select>
            <button onClick={handlePayment}>Pay</button>
        </div>
    );
};

export default Checkout;