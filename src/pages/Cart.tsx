import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store';
import Button from '../components/ui/Button';
// Local Card component to avoid missing module import
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
};

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart } = useCartStore();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Add some delicious items from our restaurants to get started
          </p>
          <Button onClick={() => navigate('/restaurants')}>
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Item Image */}
                    <img
                      src={item.menuItem.imageUrl || 'https://via.placeholder.com/80x80'}
                      alt={item.menuItem.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.menuItem.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.menuItem.description}
                      </p>
                      <p className="text-lg font-bold text-orange-600 mt-1">
                        ${item.menuItem.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    icon={<Minus className="w-4 h-4" />} children={undefined}                      />
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    icon={<Plus className="w-4 h-4" />} children={undefined}                      />
                    </div>

                    {/* Remove Button */}
                    <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                icon={<Trash2 className="w-4 h-4" />}
                                className="text-red-500 hover:text-red-600" children={undefined}                    />
                  </div>

                  {/* Item Total */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Item Total
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Clear Cart */}
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                icon={<Trash2 className="w-4 h-4" />}
                className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="font-semibold">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Delivery Fee</span>
                  <span className="font-semibold">${cart.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Taxes</span>
                  <span className="font-semibold">${cart.taxes.toFixed(2)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${cart.discount.toFixed(2)}</span>
                  </div>
                )}
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>

              {/* Restaurant Info */}
              {cart.restaurant && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Ordering from
                  </h4>
                  <div className="flex items-center space-x-3">
                    {cart.restaurant.logoUrl && (
                      <img
                        src={cart.restaurant.logoUrl}
                        alt={cart.restaurant.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {cart.restaurant.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {cart.restaurant.deliveryTime}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;