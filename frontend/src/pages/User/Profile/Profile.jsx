import React, { useState, useEffect } from 'react';
import { useUser } from '../../../Context/UserContext';
import { getProfile, updateProfile } from '../../../services/userapi/profileService';
import './Profile.css';

const Profile = () => {
    const { user, token } = useUser();
    const [profile, setProfile] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        profileCompleted: false
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [token]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            console.log('Fetching profile with token:', token);
            const response = await getProfile(token);
            console.log('Profile data received:', response);
            if (response.success) {
                setProfile(response.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({
                text: error.message || 'Error fetching profile',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Saving profile data:', {
                name: profile.name,
                phoneNumber: profile.phoneNumber
            });

            const response = await updateProfile(token, {
                name: profile.name,
                phoneNumber: profile.phoneNumber
            });

            console.log('Save response:', response);

            if (response.success) {
                setMessage({ text: 'Profile updated successfully', type: 'success' });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage({
                text: error.message || 'Error updating profile',
                type: 'error'
            });
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Profile</h2>
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
                
                {!isEditing ? (
                    <div className="profile-details">
                        <div className="detail-section">
                            <div className="detail-header">Account Information</div>
                            <div className="detail-row">
                                <div className="detail-label">Email</div>
                                <div className="detail-value">{profile.email}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Name</div>
                                <div className="detail-value">{profile.name || 'Not set'}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Phone Number</div>
                                <div className="detail-value">{profile.phoneNumber || 'Not set'}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Profile Status</div>
                                <div className={`detail-value status ${profile.profileCompleted ? 'complete' : 'incomplete'}`}>
                                    {profile.profileCompleted ? 'Complete' : 'Incomplete'}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="edit-button"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="input-disabled"
                            />
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="save-button">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    fetchProfile();
                                }}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
