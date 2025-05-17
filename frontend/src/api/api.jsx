import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

/**
 * API client for authentication endpoints
 */
const api = {

    //  @param {Object} data - { name, email, password }
    //  @returns {Promise} - { userId, message }
    async signup(data) {
        try {
            const response = await axios.post(`${API_URL}/api/users`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Signup failed' };
        }
    },


    //  @param {Object} data - { email, password }
    //  @returns {Promise} - { userId, token }
    async login(data) {
        try {
            const response = await axios.post(`${API_URL}/api/login`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    },


    //  Log in a staff member
    //  @param {Object} data - { email, password }
    //  @returns {Promise} - { staffId, token }

    async staffLogin(data) {
        try {
            const response = await axios.post(`${API_URL}/api/staff/login`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Staff login failed' };
        }
    },
};

export default api;