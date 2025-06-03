import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import Button from '../components/Button';

/**
 * Order page for viewing details of a specific order
 */
const Order = () => {
    const { orderId } = useParams(); // Get orderId from URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Placeholder for GET /api/orders/:orderId
                const data = await api.getOrderById(orderId);
                setOrder(data);
            } catch (error) {
                console.error(error.error || 'Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    // Mock data for now (replace with API response)
    const mockOrder = {
        id: orderId,
        date: 'May 27, 2025, 08:00 PM AEST',
        items: [
            { id: 1, title: 'Laptop Pro', price: 999.99, quantity: 1, image: 'https://via.placeholder.com/100x100?text=Laptop' },
            { id: 2, title: 'Smartphone X', price: 699.99, quantity: 2, image: 'https://via.placeholder.com/100x100?text=Phone' },
        ],
        total: 2399.97, // 999.99 + (699.99 * 2)
        status: 'Delivered',
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Order Details - #{mockOrder.id}</h1>
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                    {/* Order Summary */}
                    <div className="mb-6">
                        <p className="text-lg font-semibold">Order Date: <span className="font-normal">{mockOrder.date}</span></p>
                        <p className="text-lg font-semibold">Status: <span className={`font-normal ${mockOrder.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{mockOrder.status}</span></p>
                        <p className="text-lg font-semibold">Total: <span className="font-normal">${mockOrder.total.toFixed(2)}</span></p>
                    </div>

                    {/* Order Items */}
                    <div className="border-t pt-4">
                        <h2 className="text-xl font-semibold mb-4">Items</h2>
                        {mockOrder.items.map((item) => (
                            <div key={item.id} className="flex items-center mb-4 border-b pb-4">
                                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded mr-4" />
                                <div className="flex-1">
                                    <Link to={`/product-details/${item.id}`} className="text-lg font-medium text-blue-500 hover:underline">
                                        {item.title}
                                    </Link>
                                    <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-gray-600">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center space-x-4 mt-6">
                        <Link to="/order-history">
                            <Button className="bg-blue-500 hover:bg-blue-600">Back to Order History</Button>
                        </Link>
                        <Link to="/">
                            <Button className="bg-gray-500 hover:bg-gray-600">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;