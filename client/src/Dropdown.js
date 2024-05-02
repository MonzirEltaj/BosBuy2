import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dropdown({ label, options }) {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();  

  const handleOptionClick = (option) => {
    if (option === label) {
      navigate(`/${label}`);  
    } else {
      navigate(`/${label}/${option}`);  
    }
  };

  return (
    <div
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
      style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}
    >
      <button onClick={() => handleOptionClick(label)}>{label}</button>
      {showOptions && (
        <div style={{
          position: 'absolute',
          backgroundColor: 'white',
          boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
          zIndex: 1
        }}>
          {options.map((option, index) => (
            <button key={index} onClick={() => handleOptionClick(option)} style={{ display: 'block', width: '100%' }}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;