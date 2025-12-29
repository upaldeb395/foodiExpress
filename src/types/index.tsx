// Core data models for the food delivery platform

export interface User {
  id: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'customer' | 'restaurant_owner' | 'delivery_partner' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  preferences?: {
    language: string;
    currency: string;
    dietaryRestrictions?: string[];
    notifications: {
      orders: boolean;
      promotions: boolean;
      reminders: boolean;
    };
  };
  loyaltyPoints?: number;
  walletBalance?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  deliveryTime: string; // e.g., "25-35 min"
  deliveryFee: number;
  minimumOrder: number;
  address: Address;
  location: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
  };
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  tags: string[];
  specialOffers?: string[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // for discounted items
  imageUrl?: string;
  category: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  calories?: number;
  ingredients: string[];
  allergens?: string[];
  tags: string[]; // e.g., 'spicy', 'vegetarian', 'vegan', 'gluten-free'
  customizations?: {
    id: string;
    name: string;
    options: {
      id: string;
      name: string;
      price: number;
    }[];
    isRequired: boolean;
    maxSelections?: number;
  }[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: {
    id: string;
    name: string;
    selectedOptions: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
  totalPrice: number;
  specialInstructions?: string;
}

export interface Cart {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant: Restaurant;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
  promoCode?: string;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  location: {
    lat: number;
    lng: number;
  };
  instructions?: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  restaurantId: string;
  restaurant: {
    id: string;
    name: string;
    logoUrl?: string;
    phone: string;
  };
  items: CartItem[];
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'mobile_banking' | 'wallet';
  deliveryAddress: Address;
  pricing: {
    subtotal: number;
    deliveryFee: number;
    taxes: number;
    discount: number;
    tip: number;
    total: number;
  };
  promoCode?: string;
  specialInstructions?: string;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  deliveryPartnerId?: string;
  deliveryPartner?: {
    id: string;
    name: string;
    phone: string;
    location?: {
      lat: number;
      lng: number;
    };
  };
  timeline: OrderTimeline[];
  rating?: {
    restaurant: number;
    delivery: number;
    food: number;
    comments?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'placed' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready_for_pickup' 
  | 'picked_up' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: Date;
  description: string;
  updatedBy?: string;
}

export interface DeliveryPartner {
  id: string;
  email: string;
  name: string;
  phone: string;
  photoUrl?: string;
  vehicleType: 'bicycle' | 'motorcycle' | 'car';
  vehicleNumber: string;
  licenseNumber: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isOnline: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  totalDeliveries: number;
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  restaurantId?: string;
  deliveryPartnerId?: string;
  type: 'restaurant' | 'delivery';
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system' | 'reminder';
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

export interface PromoCode {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'delivery';
  value: number;
  minimumOrder?: number;
  maximumDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableRestaurants?: string[];
  createdAt: Date;
}

// UI State interfaces
export interface FilterOptions {
  cuisine: string[];
  priceRange: [number, number];
  rating: number;
  deliveryTime: number;
  isVegetarian: boolean;
  isVegan: boolean;
  hasOffers: boolean;
  sortBy: 'distance' | 'rating' | 'deliveryTime' | 'popularity' | 'price';
}

export interface SearchFilters {
  location?: string;
  query?: string;
  categories?: string[];
  filters?: FilterOptions;
}

export interface LocationData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  city: string;
  state: string;
  country: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}