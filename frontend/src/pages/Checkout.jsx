import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import api from '../api/api';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shippingForm, setShippingForm] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    });
    const [paymentForm, setPaymentForm] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardName: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('Please log in to proceed to checkout.');
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

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingForm((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForms = () => {
        const errors = {};

        if (!shippingForm.fullName.trim()) errors.fullName = 'Full name is required';
        if (!shippingForm.address.trim()) errors.address = 'Address is required';
        if (!shippingForm.city.trim()) errors.city = 'City is required';
        if (!shippingForm.state.trim()) errors.state = 'State is required';
        if (!shippingForm.zip.trim()) errors.zip = 'ZIP code is required';
        else if (!/^\d{5}$/.test(shippingForm.zip)) errors.zip = 'Invalid ZIP code (5 digits)';
        if (!shippingForm.country.trim()) errors.country = 'Country is required';

        if (!paymentForm.cardNumber.trim()) errors.cardNumber = 'Card number is required';
        else if (!/^\d{16}$/.test(paymentForm.cardNumber.replace(/\s/g, '')))
            errors.cardNumber = 'Invalid card number (16 digits)';
        if (!paymentForm.expiry.trim()) errors.expiry = 'Expiry date is required';
        else if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiry)) errors.expiry = 'Invalid expiry (MM/YY)';
        if (!paymentForm.cvv.trim()) errors.cvv = 'CVV is required';
        else if (!/^\d{3,4}$/.test(paymentForm.cvv)) errors.cvv = 'Invalid CVV (3-4 digits)';
        if (!paymentForm.cardName.trim()) errors.cardName = 'Name on card is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!validateForms()) {
            alert('Please fix the form errors before proceeding.');
            return;
        }

        try {
            const order = {
                userId: localStorage.getItem('userId'),
                items: cartItems,
                total: total.toFixed(2),
                shipping: shippingForm,
                payment: {
                    cardName: paymentForm.cardName,
                    last4: paymentForm.cardNumber.slice(-4),
                },
                timestamp: new Date().toISOString(),
            };
            console.log('Sending order:', order);
            const response = await api.placeOrder(order);
            console.log('Order placed:', response);

            navigate('/order-confirmation', { state: { orderId: response.orderId, order } });
        } catch (error) {
            console.error('Checkout failed:', error);
            setError('Failed to place order. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-red-600 text-lg font-medium">{error}</p>
                    <Link to="/login" className="mt-4 inline-block text-blue-600 hover:underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Checkout</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                        <p className="text-gray-600 mb-8">Add items to proceed with checkout.</p>
                        <Link to="/products" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={shippingForm.fullName}
                                            onChange={handleShippingChange}
                                            className={`mt-1 block w-full border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500`}
                                            placeholder="John Doe"
                                        />
                                        {formErrors.fullName && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingForm.address}
                                            onChange={handleShippingChange}
                                            className={`mt-1 block w-full border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500`}
                                            placeholder="123 Main St"
                                        />
                                        {formErrors.address && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingForm.city}
                                            onChange={handleShippingChange}
                                            className={`mt-1 block w-full border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500`}
                                            placeholder="New York"
                                        />
                                        {formErrors.city && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shippingForm.state}
                                            onChange={handleShippingChange}
                                            className={`mt-1 block w-full border ${formErrors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500`}
                                            placeholder="NY"
                                        />
                                        {formErrors.state && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={shippingForm.zip}
                                            onChange={handleShippingChange}
                                            className={`mt-1 block w-full border ${formErrors.zip ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500`}
                                            placeholder="10001"
                                        />
                                        {formErrors.zip && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.zip}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={shippingForm.country}
                                            onChange={handleShippingChange}
                                            className={`mt-1 block w-full border ${formErrors.country ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500`}
                                            placeholder="United States"
                                        />
                                        {formErrors.country && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Information</h2>
                                <form className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={paymentForm.cardNumber}
                                            onChange={handlePaymentChange}
                                            className={`mt-1 block w-full border ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500`}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                        />
                                        {formErrors.cardNumber && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={paymentForm.expiry}
                                                onChange={handlePaymentChange}
                                                className={`mt-1 block w-full border ${formErrors.expiry ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                            />
                                            {formErrors.expiry && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.expiry}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">CVV</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={paymentForm.cvv}
                                                onChange={handlePaymentChange}
                                                className={`mt-1 block w-full border ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="123"
                                                maxLength="4"
                                            />
                                            {formErrors.cvv && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name on Card</label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            value={paymentForm.cardName}
                                            onChange={handlePaymentChange}
                                            className={`mt-1 block w-full border ${formErrors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500`}
                                            placeholder="John Doe"
                                        />
                                        {formErrors.cardName && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.cardName}</p>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Items</h2>
                                {cartItems.map((item) => (
                                    <div key={item.cartItemId} className="flex items-center mb-6 border-b border-gray-200 pb-4">
                                        <div className="flex-1">
                                            <span className="text-lg font-medium text-gray-800">{item.title}</span>
                                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                                            <p className="text-gray-600">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
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
                                <Button
                                    onClick={handleCheckout}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold text-lg"
                                >
                                    Place Order
                                </Button>
                                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                                    <Link
                                        to="/cart"
                                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                        </svg>
                                        Back to Cart
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

export default Checkout;