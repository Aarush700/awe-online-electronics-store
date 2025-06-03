import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from '../components/Navbar';

const OrderConfirmation = () => {
    const location = useLocation(); // Use the hook to get location
    const order = location.state?.order; // Access state safely
    const orderId = location.state?.orderId;

    if (!orderId || !order) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12">
                <div className="text-center text-white">
                    <p className="text-lg">No order details available.</p>
                    <Link to="/" className="mt-4 inline-block text-yellow-400 hover:text-yellow-300">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
                    <p className="text-lg mb-2">Thank you for your purchase.</p>
                    <p className="text-lg mb-2">Order Number: #{orderId}</p>
                    <p className="text-lg mb-4">Total: ${order.total}</p>
                    <Link to="/order-history" className="mt-6 inline-block text-yellow-400 hover:text-yellow-300">
                        View Order History
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;