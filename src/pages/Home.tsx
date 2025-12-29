import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Truck,
  Filter,
  TrendingUp,
  Percent,
  Pizza,
  Coffee,
  Utensils,
  IceCreamBowl
} from 'lucide-react';
import { useLocationStore, useRestaurantStore, useUIStore } from '../store';
import { Restaurant } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'elevated' | 'outline' | 'default';
  className?: string;
  onClick?: () => void;
};

const Card: React.FC<CardProps> = ({ children, hover, padding = 'md', variant, className = '', ...rest }) => {
  const paddingClass =
    padding === 'none' ? 'p-0' :
    padding === 'sm' ? 'p-2' :
    padding === 'lg' ? 'p-8' : 'p-4';

  const variantClass =
    variant === 'elevated' ? 'bg-white dark:bg-gray-800 shadow-sm rounded-lg' :
    variant === 'outline' ? 'bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg' :
    'bg-white dark:bg-gray-800 rounded-lg';

  const hoverClass = hover ? 'hover:shadow-md transition-shadow' : '';

  return (
    <div className={`${variantClass} ${paddingClass} ${hoverClass} ${className}`} {...rest}>
      {children}
    </div>
  );
};

// Mock data for demo purposes
const mockFeaturedRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    description: 'Authentic Italian pizzas with fresh ingredients',
    logoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop&crop=center',
    bannerUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=200&fit=crop',
    cuisine: ['Italian', 'Pizza'],
    rating: 4.5,
    reviewCount: 1250,
    isOpen: true,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    minimumOrder: 15,
    address: {} as any,
    location: { lat: 40.7128, lng: -74.0060 },
    contact: { phone: '+1234567890', email: 'info@pizzapalace.com' },
    ownerId: 'owner1',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    operatingHours: {},
    tags: ['Popular', 'Fast Delivery'],
    specialOffers: ['20% off on orders above $25']
  },
  {
    id: '2',
    name: 'Burger Junction',
    description: 'Premium gourmet burgers and sides',
    logoUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop&crop=center',
    bannerUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=200&fit=crop',
    cuisine: ['American', 'Burgers'],
    rating: 4.3,
    reviewCount: 890,
    isOpen: true,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    minimumOrder: 12,
    address: {} as any,
    location: { lat: 40.7589, lng: -73.9851 },
    contact: { phone: '+1234567891', email: 'info@burgerjunction.com' },
    ownerId: 'owner2',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    operatingHours: {},
    tags: ['Trending', 'Gourmet'],
    specialOffers: ['Free delivery on orders above $20']
  },
  {
    id: '3',
    name: 'Sushi Zen',
    description: 'Fresh sushi and Japanese delicacies',
    logoUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop&crop=center',
    bannerUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=200&fit=crop',
    cuisine: ['Japanese', 'Sushi'],
    rating: 4.7,
    reviewCount: 654,
    isOpen: true,
    deliveryTime: '30-40 min',
    deliveryFee: 3.99,
    minimumOrder: 25,
    address: {} as any,
    location: { lat: 40.7505, lng: -73.9934 },
    contact: { phone: '+1234567892', email: 'info@sushizen.com' },
    ownerId: 'owner3',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    operatingHours: {},
    tags: ['Premium', 'Healthy'],
    specialOffers: []
  }
];

const categories = [
  { id: 'pizza', name: 'Pizza', icon: Pizza, color: 'bg-red-500' },
  { id: 'burgers', name: 'Burgers', icon: Utensils, color: 'bg-yellow-500' },
  { id: 'coffee', name: 'Coffee', icon: Coffee, color: 'bg-amber-600' },
  { id: 'desserts', name: 'Desserts', icon: IceCreamBowl, color: 'bg-pink-500' },
  { id: 'asian', name: 'Asian', icon: Utensils, color: 'bg-green-500' },
  { id: 'healthy', name: 'Healthy', icon: Utensils, color: 'bg-emerald-500' }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [locationQuery, setLocationQuery] = useState('');
  const [foodQuery, setFoodQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const { deliveryLocation, setDeliveryLocation, setLocationLoading } = useLocationStore();
  const { featuredRestaurants, setFeaturedRestaurants, setLoading } = useRestaurantStore();
  const { setSearchQuery } = useUIStore();

  useEffect(() => {
    // Load featured restaurants
    setFeaturedRestaurants(mockFeaturedRestaurants);
  }, [setFeaturedRestaurants]);

  const handleLocationDetection = async () => {
    setIsLoadingLocation(true);
    setLocationLoading(true);
    
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Mock reverse geocoding - in production, use Google Maps API
            const mockLocation = {
              address: '123 Main St, New York, NY 10001',
              coordinates: { lat: latitude, lng: longitude },
              city: 'New York',
              state: 'NY',
              country: 'USA'
            };
            
            setDeliveryLocation(mockLocation);
            setLocationQuery(mockLocation.address);
            setIsLoadingLocation(false);
            setLocationLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            setIsLoadingLocation(false);
            setLocationLoading(false);
          }
        );
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      setIsLoadingLocation(false);
      setLocationLoading(false);
    }
  };

  const handleSearch = () => {
    if (foodQuery.trim()) {
      setSearchQuery(foodQuery);
      navigate(`/search?q=${encodeURIComponent(foodQuery)}`);
    } else {
      navigate('/restaurants');
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/restaurants?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Craving something
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                delicious?
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Discover amazing food from top-rated restaurants and get it delivered 
              fresh to your doorstep in minutes
            </motion.p>
          </div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-6 lg:p-8" variant="elevated">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Location Input */}
                <div className="lg:col-span-1">
                  <div className="relative">
                    <Input
                      placeholder="Enter delivery address"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      icon={<MapPin className="w-4 h-4" />}
                      rightIcon={
                        <button
                          onClick={handleLocationDetection}
                          disabled={isLoadingLocation}
                          className="text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          {isLoadingLocation ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <span className="text-xs font-medium">Detect</span>
                          )}
                        </button>
                      }
                    />
                  </div>
                </div>

                {/* Food Search Input */}
                <div className="lg:col-span-1">
                  <Input
                    placeholder="Search for food or restaurants"
                    value={foodQuery}
                    onChange={(e) => setFoodQuery(e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                {/* Search Button */}
                <div className="lg:col-span-1">
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="w-full"
                    icon={<Search className="w-4 h-4" />}
                  >
                    Find Food
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 lg:mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Browse by your favorite cuisine types
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    hover
                    onClick={() => handleCategoryClick(category.id)}
                    className="text-center p-6 cursor-pointer group"
                  >
                    <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-12 lg:py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8 lg:mb-12"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Restaurants
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Top-rated restaurants in your area
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/restaurants')}
              icon={<TrendingUp className="w-4 h-4" />}
            >
              View All
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFeaturedRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  hover
                  padding="none"
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="overflow-hidden cursor-pointer"
                >
                  {/* Restaurant Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={restaurant.bannerUrl}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        restaurant.isOpen
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {restaurant.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    {/* Special Offers */}
                    {restaurant.specialOffers && restaurant.specialOffers.length > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Percent className="w-3 h-3 mr-1" />
                          Offer
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {restaurant.cuisine.join(', ')}
                        </p>
                      </div>
                      {restaurant.logoUrl && (
                        <img
                          src={restaurant.logoUrl}
                          alt={`${restaurant.name} logo`}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      )}
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {restaurant.rating}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({restaurant.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Truck className="w-4 h-4" />
                        <span>${restaurant.deliveryFee}</span>
                      </div>
                    </div>

                    {/* Special Offer */}
                    {restaurant.specialOffers && restaurant.specialOffers.length > 0 && (
                      <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          {restaurant.specialOffers[0]}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 lg:p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Get 50% off on your first order!
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Download our app and enjoy exclusive discounts and faster delivery
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                >
                  Order Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-orange-500"
                >
                  Download App
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;