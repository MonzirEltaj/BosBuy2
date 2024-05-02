import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const clearCart = () => {
    setCartItems([]); 
  };

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(it => it._id === item._id);
      if (itemExists) {
        return prevItems.map(it => it._id === item._id ? {...it, quantity: it.quantity + 1} : it);
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item) => {
    setCartItems(prevItems => prevItems.filter(it => it._id !== item._id));
  };

  const decreaseQuantity = (item) => {
    setCartItems(prevItems => {
      if (item.quantity === 1) {
        return prevItems.filter(it => it._id !== item._id);
      }
      return prevItems.map(it => it._id === item._id ? {...it, quantity: it.quantity - 1} : it);
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decreaseQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};