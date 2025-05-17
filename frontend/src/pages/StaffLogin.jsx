import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';

// Staff login page
const StaffLogin = () => {
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
            const response = await api.staffLogin(formData);
            localStorage.setItem('staffId', response.staffId);
            localStorage.setItem('token', response.token);
            setAlert({ message: 'Staff login successful', type: 'success' });
            setTimeout(() => navigate('/staff/dashboard'), 1000);
        } catch (error) {
            setAlert({ message: error.error || 'Staff login failed', type: 'error' });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl mb-6 text-center">Staff Login</h2>
            {alert && <Alert message={alert.message} type={alert.type} />}
            <form onSubmit={handleSubmit}>
                <InputField
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    error={errors.email}
                />
                <InputField
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    error={errors.password}
                />
                <Button type="submit">Login</Button>
            </form>
            <p className="mt-4 text-center">
                Customer? <Link to="/login" className="text-blue-500">Customer Login</Link>
            </p>
        </div>
    );
};

export default StaffLogin;