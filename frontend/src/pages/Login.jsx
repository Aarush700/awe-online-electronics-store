import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';

// Customer login page with guest login option
const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await api.login(formData);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('token', response.token);
            // Trigger Navbar re-render by dispatching the authUpdated event
            window.dispatchEvent(new Event('authUpdated'));
            setAlert({ message: 'Login successful', type: 'success' });
            setTimeout(() => navigate('/'), 1000);
        } catch (error) {
            setAlert({ message: error.error || 'Login failed', type: 'error' });
        }
    };

    const handleGuestLogin = () => {
        localStorage.setItem('userId', `guest-${Date.now()}`);
        // Trigger Navbar re-render by dispatching the authUpdated event
        window.dispatchEvent(new Event('authUpdated'));
        navigate('/');
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Customer Login</h2>
                {alert && <Alert message={alert.message} type={alert.type} />}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <InputField
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            error={errors.email}
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
                            placeholder="Password"
                            error={errors.password}
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
                <Button
                    onClick={handleGuestLogin}
                    className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                    Continue as Guest
                </Button>
                <p className="mt-4 text-center text-gray-400">
                    No account? <Link to="/signup" className="text-yellow-400 hover:text-yellow-300">Sign Up</Link>
                </p>
                <p className="mt-2 text-center text-gray-400">
                    Staff? <Link to="/staff/login" className="text-yellow-400 hover:text-yellow-300">Staff Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;