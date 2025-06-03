import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StaffLogin from './pages/StaffLogin';
import Category from './pages/Category';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory';
import OrderManagement from './pages/OrderManagement';
import ProductDetails from './pages/ProductDetails';
import ProductManagement from './pages/ProductManagement';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import Products from './pages/Products';
import Cart from './pages/Cart';
import StaffDashboard from './pages/StaffDashboard';
import Order from './pages/Order';
import OrderDetails from './pages/OrderDetails';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/order-management" element={<OrderManagement />} />
            <Route path="/product-details/:productId" element={<ProductDetails />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/order/:orderId" element={<Order />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/order-details/:orderId" element={<OrderDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <section className="py-12 bg-black text-center">
          <p className="mb-4">Follow us on social media for the latest deals!</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-yellow-400 hover:text-yellow-300">Facebook</a>
            <a href="#" className="text-yellow-400 hover:text-yellow-300">Twitter</a>
            <a href="#" className="text-yellow-400 hover:text-yellow-300">Instagram</a>
          </div>
          <p className="mt-4 text-gray-500">© 2025 AWEStore. All rights reserved.</p>
        </section>
      </div>
    </Router>
  );
};

export default App;