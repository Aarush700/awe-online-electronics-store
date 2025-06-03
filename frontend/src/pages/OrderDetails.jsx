import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';

const OrderDetails = () => {
    const { orderId } = useParams(); // Get orderId from URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('Please log in to view order details.');
                    setLoading(false);
                    return;
                }
                const response = await api.getOrderDetails(userId, orderId);
                setOrder(response);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch order details:', error);
                setError('Failed to load order details.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    // Helper function to decode image paths
    const getImageUrl = (image) => {
        if (!image) {
            console.log('No image data provided');
            return 'https://via.placeholder.com/100x100?text=No+Image';
        }

        try {
            if (typeof image === 'string' && image.startsWith('http')) {
                return image;
            }

            // If the image is a base64-encoded string, decode it
            const decodedPath = atob(image);
            if (decodedPath.startsWith('http')) {
                return decodedPath;
            }

            return `http://127.0.0.1:5000${decodedPath}`;
        } catch (error) {
            console.error('Error decoding image path:', error, 'Raw data:', image);
            if (typeof image === 'string' && !image.startsWith('http')) {
                return `http://127.0.0.1:5000/static/images/${image}`;
            }
            return 'https://via.placeholder.com/100x100?text=No+Image';
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-red-400 text-lg font-medium">{error}</p>
                    <Link to="/login" className="mt-4 inline-block text-yellow-400 hover:text-yellow-300">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-12 shadow-2xl">
                    <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">Order Not Found</h3>
                    <p className="text-gray-400 mb-6">The order you are looking for does not exist.</p>
                    <Link to="/order-history" className="inline-flex items-center text-yellow-400 hover:text-yellow-300">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Order History
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                            Order Details - #{order.orderId}
                        </h1>
                        <p className="text-gray-400 text-lg">View the details of your order below</p>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                        {/* Order Summary */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">Order Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                                    <p className="text-sm text-gray-400 mb-1">Order Date</p>
                                    <p className="text-white font-medium">
                                        {new Date(order.timestamp).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                                    <p className="text-sm text-gray-400 mb-1">Total</p>
                                    <p className="text-white font-medium">${order.total}</p>
                                </div>
                                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                                    <p className="text-sm text-gray-400 mb-1">Status</p>
                                    <p className="text-white font-medium capitalize">{order.status}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">Items</h2>
                            {order.items.length === 0 ? (
                                <p className="text-gray-400">No items in this order.</p>
                            ) : (
                                <div className="space-y-6">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.orderItemId}
                                            className="flex items-center border-b border-gray-700/50 pb-4"
                                        >
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-white">{item.title}</h3>
                                                <p className="text-gray-400">Quantity: {item.quantity}</p>
                                                <p className="text-gray-400">Price: ${item.price}</p>
                                                <p className="text-gray-400">
                                                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Back Link */}
                        <div className="text-center">
                            <Link
                                to="/order-history"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Order History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;