import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import Alert from '../components/Alert';
import api from '../api/api';

/**
 * Home page with a hero section, featured products, offers, testimonials, and more
 */
const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const productsPerPage = 3; // Show 3 products per page

    useEffect(() => {
        // Fetch featured products
        const fetchFeaturedProducts = async () => {
            try {
                console.log('Fetching featured products...');
                const data = await api.getProducts(); // Replace with /api/products/featured if available
                setFeaturedProducts(data.map(product => ({
                    ...product,
                    productId: product.productId || product.id,
                    price: Number(product.price),
                    image: product.image.startsWith('http') ? product.image : `http://127.0.0.1:5000${product.image}`,
                    rating: product.rating ? Number(product.rating) : 4.0,
                })) || []);
            } catch (error) {
                console.error('Failed to fetch featured products:', error.message || error);
                showAlert('Failed to load featured products. Displaying sample products.', 'error');
                setFeaturedProducts(mockProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedProducts();
    }, []);

    // Show alert message
    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
        setTimeout(() => {
            setAlertVisible(false);
        }, 4000);
    };

    // Mock data as fallback
    const mockProducts = [
        { productId: 1, title: 'Laptop Pro', price: 999.99, image: 'https://via.placeholder.com/300x200?text=Laptop', rating: 4.5 },
        { productId: 2, title: 'Smartphone X', price: 699.99, image: 'https://via.placeholder.com/300x200?text=Phone', rating: 4.0 },
        { productId: 3, title: 'Wireless Headphones', price: 149.99, image: 'https://via.placeholder.com/300x200?text=Headphones', rating: 4.8 },
    ];
    const mockOffers = [
        { id: 1, title: '20% Off Laptops', description: 'Limited time offer! Get the latest laptops at unbeatable prices.' },
        { id: 2, title: 'Free Shipping', description: 'On orders over $50. Shop now and save!' },
    ];
    const mockTestimonials = [
        { id: 1, name: 'Jane Doe', text: 'Amazing selection and lightning-fast delivery. Highly recommend!' },
        { id: 2, name: 'John Smith', text: 'The best electronics store I’ve ever shopped at. Great quality!' },
    ];

    // Pagination logic
    const totalProducts = featuredProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = featuredProducts.slice(startIndex, endIndex);

    // Handle page navigation
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-4 text-lg text-gray-600">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            {/* Alert Component */}
            {alertVisible && (
                <div className={`fixed top-4 right-4 z-50 max-w-md w-full mx-4 transform transition-all duration-300 ${alertVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                    <Alert
                        message={alertMessage}
                        type={alertType}
                        onClose={() => setAlertVisible(false)}
                    />
                </div>
            )}

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Breadcrumb Navigation */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                    </ol>
                </nav>

                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-xl overflow-hidden py-20 mb-12">
                    <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x600?text=Hero+Image')] bg-cover bg-center opacity-20"></div>
                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">Welcome to AWEStore</h1>
                        <p className="text-lg md:text-xl text-gray-100 mb-4">Your Ultimate Electronics Destination</p>
                        <p className="text-sm md:text-md text-gray-200 mb-6">Discover cutting-edge Laptops, Smartphones, Headphones, and Smart Home Devices.</p>
                        <p className="text-sm md:text-md text-gray-200 mb-8">Special Offer: Get 15% off your first purchase until July 11, 2025!</p>
                        <p className="text-sm md:text-md text-gray-200 mb-8">Current Time: 01:38 AM AEST, Sunday, June 01, 2025</p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/products">
                                <Button
                                    className="bg-white text-blue-700 font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Shop Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Featured Products</h2>
                    {featuredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📦</div>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No featured products available</h2>
                            <p className="text-gray-500">Check back later for new arrivals!</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {currentProducts.map((product) => (
                                    <Link
                                        to={`/product-details/${product.productId}`}
                                        key={product.productId}
                                        className="block transform transition-transform hover:scale-105"
                                    >
                                        <ProductCard
                                            title={product.title}
                                            price={product.price}
                                            image={product.image}
                                            rating={product.rating}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200"
                                            onImageError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                                console.error('Image load error:', product.image);
                                            }}
                                        />
                                    </Link>
                                ))}
                            </div>
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                                    <Button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <Button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === page
                                                    ? 'bg-blue-500 text-white shadow-lg'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                                    }`}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
                                            }`}
                                    >
                                        Next
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Button>
                                </div>
                            )}
                            <div className="text-center mt-8">
                                <Link to="/products">
                                    <Button
                                        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
                                    >
                                        View All Products
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </section>

                {/* Special Offers */}
                <section className="py-16 bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Special Offers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {mockOffers.map((offer) => (
                                <div
                                    key={offer.id}
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{offer.title}</h3>
                                    <p className="text-gray-600">{offer.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Our Customers Say</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {mockTestimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
                                >
                                    <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                                    <p className="font-semibold text-blue-600">{testimonial.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;