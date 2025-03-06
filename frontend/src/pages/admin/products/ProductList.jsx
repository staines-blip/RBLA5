import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getAllProducts, 
    toggleProductActive, 
    deleteProduct,
    getAllCategories 
} from '../../../services/adminapi/index';
import { isAdminLoggedIn } from '../../../services/adminAuthService';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import './ProductList.css';

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({
        category: '',
        isActive: ''
    });

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                const isLoggedIn = await isAdminLoggedIn();
                if (!isLoggedIn) {
                    navigate('/admin/login');
                    return;
                }
                await Promise.all([fetchProducts(), fetchCategories()]);
            } catch (error) {
                console.error('Authentication check failed:', error);
                navigate('/admin/login');
            }
        };
        checkAuthAndFetchData();
    }, [navigate]);

    const handleUnauthorized = () => {
        // Clear any error state
        setError('');
        setLoading(false);
        // Redirect to login
        navigate('/admin/login');
    };

    const fetchProducts = async () => {
        try {
            const queryParams = {};
            if (filter.category) queryParams.category = filter.category;
            if (filter.isActive !== '') queryParams.isActive = filter.isActive;

            const data = await getAllProducts(queryParams);
            setProducts(data);
            setError('');
        } catch (error) {
            console.error('Error fetching products:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Failed to load products. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            const categoryMap = {};
            data.forEach(category => {
                categoryMap[category._id] = category.name;
            });
            setCategories(categoryMap);
        } catch (error) {
            console.error('Error fetching categories:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            }
        }
    };

    const handleFilterChange = async (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
        setLoading(true);
        await fetchProducts();
    };

    const handleToggleActive = async (productId) => {
        try {
            setLoading(true);
            await toggleProductActive(productId);
            await fetchProducts(); // Refresh the list
            setError('');
        } catch (error) {
            console.error('Error toggling product status:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Failed to update product status. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setLoading(true);
                await deleteProduct(productId);
                await fetchProducts(); // Refresh the list
                setError('');
            } catch (error) {
                console.error('Error deleting product:', error);
                if (error.response?.status === 401) {
                    handleUnauthorized();
                } else {
                    setError('Failed to delete product. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h2>Product List</h2>
                <div className="filters">
                    <select
                        name="category"
                        value={filter.category}
                        onChange={handleFilterChange}
                        disabled={loading}
                    >
                        <option value="">All Categories</option>
                        {Object.entries(categories).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                    <select
                        name="isActive"
                        value={filter.isActive}
                        onChange={handleFilterChange}
                        disabled={loading}
                    >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="product-table-container">
                {products.length === 0 ? (
                    <div className="no-products">No products found</div>
                ) : (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <img 
                                            src={product.image_url} 
                                            alt={product.name}
                                            className="product-thumbnail"
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{categories[product.category]}</td>
                                    <td>₹{product.new_price}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <button
                                            className={`status-toggle ${product.isActive ? 'active' : 'inactive'}`}
                                            onClick={() => handleToggleActive(product._id)}
                                            disabled={loading}
                                        >
                                            {product.isActive ? <FaToggleOn /> : <FaToggleOff />}
                                        </button>
                                    </td>
                                    <td className="actions">
                                        <button 
                                            className="edit-btn"
                                            disabled={loading}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(product._id)}
                                            disabled={loading}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProductList;
