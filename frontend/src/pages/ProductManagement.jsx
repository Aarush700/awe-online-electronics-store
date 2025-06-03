import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Alert from '../components/Alert';

/**
 * Product management page for staff
 */
const ProductManagement = () => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        categoryId: '',
        image: '',
        description: '',
        rating: '',
        discount_percentage: '',
        original_price: '',
    });
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const staffId = localStorage.getItem('staffId');

    // Current date and time
    const currentDateTime = new Date().toLocaleString('en-AU', {
        timeZone: 'Australia/Sydney',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!staffId) {
            navigate('/staff/login');
            return;
        }

        try {
            // Convert numeric fields to numbers before sending
            const productData = {
                ...formData,
                price: formData.price ? parseFloat(formData.price) : 0,
                categoryId: formData.categoryId || null,
                rating: formData.rating ? parseFloat(formData.rating) : 0.0,
                discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : 0.00,
                original_price: formData.original_price ? parseFloat(formData.original_price) : 0.00,
            };
            await api.addProduct(staffId, productData);
            setAlert({ message: 'Product added successfully', type: 'success' });
            setFormData({
                title: '',
                price: '',
                categoryId: '',
                image: '',
                description: '',
                rating: '',
                discount_percentage: '',
                original_price: '',
            });
        } catch (error) {
            setAlert({ message: error.error || 'Failed to add product', type: 'error' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('staffId');
        localStorage.removeItem('staffRole');
        navigate('/staff/login');
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Header with Date and Time */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                            Manage Products
                        </h1>
                        <p className="text-gray-400 text-lg">Add new products to the store</p>
                        <p className="text-gray-500 text-sm mt-2">{currentDateTime}</p>
                    </div>

                    {/* Alert */}
                    {alert && (
                        <div className="mb-8">
                            <Alert message={alert.message} type={alert.type} />
                        </div>
                    )}

                    {/* Product Form Card */}
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-semibold text-white mb-6">Add New Product</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <InputField
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Title"
                                    required
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                />
                                <InputField
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Price"
                                    required
                                    step="0.01"
                                    min="0"
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                />
                                <InputField
                                    type="number"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    placeholder="Category ID"
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                />
                                <InputField
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="Image URL"
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                />
                                <InputField
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                />
                                <InputField
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    placeholder="Rating (0-5)"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                />
                                <InputField
                                    type="number"
                                    name="discount_percentage"
                                    value={formData.discount_percentage}
                                    onChange={handleChange}
                                    placeholder="Discount % (0-100)"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                />
                                <InputField
                                    type="number"
                                    name="original_price"
                                    value={formData.original_price}
                                    onChange={handleChange}
                                    placeholder="Original Price"
                                    step="0.01"
                                    min="0"
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 hover:border-yellow-400/50 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                >
                                    Add Product
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleLogout}
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-600/50 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                        >
                            <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;