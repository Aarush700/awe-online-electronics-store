import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('Please log in to view order history.');
                    setLoading(false);
                    return;
                }
                const response = await api.getOrderHistory(userId);
                setOrders(response);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch order history:', error);
                setError('Failed to load order history.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderHistory();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-lg">Loading order history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12">
                <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-4 text-center text-white">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium">{error}</p>
                    <Link to="/login" className="mt-4 inline-block text-yellow-400 hover:text-yellow-300">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Order History</h1>
                {orders.length === 0 ? (
                    <div className="bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                        <p className="text-lg">You have no previous orders.</p>
                        <Link to="/products" className="mt-4 inline-flex items-center px-6 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.orderId} className="bg-gray-800 rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-2">Order #{order.orderId}</h2>
                                <p className="text-gray-400">Date: {new Date(order.timestamp).toLocaleDateString()}</p>
                                <p className="text-gray-400">Total: ${order.total}</p>
                                <p className="text-gray-400">Status: {order.status}</p>
                                <div className="mt-4">
                                    <Link to={`/order-details/${order.orderId}`} className="text-yellow-400 hover:text-yellow-300">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;