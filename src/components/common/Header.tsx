import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  Search, 
  Menu, 
  X, 
  Bell,
  Heart,
  Settings,
  LogOut,
  Clock
} from 'lucide-react';
import { useAuthStore, useCartStore, useLocationStore, useUIStore } from '../../store';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, logout } = useAuthStore();
  const { cart, toggleCart } = useCartStore();
  const { deliveryLocation } = useLocationStore();
  const { searchQuery, setSearchQuery, notifications } = useUIStore();

  const cartItemsCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center"
              >
                <span className="text-white font-bold text-lg lg:text-xl">F</span>
              </motion.div>
              <span className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white">
                FoodieExpress
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <Input
                placeholder="Search for food, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="w-full"
              />
            </form>
          </div>

          {/* Location - Desktop */}
<div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
  <MapPin className="w-4 h-4 text-orange-500" />
  <span className="max-w-40 truncate">
    {deliveryLocation?.address || 'Detecting location...'}
  </span>
  <button
    onClick={async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Reverse geocoding (OpenStreetMap free API)
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await res.json();
              const address = data.display_name || `${latitude}, ${longitude}`;

              // Store the location in Zustand
              useLocationStore.getState().setDeliveryLocation({
                address,
                latitude,
                longitude,
              } as any);
            } catch (err) {
              console.error("Failed to fetch location:", err);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("Unable to fetch location. Please allow location access.");
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }}
    className="ml-2 text-orange-500 hover:underline"
  >
    Detect
  </button>
</div>


          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Notifications */}
            {user && (
              <Link
                to="/notifications"
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            )}

            {/* Favorites */}
            {user && (
              <Link
                to="/favorites"
                className="hidden lg:block p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Heart className="w-5 h-5" />
                </motion.div>
              </Link>
            )}

            {/* Cart */}
<Link
  to="/cart"
  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
>
  <ShoppingCart className="w-5 h-5" />
  {cartItemsCount > 0 && (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center"
    >
      {cartItemsCount > 99 ? '99+' : cartItemsCount}
    </motion.span>
  )}
</Link>


            {/* User Menu */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.displayName || 'User'}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Clock className="w-4 h-4" />
                        <span>Orders</span>
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart className="w-4 h-4" />
                        <span>Favorites</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-600" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="w-full">
            <Input
              placeholder="Search for food, restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Location */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{deliveryLocation?.address || 'Select location'}</span>
              </div>

              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="block py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/favorites"
                    className="block py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block py-2 text-red-600 dark:text-red-400 w-full text-left"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigate('/signup');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
