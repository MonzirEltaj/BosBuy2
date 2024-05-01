import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dropdown({ label, options }) {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();  // Use navigation

  const handleOptionClick = (option) => {
    // Check if the option is the category itself or a sub-category
    if (option === label) {
      navigate(`/${label}`);  // Navigate to main category page
    } else {
      navigate(`/${label}/${option}`);  // Navigate to sub-category
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