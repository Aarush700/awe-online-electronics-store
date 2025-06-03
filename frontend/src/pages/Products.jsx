import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

/**
 * Products page for browsing all products
 */
const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('name'); // name, price-low, price-high, rating
    const [filterBy, setFilterBy] = useState('all'); // all, on-sale, high-rated
    const productsPerPage = 6; // Show 6 products per page

    useEffect(() => {
        // Fetch all products from API
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data || []);
            } catch (error) {
                console.error(error.error || 'Failed to fetch products');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter products
    const filteredProducts = products.filter(product => {
        if (filterBy === 'on-sale') {
            return product.discount_percentage > 0;
        }
        if (filterBy === 'high-rated') {
            return product.rating >= 4.5;
        }
        return true; // 'all'
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'name':
            default:
                return a.title.localeCompare(b.title);
        }
    });

    // Pagination logic
    const totalProducts = sortedProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

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

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [sortBy, filterBy]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-4 text-lg text-gray-600">Loading products...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our amazing collection of electronics and gadgets
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No products available</h2>
                        <p className="text-gray-500">Check back later for new arrivals!</p>
                    </div>
                ) : (
                    <>
                        {/* Filter and Sort Controls */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Filter */}
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium text-gray-700">Filter:</label>
                                        <select
                                            value={filterBy}
                                            onChange={(e) => setFilterBy(e.target.value)}
                                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">All Products</option>
                                            <option value="on-sale">On Sale</option>
                                            <option value="high-rated">High Rated (4.5+)</option>
                                        </select>
                                    </div>

                                    {/* Sort */}
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium text-gray-700">Sort by:</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="name">Name A-Z</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="rating">Highest Rated</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600">
                                    Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
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
                                        original_price={product.original_price}
                                        discount_percentage={product.discount_percentage || 0}
                                        rating={product.rating || 4.0}
                                        image={product.image}
                                    />
                                </Link>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                                <button
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
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === page
                                                    ? 'bg-blue-500 text-white shadow-lg'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
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
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Back to Home Link */}
                <div className="text-center mt-16">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Products;