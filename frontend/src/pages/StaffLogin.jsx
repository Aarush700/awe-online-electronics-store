import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';

const StaffLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.staffLogin(formData);
            localStorage.setItem('staffId', response.staffId);
            localStorage.setItem('staffRole', response.role); // Store the role
            setAlert({ message: 'Login successful', type: 'success' });
            // Dispatch authUpdated event to notify Navbar
            window.dispatchEvent(new Event('authUpdated'));
            navigate('/staff/dashboard');
        } catch (error) {
            console.error('Staff login error:', error);
            setAlert({ message: error.error || 'Failed to login', type: 'error' });
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Staff Login</h2>
                {alert && <Alert message={alert.message} type={alert.type} />}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <InputField
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                        Login
                    </Button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Not a staff member?{' '}
                    <Link to="/login" className="text-yellow-400 hover:text-yellow-300">
                        User Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default StaffLogin;