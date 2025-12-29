import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Package, Star } from 'lucide-react';
import { Order } from '../../types';
import Button from '../../components/ui/Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

/**
 * Minimal Card wrapper used by this page to avoid missing module errors.
 * Matches expected props used in Orders.tsx: className, hover, onClick, children.
 */
const Card: React.FC<CardProps> = ({ children, className = '', hover = false, ...rest }) => {
  const base = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm';
  const hoverClass = hover ? 'hover:shadow-md transition-shadow' : '';
  return (
    <div className={`${base} ${hoverClass} ${className}`} {...rest}>
      {children}
    </div>
  );
};

const Orders: React.FC = () => {
  const navigate = useNavigate();

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-1234567890',
      userId: 'user1',
      customer: {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      },
      restaurantId: 'rest1',
      restaurant: {
        id: 'rest1',
        name: 'Pizza Palace',
        logoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
        phone: '+1234567890'
      },
      items: [
        {
          id: '1',
          menuItem: {
            id: '1',
            restaurantId: 'rest1',
            name: 'Margherita Pizza',
            description: 'Classic pizza with fresh mozzarella',
            price: 16.99,
            imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=100&h=100&fit=crop',
            category: 'Pizza',
            isAvailable: true,
            preparationTime: 15,
            ingredients: ['Mozzarella', 'Tomatoes'],
            tags: ['Vegetarian'],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          quantity: 2,
          customizations: [],
          totalPrice: 16.99
        }
      ],
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      deliveryAddress: {} as any,
      pricing: {
        subtotal: 33.98,
        deliveryFee: 2.99,
        taxes: 3.04,
        discount: 0,
        tip: 3.00,
        total: 43.01
      },
      estimatedDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      actualDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      timeline: [],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      orderNumber: 'ORD-1234567891',
      userId: 'user1',
      customer: {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      },
      restaurantId: 'rest2',
      restaurant: {
        id: 'rest2',
        name: 'Burger Junction',
        logoUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop',
        phone: '+1234567891'
      },
      items: [
        {
          id: '2',
          menuItem: {
            id: '2',
            restaurantId: 'rest2',
            name: 'Classic Burger',
            description: 'Beef patty with lettuce and tomato',
            price: 12.99,
            imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop',
            category: 'Burgers',
            isAvailable: true,
            preparationTime: 15,
            ingredients: ['Beef', 'Lettuce'],
            tags: ['Popular'],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          quantity: 1,
          customizations: [],
          totalPrice: 12.99
        }
      ],
      status: 'out_for_delivery',
      paymentStatus: 'paid',
      paymentMethod: 'cash',
      deliveryAddress: {} as any,
      pricing: {
        subtotal: 12.99,
        deliveryFee: 1.99,
        taxes: 1.33,
        discount: 0,
        tip: 2.00,
        total: 18.31
      },
      estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000),
      timeline: [],
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 60 * 1000)
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'out_for_delivery':
        return <Package className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'placed':
        return 'Order Placed';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'picked_up':
        return 'Picked Up';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-100';
      case 'out_for_delivery':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-100';
      default:
        return 'text-orange-600 bg-orange-100 dark:bg-orange-800 dark:text-orange-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Orders
          </h1>
          <Button onClick={() => navigate('/restaurants')}>
            Order Again
          </Button>
        </div>

        <div className="space-y-6">
          {mockOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover onClick={() => navigate(`/order/${order.id}`)}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Order Info */}
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-start space-x-4">
                      {/* Restaurant Logo */}
                      <img
                        src={order.restaurant.logoUrl}
                        alt={order.restaurant.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />

                      {/* Order Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {order.restaurant.name}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          Order #{order.orderNumber}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
                          {order.items.map((item, idx) => (
                            <span key={idx}>
                              {item.quantity}x {item.menuItem.name}
                              {idx < order.items.length - 1 && ', '}
                            </span>
                          ))}
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${order.pricing.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      {order.status === 'delivered' && !order.rating && (
                        <Button size="sm" variant="outline" icon={<Star className="w-4 h-4" />}>
                          Rate Order
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline">
                        {order.status === 'delivered' || order.status === 'cancelled' 
                          ? 'View Receipt' 
                          : 'Track Order'
                        }
                      </Button>

                      {order.status === 'delivered' && (
                        <Button size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Timeline Preview */}
                {(order.status === 'out_for_delivery' || order.status === 'preparing') && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {order.status === 'out_for_delivery' 
                          ? 'Arriving in approximately 15 minutes'
                          : 'Being prepared in the kitchen'
                        }
                      </span>
                      <Button variant="ghost" size="sm">
                        Track Live →
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}

          {mockOrders.length === 0 && (
            <Card className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Start by ordering some delicious food from our restaurants
              </p>
              <Button onClick={() => navigate('/restaurants')}>
                Browse Restaurants
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;