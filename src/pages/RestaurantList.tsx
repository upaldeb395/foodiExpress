// src/pages/RestaurantList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Filter, 
  Star, 
  Clock, 
  Truck, 
  Grid,
  List as ListIcon,
  ChevronDown
} from 'lucide-react';
import { Restaurant } from '../types';
import { useRestaurantStore } from '../store';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type CardProps = React.PropsWithChildren<{
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}>;

const Card: React.FC<CardProps> = ({ children, hover, padding = 'md', onClick, className }) => {
  const paddingClass =
    padding === 'none' ? 'p-0' : padding === 'sm' ? 'p-2' : padding === 'lg' ? 'p-6' : 'p-4';
  return (
    <div
      onClick={onClick}
      className={`৳{hover ? 'transition-shadow hover:shadow-lg' : ''} ৳{paddingClass} ৳{
        className || ''
      }`}
    >
      {children}
    </div>
  );
};

const RestaurantList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  
  const { restaurants, setRestaurants, isLoading, setLoading } = useRestaurantStore();

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  // Mock restaurants data
  const mockRestaurants: Restaurant[] = [
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
      tags: ['Popular', 'Fast Delivery']
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
      tags: ['Trending', 'Gourmet']
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setLoading(false);
    }, 1000);
  }, [query, category, setRestaurants, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {query ? `Search results for "৳{query}"` : 'Restaurants'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Found {restaurants.length} restaurants
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="w-4 h-4" />}
            >
              Filters
            </Button>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="deliveryTime">Fastest Delivery</option>
                <option value="distance">Nearest</option>
                <option value="deliveryFee">Lowest Delivery Fee</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              icon={<Grid className="w-4 h-4" />} children={undefined}            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              icon={<ListIcon className="w-4 h-4" />} children={undefined}            />
          </div>
        </div>

        {/* Restaurant Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                hover
                padding="none"
                // ✅ FIX: navigate to /restaurants/:id
                onClick={() => navigate(`/restaurants/৳{restaurant.id}`)}
                className="overflow-hidden cursor-pointer"
              >
                <div className={viewMode === 'list' ? 'flex' : ''}>
                  {/* Restaurant Image */}
                  <div className={`relative overflow-hidden ৳{
                    viewMode === 'list' ? 'w-48 h-32' : 'h-48'
                  }`}>
                    <img
                      src={restaurant.bannerUrl}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ৳{
                        restaurant.isOpen
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {restaurant.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {restaurant.cuisine.join(', ')}
                        </p>
                      </div>
                      {restaurant.logoUrl && viewMode === 'list' && (
                        <img
                          src={restaurant.logoUrl}
                          alt={`৳{restaurant.name} logo`}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                    </div>

                    {/* Rating and Stats */}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {restaurant.rating}
                        </span>
                        <span className="text-sm text-gray-500">
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
                        <span>৳{restaurant.deliveryFee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No restaurants found matching your criteria
            </p>
            <Button onClick={() => navigate('/')}>
              Browse All Restaurants
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
