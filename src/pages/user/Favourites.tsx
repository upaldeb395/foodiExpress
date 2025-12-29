import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Clock, Truck } from 'lucide-react';
import { Restaurant } from '../../types';
import Button from '../../components/ui/Button';

type CardProps = React.PropsWithChildren<{
  className?: string;
  hover?: boolean;
  padding?: string;
  [key: string]: any;
}>;

const Card: React.FC<CardProps> = ({ children, className = '', hover, padding = 'p-4', ...rest }) => {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow' : '';
  const paddingClass = padding === 'none' ? '' : padding;
  return (
    <div
      className={`${paddingClass} bg-white dark:bg-gray-800 rounded-lg shadow-sm ${hoverClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

const Favorites: React.FC = () => {
  const navigate = useNavigate();

  // Mock favorites data
  const favoriteRestaurants: Restaurant[] = [
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
      address: {
        id: '',
        userId: '',
        type: 'home',
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        location: {
          lat: 0,
          lng: 0
        },
        isDefault: false,
        createdAt: new Date()
      },
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
      name: 'Sushi Zen',
      description: 'Fresh sushi and Japanese delicacies',
      logoUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop&crop=center',
      bannerUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=200&fit=crop',
      cuisine: ['Japanese', 'Sushi'],
      rating: 4.7,
      reviewCount: 654,
      isOpen: false,
      deliveryTime: '30-40 min',
      deliveryFee: 3.99,
      minimumOrder: 25,
      address: {
        id: '',
        userId: '',
        type: 'home',
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        location: {
          lat: 0,
          lng: 0
        },
        isDefault: false,
        createdAt: new Date()
      },
      location: { lat: 40.7505, lng: -73.9934 },
      contact: { phone: '+1234567892', email: 'info@sushizen.com' },
      ownerId: 'owner3',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      operatingHours: {},
      tags: ['Premium', 'Healthy']
    }
  ];

  // Handle remove from favorites
  const handleRemoveFavorite = (id: string) => {
    // Remove the restaurant with this ID from the favorites
    const updatedFavorites = favoriteRestaurants.filter((restaurant) => restaurant.id !== id);
    console.log('Updated Favorites:', updatedFavorites);
    // Here you would update the state or context holding the favoriteRestaurants list
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your saved restaurants and dishes
            </p>
          </div>
          <Button onClick={() => navigate('/restaurants')}>
            Discover More
          </Button>
        </div>

        {favoriteRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  hover
                  padding="none"
                  className="overflow-hidden cursor-pointer relative group"
                >
                  {/* Favorite Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </motion.button>
                  </div>

                  {/* Restaurant Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={restaurant.bannerUrl}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    
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
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Special Offer
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
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
                          className="w-12 h-12 rounded-xl object-cover ml-3"
                        />
                      )}
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center space-x-4 mb-4">
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
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Truck className="w-4 h-4" />
                        <span>${restaurant.deliveryFee}</span>
                      </div>
                    </div>

                    {/* Special Offer Details */}
                    {restaurant.specialOffers && restaurant.specialOffers.length > 0 && (
                      <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          {restaurant.specialOffers[0]}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        className="flex-1"
                        onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                        disabled={!restaurant.isOpen}
                      >
                        {restaurant.isOpen ? 'Order Now' : 'View Menu'}
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(restaurant.id);
                        }}
                        className="px-3"
                      >
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No favorites yet
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Start exploring restaurants and save your favorites for quick access. 
                Just click the heart icon on any restaurant you love!
              </p>

              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/restaurants')}
                  className="w-full sm:w-auto"
                >
                  Explore Restaurants
                </Button>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>💡 Tip: Save restaurants to reorder your favorite meals quickly</p>
                </div>
              </div>
            </motion.div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Favorites;
