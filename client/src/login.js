import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';
import { useAuth } from './UserContext';  

function Login() {
    const navigate = useNavigate();
    const { handleLoginSuccess } = useAuth();  
    const [loginValues, setLoginValues] = useState({
        accountType: 'user',  
        userId: '',
        name: '',  
        password: '',
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const params = {
            accountType: loginValues.accountType,
            ...loginValues
        };
       
        if (params.accountType === 'user') {
            delete params.name;
        } else {
            delete params.userId;
            params.userId = params.name;  
        }

        axios.get('http://localhost:9000/getAccount', { params })
        .then((res) => {
            if (res.data) {
                handleLoginSuccess(res.data, loginValues.accountType);  
                navigate('/');
            } else {
                alert('No user found with these credentials');
            }
        })
        .catch((err) => {
            console.error(err);
            alert('Error in Login: ' + (err.response?.data?.message || 'Server error'));
        });
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="accountType">Account Type:</label>
                    <select id="accountType" name="accountType" value={loginValues.accountType} onChange={handleInputChange}>
                        <option value="user">User</option>
                        <option value="company">Company</option>
                    </select>
                </div>
                {loginValues.accountType === 'user' ? (
                    <div>
                        <label htmlFor="userId">User ID:</label>
                        <input type="text" id="userId" name="userId" value={loginValues.userId} onChange={handleInputChange} />
                    </div>
                ) : (
                    <div>
                        <label htmlFor="name">Company Name:</label>
                        <input type="text" id="name" name="name" value={loginValues.name} onChange={handleInputChange} />
                    </div>
                )}
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type={isPasswordVisible ? "text" : "password"} id="password" name="password" value={loginValues.password} onChange={handleInputChange} />
                    <button type="button" onClick={togglePasswordVisibility} className="button-common">
                        {isPasswordVisible ? 'Hide' : 'Show'}
                    </button>
                </div>
                <button type="submit" className="button-common">Log<span className='in-text'>in</span></button>
                <button type="button" onClick={() => navigate('/')} className="button-common">Ho<span className='me-text'>me</span></button>
            </form>
            <button type="button" onClick={() => navigate('/signup')} className="signup-button">Go to S<span className='signup-text'>ignup</span></button>
        </div>
    );
}

export default Login;