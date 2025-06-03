import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Alert from '../components/Alert';
import Navbar from '../components/Navbar';

/**
 * Staff dashboard for admin staff management
 */
const StaffDashboard = () => {
    const [staffList, setStaffList] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff' });
    const [editData, setEditData] = useState(null); // For editing staff
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Current date and time
    const currentDateTime = new Date('2025-06-01T22:04:00+10:00').toLocaleString('en-AU', {
        timeZone: 'Australia/Sydney',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    // Fetch staff list
    useEffect(() => {
        const fetchStaffList = async () => {
            const staffId = localStorage.getItem('staffId');
            const staffRole = localStorage.getItem('staffRole');

            if (!staffId) {
                setError('Please log in to access the staff dashboard.');
                setLoading(false);
                navigate('/staff/login');
                return;
            }

            if (staffRole !== 'admin') {
                setError('Unauthorized: Admin access required.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.getStaffList(staffId);
                setStaffList(response);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch staff list:', error);
                setError(error.error || 'Failed to load staff list.');
            } finally {
                setLoading(false);
            }
        };
        fetchStaffList();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleCreateStaff = async (e) => {
        e.preventDefault();
        const staffId = localStorage.getItem('staffId');
        try {
            const response = await api.createStaff(formData, staffId);
            setAlert({ message: 'Staff created successfully', type: 'success' });
            // Fetch the updated staff list
            const updatedList = await api.getStaffList(staffId);
            setStaffList(updatedList);
            setFormData({ name: '', email: '', password: '', role: 'staff' });
        } catch (error) {
            console.error('Create staff error:', error);
            setAlert({ message: error.error || 'Failed to create staff', type: 'error' });
        }
    };

    const handleEditStaff = async (e) => {
        e.preventDefault();
        const staffId = localStorage.getItem('staffId');
        try {
            await api.updateStaff(editData.staffId, editData, staffId);
            setAlert({ message: 'Staff updated successfully', type: 'success' });
            // Fetch the updated staff list
            const updatedList = await api.getStaffList(staffId);
            setStaffList(updatedList);
            setEditData(null); // Close the modal
        } catch (error) {
            console.error('Update staff error:', error);
            setAlert({ message: error.error || 'Failed to update staff', type: 'error' });
        }
    };

    const handleDeleteStaff = async (staffIdToDelete) => {
        const staffId = localStorage.getItem('staffId');
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await api.deleteStaff(staffIdToDelete, staffId);
                setAlert({ message: 'Staff deleted successfully', type: 'success' });
                // Fetch the updated staff list
                const updatedList = await api.getStaffList(staffId);
                setStaffList(updatedList);
            } catch (error) {
                console.error('Delete staff error:', error);
                setAlert({ message: error.error || 'Failed to delete staff', type: 'error' });
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('staffId');
        localStorage.removeItem('staffRole');
        navigate('/staff/login');
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading staff dashboard...</p>
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
                    <Link to="/staff/login" className="mt-4 inline-block text-yellow-400 hover:text-yellow-300">
                        Go to Staff Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header with Date and Time */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                            Staff Dashboard
                        </h1>
                        <p className="text-gray-400 text-lg">Manage staff members and their roles</p>
                        <p className="text-gray-500 text-sm mt-2">{currentDateTime}</p>
                    </div>

                    {/* Alert */}
                    {alert && (
                        <div className="mb-8">
                            <Alert message={alert.message} type={alert.type} />
                        </div>
                    )}

                    {/* Create Staff Form */}
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-6">Create New Staff</h2>
                        <form onSubmit={handleCreateStaff} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <InputField
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter staff name"
                                        className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <InputField
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter staff email"
                                        className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                    <InputField
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                            >
                                Create Staff
                            </Button>
                        </form>
                    </div>

                    {/* Staff List */}
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-semibold text-white mb-6">Staff Members</h2>
                        {staffList.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-lg">No staff members found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {staffList.map((staff) => (
                                    <div
                                        key={staff.staffId}
                                        className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 hover:bg-gray-700/50 transition-all duration-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{staff.name}</p>
                                                <p className="text-gray-400 text-sm">{staff.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="text-right">
                                                <p className="text-gray-400 capitalize">Role: {staff.role}</p>
                                                <p className="text-gray-400 text-sm">
                                                    Created: {new Date(staff.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setEditData(staff)}
                                                className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-600/30 hover:border-blue-600/50 rounded-lg transition-all duration-200"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0l-1.414-1.414a2 2 0 010-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStaff(staff.staffId)}
                                                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-600/50 rounded-lg transition-all duration-200"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Edit Staff Modal */}
                    {editData && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 max-w-md w-full mx-4">
                                <h2 className="text-2xl font-semibold text-white mb-6">Edit Staff</h2>
                                <form onSubmit={handleEditStaff} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                        <InputField
                                            type="text"
                                            name="name"
                                            value={editData.name}
                                            onChange={handleEditChange}
                                            placeholder="Enter staff name"
                                            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                        <InputField
                                            type="email"
                                            name="email"
                                            value={editData.email}
                                            onChange={handleEditChange}
                                            placeholder="Enter staff email"
                                            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Password (optional)</label>
                                        <InputField
                                            type="password"
                                            name="password"
                                            value={editData.password || ''}
                                            onChange={handleEditChange}
                                            placeholder="Enter new password (optional)"
                                            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                        <select
                                            name="role"
                                            value={editData.role}
                                            onChange={handleEditChange}
                                            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                                        >
                                            <option value="staff">Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="flex space-x-4">
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                                        >
                                            Update Staff
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setEditData(null)}
                                            className="flex-1 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-gray-200 border border-gray-600/50 hover:border-gray-600/70 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Logout Button */}
                    <div className="mt-8 text-center">
                        <Button
                            onClick={handleLogout}
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-600/50 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
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
        </div>
    );
};

export default StaffDashboard;