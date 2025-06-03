import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const api = {
    async signup(data) {
        try {
            const response = await axios.post(`${API_URL}/api/users`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Signup failed' };
        }
    },

    async login(data) {
        try {
            const response = await axios.post(`${API_URL}/api/login`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    },

    async staffLogin(data) {
        try {
            const response = await axios.post(`${API_URL}/api/staff/login`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Staff login failed' };
        }
    },

    async getProducts() {
        try {
            const response = await axios.get(`${API_URL}/api/products`);
            console.log('Get products response:', response.data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch products' };
        }
    },

    async getProduct(id) {
        try {
            const response = await axios.get(`${API_URL}/api/products/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: `Failed to fetch product ${id}` };
        }
    },

    async getProducts(params = {}) {
        try {
            // If search parameter is provided, redirect to searchProducts
            if (params.search) {
                console.warn('getProducts called with search param, redirecting to searchProducts');
                return await this.searchProducts(params.search);
            }

            const response = await axios.get(`${API_URL}/api/products`);
            console.log('Get products response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get products error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to fetch products' };
        }
    },

    async searchProducts(query) {
        try {
            if (!query || !query.trim()) {
                console.log('Empty search query, returning empty array');
                return [];
            }

            console.log('Searching products with query:', query);
            const response = await axios.get(`${API_URL}/api/search`, {
                params: { q: query.trim() }
            });

            console.log('Search API response:', response.data, 'Query:', query);

            // Ensure we always return an array
            const results = Array.isArray(response.data) ? response.data : [];
            console.log(`Search returned ${results.length} results`);

            return results;
        } catch (error) {
            console.error('Search API error:', error.response?.data || error.message);

            // For search, we can return empty array on error instead of throwing
            // This provides better UX - user sees "no results" instead of error
            if (error.response?.status === 404 || error.response?.status === 400) {
                console.log('Search returned no results or bad request, returning empty array');
                return [];
            }

            throw error.response?.data || { error: 'Failed to search products' };
        }
    },

    async getCart(userId) {
        try {
            const response = await axios.get(`${API_URL}/api/cart`, {
                params: { userId },
                headers: { 'X-User-ID': userId }
            });
            console.log('Get cart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Fetch cart error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to fetch cart' };
        }
    },

    async addToCart(userId, item) {
        try {
            console.log('Sending addToCart request:', { userId, item });
            const response = await axios.post(`${API_URL}/api/cart`, {
                userId,
                productId: Number(item.productId),
                quantity: item.quantity || 1
            });
            console.log('Add to cart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Add to cart error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            throw error.response?.data || { error: 'Failed to add to cart', details: error.message };
        }
    },

    async updateCartItem(userId, productId, quantity) {
        try {
            const response = await axios.put(`${API_URL}/api/cart-items/${productId}`, {
                userId,
                quantity
            });
            console.log('Update cart item response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Update cart item error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to update cart item' };
        }
    },

    async removeCartItem(userId, productId) {
        try {
            const response = await axios.delete(`${API_URL}/api/cart-items/${productId}`, {
                params: { userId }
            });
            console.log('Remove cart item response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Remove cart item error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to remove cart item' };
        }
    },

    async clearCart(userId) {
        try {
            const response = await axios.delete(`${API_URL}/api/cart`, {
                params: { userId }
            });
            console.log('Clear cart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Clear cart error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to clear cart' };
        }
    },

    async getUserProfile(userId) {
        try {
            const response = await axios.get(`${API_URL}/api/users/${userId}`);
            console.log('Get user profile response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get user profile error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to fetch user profile' };
        }
    },

    async updateUserProfile(userId, data) {
        try {
            const response = await axios.put(`${API_URL}/api/users/${userId}`, data);
            console.log('Update user profile response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Update user profile error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to update user profile' };
        }
    },

    async placeOrder(data) {
        try {
            const response = await axios.post(`${API_URL}/api/checkout`, data);
            console.log('Place order response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Place order error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to place order' };
        }
    },

    async getOrderHistory(userId) {
        try {
            const response = await axios.get(`${API_URL}/api/orders`, {
                params: { userId },
                headers: { 'X-User-ID': userId }
            });
            console.log('Get order history response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get order history error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to fetch order history' };
        }
    },

    async getOrderDetails(userId, orderId) {
        try {
            const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
                params: { userId },
                headers: { 'X-User-ID': userId }
            });
            console.log('Get order details response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get order details error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to fetch order details' };
        }
    },

    async getStaffList(staffId) {
        try {
            const response = await axios.get(`${API_URL}/api/staff`, {
                params: { staffId },
                headers: { 'X-Staff-ID': staffId }
            });
            console.log('Get staff list response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get staff list error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to fetch staff list' };
        }
    },

    async createStaff(data, staffId) {
        try {
            const response = await axios.post(`${API_URL}/api/staff`, data, {
                params: { staffId },
                headers: { 'X-Staff-ID': staffId }
            });
            console.log('Create staff response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Create staff error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to create staff' };
        }
    },

    async updateStaff(staffId, data, adminStaffId) {
        try {
            const response = await axios.put(`${API_URL}/api/staff/${staffId}`, data, {
                params: { staffId: adminStaffId },
                headers: { 'X-Staff-ID': adminStaffId }
            });
            console.log('Update staff response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Update staff error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to update staff' };
        }
    },

    async deleteStaff(staffId, adminStaffId) {
        try {
            const response = await axios.delete(`${API_URL}/api/staff/${staffId}`, {
                params: { staffId: adminStaffId },
                headers: { 'X-Staff-ID': adminStaffId }
            });
            console.log('Delete staff response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Delete staff error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to delete staff' };
        }
    },

    async getOrders(staffId) {
        try {
            const response = await axios.get(`${API_URL}/api/orders/all`, {
                params: { staffId },
                headers: { 'X-Staff-ID': staffId }
            });
            console.log('Get orders response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get orders error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to fetch orders' };
        }
    },

    async getOrderDetailsByStaff(staffId, orderId) {
        try {
            const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
                params: { staffId },
                headers: { 'X-Staff-ID': staffId }
            });
            console.log('Get order details response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Get order details error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to fetch order details' };
        }
    },

    async updateOrderStatus(orderId, status, staffId) {
        try {
            const response = await axios.put(`${API_URL}/api/orders/${orderId}`, { status }, {
                params: { staffId },
                headers: { 'X-Staff-ID': staffId }
            });
            console.log('Update order status response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Update order status error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to update order status' };
        }
    },

    async addProduct(staffId, productData) {
        try {
            // Ensure numeric fields are numbers
            const sanitizedData = {
                ...productData,
                price: parseFloat(productData.price) || 0,
                rating: parseFloat(productData.rating) || 0.0,
                discount_percentage: parseFloat(productData.discount_percentage) || 0.00,
                original_price: parseFloat(productData.original_price) || 0.00,
                categoryId: productData.categoryId ? parseInt(productData.categoryId, 10) : null,
            };
            console.log('Sending product data to', `${API_URL}/api/products`, sanitizedData); // Debug log with full URL
            const response = await axios.post(`${API_URL}/api/products`, sanitizedData, { params: { staffId } });
            console.log('Response from /api/products:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Failed to add product:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            throw { error: error.response?.data?.error || 'Failed to add product' };
        }
    },
};

export default api;