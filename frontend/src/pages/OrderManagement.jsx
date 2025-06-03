import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import Alert from '../components/Alert';
import Navbar from '../components/Navbar';

/**
 * Order management page for staff
 */
const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null); // For viewing order details
    const navigate = useNavigate();
    const staffId = localStorage.getItem('staffId');

    // Current date and time
    const currentDateTime = new Date('2025-06-01T23:01:00+10:00').toLocaleString('en-AU', {
        timeZone: 'Australia/Sydney',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    useEffect(() => {
        if (!staffId) {
            setError('Please log in to access order management.');
            setLoading(false);
            navigate('/staff/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await api.getOrders(staffId);
                console.log('Fetched orders:', data); // Debug log
                setOrders(data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                setError(error.error || 'Failed to fetch orders.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [staffId, navigate]);

    const handleViewDetails = async (orderId) => {
        try {
            const orderDetails = await api.getOrderDetailsByStaff(staffId, orderId);
            console.log('Fetched order details:', orderDetails); // Debug log
            setSelectedOrder(orderDetails);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            setAlert({ message: error.error || 'Failed to fetch order details.', type: 'error' });
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await api.updateOrderStatus(orderId, newStatus, staffId);
            setAlert({ message: 'Order status updated successfully.', type: 'success' });
            // Refresh the orders list
            const updatedOrders = await api.getOrders(staffId);
            setOrders(updatedOrders);
        } catch (error) {
            console.error('Failed to update order status:', error);
            setAlert({ message: error.error || 'Failed to update order status.', type: 'error' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('staffId');
        localStorage.removeItem('staffRole');
        navigate('/staff/login');
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading orders...</p>
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
                    <Link to="/staff/login" className="mt-4 inline-block text-yellow-400 hover:text-yellow-300">
                        Go to Staff Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Header with Date and Time */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                            Order Management
                        </h1>
                        <p className="text-gray-400 text-lg">View and manage customer orders</p>
                        <p className="text-gray-500 text-sm mt-2">{currentDateTime}</p>
                    </div>

                    {/* Alert */}
                    {alert && (
                        <div className="mb-8">
                            <Alert message={alert.message} type={alert.type} />
                        </div>
                    )}

                    {/* Orders Table */}
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-semibold text-white mb-6">All Orders</h2>
                        {orders.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M3 3v18M3 3H1m20 0h2m-2 0v18m2 0h-2M3 21H1m2-18h18m0 18H3m18-18v18" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-lg">No orders to manage.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-700/50">
                                            <th className="py-3 px-4 text-gray-300 font-semibold">Order ID</th>
                                            <th className="py-3 px-4 text-gray-300 font-semibold">Customer</th>
                                            <th className="py-3 px-4 text-gray-300 font-semibold">Date</th>
                                            <th className="py-3 px-4 text-gray-300 font-semibold">Total</th>
                                            <th className="py-3 px-4 text-gray-300 font-semibold">Status</th>
                                            <th className="py-3 px-4 text-gray-300 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr
                                                key={order.orderId}
                                                className="border-b border-gray-700/30 hover:bg-gray-700/50 transition-all duration-200"
                                            >
                                                <td className="py-4 px-4 text-white">#{order.orderId}</td>
                                                <td className="py-4 px-4 text-white">{order.customer}</td>
                                                <td className="py-4 px-4 text-gray-400">
                                                    {new Date(order.timestamp).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </td>
                                                <td className="py-4 px-4 text-white">
                                                    ${typeof order.total === 'number' ? order.total.toFixed(2) : (typeof order.total === 'string' ? parseFloat(order.total).toFixed(2) : 'N/A')}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                                                        className="p-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <button
                                                        onClick={() => handleViewDetails(order.orderId)}
                                                        className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-600/30 hover:border-blue-600/50 rounded-lg transition-all duration-200"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Order Details Modal */}
                    {selectedOrder && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 max-w-lg w-full mx-4">
                                <h2 className="text-2xl font-semibold text-white mb-6">Order Details - #{selectedOrder.orderId}</h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Customer</p>
                                        <p className="text-white">{selectedOrder.customer} ({selectedOrder.customerEmail})</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Date</p>
                                        <p className="text-white">
                                            {new Date(selectedOrder.timestamp).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Status</p>
                                        <p className="text-white">{selectedOrder.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Shipping</p>
                                        <p className="text-white">{JSON.stringify(selectedOrder.shipping)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Payment</p>
                                        <p className="text-white">{JSON.stringify(selectedOrder.payment)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Items</p>
                                        <div className="space-y-2 mt-2">
                                            {selectedOrder.items.map((item) => (
                                                <div key={item.orderItemId} className="flex justify-between bg-gray-700/30 p-3 rounded-xl">
                                                    <div>
                                                        <p className="text-white">Product ID: {item.productId}</p>
                                                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                                    </div>

                                                    <p className="text-white">${typeof item.price === 'number' ? item.price.toFixed(2) : (typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : 'N/A')}</p>
                                                </div>

                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Total</p>
                                        <p className="text-white font-semibold">
                                            ${typeof selectedOrder.total === 'number' ? selectedOrder.total.toFixed(2) : (typeof selectedOrder.total === 'string' ? parseFloat(selectedOrder.total).toFixed(2) : 'N/A')}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="w-full bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-gray-200 border border-gray-600/50 hover:border-gray-600/70 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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

export default OrderManagement;