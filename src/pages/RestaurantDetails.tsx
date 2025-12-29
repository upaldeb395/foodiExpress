import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Truck,
  MapPin,
  Phone,
  Heart,
  Share,
  Plus,
  Minus,
  Info,
} from "lucide-react";
import { Restaurant, MenuItem } from "../types";
import { useCartStore, useRestaurantStore } from "../store";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Modal from "../components/ui/Modal";

/**
 * Simple local Card component
 */
type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  hover?: boolean;
  padding?: "none" | "default";
  className?: string;
};

const Card: React.FC<CardProps> = ({
  children,
  hover,
  padding = "default",
  className = "",
  ...rest
}) => {
  const baseStyles = [
    "rounded-lg",
    "bg-white",
    "dark:bg-gray-800",
    padding === "none" ? "" : "p-4",
    hover ? "hover:shadow-md transition-shadow" : "shadow-sm",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`৳{baseStyles} ৳{className}`} {...rest}>
      {children}
    </div>
  );
};

// 🔹 Convert USD → BDT (example rate: 1 USD = 110 BDT)
const convertToBDT = (usd: number): string => {
  const rate = 110; // Example conversion rate
  return `৳{(usd * rate).toFixed(0)}`;
};

const RestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");

  const { currentRestaurant, setCurrentRestaurant, isLoading, setLoading } =
    useRestaurantStore();
  const { addItem } = useCartStore();

  // ✅ Mock restaurant data
  const mockRestaurants: Restaurant[] = [
    {
      id: "1",
      name: "Pizza Palace",
      description:
        "Authentic Italian pizzas with fresh ingredients made with love and tradition",
      logoUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop&crop=center",
      bannerUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop",
      cuisine: ["Italian", "Pizza"],
      rating: 4.5,
      reviewCount: 1250,
      isOpen: true,
      deliveryTime: "25-35 min",
      deliveryFee: 2.99,
      minimumOrder: 15,
      address: {
        street: "123 Main St", city: "New York",
        id: "",
        userId: "",
        type: "home",
        name: "",
        state: "",
        zipCode: "",
        country: "",
        location: {
          lat: 0,
          lng: 0
        },
        isDefault: false,
        createdAt: new Date()
      },
      location: { lat: 40.7128, lng: -74.006 },
      contact: { phone: "+1234567890", email: "info@pizzapalace.com" },
      ownerId: "owner1",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      operatingHours: {},
      tags: ["Popular", "Fast Delivery"],
      specialOffers: ["20% off on orders above ৳25"],
    },
    {
      id: "2",
      name: "Burger Junction",
      description: "Premium gourmet burgers and sides",
      logoUrl:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop&crop=center",
      bannerUrl:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=400&fit=crop",
      cuisine: ["American", "Burgers"],
      rating: 4.3,
      reviewCount: 890,
      isOpen: true,
      deliveryTime: "20-30 min",
      deliveryFee: 1.99,
      minimumOrder: 12,
      address: {
        street: "456 Broadway", city: "New York",
        id: "",
        userId: "",
        type: "home",
        name: "",
        state: "",
        zipCode: "",
        country: "",
        location: {
          lat: 0,
          lng: 0
        },
        isDefault: false,
        createdAt: new Date()
      },
      location: { lat: 40.7589, lng: -73.9851 },
      contact: { phone: "+1234567891", email: "info@burgerjunction.com" },
      ownerId: "owner2",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      operatingHours: {},
      tags: ["Trending", "Gourmet"],
      specialOffers: ["Free fries with any burger"],
    },
  ];

  // ✅ Mock menu items
  const mockMenuItems: MenuItem[] = [
    {
      id: "1",
      restaurantId: "1",
      name: "Margherita Pizza",
      description: "Classic pizza with fresh mozzarella, tomatoes, and basil",
      price: 16.99,
      imageUrl:
        "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=300&fit=crop",
      category: "Pizza",
      isAvailable: true,
      preparationTime: 15,
      calories: 320,
      ingredients: ["Mozzarella", "Tomatoes", "Basil", "Olive Oil"],
      tags: ["Vegetarian", "Popular"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      restaurantId: "1",
      name: "Pepperoni Pizza",
      description: "Traditional pepperoni pizza with mozzarella cheese",
      price: 19.99,
      imageUrl:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=300&fit=crop",
      category: "Pizza",
      isAvailable: true,
      preparationTime: 18,
      calories: 380,
      ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce"],
      tags: ["Popular", "Meat"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      restaurantId: "2",
      name: "Cheese Burger",
      description: "Juicy burger with cheddar cheese and fresh veggies",
      price: 12.99,
      imageUrl:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=300&fit=crop",
      category: "Burgers",
      isAvailable: true,
      preparationTime: 12,
      calories: 450,
      ingredients: ["Beef Patty", "Cheddar", "Lettuce"],
      tags: ["Beef", "Cheesy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const categories = [
    "all",
    "Pizza",
    "Burgers",
    "Appetizers",
    "Salads",
    "Drinks",
    "Desserts",
  ];

  // ✅ Format Address safely
  const formatAddress = (addr: any): string => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;

    const parts: string[] = [];
    if (addr.street) parts.push(addr.street);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.country) parts.push(addr.country);

    return parts.join(", ");
  };

  // ✅ Load restaurant
  useEffect(() => {
    if (id) {
      setLoading(true);
      setTimeout(() => {
        const found = mockRestaurants.find((r) => r.id === id);
        if (found) setCurrentRestaurant(found);
        setLoading(false);
      }, 1000);
    }
  }, [id, setCurrentRestaurant, setLoading]);

  const handleAddToCart = (item: MenuItem, selectedQuantity: number) => {
    const cartItem = {
      id: `৳{item.id}-৳{Date.now()}`,
      menuItem: item,
      quantity: selectedQuantity,
      customizations: [],
      totalPrice: item.price * selectedQuantity,
      specialInstructions: "",
    };

    addItem(cartItem);
    setSelectedItem(null);
    setQuantity(1);
  };

  if (isLoading || !currentRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="relative">
        <div className="h-64 lg:h-80 overflow-hidden">
          <img
            src={currentRestaurant.bannerUrl}
            alt={currentRestaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="max-w-7xl mx-auto flex items-end space-x-4 text-white">
            {currentRestaurant.logoUrl && (
              <img
                src={currentRestaurant.logoUrl}
                alt={`৳{currentRestaurant.name} logo`}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white"
              />
            )}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                {currentRestaurant.name}
              </h1>
              <p className="text-lg opacity-90 mb-2">
                {currentRestaurant.description}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{currentRestaurant.rating}</span>
                  <span className="opacity-75">
                    ({currentRestaurant.reviewCount})
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentRestaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Truck className="w-4 h-4" />
                  <span>{convertToBDT(currentRestaurant.deliveryFee)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Button variant="secondary" size="sm" icon={<Share className="w-4 h-4" />}>
            Share
          </Button>
          <Button variant="secondary" size="sm" icon={<Heart className="w-4 h-4" />}>
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{formatAddress(currentRestaurant.address)}</span>
            </div>

            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg ৳{
                    activeCategory === category
                      ? "bg-orange-500 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {category === "all" ? "All Items" : category}
                </button>
              ))}
            </nav>

            {/* Restaurant Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{currentRestaurant.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-gray-400" />
                <span>Min. order: {convertToBDT(currentRestaurant.minimumOrder)}</span>
              </div>
            </div>
          </Card>

          {/* Menu Items */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockMenuItems
              .filter((item) => item.restaurantId === currentRestaurant.id)
              .filter(
                (item) => activeCategory === "all" || item.category === activeCategory
              )
              .map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card hover padding="none" className="overflow-hidden flex">
                    <div className="w-32 h-32">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-bold">{convertToBDT(item.price)}</span>
                        <Button
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          icon={<Plus className="w-4 h-4" />}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Add to Cart"
        size="md"
      >
        {selectedItem && (
          <div>
            <div className="flex items-start space-x-4 mb-6">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.name}
                className="w-20 h-20 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedItem.description}
                </p>
                <p className="text-lg font-bold text-orange-600 mt-2">
                  {convertToBDT(selectedItem.price)}
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between mb-6">
              <span>Quantity</span>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  icon={<Minus className="w-4 h-4" />} children={undefined}                />
                <span className="text-lg font-semibold w-8 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  icon={<Plus className="w-4 h-4" />} children={undefined}                />
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xl font-bold">
                Total: {convertToBDT(selectedItem.price * quantity)}
              </span>
              <Button
                onClick={() => handleAddToCart(selectedItem, quantity)}
                size="lg"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RestaurantDetails;
