import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Success from './pages/Success.jsx';
import Cancel from './pages/Cancel';
import TrackOrder from './pages/TrackOrder';
import MyOrders from './pages/MyOrders';
import ReturnPolicy from './pages/ReturnPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './services/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './services/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import OrderTrackingToast from './components/ui/OrderTrackingToast';
import AiAssistant from './components/ui/AiAssistant';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Elements stripe={stripePromise}>
            <Router>
              <div className="flex flex-col min-h-screen transition-colors duration-300">
                <Navbar />
                <main className="flex-grow pt-20">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/men" element={<Products category="men" />} />
                    <Route path="/products/women" element={<Products category="women" />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
                    <Route path="/auth/google/callback" element={<GoogleAuthSuccess />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/my-orders" element={<MyOrders />} />

                    <Route
                      path="/admin/*"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/return-policy" element={<ReturnPolicy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />

                    <Route path="/success" element={<Success />} />
                    <Route path="/cancel" element={<Cancel />} />
                  </Routes>
                </main>
                <Footer />
                <OrderTrackingToast />
                <AiAssistant />
              </div>
            </Router>
          </Elements>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
