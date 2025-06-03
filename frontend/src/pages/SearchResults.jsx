import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

/**
 * Search results page
 */
const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q') || '';

    useEffect(() => {
        // Placeholder for GET /api/products?search={query}
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts({ search: query });
                setProducts(data);
            } catch (error) {
                console.error(error.error || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [query]);

    // Mock data for now
    const mockProducts = [
        { id: 1, title: `${query} Result 1`, price: 199.99, image: `https://via.placeholder.com/300x200?text=${query} 1` },
        { id: 2, title: `${query} Result 2`, price: 299.99, image: `https://via.placeholder.com/300x200?text=${query} 2` },
    ];
    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Search Results for "{query}"</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard
                                key={product.id}
                                title={product.title}
                                price={product.price}
                                image={product.image}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No results found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;