import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Signup.css';
import axios from 'axios';

function Signup() {
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState('user');
    const [signupValues, setSignupValues] = useState({
        firstName: '',
        lastName: '',
        userId: '',
        password: '',
        name: '',  // For company name
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSignupValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const url = 'http://localhost:9000/createAccount'; // Adjusted endpoint
        let data = {
            accountType,
            ...signupValues
        };

        // Remove fields that are not necessary for the respective account type
        if (accountType === 'user') {
            delete data.name;
        } else {
            delete data.firstName;
            delete data.lastName;
            delete data.userId;
            data.name = signupValues.name; // Using the company name field for companies
        }

        axios.post(url, data)
            .then((res) => {
                alert('Successfully Signed Up!');
                navigate('/login');
            })
            .catch((err) => {
                console.error(err);
                const errorMessage = err.response ? err.response.data.message : 'An error occurred';
                alert(`Error in Signing Up: ${errorMessage}`);
            });
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="signup">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="accountType">Account Type:</label>
                    <select id="accountType" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                        <option value="user">User</option>
                        <option value="company">Company</option>
                    </select>
                </div>
                {accountType === 'user' ? (
                    <>
                        <div>
                            <label htmlFor="firstName">First Name:</label>
                            <input type="text" id="firstName" name="firstName" value={signupValues.firstName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="text" id="lastName" name="lastName" value={signupValues.lastName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="userId">User ID:</label>
                            <input type="text" id="userId" name="userId" value={signupValues.userId} onChange={handleInputChange} />
                        </div>
                    </>
                ) : (
                    <div>
                        <label htmlFor="name">Company Name:</label>
                        <input type="text" id="name" name="name" value={signupValues.name} onChange={handleInputChange} />
                    </div>
                )}
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type={isPasswordVisible ? "text" : "password"} id="password" name="password" value={signupValues.password} onChange={handleInputChange} />
                    <button type="button" onClick={togglePasswordVisibility} className='showhide'>
                        {isPasswordVisible ? 'Hide' : 'Show'}
                    </button>
                </div>
                <button type="submit" className='signup-button'>Sig<span className='up-text'>nup</span></button>
            </form>
            <button onClick={() => navigate('/')} className='home-button'>Ho<span className='me-text'>me</span></button>
            <button onClick={() => navigate('/login')} className='login-button'>Go to L<span className='login-text'> ogin</span></button>
        </div>
    );
}

export default Signup;