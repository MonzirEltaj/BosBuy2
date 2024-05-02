import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';
import './styles/EditProfile.css';

function EditProfile() {
    const navigate = useNavigate();
    const { authState, updateUser } = useAuth();
    const [profileData, setProfileData] = useState({
        id: authState.user?._id,
        firstName: authState.user?.firstName || '',
        lastName: authState.user?.lastName || '',
        userId: authState.user?.userId || '',
        defaultCard: authState.user?.defaultCard || '',
        companyName: authState.user?.name || '',
        cards: [],
    });

    useEffect(() => {
        if (!authState.isAuthenticated) {
            navigate('/login');
        } else if (authState.type === 'user') {
            axios.get(`http://localhost:9000/getCards/${authState.user?._id}`)
                .then(response => setProfileData(prev => ({ ...prev, cards: response.data.cards })))
                .catch(error => console.error('Failed to fetch cards:', error));
        }
    }, [authState.isAuthenticated, navigate, authState.type, authState.user?._id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'companyName') {
            setProfileData(prev => ({ ...prev, [name]: value, name: value }));
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/updateProfile', {
                type: authState.type,
                ...profileData
            });
            if (response.data.success) {
                updateUser(response.data.user);
                alert('Profile updated successfully!');
                navigate('/');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile: ' + error.response?.data?.message);
        }
    };

    return (
        <div className="edit-profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
                {authState.type === 'user' ? (
                    <>
                        <label style={{ marginBottom: '10px' }}>First Name:
                            <input type="text" name="firstName" value={profileData.firstName} onChange={handleInputChange} style={{ width: '100%' }} />
                        </label>
                        <label style={{ marginBottom: '10px' }}>Last Name:
                            <input type="text" name="lastName" value={profileData.lastName} onChange={handleInputChange} style={{ width: '100%' }} />
                        </label>
                        <label style={{ marginBottom: '10px' }}>User ID:
                            <input type="text" name="userId" value={profileData.userId} onChange={handleInputChange} style={{ width: '100%' }} />
                        </label>
                        <label>Default Card:
                            <select name="defaultCard" value={profileData.defaultCard} onChange={handleInputChange}>
                                {profileData.cards.map(card => (
                                    <option key={card._id} value={card._id}>
                                        {card.cardName} - {card.expirationDate}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button type="button" onClick={() => navigate('/manageCards')} style={{ margin: '10px 0' }}>Manage Cards</button>
                    </>
                ) : (
                    <label style={{ marginBottom: '10px' }}>Company Name:
                        <input type="text" name="companyName" value={profileData.companyName} onChange={handleInputChange} style={{ width: '100%' }} />
                    </label>
                )}
                <button type="submit" style={{ margin: '10px 0' }}>Update Profile</button>
                {authState.type === 'company' && (
                    <button type="button" onClick={() => navigate('/editproduct')} style={{ marginBottom: '10px' }}>Edit Listing</button>
                )}
                <button type="button" onClick={() => navigate('/changePassword')} style={{ margin: '10px 0' }}>Change Password</button>
                <button type="button" onClick={() => navigate(-1)} style={{ margin: '10px 0' }}>Back</button>
            </form>
        </div>
    );
}

export default EditProfile;
