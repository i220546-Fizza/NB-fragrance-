import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import LoadingSpinner from './components/LoadingSpinner';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import ScentFinder from './pages/ScentFinder';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';

const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminHomepage = lazy(() => import('./pages/admin/AdminHomepage'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetails = lazy(() => import('./pages/admin/AdminOrderDetails'));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite">
      <LoadingSpinner label="Loading admin panel" dark />
    </div>
  );
}

export default function App() {
  const [showLoader, setShowLoader] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const t = window.setTimeout(() => setShowLoader(false), 1400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <>
      <LoadingScreen visible={showLoader} />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collection/:category" element={<Collection />} />
          <Route path="/product/:idOrSlug" element={<ProductDetails />} />
          <Route path="/scent-finder" element={<ScentFinder />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="homepage"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminHomepage />
              </Suspense>
            }
          />
          <Route
            path="products"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminProducts />
              </Suspense>
            }
          />
          <Route
            path="products/new"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminProductForm />
              </Suspense>
            }
          />
          <Route
            path="products/:id/edit"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminProductForm />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminOrders />
              </Suspense>
            }
          />
          <Route
            path="orders/:id"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminOrderDetails />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
