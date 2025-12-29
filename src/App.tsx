import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Addresses from "./pages/user/Addresses";
import PaymentMethods from "./pages/user/PaymentMethods";
import Promotions from "./pages/user/Promotions";
import Settings from "./pages/user/Settings";
import EditProfile from "./pages/user/EditProfile";

// Stores
import { useAuthStore, useUIStore } from './store';

// Components
import Header from './components/common/Header';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Pages
import Home from './pages/Home';

// Firebase
import { auth } from './api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { userService } from './api/services';
import Notifications from './pages/user/Notifications';

// Lazy Pages
const RestaurantList = React.lazy(() => import('./pages/RestaurantList'));
const RestaurantDetails = React.lazy(() => import('./pages/RestaurantDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const OrderTracking = React.lazy(() => import('./pages/OrderTracking'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Signup = React.lazy(() => import('./pages/auth/Signup'));
const Profile = React.lazy(() => import('./pages/user/Profile'));
const Orders = React.lazy(() => import('./pages/user/Orders'));
const Favourites = React.lazy(() => import('./pages/user/Favourites')); // ✅ uncommented
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const DeliveryDashboard = React.lazy(() => import('./pages/delivery/Dashboard'));

// Suspense Wrapper
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    }
  >
    {children}
  </React.Suspense>
);

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean; deliveryOnly?: boolean }> = ({ 
  children, 
  adminOnly = false,
  deliveryOnly = false 
}) => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Please sign in to access this page</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
      </div>
    );
  }

  if (deliveryOnly && user.role !== 'delivery_partner') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Partner Access Only</h2>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { setUser, setLoading } = useAuthStore();
  const { theme, isLoading } = useUIStore();

  // Firebase Auth listener
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await userService.getUser(firebaseUser.uid);
          if (userData) {
            setUser(userData);
          } else {
            const newUserData = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              role: 'customer' as const,
              isVerified: firebaseUser.emailVerified,
              createdAt: new Date(),
              updatedAt: new Date(),
              preferences: {
                language: 'en',
                currency: 'USD',
                notifications: { orders: true, promotions: true, reminders: true }
              },
              loyaltyPoints: 0,
              walletBalance: 0
            };
            await userService.createUser(newUserData);
            setUser(newUserData);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error setting up user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  // Theme
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading FoodieExpress...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<SuspenseWrapper><RestaurantList /></SuspenseWrapper>} />
            <Route path="/restaurants/:id" element={<SuspenseWrapper><RestaurantDetails /></SuspenseWrapper>} />
            <Route path="/search" element={<SuspenseWrapper><RestaurantList /></SuspenseWrapper>} />

            {/* Auth */}
            <Route path="/login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
            <Route path="/signup" element={<SuspenseWrapper><Signup /></SuspenseWrapper>} />

            

...

<Route 
  path="/notifications" 
  element={
    <ProtectedRoute>
      <SuspenseWrapper>
        <Notifications />
      </SuspenseWrapper>
    </ProtectedRoute>
  } 
/>

<Route path="/edit-profile" element={<EditProfile />} />

            {/* Protected */}
            <Route path="/cart" element={<ProtectedRoute><SuspenseWrapper><Cart /></SuspenseWrapper></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><SuspenseWrapper><Checkout /></SuspenseWrapper></ProtectedRoute>} />
            <Route path="/order/:orderId" element={<ProtectedRoute><SuspenseWrapper><OrderTracking /></SuspenseWrapper></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><SuspenseWrapper><Profile /></SuspenseWrapper></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><SuspenseWrapper><Orders /></SuspenseWrapper></ProtectedRoute>} />
            <Route 
  path="/favorites" 
  element={
    <ProtectedRoute>
      <SuspenseWrapper>
        <Favourites />
      </SuspenseWrapper>
    </ProtectedRoute>
  } 
/>

<Route path="/addresses" element={<Addresses />} />
  <Route path="/payment-methods" element={<PaymentMethods />} />
  <Route path="/promotions" element={<Promotions />} />
  <Route path="/settings" element={<Settings />} />

            {/* Admin */}
            <Route path="/admin/*" element={<ProtectedRoute adminOnly><SuspenseWrapper><AdminDashboard /></SuspenseWrapper></ProtectedRoute>} />

            {/* Delivery */}
            <Route path="/delivery/*" element={<ProtectedRoute deliveryOnly><SuspenseWrapper><DeliveryDashboard /></SuspenseWrapper></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Page not found</p>
                  <a href="/" className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors">
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </AnimatePresence>

        {/* Toast */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: theme === 'dark' ? '#1f2937' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;
