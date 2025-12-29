import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Cart, Address, LocationData, Notification, Restaurant, Order, OrderStatus, DeliveryPartner } from '../types';

// Authentication Store
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Cart Store
interface CartStore {
  cart: Cart | null;
  isCartOpen: boolean;
  setCart: (cart: Cart | null) => void;
  addItem: (item: any) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isCartOpen: false,
      setCart: (cart) => set({ cart }),
      addItem: (item) => {
        const { cart } = get();
        if (!cart) return;
        
        // Logic to add item to cart
        const existingItemIndex = cart.items.findIndex(
          (cartItem) => cartItem.id === item.id
        );
        
        if (existingItemIndex >= 0) {
          cart.items[existingItemIndex].quantity += item.quantity || 1;
        } else {
          cart.items.push(item);
        }
        
        // Recalculate totals
        const subtotal = cart.items.reduce(
          (sum, cartItem) => sum + cartItem.totalPrice * cartItem.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: [...cart.items],
            subtotal,
            total: subtotal + cart.deliveryFee + cart.taxes - cart.discount,
          },
        });
      },
      removeItem: (itemId) => {
        const { cart } = get();
        if (!cart) return;
        
        const updatedItems = cart.items.filter((item) => item.id !== itemId);
        const subtotal = updatedItems.reduce(
          (sum, item) => sum + item.totalPrice * item.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: updatedItems,
            subtotal,
            total: subtotal + cart.deliveryFee + cart.taxes - cart.discount,
          },
        });
      },
      updateQuantity: (itemId, quantity) => {
        const { cart } = get();
        if (!cart) return;
        
        const updatedItems = cart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        
        const subtotal = updatedItems.reduce(
          (sum, item) => sum + item.totalPrice * item.quantity,
          0
        );
        
        set({
          cart: {
            ...cart,
            items: updatedItems,
            subtotal,
            total: subtotal + cart.deliveryFee + cart.taxes - cart.discount,
          },
        });
      },
      clearCart: () => set({ cart: null }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setCartOpen: (open) => set({ isCartOpen: open }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Location Store
interface LocationStore {
  currentLocation: LocationData | null;
  deliveryLocation: LocationData | null;
  savedAddresses: Address[];
  isLocationLoading: boolean;
  setCurrentLocation: (location: LocationData | null) => void;
  setDeliveryLocation: (location: LocationData | null) => void;
  setSavedAddresses: (addresses: Address[]) => void;
  addSavedAddress: (address: Address) => void;
  removeSavedAddress: (addressId: string) => void;
  setLocationLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      deliveryLocation: null,
      savedAddresses: [],
      isLocationLoading: false,
      setCurrentLocation: (location) => set({ currentLocation: location }),
      setDeliveryLocation: (location) => set({ deliveryLocation: location }),
      setSavedAddresses: (addresses) => set({ savedAddresses: addresses }),
      addSavedAddress: (address) => {
        const { savedAddresses } = get();
        set({ savedAddresses: [...savedAddresses, address] });
      },
      removeSavedAddress: (addressId) => {
        const { savedAddresses } = get();
        set({
          savedAddresses: savedAddresses.filter((addr) => addr.id !== addressId),
        });
      },
      setLocationLoading: (loading) => set({ isLocationLoading: loading }),
    }),
    {
      name: 'location-storage',
    }
  )
);

// UI Store
interface UIStore {
  theme: 'light' | 'dark';
  language: string;
  currency: string;
  isLoading: boolean;
  notifications: Notification[];
  activeModal: string | null;
  searchQuery: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  setCurrency: (currency: string) => void;
  setLoading: (loading: boolean) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  setActiveModal: (modal: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      language: 'en',
      currency: 'USD',
      isLoading: false,
      notifications: [],
      activeModal: null,
      searchQuery: '',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setLoading: (loading) => set({ isLoading: loading }),
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) => {
        const { notifications } = get();
        set({ notifications: [notification, ...notifications] });
      },
      markNotificationAsRead: (id) => {
        const { notifications } = get();
        set({
          notifications: notifications.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
          ),
        });
      },
      setActiveModal: (modal) => set({ activeModal: modal }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

// Restaurant Store
interface RestaurantStore {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  featuredRestaurants: Restaurant[];
  isLoading: boolean;
  filters: any;
  setRestaurants: (restaurants: Restaurant[]) => void;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  setFeaturedRestaurants: (restaurants: Restaurant[]) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: any) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: [],
  currentRestaurant: null,
  featuredRestaurants: [],
  isLoading: false,
  filters: {},
  setRestaurants: (restaurants) => set({ restaurants }),
  setCurrentRestaurant: (restaurant) => set({ currentRestaurant: restaurant }),
  setFeaturedRestaurants: (restaurants) => set({ featuredRestaurants: restaurants }),
  setLoading: (loading) => set({ isLoading: loading }),
  setFilters: (filters) => set({ filters }),
}));

// Order Store
interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  activeOrders: Order[];
  orderHistory: Order[];
  isLoading: boolean;
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  setActiveOrders: (orders: Order[]) => void;
  setOrderHistory: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setLoading: (loading: boolean) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  activeOrders: [],
  orderHistory: [],
  isLoading: false,
  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setActiveOrders: (orders) => set({ activeOrders: orders }),
  setOrderHistory: (orders) => set({ orderHistory: orders }),
  addOrder: (order) => {
    const { orders, activeOrders } = get();
    set({
      orders: [order, ...orders],
      activeOrders: [order, ...activeOrders],
    });
  },
  updateOrderStatus: (orderId, status: OrderStatus) => {
    const { orders, activeOrders, currentOrder } = get();
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    const updatedActiveOrders = activeOrders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    
    set({
      orders: updatedOrders,
      activeOrders: updatedActiveOrders,
      currentOrder:
        currentOrder?.id === orderId
          ? { ...currentOrder, status }
          : currentOrder,
    });
  },
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Delivery Partner Store (for delivery dashboard)
interface DeliveryStore {
  deliveryPartner: DeliveryPartner | null;
  assignedOrders: Order[];
  earnings: any;
  isOnline: boolean;
  currentLocation: { lat: number; lng: number } | null;
  setDeliveryPartner: (partner: DeliveryPartner | null) => void;
  setAssignedOrders: (orders: Order[]) => void;
  setEarnings: (earnings: any) => void;
  setOnlineStatus: (online: boolean) => void;
  setCurrentLocation: (location: { lat: number; lng: number } | null) => void;
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  deliveryPartner: null,
  assignedOrders: [],
  earnings: null,
  isOnline: false,
  currentLocation: null,
  setDeliveryPartner: (partner) => set({ deliveryPartner: partner }),
  setAssignedOrders: (orders) => set({ assignedOrders: orders }),
  setEarnings: (earnings) => set({ earnings }),
  setOnlineStatus: (online) => set({ isOnline: online }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
}));