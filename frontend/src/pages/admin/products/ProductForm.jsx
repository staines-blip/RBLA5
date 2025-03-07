import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct, getAllCategories } from '../../../services/adminapi/index';
import { createCategory } from '../../../services/adminapi/categoryAPI';
import { getAllProductUnits, createProductUnit } from '../../../services/adminapi/productUnitAPI';
import { uploadImage } from '../../../services/adminapi/uploadAPI';
import { isAdminLoggedIn } from '../../../services/adminAuthService';
import './ProductForm.css';

const ProductForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        unit: '',
        new_price: '',
        old_price: '',
        stock: '',
        image_url: '',
        size: {
            breadth: '',
            height: ''
        },
        isActive: true
    });
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newUnit, setNewUnit] = useState('');
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [showUnitInput, setShowUnitInput] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                const isLoggedIn = await isAdminLoggedIn();
                if (!isLoggedIn) {
                    navigate('/admin/login');
                    return;
                }
                await Promise.all([fetchCategories(), fetchUnits()]);
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

    const fetchUnits = async () => {
        try {
            const data = await getAllProductUnits();
            setUnits(data);
        } catch (error) {
            console.error('Error fetching units:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Failed to load units. Please try again.');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            // Handle nested object fields (e.g., size.breadth)
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        if (name === 'image_url' && value) {
            setImagePreview(value);
        }
    };

    const validateForm = () => {
        const errors = [];
        if (!formData.name.trim()) errors.push('Name is required');
        if (!formData.description.trim()) errors.push('Description is required');
        if (!formData.category) errors.push('Category is required');
        if (!formData.unit) errors.push('Unit is required');
        if (!formData.new_price || isNaN(formData.new_price)) errors.push('Valid price is required');
        if (formData.old_price && isNaN(formData.old_price)) errors.push('Old price must be a valid number');
        if (!formData.stock || isNaN(formData.stock)) errors.push('Valid stock quantity is required');
        if (!formData.size.breadth || isNaN(formData.size.breadth)) errors.push('Valid breadth is required');
        if (!formData.size.height || isNaN(formData.size.height)) errors.push('Valid height is required');
        if (!formData.image_url) errors.push('Please upload a product image');

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
                stock: parseInt(formData.stock, 10),
                size: {
                    breadth: parseFloat(formData.size.breadth),
                    height: parseFloat(formData.size.height)
                }
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

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) {
            setError('Category name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            const response = await createCategory({ name: newCategory.trim() });
            setCategories([...categories, response]);
            setFormData(prev => ({ ...prev, category: response._id }));
            setNewCategory('');
            setShowCategoryInput(false);
            setError('');
        } catch (error) {
            console.error('Error creating category:', error);
            setError(error.response?.data?.message || 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUnit = async (e) => {
        e.preventDefault();
        if (!newUnit.trim()) {
            setError('Unit name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            const response = await createProductUnit({ name: newUnit.trim() });
            setUnits([...units, response]);
            setFormData(prev => ({ ...prev, unit: response._id }));
            setNewUnit('');
            setShowUnitInput(false);
            setError('');
        } catch (error) {
            console.error('Error creating unit:', error);
            setError(error.response?.data?.message || 'Failed to create unit');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setUploadLoading(true);
        setError('');

        try {
            const result = await uploadImage(file);
            const fileUrl = result.fileUrl;
            setFormData(prev => ({ ...prev, image_url: fileUrl }));
            setImagePreview(URL.createObjectURL(file));
        } catch (error) {
            console.error('Error uploading image:', error);
            setError(error.response?.data?.message || 'Failed to upload image');
            // Clear the file input on error
            e.target.value = '';
        } finally {
            setUploadLoading(false);
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
                    <div className="category-input-group">
                        {showCategoryInput ? (
                            <div className="new-category-input">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Enter new category name"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    disabled={loading || !newCategory.trim()}
                                    className="add-category-btn"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCategoryInput(false);
                                        setNewCategory('');
                                    }}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
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
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryInput(true)}
                                    className="new-category-btn"
                                    disabled={loading}
                                >
                                    New Category
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="unit">Unit/Store *</label>
                    <div className="category-input-group">
                        {showUnitInput ? (
                            <div className="new-category-input">
                                <input
                                    type="text"
                                    value={newUnit}
                                    onChange={(e) => setNewUnit(e.target.value)}
                                    placeholder="Enter new unit name"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddUnit}
                                    disabled={loading || !newUnit.trim()}
                                    className="add-category-btn"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUnitInput(false);
                                        setNewUnit('');
                                    }}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <select
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select a unit</option>
                                    {units.map(unit => (
                                        <option key={unit._id} value={unit._id}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowUnitInput(true)}
                                    className="new-category-btn"
                                    disabled={loading}
                                >
                                    New Unit
                                </button>
                            </>
                        )}
                    </div>
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
                        <label htmlFor="image">Product Image *</label>
                        <div className="image-upload-container">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={loading || uploadLoading}
                                className="image-input"
                            />
                            {uploadLoading && <div className="upload-loading">Uploading...</div>}
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Product preview" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="breadth">Breadth (cm) *</label>
                        <input
                            type="number"
                            id="breadth"
                            name="size.breadth"
                            value={formData.size.breadth}
                            onChange={handleChange}
                            min="0"
                            step="0.1"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="height">Height (cm) *</label>
                        <input
                            type="number"
                            id="height"
                            name="size.height"
                            value={formData.size.height}
                            onChange={handleChange}
                            min="0"
                            step="0.1"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

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
