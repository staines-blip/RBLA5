import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct, getAllCategories } from '../../../services/adminapi/index';
import { isAdminLoggedIn } from '../../../services/adminAuthService';
import './ProductForm.css';

const ProductForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        new_price: '',
        old_price: '',
        stock: '',
        image_url: '',
        isActive: true
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                const isLoggedIn = await isAdminLoggedIn();
                if (!isLoggedIn) {
                    navigate('/admin/login');
                    return;
                }
                await fetchCategories();
            } catch (error) {
                console.error('Authentication check failed:', error);
                navigate('/admin/login');
            } finally {
                setLoading(false);
            }
        };
        checkAuthAndFetchData();
    }, [navigate]);

    const handleUnauthorized = () => {
        setError('');
        setLoading(false);
        navigate('/admin/login');
    };

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Failed to load categories. Please try again.');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'image_url' && value) {
            setImagePreview(value);
        }
    };

    const validateForm = () => {
        const errors = [];
        if (!formData.name.trim()) errors.push('Name is required');
        if (!formData.description.trim()) errors.push('Description is required');
        if (!formData.category) errors.push('Category is required');
        if (!formData.new_price || isNaN(formData.new_price)) errors.push('Valid price is required');
        if (formData.old_price && isNaN(formData.old_price)) errors.push('Old price must be a valid number');
        if (!formData.stock || isNaN(formData.stock)) errors.push('Valid stock quantity is required');
        if (!formData.image_url.trim()) errors.push('Image URL is required');

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setError(validationErrors.join('\n'));
            return;
        }

        setLoading(true);
        try {
            const productData = {
                ...formData,
                new_price: parseFloat(formData.new_price),
                old_price: formData.old_price ? parseFloat(formData.old_price) : undefined,
                stock: parseInt(formData.stock, 10)
            };

            await createProduct(productData);
            navigate('/admin/products'); 
        } catch (error) {
            console.error('Error creating product:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError(error.response?.data?.message || 'Failed to create product. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading form...</p>
            </div>
        );
    }

    return (
        <div className="product-form-container">
            <h2>Add New Product</h2>
            
            {error && (
                <div className="error-message">
                    {error.split('\n').map((err, index) => (
                        <div key={index}>{err}</div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="name">Product Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="new_price">Price (₹) *</label>
                        <input
                            type="number"
                            id="new_price"
                            name="new_price"
                            value={formData.new_price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="old_price">Old Price (₹)</label>
                        <input
                            type="number"
                            id="old_price"
                            name="old_price"
                            value={formData.old_price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="stock">Stock Quantity *</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image_url">Image URL *</label>
                        <input
                            type="text"
                            id="image_url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Product preview" />
                    </div>
                )}

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <label htmlFor="isActive">Product is active</label>
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Product...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
