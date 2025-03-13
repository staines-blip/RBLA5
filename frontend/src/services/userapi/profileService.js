import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

// Get user profile
export const getProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { 
            success: false, 
            message: 'Error fetching profile' 
        };
    }
};

// Update user profile
export const updateProfile = async (token, profileData) => {
    try {
        const response = await axios.put(
            `${API_URL}/profile`,
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { 
            success: false, 
            message: 'Error updating profile' 
        };
    }
};
