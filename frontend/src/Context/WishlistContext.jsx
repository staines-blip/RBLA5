import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthToken } from '../services/userapi/authservice';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get wishlist items
    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const response = await axios.get('/api/user/wishlist', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setWishlistItems(response.data.items || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching wishlist');
        } finally {
            setLoading(false);
        }
    };

    // Add to wishlist
    const addToWishlist = async (productId) => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const response = await axios.post('/api/user/wishlist/add', 
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setWishlistItems(response.data.items || []);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding to wishlist');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Remove from wishlist
    const removeFromWishlist = async (productId) => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const response = await axios.delete(`/api/user/wishlist/remove/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setWishlistItems(response.data.items || []);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Error removing from wishlist');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Clear wishlist
    const clearWishlist = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            await axios.delete('/api/user/wishlist/clear', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setWishlistItems([]);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Error clearing wishlist');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Check if item is in wishlist
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.product._id === productId);
    };

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            fetchWishlist();
        }
    }, []);

    const value = {
        wishlistItems,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
