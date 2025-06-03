import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import api from '../api/api';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const updateUserStatus = () => {
        const userId = localStorage.getItem('userId');
        const staffId = localStorage.getItem('staffId');
        if (staffId) {
            console.log('Staff logged in:', staffId); // Debug log
            setUser({ type: 'staff', id: staffId });
        } else if (userId) {
            console.log('User logged in:', userId); // Debug log
            setUser({ type: userId.startsWith('guest') ? 'guest' : 'customer', id: userId });
        } else {
            console.log('No user logged in'); // Debug log
            setUser(null);
            setCartItems(0); // Reset cart count when logged out
        }
    };

    const fetchCartCount = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setCartItems(0);
            return;
        }
        try {
            console.log('Fetching cart for user:', userId);
            const cart = await api.getCart(userId);
            console.log('Fetched cart items:', cart);
            setCartItems(cart.length);
        } catch (error) {
            console.error('Failed to fetch cart count:', error);
            setCartItems(0);
        }
    };

    useEffect(() => {
        updateUserStatus();
        fetchCartCount();

        const handleAuthUpdated = () => {
            console.log('authUpdated event received'); // Debug log
            updateUserStatus();
            fetchCartCount();
        };

        const handleCartUpdated = () => {
            console.log('cartUpdated event received'); // Debug log
            fetchCartCount();
        };

        window.addEventListener('authUpdated', handleAuthUpdated);
        window.addEventListener('cartUpdated', handleCartUpdated);

        return () => {
            window.removeEventListener('authUpdated', handleAuthUpdated);
            window.removeEventListener('cartUpdated', handleCartUpdated);
        };
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            try {
                console.log('Initiating search for query:', searchQuery);
                navigate(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
                setSearchQuery('');
                setIsOpen(false);
            } catch (error) {
                console.error('Search navigation failed:', error);
                alert('Failed to initiate search. Please try again.');
            }
        } else {
            console.log('Search query is empty');
            alert('Please enter a search query.');
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('staffId');
        localStorage.removeItem('staffRole');
        localStorage.removeItem('token');
        setUser(null);
        setCartItems(0);
        navigate('/');
        setIsOpen(false);
        setIsDropdownOpen(false);
        window.dispatchEvent(new Event('authUpdated'));
    };

    return (
        <nav className="bg-black text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center group">
                    <div className="relative mr-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                            <svg
                                className="w-6 h-6 text-white drop-shadow-md"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.52 17.02 11 21 11 21z" />
                            </svg>
                        </div>
                        <div className="absolute inset-0 w-12 h-12 bg-yellow-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-md"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300 tracking-tight">
                            AWEStore
                        </span>
                        <span className="text-xs text-gray-400 font-medium tracking-wider -mt-1">
                            ELECTRONICS & MORE
                        </span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="flex items-center space-x-1 hover:text-yellow-300 transition duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5v7h4v-7z" />
                        </svg>
                        <span>Home</span>
                    </Link>
                    <Link to="/products" className="flex items-center space-x-1 hover:text-yellow-300 transition duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span>Products</span>
                    </Link>
                    <Link to="/cart" className="flex items-center space-x-1 hover:text-yellow-300 transition duration-300 relative">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Cart</span>
                        {cartItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartItems}
                            </span>
                        )}
                    </Link>
                    <Link to="/checkout" className="flex items-center space-x-1 hover:text-yellow-300 transition duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M9 10V4a2 2 0 012-2h2a2 2 0 012 2v6m-6 4h6m-3 4v4" />
                        </svg>
                        <span>Checkout</span>
                    </Link>
                    <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-full p-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="bg-transparent text-white placeholder-gray-500 p-2 rounded-l-full focus:outline-none w-40"
                        />
                        <Button type="submit" className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Button>
                    </form>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-1 hover:text-yellow-300 transition duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Account</span>
                                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-10">
                                    {user.type === 'customer' && (
                                        <>
                                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setIsDropdownOpen(false)}>
                                                Profile
                                            </Link>
                                            <Link to="/order-history" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setIsDropdownOpen(false)}>
                                                Order History
                                            </Link>
                                        </>
                                    )}
                                    {user.type === 'staff' && (
                                        <>
                                            <Link to="/staff/dashboard" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setIsDropdownOpen(false)}>
                                                Dashboard
                                            </Link>
                                            <Link to="/order-management" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setIsDropdownOpen(false)}>
                                                Order Management
                                            </Link>
                                            <Link to="/product-management" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setIsDropdownOpen(false)}>
                                                Product Management
                                            </Link>
                                        </>
                                    )}
                                    <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-700">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Link to="/login" className="flex items-center space-x-1 hover:text-yellow-300 transition duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Customer Login</span>
                            </Link>
                            <Link to="/staff/login" className="flex items-center space-x-1 hover:text-yellow-300 transition duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>Staff Login</span>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-gray-900 p-4 shadow-md">
                    <form onSubmit={handleSearch} className="mb-4 flex items-center bg-gray-800 rounded-full p-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="bg-transparent text-white placeholder-gray-500 p-2 rounded-l-full focus:outline-none w-full"
                        />
                        <Button type="submit" className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Button>
                    </form>

                    <div className="flex flex-col space-y-3">
                        <Link to="/" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => setIsOpen(false)}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5v7h4v-7z" />
                            </svg>
                            <span>Home</span>
                        </Link>
                        <Link to="/products" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => setIsOpen(false)}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            <span>Products</span>
                        </Link>
                        <Link to="/cart" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300 relative" onClick={() => setIsOpen(false)}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Cart</span>
                            {cartItems > 0 && (
                                <span className="absolute left-5 top-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartItems}
                                </span>
                            )}
                        </Link>
                        <Link to="/checkout" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => setIsOpen(false)}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M9 10V4a2 2 0 012-2h2a2 2 0 012 2v6m-6 4h6m-3 4v4" />
                            </svg>
                            <span>Checkout</span>
                        </Link>

                        <div className="border-t border-gray-700 my-2"></div>

                        {user ? (
                            <>
                                {user.type === 'customer' && (
                                    <>
                                        <Link to="/profile" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => setIsOpen(false)}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Profile</span>
                                        </Link>
                                        <Link to="/order-history" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => setIsOpen(false)}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m-8 5h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                            </svg>
                                            <span>Order History</span>
                                        </Link>
                                    </>
                                )}
                                {user.type === 'staff' && (
                                    <>
                                        <Link to="/staff/dashboard" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => setIsOpen(false)}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                            </svg>
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link to="/order-management" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => setIsOpen(false)}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <span>Order Management</span>
                                        </Link>
                                        <Link to="/product-management" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => setIsOpen(false)}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                            <span>Product Management</span>
                                        </Link>
                                    </>
                                )}
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300 text-left">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => setIsOpen(false)}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Customer Login</span>
                                </Link>
                                <Link to="/staff/login" className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => setIsOpen(false)}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span>Staff Login</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;