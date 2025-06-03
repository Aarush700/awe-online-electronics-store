import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import api from '../api/api';

/**
 * Profile page for displaying and editing user information
 */
const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ name: '', email: '' });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const data = await api.getUserProfile(userId);
                    setUser(data);
                    setEditedUser({ name: data.name, email: data.email });
                } else {
                    setError('No user logged in.');
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                setError('Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const userId = localStorage.getItem('userId');
            await api.updateUserProfile(userId, editedUser);
            setUser({ ...user, ...editedUser });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setError('Failed to save changes.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authUpdated'));
        window.location.href = '/';
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-red-400 text-lg font-medium">{error}</p>
                    <Link to="/login" className="mt-4 inline-block text-yellow-400 hover:text-yellow-300">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                            Profile
                        </h1>
                        <p className="text-gray-400 text-lg">Manage your account information</p>
                    </div>

                    {user ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Card */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                                    {/* Avatar Section */}
                                    <div className="flex items-center space-x-6 mb-8">
                                        <div className="relative">
                                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                                <svg
                                                    className="w-10 h-10 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                                            <p className="text-gray-400">Active Member</p>
                                        </div>
                                    </div>

                                    {/* Profile Information */}
                                    {isEditing ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-300">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={editedUser.name}
                                                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                                        className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-300">Email Address</label>
                                                    <input
                                                        type="email"
                                                        value={editedUser.email}
                                                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                                                        className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                                <Button
                                                    onClick={handleSave}
                                                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                                                >
                                                    Save Changes
                                                </Button>
                                                <Button
                                                    onClick={() => setIsEditing(false)}
                                                    className="flex-1 bg-gray-600/50 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                                                    <p className="text-sm text-gray-400 mb-1">User ID</p>
                                                    <p className="text-white font-medium">{user.userId}</p>
                                                </div>
                                                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                                                    <p className="text-sm text-gray-400 mb-1">Full Name</p>
                                                    <p className="text-white font-medium">{user.name}</p>
                                                </div>
                                                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                                                    <p className="text-sm text-gray-400 mb-1">Email Address</p>
                                                    <p className="text-white font-medium">{user.email}</p>
                                                </div>
                                                {user.createdAt && (
                                                    <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                                                        <p className="text-sm text-gray-400 mb-1">Member Since</p>
                                                        <p className="text-white font-medium">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                                <Button
                                                    onClick={handleEdit}
                                                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                                                >
                                                    Edit Profile
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions Sidebar */}
                            <div className="space-y-6">
                                {/* Quick Actions */}
                                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                                    <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <Link
                                            to="/order-history"
                                            className="flex items-center p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl text-yellow-400 hover:text-yellow-300 transition-all duration-200 group"
                                        >
                                            <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-400/30 transition-colors">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium">Order History</p>
                                                <p className="text-sm text-gray-400">View past orders</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                {/* Account Management */}
                                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                                    <h3 className="text-xl font-semibold text-white mb-4">Account</h3>
                                    <Button
                                        onClick={handleLogout}
                                        className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-600/50 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-12 shadow-2xl">
                            <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4">No Profile Found</h3>
                            <p className="text-gray-400 mb-6">Please log in to view your profile information.</p>
                            <Link
                                to="/login"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 transform hover:scale-105"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;