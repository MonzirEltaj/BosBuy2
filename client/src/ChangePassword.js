import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';

function ChangePassword() {
    const navigate = useNavigate();
    const { authState, updateUser } = useAuth();
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState(false); 

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        try {
            const dataToSend = {
                accountType: authState.type,
                userId: authState.type === 'user' ? authState.user?._id : undefined,
                name: authState.type === 'company' ? authState.user?.name : undefined,
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
            };
            const response = await axios.post('http://localhost:9000/verifyAndChangePassword', dataToSend);
            if (response.data.success) {
                updateUser(response.data.user);
                alert('Password changed successfully!');
                navigate('/editProfile');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Failed to change password.');
        }
    };

    const togglePasswordVisibility = (event) => {
        event.preventDefault(); 
        setShowPasswords(!showPasswords); 
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
                <label style={{ width: '100%' }}>Old Password:
                    <input
                        type={showPasswords ? "text" : "password"}
                        name="oldPassword"
                        value={passwords.oldPassword}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
                    />
                </label>
                <label style={{ width: '100%' }}>New Password:
                    <input
                        type={showPasswords ? "text" : "password"}
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
                    />
                </label>
                <label style={{ width: '100%' }}>Confirm New Password:
                    <input
                        type={showPasswords ? "text" : "password"}
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
                    />
                </label>
                <button onClick={togglePasswordVisibility} style={{ margin: '10px 0' }}>
                    {showPasswords ? "Hide" : "Show"} Passwords
                </button>
                <button type="submit" style={{ margin: '10px 0' }}>Change Password</button>
                <button type="button" onClick={() => navigate(-1)} style={{ margin: '10px 0' }}>Back</button>
                <button type="button" onClick={() => navigate('/')} style={{ margin: '10px 0' }}>Home</button>
            </form>
        </div>
    );
}

export default ChangePassword;