import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext'; // Make sure this path is correct

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, decreaseQuantity, addToCart, clearCart } = useCart();

  // Calculate total price for each item
  const getItemTotal = (item) => item.price * item.quantity;

  // Calculate the total price for all items
  const getTotalSum = () => {
    return cartItems.reduce((acc, item) => acc + getItemTotal(item), 0);
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ margin: '10px' }}>Back</button>
      <button onClick={clearCart} style={{ margin: '10px' }}>Clear Cart</button>
      <h1>Your Cart</h1>
      <ul>
        {cartItems.map(item => (
          <li key={item._id}>
            <img src={item.imageUrl} alt={item.name} style={{ width: '50px' }} />
            {item.name} - {item.quantity} x ${item.price} = ${getItemTotal(item).toFixed(2)}
            <br />
            <button onClick={() => decreaseQuantity(item)}>-</button>
            <button onClick={() => addToCart(item)}>+</button>
            <button onClick={() => removeFromCart(item)}>🗑️</button>
          </li>
        ))}
      </ul>
      <h2>Total: ${getTotalSum().toFixed(2)}</h2> {/* Display the total sum */}
      {cartItems.length === 0 ? <p>Your cart is empty</p> : 
        <button onClick={() => navigate('/checkout')} style={{ margin: '10px' }}>Checkout</button>
      }
    </div>
  );
};

export default Cart;