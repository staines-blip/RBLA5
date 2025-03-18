import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct, updateProductStock } from '../../../services/adminapi/index';
import { getAllCategories } from '../../../services/adminapi/categoryAPI';
import { getAllProductUnits } from '../../../services/adminapi/productUnitAPI';
import { uploadImage } from '../../../services/adminapi/uploadAPI';
import { isAdminLoggedIn } from '../../../services/adminAuthService';
import { toast } from 'react-toastify';
import './ProductForm.css';
import './EditProduct.css';

const EditProduct = () => {
    const { id } = useParams();
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
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [stockOnly, setStockOnly] = useState(false);

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                const isLoggedIn = await isAdminLoggedIn();
                if (!isLoggedIn) {
                    navigate('/admin/login');
                    return;
                }
                await Promise.all([fetchProduct(), fetchCategories(), fetchUnits()]);
            } catch (error) {
                console.error('Authentication check failed:', error);
                navigate('/admin/login');
            } finally {
                setLoading(false);
            }
        };
        checkAuthAndFetchData();
    }, [id, navigate]);

    const handleUnauthorized = () => {
        setError('');
        setLoading(false);
        navigate('/admin/login');
    };

    const fetchProduct = async () => {
        try {
            const data = await getProduct(id);
            setFormData({
                name: data.name || '',
                description: data.description || '',
                category: data.category?._id || '',
                unit: data.unit?._id || '',
                new_price: data.new_price || '',
                old_price: data.old_price || '',
                stock: data.stock || 0,
                image_url: data.image_url || '',
                images: data.images || [],
                size: {
                    breadth: data.size?.breadth || '',
                    height: data.size?.height || ''
                },
                isActive: data.isActive
            });
            setImagePreview(data.image_url);
        } catch (error) {
            console.error('Error fetching product:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Failed to load product. Please try again.');
            }
        }
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
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload the image to the server
        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploadLoading(true);
            const response = await uploadImage(formData);
            setFormData(prev => ({
                ...prev,
                image_url: response.fileUrl
            }));
            setError('');
        } catch (error) {
            console.error('Error uploading image:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Failed to upload image. Please try again.');
            }
        } finally {
            setUploadLoading(false);
        }
    };

    const handleStockUpdate = async (e) => {
        e.preventDefault();
        
        try {
            setSubmitting(true);
            await updateProductStock(id, formData.stock);
            toast.success('Stock updated successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error updating stock:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Failed to update stock. Please try again.');
                toast.error('Failed to update stock');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.name || !formData.description || !formData.category || 
            !formData.unit || !formData.new_price || !formData.old_price || 
            !formData.stock || !formData.image_url) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);
            await updateProduct(id, formData);
            toast.success('Product updated successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error updating product:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Failed to update product. Please try again.');
                toast.error('Failed to update product');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading product data...</p>
            </div>
        );
    }

    return (
        <div className="product-form-container">
            <div className="form-header">
                <h2>Edit Product</h2>
                <div className="edit-options">
                    <button 
                        className={`option-btn ${!stockOnly ? 'active' : ''}`}
                        onClick={() => setStockOnly(false)}
                    >
                        Full Edit
                    </button>
                    <button 
                        className={`option-btn ${stockOnly ? 'active' : ''}`}
                        onClick={() => setStockOnly(true)}
                    >
                        Stock Only
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {stockOnly ? (
                <form onSubmit={handleStockUpdate} className="product-form stock-only-form">
                    <div className="form-group">
                        <label>Product Name:</label>
                        <input
                            type="text"
                            value={formData.name}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>Current Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin/dashboard')}
                            className="cancel-btn"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Update Stock'}
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-section">
                        <h3>Basic Information</h3>
                        <div className="form-group">
                            <label>Product Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category:</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Unit:</label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Unit</option>
                                    {units.map(unit => (
                                        <option key={unit._id} value={unit._id}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Pricing & Inventory</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Current Price (₹):</label>
                                <input
                                    type="number"
                                    name="new_price"
                                    value={formData.new_price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Original Price (₹):</label>
                                <input
                                    type="number"
                                    name="old_price"
                                    value={formData.old_price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Stock Quantity:</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Product Status:</label>
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    id="isActive"
                                />
                                <label htmlFor="isActive">Active</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Dimensions</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Width:</label>
                                <input
                                    type="number"
                                    name="size.breadth"
                                    value={formData.size.breadth}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Height:</label>
                                <input
                                    type="number"
                                    name="size.height"
                                    value={formData.size.height}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.1"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Product Image</h3>
                        <div className="image-upload-section">
                            <div className="image-preview">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Product preview" />
                                ) : (
                                    <div className="no-image">No image selected</div>
                                )}
                            </div>
                            <div className="upload-controls">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="upload-btn">
                                    {uploadLoading ? 'Uploading...' : 'Choose Image'}
                                </label>
                                <p className="upload-help">Recommended size: 800x800px, max 5MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin/dashboard')}
                            className="cancel-btn"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={submitting || uploadLoading}
                        >
                            {submitting ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditProduct;
