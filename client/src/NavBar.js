import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';
import { categories } from './categories';
import axios from 'axios';  
import Dropdown from './Dropdown';  


function NavBar() {
  const navigate = useNavigate();
  const { authState, handleSignout } = useAuth();  

  const groceryOptions = categories.Grocery;
  const clothingOptions = categories.Clothing;
  const techOptions = categories.Technology;
  const jewleryOptions = categories.Jewlery;
  const furnitureOptions = categories.Furniture;
  const [companyOptions, setCompanyOptions] = useState([]);

  const addProductButton = authState.isAuthenticated && authState.type === 'company' ? (
    <button onClick={() => navigate('/addProduct')}>Add Product</button>
  ) : null;

  const handleSignoutAndNavigate = () => {
    handleSignout();  
    navigate('/');    
  };

  useEffect(() => {
    const fetchCompanies = async () => {
        try {
            const response = await axios.get('http://localhost:9000/getCompanies');
            setCompanyOptions(response.data);
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        }
    };

    fetchCompanies();
}, []);

const welcomeMessage = authState.isAuthenticated ? (
  `${authState.type === 'user' ? 'User' : 'Company'}: ${authState.user.name || authState.user.firstName + ' ' + authState.user.lastName }`
) : null;

 
  const spinningStyle = {
    animation: 'spin3d 10s linear infinite',
    fontSize: '36px', 
    cursor: 'pointer',
    color: 'white', 
    padding: '10px',
    userSelect: 'none', 
    transition: 'color 0.3s' 
  };
  const bosbuyStyle = {
    textAlign: 'center',
    fontFamily: 'Poppins', 
    fontSize: 'px', 
    color: 'black',
    backgroundColor: '#3f2860',
     
  };
  const pinkBOSstyle = {
    color: '#ff69b4', 
  };
  const whiteBUYstyle ={
    color: 'white',
  };

  return (
    <div>
      {}
      <div style={bosbuyStyle}>
      <span style={pinkBOSstyle}>Bos</span>
        <span style={whiteBUYstyle}>Buy</span>
      </div>

      {}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: '#3f2860',
        position: 'relative'
      }}>
        <div
          style={{ ...spinningStyle, position: 'absolute', left: '10px', top: '5px' }}
          onClick={() => navigate('/homepage')}
          onMouseEnter={(e) => e.target.style.color = 'black'}
          onMouseLeave={(e) => e.target.style.color = 'white'}
        >
          &#8962;
        </div>
        <div style={{position: 'absolute', left: '50px'}} >
          {authState.isAuthenticated && (
              <div onClick={() => navigate('/cart')} style={{ fontSize: '30px', cursor: 'pointer', color: 'white', padding: '10px', userSelect: 'none' }}>
                &#128722;
              </div>
            )}
        </div> 
        <div style={{ alignSelf: 'flex-end', paddingBottom: '10px' }}>
        {authState.isAuthenticated ? (
          <>
            <span style={{ color: 'white', paddingRight: '20px' }}>{welcomeMessage}</span>
           <div>
           {addProductButton} 
            <button onClick={() => navigate('/orderHistory')}>Order History</button>
            <button onClick={() => navigate('/editProfile')}>Edit Profile</button>
            <button onClick={handleSignoutAndNavigate}>Sign Out</button>
           </div>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>
        
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Dropdown label="Grocery" options={groceryOptions} />
          <Dropdown label="Clothing" options={clothingOptions} />
          <Dropdown label="Technology" options={techOptions} />
          <Dropdown label="Jewlery" options={jewleryOptions} />
          <Dropdown label="Furniture" options={furnitureOptions} />
          <Dropdown label="Companies" options={companyOptions} />
          <button onClick={() => navigate('/products')}> Product Listing</button>
        </div>
      </nav>
    </div>
  );
}

document.head.appendChild(document.createElement("style")).textContent = `
  @keyframes spin3d {
    from { transform: rotate3d(0, 1, 0, 0deg); }
    to { transform: rotate3d(0, 1, 0, 360deg); }
  }
`;

export default NavBar;