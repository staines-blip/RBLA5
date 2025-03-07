import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/public';

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL
});

// Get all products
export const getAllProducts = async (filters = {}) => {
    try {
        const response = await api.get('/products', { params: filters });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get products by category
export const getProductsByCategory = async (categoryName) => {
    try {
        const response = await api.get(`/products/category/${categoryName}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get single product
export const getProduct = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
