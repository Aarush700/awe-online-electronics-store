import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import api from '../api/api';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('Please log in to view your cart.');
                    setLoading(false);
                    return;
                }
                console.log('Fetching cart for user:', userId);
                const data = await api.getCart(userId);
                console.log('Fetched cart items:', data);
                setCartItems(data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
                setError(error.error || 'Failed to fetch cart');
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please log in to update your cart.');
                return;
            }
            await api.updateCartItem(userId, productId, newQuantity);
            const updatedCart = await api.getCart(userId);
            setCartItems(updatedCart);
        } catch (error) {
            console.error('Error updating cart:', error);
            alert('Failed to update cart item.');
        }
    };

    const removeItem = async (productId) => {
        try {
            const userId = localStorage.getItem('userId');
            await api.removeCartItem(userId, productId);
            const updatedCart = await api.getCart(userId);
            setCartItems(updatedCart);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error removing cart item:', error);
            alert('Failed to remove cart item.');
        }
    };

    const clearCart = async () => {
        try {
            const userId = localStorage.getItem('userId');
            await api.clearCart(userId);
            setCartItems([]);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error clearing cart:', error);
            alert('Failed to clear cart.');
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-red-600 text-lg font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h2>
                    <p className="text-gray-600">Review your items before checkout</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                        <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
                        <Link to="/products" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.cartItemId} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-6">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    to={`/product-details/${item.productId}`}
                                                    className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors block mb-2 truncate"
                                                >
                                                    {item.title}
                                                </Link>
                                                <p className="text-lg font-medium text-green-600 mb-4">${item.price.toFixed(2)}</p>

                                                <div className="flex flex-wrap items-center gap-3">
                                                    <div className="flex items-center bg-gray-100 rounded-lg">
                                                        <Button
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                            className="bg-transparent hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg border-none"
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="px-4 py-2 font-medium text-gray-800 min-w-[50px] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                            className="bg-transparent hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg border-none"
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        onClick={() => removeItem(item.productId)}
                                                        className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg border border-red-200 font-medium"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <p className="text-lg font-semibold text-gray-800">
                                                        Subtotal: <span className="text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between text-xl font-bold text-gray-800">
                                            <span>Total</span>
                                            <span className="text-blue-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link to="/checkout" className="block">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={clearCart}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
                                    >
                                        Clear Cart
                                    </Button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                                    <Link
                                        to="/products"
                                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                        </svg>
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;