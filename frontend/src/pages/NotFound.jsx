import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found page
 */
const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12 text-center">
            <div className="container mx-auto max-w-md">
                <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
                <Link to="/">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        Back to Home
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;