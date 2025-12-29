import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  DollarSign, 
  Clock, 
  MapPin,
  Phone,
  Navigation,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      {children}
    </div>
  );
};

const DeliveryDashboard: React.FC = () => {
  // Mock delivery partner data
  const deliveryStats = {
    todayEarnings: 125.50,
    weekEarnings: 890.25,
    monthEarnings: 3450.75,
    totalDeliveries: 156,
    averageRating: 4.8,
    completionRate: 98.5
  };

  const assignedOrders = [
    {
      id: 'ORD-001',
      restaurant: 'Pizza Palace',
      customer: 'John Doe',
      address: '123 Main St, City',
      phone: '+1234567890',
      total: 32.50,
      status: 'ready_for_pickup',
      estimatedTime: '15 mins',
      distance: '2.3 km'
    },
    {
      id: 'ORD-002',
      restaurant: 'Burger Junction',
      customer: 'Jane Smith',
      address: '456 Oak Ave, City',
      phone: '+1234567891',
      total: 18.99,
      status: 'picked_up',
      estimatedTime: '8 mins',
      distance: '1.1 km'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Delivery Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your deliveries and track your earnings
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Online
              </span>
            </div>
            <Button variant="outline">
              Go Offline
            </Button>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Today's Earnings
                  </p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ${deliveryStats.todayEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    This Week
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${deliveryStats.weekEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${deliveryStats.monthEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assigned Orders */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Assigned Orders
                </h3>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 rounded-full text-sm font-medium">
                  {assignedOrders.length} Active
                </span>
              </div>

              <div className="space-y-4">
                {assignedOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {order.id}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'ready_for_pickup'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                          }`}>
                            {order.status === 'ready_for_pickup' ? 'Ready for Pickup' : 'Picked Up'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          From: {order.restaurant}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          To: {order.customer}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.address}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          ${order.total}
                        </p>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{order.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{order.distance}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button size="sm" variant="outline" icon={<Phone className="w-4 h-4" />}>
                        Call Customer
                      </Button>
                      <Button size="sm" variant="outline" icon={<Navigation className="w-4 h-4" />}>
                        Navigate
                      </Button>
                      {order.status === 'ready_for_pickup' ? (
                        <Button size="sm" icon={<Package className="w-4 h-4" />}>
                          Mark as Picked Up
                        </Button>
                      ) : (
                        <Button size="sm" icon={<CheckCircle className="w-4 h-4" />}>
                          Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {assignedOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No orders assigned
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      You'll see new delivery orders here when they become available
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Performance
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Total Deliveries</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {deliveryStats.totalDeliveries}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {deliveryStats.averageRating}
                    </span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Completion Rate</span>
                  <span className="font-semibold text-green-600">
                    {deliveryStats.completionRate}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" icon={<MapPin className="w-4 h-4" />}>
                  Update Location
                </Button>
                <Button variant="outline" className="w-full justify-start" icon={<Clock className="w-4 h-4" />}>
                  View Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start" icon={<DollarSign className="w-4 h-4" />}>
                  Earnings Report
                </Button>
                <Button variant="outline" className="w-full justify-start" icon={<AlertCircle className="w-4 h-4" />}>
                  Report Issue
                </Button>
              </div>
            </Card>

            {/* Status Card */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-700 dark:text-green-300 mb-1">
                  You're Online!
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Ready to receive new orders
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;