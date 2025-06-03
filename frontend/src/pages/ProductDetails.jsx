import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api.jsx';
import Button from '../components/Button.jsx';
import Alert from '../components/Alert.jsx';

/**
 * Product details page
 */
const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await api.getProduct(productId);
                setProduct({
                    ...data,
                    price: Number(data.price),
                    original_price: data.original_price ? Number(data.original_price) : undefined,
                    discount_percentage: data.discount_percentage ? Number(data.discount_percentage) : 0,
                    rating: data.rating ? Number(data.rating) : undefined,
                });
            } catch (error) {
                console.error('Failed to fetch product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
        setTimeout(() => {
            setAlertVisible(false);
        }, 4000);
    };

    const handleQuantityChange = (change) => {
        setQuantity(prev => Math.max(1, prev + change));
    };

    const handleAddToCart = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                showAlert('Please log in to add items to your cart.', 'error');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }
            await api.addToCart(userId, { productId: Number(productId), quantity });
            window.dispatchEvent(new Event('cartUpdated'));
            showAlert(`${quantity} x ${product?.title || 'Product'} added to cart successfully!`, 'success');
        } catch (err) {
            console.error('Error adding to cart:', err);
            showAlert(`Failed to add to cart: ${err.details || err.error || 'Unknown error'}`, 'error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-4 text-lg text-gray-600">Loading product...</span>
                    </div>
                </div>
            </div>
        );
    }

    const mockProduct = {
        productId,
        title: `Product ${productId}`,
        price: 199.99,
        original_price: 249.99,
        discount_percentage: 20,
        description: 'High-quality electronic device with advanced features and modern design.',
        image: `https://via.placeholder.com/400x300?text=Product ${productId}`,
        rating: 4.5,
    };
    const displayProduct = product || mockProduct;

    const imageUrl = displayProduct.image.startsWith('http')
        ? displayProduct.image
        : `http://127.0.0.1:5000${displayProduct.image}`;

    const isOnSale = displayProduct.discount_percentage > 0 && displayProduct.original_price;
    const savings = isOnSale ? displayProduct.original_price - displayProduct.price : 0;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            {/* Custom Alert Component */}
            {alertVisible && (
                <div className={`fixed top-4 right-4 z-50 max-w-md w-full mx-4 transform transition-all duration-300 ${alertVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    }`}>
                    <div className={`rounded-lg shadow-lg border-l-4 p-4 ${alertType === 'success'
                            ? 'bg-green-50 border-green-400 text-green-700'
                            : 'bg-red-50 border-red-400 text-red-700'
                        }`}>
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {alertType === 'success' ? (
                                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium">{alertMessage}</p>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                                <button
                                    onClick={() => setAlertVisible(false)}
                                    className={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${alertType === 'success'
                                            ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                                            : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 max-w-6xl">
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li><Link to="/products" className="hover:text-blue-600">Products</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li className="text-gray-900 font-medium">{displayProduct.title}</li>
                    </ol>
                </nav>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="relative p-8">
                            {isOnSale && (
                                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                    {displayProduct.discount_percentage}% OFF
                                </div>
                            )}
                            <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt={displayProduct.title}
                                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                        console.error('Image load error:', imageUrl);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-8">
                            {displayProduct.rating && (
                                <div className="flex items-center mb-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(displayProduct.rating) ? 'fill-current' : 'fill-gray-200'}`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.951.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-2">
                                        {displayProduct.rating} ({Math.floor(Math.random() * 200) + 50} reviews)
                                    </span>
                                </div>
                            )}

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {displayProduct.title}
                            </h1>

                            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                                {displayProduct.description}
                            </p>

                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ${Number(displayProduct.price).toFixed(2)}
                                    </span>
                                    {isOnSale && (
                                        <span className="text-xl text-gray-500 line-through">
                                            ${Number(displayProduct.original_price).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {isOnSale && (
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                                            Save ${Number(savings).toFixed(2)} ({displayProduct.discount_percentage}%)
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="w-16 text-center text-lg font-semibold bg-gray-50 py-2 rounded-lg">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    onClick={handleAddToCart}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 2.5M7 13l2.5 2.5M16 8h.01M19 8h.01" />
                                        </svg>
                                        Add to Cart - ${(Number(displayProduct.price) * quantity).toFixed(2)}
                                    </div>
                                </Button>

                                <button className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 0 4.5 4.5 0 010 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                                        </svg>
                                        Add to Wishlist
                                    </div>
                                </button>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Features</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Free shipping on orders over $50
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        30-day return policy
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        1-year warranty included
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        24/7 customer support
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;