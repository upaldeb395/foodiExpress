// API service functions for the food delivery platform
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  getCollection, 
  subscribeToCollection, 
  subscribeToDocument,
  uploadFile,
  collections,
  auth
} from './firebase';
import { 
  User, 
  Restaurant, 
  MenuItem, 
  Order, 
  Address, 
  Review, 
  DeliveryPartner, 
  PromoCode,
  Notification
} from '../types';
import { query, where, orderBy, limit } from 'firebase/firestore';

// User Services
export const userService = {
  async createUser(userData: Partial<User>): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');
    await createDocument(collections.users, auth.currentUser.uid, userData);
  },

  async getUser(userId: string): Promise<User | null> {
    return await getDocument(collections.users, userId) as User | null;
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    await updateDocument(collections.users, userId, userData);
  },

  async getUserAddresses(userId: string): Promise<Address[]> {
    return await getCollection(collections.addresses, [
      where('userId', '==', userId)
    ]) as Address[];
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<void> {
    const docRef = await createDocument(collections.addresses, '', address);
  },

  async updateAddress(addressId: string, addressData: Partial<Address>): Promise<void> {
    await updateDocument(collections.addresses, addressId, addressData);
  },

  async deleteAddress(addressId: string): Promise<void> {
    await deleteDocument(collections.addresses, addressId);
  }
};

// Restaurant Services
export const restaurantService = {
  async getRestaurants(filters?: any): Promise<Restaurant[]> {
    const conditions = [];
    conditions.push(where('isActive', '==', true));
    
    if (filters?.cuisine) {
      conditions.push(where('cuisine', 'array-contains-any', filters.cuisine));
    }
    
    return await getCollection(collections.restaurants, conditions) as Restaurant[];
  },

  async getRestaurant(restaurantId: string): Promise<Restaurant | null> {
    return await getDocument(collections.restaurants, restaurantId) as Restaurant | null;
  },

  async getFeaturedRestaurants(): Promise<Restaurant[]> {
    return await getCollection(collections.restaurants, [
      where('isActive', '==', true),
      where('rating', '>=', 4.0),
      orderBy('rating', 'desc'),
      limit(6)
    ]) as Restaurant[];
  },

  async getNearbyRestaurants(lat: number, lng: number, radius: number = 10): Promise<Restaurant[]> {
    // For demo purposes, return all restaurants. In production, use GeoFirestore or similar
    return await getCollection(collections.restaurants, [
      where('isActive', '==', true)
    ]) as Restaurant[];
  },

  async searchRestaurants(searchQuery: string): Promise<Restaurant[]> {
    // Simple text search - in production, use Algolia or similar search service
    const restaurants = await getCollection(collections.restaurants, [
      where('isActive', '==', true)
    ]) as Restaurant[];
    
    return restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some(cuisine => 
        cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  },

  async createRestaurant(restaurantData: Omit<Restaurant, 'id'>): Promise<string> {
    const docRef = await createDocument(collections.restaurants, '', restaurantData);
    return docRef.id;
  },

  async updateRestaurant(restaurantId: string, restaurantData: Partial<Restaurant>): Promise<void> {
    await updateDocument(collections.restaurants, restaurantId, restaurantData);
  }
};

// Menu Services
export const menuService = {
  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    return await getCollection(collections.menuItems, [
      where('restaurantId', '==', restaurantId),
      where('isAvailable', '==', true),
      orderBy('category')
    ]) as MenuItem[];
  },

  async getMenuItem(itemId: string): Promise<MenuItem | null> {
    return await getDocument(collections.menuItems, itemId) as MenuItem | null;
  },

  async createMenuItem(menuItemData: Omit<MenuItem, 'id'>): Promise<string> {
    const docRef = await createDocument(collections.menuItems, '', menuItemData);
    return docRef.id;
  },

  async updateMenuItem(itemId: string, itemData: Partial<MenuItem>): Promise<void> {
    await updateDocument(collections.menuItems, itemId, itemData);
  },

  async deleteMenuItem(itemId: string): Promise<void> {
    await deleteDocument(collections.menuItems, itemId);
  },

  async searchMenuItems(query: string, restaurantId?: string): Promise<MenuItem[]> {
    const conditions = [where('isAvailable', '==', true)];
    
    if (restaurantId) {
      conditions.push(where('restaurantId', '==', restaurantId));
    }
    
    const items = await getCollection(collections.menuItems, conditions) as MenuItem[];
    
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
};

// Order Services
export const orderService = {
  async createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
    const docRef = await createDocument(collections.orders, '', {
      ...orderData,
      orderNumber: `ORD-${Date.now()}`,
      status: 'placed',
      paymentStatus: 'pending',
      timeline: [{
        status: 'placed',
        timestamp: new Date(),
        description: 'Order placed successfully',
      }]
    });
    return docRef.id;
  },

  async getOrder(orderId: string): Promise<Order | null> {
    return await getDocument(collections.orders, orderId) as Order | null;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    return await getCollection(collections.orders, [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]) as Order[];
  },

  async getActiveOrders(userId: string): Promise<Order[]> {
    return await getCollection(collections.orders, [
      where('userId', '==', userId),
      where('status', 'in', ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery'])
    ]) as Order[];
  },

  async updateOrderStatus(orderId: string, status: string, updatedBy?: string): Promise<void> {
    const order = await getDocument(collections.orders, orderId) as Order;
    if (!order) throw new Error('Order not found');

    const newTimelineEntry = {
      status,
      timestamp: new Date(),
      description: `Order ${status.replace('_', ' ')}`,
      updatedBy
    };

    await updateDocument(collections.orders, orderId, {
      status,
      timeline: [...order.timeline, newTimelineEntry]
    });
  },

  async assignDeliveryPartner(orderId: string, deliveryPartnerId: string): Promise<void> {
    const partner = await getDocument(collections.deliveryPartners, deliveryPartnerId) as DeliveryPartner;
    
    await updateDocument(collections.orders, orderId, {
      deliveryPartnerId,
      deliveryPartner: {
        id: partner.id,
        name: partner.name,
        phone: partner.phone,
        location: partner.currentLocation
      }
    });
  },

  subscribeToOrder(orderId: string, callback: (order: Order) => void) {
    return subscribeToDocument(collections.orders, orderId, callback);
  },

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    await updateDocument(collections.orders, orderId, {
      status: 'cancelled',
      cancellationReason: reason,
      timeline: [
        ...(await getDocument(collections.orders, orderId) as Order).timeline,
        {
          status: 'cancelled',
          timestamp: new Date(),
          description: `Order cancelled: ${reason}`
        }
      ]
    });
  }
};

// Review Services
export const reviewService = {
  async createReview(reviewData: Omit<Review, 'id'>): Promise<string> {
    const docRef = await createDocument(collections.reviews, '', reviewData);
    return docRef.id;
  },

  async getRestaurantReviews(restaurantId: string): Promise<Review[]> {
    return await getCollection(collections.reviews, [
      where('restaurantId', '==', restaurantId),
      where('type', '==', 'restaurant'),
      orderBy('createdAt', 'desc'),
      limit(20)
    ]) as Review[];
  },

  async getUserReviews(userId: string): Promise<Review[]> {
    return await getCollection(collections.reviews, [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]) as Review[];
  }
};

// Delivery Partner Services
export const deliveryService = {
  async getDeliveryPartner(partnerId: string): Promise<DeliveryPartner | null> {
    return await getDocument(collections.deliveryPartners, partnerId) as DeliveryPartner | null;
  },

  async updatePartnerLocation(partnerId: string, location: { lat: number; lng: number }): Promise<void> {
    await updateDocument(collections.deliveryPartners, partnerId, {
      currentLocation: location,
      updatedAt: new Date()
    });
  },

  async getPartnerOrders(partnerId: string): Promise<Order[]> {
    return await getCollection(collections.orders, [
      where('deliveryPartnerId', '==', partnerId),
      where('status', 'in', ['ready_for_pickup', 'picked_up', 'out_for_delivery']),
      orderBy('createdAt', 'desc')
    ]) as Order[];
  },

  async updatePartnerStatus(partnerId: string, isOnline: boolean): Promise<void> {
    await updateDocument(collections.deliveryPartners, partnerId, {
      isOnline,
      updatedAt: new Date()
    });
  }
};

// Promo Code Services
export const promoService = {
  async validatePromoCode(code: string, orderTotal: number, userId: string): Promise<{ valid: boolean; discount: number; message: string }> {
    const promoCodes = await getCollection(collections.promoCodes, [
      where('code', '==', code.toUpperCase()),
      where('isActive', '==', true)
    ]) as PromoCode[];

    if (promoCodes.length === 0) {
      return { valid: false, discount: 0, message: 'Invalid promo code' };
    }

    const promoCode = promoCodes[0];
    const now = new Date();

    if (now < promoCode.validFrom || now > promoCode.validUntil) {
      return { valid: false, discount: 0, message: 'Promo code has expired' };
    }

    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return { valid: false, discount: 0, message: 'Promo code usage limit reached' };
    }

    if (promoCode.minimumOrder && orderTotal < promoCode.minimumOrder) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Minimum order amount is $${promoCode.minimumOrder}` 
      };
    }

    let discount = 0;
    if (promoCode.type === 'percentage') {
      discount = (orderTotal * promoCode.value) / 100;
      if (promoCode.maximumDiscount && discount > promoCode.maximumDiscount) {
        discount = promoCode.maximumDiscount;
      }
    } else if (promoCode.type === 'fixed') {
      discount = promoCode.value;
    }

    return { valid: true, discount, message: 'Promo code applied successfully' };
  },

  async applyPromoCode(promoCodeId: string): Promise<void> {
    const promoCode = await getDocument(collections.promoCodes, promoCodeId) as PromoCode;
    await updateDocument(collections.promoCodes, promoCodeId, {
      usedCount: promoCode.usedCount + 1
    });
  }
};

// Notification Services
export const notificationService = {
  async createNotification(notificationData: Omit<Notification, 'id'>): Promise<string> {
    const docRef = await createDocument(collections.notifications, '', notificationData);
    return docRef.id;
  },

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await getCollection(collections.notifications, [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    ]) as Notification[];
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await updateDocument(collections.notifications, notificationId, {
      isRead: true
    });
  },

  subscribeToUserNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    return subscribeToCollection(
      collections.notifications,
      callback,
      [
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      ]
    );
  }
};

// File Upload Services
export const uploadService = {
  async uploadImage(file: File, path: string): Promise<string> {
    return await uploadFile(file, path);
  },

  async uploadRestaurantLogo(restaurantId: string, file: File): Promise<string> {
    return await uploadFile(file, `restaurants/${restaurantId}/logo.${file.name.split('.').pop()}`);
  },

  async uploadMenuItemImage(restaurantId: string, itemId: string, file: File): Promise<string> {
    return await uploadFile(file, `restaurants/${restaurantId}/menu/${itemId}.${file.name.split('.').pop()}`);
  },

  async uploadUserAvatar(userId: string, file: File): Promise<string> {
    return await uploadFile(file, `users/${userId}/avatar.${file.name.split('.').pop()}`);
  }
};

// Analytics Services (for admin dashboard)
export const analyticsService = {
  async getOrderStats(startDate: Date, endDate: Date): Promise<any> {
    const orders = await getCollection(collections.orders, [
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    ]) as Order[];

    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.pricing.total, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.pricing.total, 0) / orders.length : 0,
      ordersByStatus: orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  },

  async getPopularItems(limit: number = 10): Promise<any[]> {
    // This would require aggregation in production
    const orders = await getCollection(collections.orders) as Order[];
    const itemCounts: Record<string, { count: number; item: any }> = {};

    orders.forEach(order => {
      order.items.forEach(cartItem => {
        const itemId = cartItem.menuItem.id;
        if (!itemCounts[itemId]) {
          itemCounts[itemId] = { count: 0, item: cartItem.menuItem };
        }
        itemCounts[itemId].count += cartItem.quantity;
      });
    });

    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
};