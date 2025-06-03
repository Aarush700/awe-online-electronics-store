import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

/**
 * Search results page
 */
const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            if (!query.trim()) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                console.log('Searching for:', query);
                const data = await api.searchProducts(query);
                console.log('Search results:', data);
                setProducts(data || []);
            } catch (error) {
                console.error('Search error:', error);
                setError(error.error || 'Failed to fetch search results');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="container mx-auto">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Searching...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="container mx-auto">
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">Error: {error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Search Results for "{query}"
                </h1>

                {!query.trim() ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Please enter a search term.</p>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <p className="text-center text-gray-600 mb-8">
                            Found {products.length} result{products.length !== 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <Link
                                    key={product.productId}
                                    to={`/product-details/${product.productId}`}
                                    className="block transform transition-transform hover:scale-105"
                                >
                                    <ProductCard
                                        id={product.productId}
                                        title={product.title}
                                        price={product.price}
                                        original_price={product.original_price}
                                        discount_percentage={product.discount_percentage || 0}
                                        rating={product.rating || 4.0}
                                        image={product.image}
                                        description={product.description}
                                    />
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600">
                            No products found for "{query}". Try searching with different keywords.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;