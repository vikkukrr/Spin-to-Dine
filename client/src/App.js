import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSkeleton from './components/LoadingSkeleton';
import './i18n';
import './styles/navbar.css';
import './styles/home.css';
import './styles/spinwheel.css';
import './styles/global.css';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RestaurantDetails = lazy(() => import('./pages/RestaurantDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const SpinWheel = lazy(() => import('./components/SpinWheel'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SpinHistory = lazy(() => import('./pages/SpinHistory'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Favorites = lazy(() => import('./pages/Favorites'));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <ToastProvider>
            <ErrorBoundary>
              <Router>
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Suspense fallback={<LoadingSkeleton type="page" />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/spin" element={<SpinWheel />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/spin-history" element={<SpinHistory />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                      </Routes>
                    </Suspense>
                  </main>
                </div>
              </Router>
            </ErrorBoundary>
          </ToastProvider>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
