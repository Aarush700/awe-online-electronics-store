import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api/api';
import Navbar from '../components/Navbar';

/**
 * Category page for browsing products by category
 */
const Category = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Placeholder for GET /api/products?category={categoryName}
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts({ category: categoryName });
                setProducts(data);
            } catch (error) {
                console.error(error.error || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryName]);

    // Mock data for now
    const mockProducts = [
        { id: 1, title: `${categoryName} Item 1`, price: 199.99, image: `https://via.placeholder.com/300x200?text=${categoryName} 1` },
        { id: 2, title: `${categoryName} Item 2`, price: 299.99, image: `https://via.placeholder.com/300x200?text=${categoryName} 2` },
    ];
    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-12">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">{categoryName}</h1>
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
                            <p className="text-center text-gray-600">No products in this category.</p>
                        )}
                    </div>
                    <div className="text-center mt-6">
                        <Link to="/products" className="text-blue-500 hover:underline">Back to All Products</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;