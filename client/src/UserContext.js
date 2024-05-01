import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useAuth = () => useContext(UserContext);

export const UserProvider = ({ children }) => { // Add a prop to handle navigation on sign out
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    type: null
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedType = localStorage.getItem('accountType');
    if (storedUser && storedType) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(storedUser),
        type: storedType
      });
    }
  }, []);

  const handleLoginSuccess = (userData, type) => {
    console.log(`User logged in as: ${type}`);  // Log the user type to the console
    setAuthState({
        isAuthenticated: true,
        user: userData,
        type: type
    });
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('accountType', type);
};

  const handleSignout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      type: null
    });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accountType');
  };

  const updateUser = (userData) => {
    setAuthState(prevState => ({
        ...prevState,
        user: {
            ...prevState.user, // spread existing user details
            ...userData // overwrite with new details from the response
        }
    }));
};

  return (
    <UserContext.Provider value={{ authState, setAuthState, handleLoginSuccess, handleSignout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;