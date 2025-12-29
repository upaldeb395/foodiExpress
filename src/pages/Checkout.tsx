import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CreditCard, 
  Clock, 
  ArrowLeft, 
  Plus,
  Check,
  Truck,
  DollarSign
} from 'lucide-react';
import { useCartStore, useAuthStore, useLocationStore } from '../store';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm ${className}`}>
    {children}
  </div>
);

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { user } = useAuthStore();
  const { savedAddresses } = useLocationStore();

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [promoCode, setPromoCode] = useState<string>('');
  const [tip, setTip] = useState<number>(0);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'cash', name: 'Cash on Delivery', icon: DollarSign }
  ];

  const tipOptions = [0, 2, 3, 5];

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    // Simulate order placement
    setTimeout(() => {
      const orderId = 'ORD-' + Date.now();
      navigate(`/order/${orderId}`);
    }, 2000);
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No items in cart
          </h2>
          <Button onClick={() => navigate('/restaurants')}>
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cart')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Address
              </h3>

              <div className="space-y-3">
                {savedAddresses.length > 0 ? (
                  savedAddresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                        selectedAddress === address.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {address.name} ({address.type})
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {address.street}, {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                        {selectedAddress === address.id && (
                          <Check className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      No saved addresses found
                    </p>
                    <Button
                      variant="outline"
                      icon={<Plus className="w-4 h-4" />}
                      onClick={() => navigate('/profile/addresses')}
                    >
                      Add New Address
                    </Button>
                  </div>
                )}

                {savedAddresses.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => navigate('/profile/addresses')}
                  >
                    Add New Address
                  </Button>
                )}
              </div>
            </Card>

            {/* Payment Method */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {method.name}
                          </span>
                        </div>
                        {paymentMethod === method.id && (
                          <Check className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Card Details (if card payment selected) */}
              {paymentMethod === 'card' && (
                <div className="mt-6 space-y-4">
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      placeholder="MM/YY"
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                    />
                  </div>
                  <Input
                    label="Cardholder Name"
                    placeholder="John Doe"
                  />
                </div>
              )}
            </Card>

            {/* Tip */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add Tip for Delivery Partner
              </h3>
              
              <div className="grid grid-cols-4 gap-3 mb-4">
                {tipOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTip(amount)}
                    className={`p-3 rounded-xl border-2 text-center transition-colors ${
                      tip === amount
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {amount === 0 ? 'No Tip' : `$${amount}`}
                  </button>
                ))}
              </div>

              <Input
                label="Custom Tip Amount"
                type="number"
                placeholder="Enter custom amount"
                value={tip > 5 ? tip : ''}
                onChange={(e) => setTip(Number(e.target.value) || 0)}
                min="0"
                step="0.50"
              />
            </Card>

            {/* Special Instructions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Special Instructions
              </h3>
              
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests for your order..."
                rows={3}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.quantity}x {item.menuItem.name}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 dark:border-gray-700 mb-4" />

              {/* Pricing Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Delivery Fee</span>
                  <span>${cart.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Taxes</span>
                  <span>${cart.taxes.toFixed(2)}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Tip</span>
                    <span>${tip.toFixed(2)}</span>
                  </div>
                )}
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(cart.total + tip).toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  rightIcon={
                    <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                      Apply
                    </button>
                  }
                />
              </div>

              {/* Estimated Delivery Time */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Estimated delivery: {cart.restaurant?.deliveryTime || '30-40 min'}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handlePlaceOrder}
                isLoading={isPlacingOrder}
                disabled={!selectedAddress}
              >
                {isPlacingOrder ? 'Placing Order...' : `Place Order - $${(cart.total + tip).toFixed(2)}`}
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;