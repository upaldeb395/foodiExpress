import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Phone,
  MessageCircle,
  Star
} from 'lucide-react';
import Button from '../components/ui/Button';
// local fallback Card component (replaces missing ../components/ui/Card)
type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      role="region"
      className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  // Mock order data
  const mockOrder = {
    id: orderId,
    orderNumber: orderId,
    status: 'out_for_delivery',
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    restaurant: {
      name: 'Pizza Palace',
      phone: '+1234567890'
    },
    deliveryPartner: {
      name: 'John Doe',
      phone: '+1234567891',
      rating: 4.8,
      location: { lat: 40.7128, lng: -74.0060 }
    },
    items: [
      {
        id: '1',
        name: 'Margherita Pizza',
        quantity: 2,
        price: 16.99
      }
    ],
    total: 39.97,
    timeline: [
      {
        status: 'placed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        description: 'Order placed successfully'
      },
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        description: 'Restaurant confirmed your order'
      },
      {
        status: 'preparing',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        description: 'Restaurant is preparing your food'
      },
      {
        status: 'ready_for_pickup',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        description: 'Food is ready for pickup'
      },
      {
        status: 'picked_up',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        description: 'Order picked up by delivery partner'
      },
      {
        status: 'out_for_delivery',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        description: 'On the way to your location'
      }
    ]
  };

  const statusSteps = [
    { key: 'placed', label: 'Order Placed', icon: CheckCircle },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: Clock },
    { key: 'ready_for_pickup', label: 'Ready', icon: CheckCircle },
    { key: 'picked_up', label: 'Picked Up', icon: Truck },
    { key: 'out_for_delivery', label: 'On the Way', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === mockOrder.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Order #{mockOrder.orderNumber}
          </p>
        </div>

        {/* Estimated Delivery Time */}
        <Card className="text-center mb-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-lg font-semibold text-orange-600">
              Estimated Delivery Time
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {mockOrder.estimatedDeliveryTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Your order will arrive in approximately 15 minutes
          </p>
        </Card>

        {/* Progress Tracker */}
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Order Progress
          </h3>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div 
              className="absolute left-6 top-8 w-0.5 bg-orange-500 transition-all duration-1000"
              style={{ 
                height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` 
              }}
            ></div>

            {/* Steps */}
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const timelineItem = mockOrder.timeline.find(t => t.status === step.key);

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-center space-x-4"
                  >
                    {/* Step Icon */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                      isCompleted 
                        ? 'bg-orange-500 border-orange-500 text-white' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                    } ${isCurrent ? 'animate-pulse' : ''}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        isCompleted 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {step.label}
                      </h4>
                      {timelineItem && (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {timelineItem.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {timelineItem.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Delivery Partner Info */}
          {mockOrder.deliveryPartner && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Delivery Partner
              </h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {mockOrder.deliveryPartner.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {mockOrder.deliveryPartner.name}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {mockOrder.deliveryPartner.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  icon={<Phone className="w-4 h-4" />}
                >
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  icon={<MessageCircle className="w-4 h-4" />}
                >
                  Message
                </Button>
              </div>
            </Card>
          )}

          {/* Restaurant Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Restaurant Details
            </h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {mockOrder.restaurant.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Preparing your order with care
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                icon={<Phone className="w-4 h-4" />}
              >
                Call Restaurant
              </Button>
            </div>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Order Items
          </h3>
          
          <div className="space-y-3">
            {mockOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.quantity}x {item.name}
                  </p>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total
              </span>
              <span className="text-lg font-bold text-orange-600">
                ${mockOrder.total.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Live Map Placeholder */}
        <Card className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Live Tracking
          </h3>
          
          <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-300">
                Live tracking map would appear here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                (Google Maps integration required)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderTracking;