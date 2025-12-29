import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Store, 
  DollarSign, 
  TrendingUp, 
  Package,
  Star,
  Clock,
  MapPin
} from 'lucide-react';
import Button from '../../components/ui/Button';

// Simple local Card component replacement to avoid missing module error.
// Replace this with the external Card import when '../../components/ui/Card' is available.
type CardProps = React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode };
const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow rounded ${className}`} {...props}>
      {children}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  // Mock admin stats
  const stats = {
    totalRevenue: 125450,
    totalOrders: 1234,
    totalRestaurants: 45,
    totalUsers: 5678,
    averageOrderValue: 28.50,
    deliveryTime: 32
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      restaurant: 'Pizza Palace',
      total: 32.50,
      status: 'delivered',
      time: '2 min ago'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      restaurant: 'Burger Junction',
      total: 18.99,
      status: 'preparing',
      time: '5 min ago'
    }
  ];

  const topRestaurants = [
    {
      name: 'Pizza Palace',
      orders: 234,
      revenue: 5670,
      rating: 4.8
    },
    {
      name: 'Sushi Zen',
      orders: 189,
      revenue: 4530,
      rating: 4.7
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor and manage your food delivery platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalOrders.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Restaurants
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalRestaurants}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Orders
              </h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {order.customer} • {order.restaurant}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${order.total}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Restaurants */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Performing Restaurants
              </h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {topRestaurants.map((restaurant, index) => (
                <div key={restaurant.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {restaurant.name}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>{restaurant.orders} orders</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{restaurant.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${restaurant.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Store className="w-6 h-6 mb-2" />
              <span>Manage Restaurants</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span>Manage Users</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <Package className="w-6 h-6 mb-2" />
              <span>View Orders</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span>Analytics</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;