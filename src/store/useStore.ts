import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  options: Record<string, string>;
}

export interface Session {
  user: string;
  role: 'Owner' | 'Chef' | 'Guest';
  restaurant: string;
}

export interface NotificationItem {
  id: number;
  text: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface LiveOrder {
  id: string;
  name: string;
  items: string;
  total: number;
  status: 'Pending' | 'Preparing' | 'Served' | 'Completed';
  time: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Entree' | 'Dessert' | 'Beverage';
  image: string;
  rating: string;
  description: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  date: 'TONIGHT' | 'TOMORROW' | 'TUESDAY';
  hour: '18:00' | '20:30' | '22:00';
  guestsCount: number;
  booth: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

interface RestaurantOSState {
  cart: CartItem[];
  session: Session;
  notifications: NotificationItem[];
  orders: LiveOrder[];
  menuItems: MenuItem[];
  reservations: Reservation[];
  favoriteItemIds: string[];

  // Cart Actions
  addToCart: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartCount: () => number;

  // Session Actions
  switchRole: (role: 'Owner' | 'Chef' | 'Guest') => void;
  switchLocation: (location: string) => void;

  // Notifications Actions
  addNotification: (text: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  clearNotifications: () => void;

  // Favorites Actions
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Orders Actions
  addLiveOrder: (order: { name: string; items: string; total: number }) => void;
  updateOrderStatus: (orderId: string, status: LiveOrder['status']) => void;

  // Menu Actions
  updateMenuPrice: (itemId: string, price: number) => void;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'rating'>) => void;
  deleteMenuItem: (itemId: string) => void;

  // Reservation Actions
  addReservation: (res: Omit<Reservation, 'id' | 'status'>) => void;
  confirmReservation: (resId: string) => void;
  cancelReservation: (resId: string) => void;
}

export const useStore = create<RestaurantOSState>()(
  persist(
    (set, get) => ({
      cart: [
        {
          id: 'wagyu-steak',
          name: 'Signature Wagyu',
          price: 124.00,
          qty: 1,
          image: '/assets/chatbot_steak.png',
          options: { temperature: 'Medium Rare', sauce: 'Marrow Jus' }
        },
        {
          id: 'napa-cabernet',
          name: 'Napa Valley Cabernet 2018',
          price: 95.00,
          qty: 1,
          image: '/assets/order_gin.png',
          options: {}
        }
      ] as CartItem[],
      session: {
        user: 'Elena Rostova',
        role: 'Owner',
        restaurant: 'Aura Gastronomy (London)'
      },
      notifications: [
        { id: 1, text: "Table 4 requested sommelier guidance", time: "19:42", type: "info" },
        { id: 2, text: "New reservation: Elena Rostova (4 guests) at 20:30", time: "19:35", type: "success" },
        { id: 3, text: "Supply alert: Wagyu beef stock below threshold", time: "19:10", type: "warning" }
      ],
      favoriteItemIds: [],
      orders: [
        { id: '#OS-8902', name: 'Elena R.', items: 'Signature Wagyu, Napa Valley 2018', total: 219.00, status: 'Preparing', time: '19:42' },
        { id: '#OS-8901', name: 'Marcus K.', items: 'Seared Scallops, Obsidian Gin', total: 54.00, status: 'Served', time: '19:20' }
      ],
      menuItems: [
        {
          id: 'seared-scallops',
          name: 'Seared Scallops',
          price: 38.00,
          category: 'Entree',
          image: '/assets/chatbot_scallops.png',
          rating: '4.9',
          description: 'Hokkaido scallops with pea purée, crispy pancetta, and citrus emulsion.'
        },
        {
          id: 'wagyu-steak',
          name: 'Signature Wagyu',
          price: 124.00,
          category: 'Entree',
          image: '/assets/chatbot_steak.png',
          rating: '5.0',
          description: 'Grade A5 Kobe beef, butter-poached with smoked marrow jus and truffle mash.'
        },
        {
          id: 'napa-cabernet',
          name: 'Napa Valley Cabernet 2018',
          price: 95.00,
          category: 'Beverage',
          image: '/assets/order_gin.png',
          rating: '4.8',
          description: 'Robust Napa Valley vintage grape, aged in French oak barrels.'
        }
      ],
      reservations: [
        { id: 'RES-01', guestName: 'Elena Rostova', date: 'TONIGHT', hour: '20:30', guestsCount: 4, booth: 'Window Booth 4', status: 'Confirmed' },
        { id: 'RES-02', guestName: 'Charles V.', date: 'TOMORROW', hour: '18:00', guestsCount: 2, booth: 'Booth 2', status: 'Pending' }
      ],

      // Cart Actions
      addToCart: (item) => {
        const cart = get().cart;
        const existing = cart.find((i) => i.id === item.id);
        let updatedCart;
        if (existing) {
          updatedCart = cart.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + (item.qty || 1) } : i
          );
        } else {
          updatedCart = [
            ...cart,
            {
              id: item.id,
              name: item.name,
              price: item.price,
              qty: item.qty || 1,
              image: item.image || '/assets/placeholder.png',
              options: item.options || {}
            }
          ];
        }
        set({ cart: updatedCart });
        get().addNotification(`Added ${item.name} to cart`, 'success');
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      updateCartQty: (id, qty) => {
        set({
          cart: get().cart.map((item) =>
            item.id === id ? { ...item, qty: Math.max(1, qty) } : item
          )
        });
      },

      clearCart: () => set({ cart: [] }),

      getCartSubtotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      },

      getCartCount: () => {
        return get().cart.reduce((sum, item) => sum + item.qty, 0);
      },

      // Session Actions
      switchRole: (role) => {
        const session = get().session;
        set({ session: { ...session, role } });
        get().addNotification(`Switched role to ${role}`, 'info');
      },

      switchLocation: (location) => {
        const session = get().session;
        set({ session: { ...session, restaurant: location } });
        get().addNotification(`Switched location to ${location}`, 'info');
      },

      // Notifications Actions
      addNotification: (text, type = 'info') => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newNotification: NotificationItem = {
          id: Date.now(),
          text,
          time,
          type
        };
        const notifications = [newNotification, ...get().notifications].slice(0, 10);
        set({ notifications });
      },

      clearNotifications: () => set({ notifications: [] }),

      // Favorites Actions
      toggleFavorite: (id) => {
        const favorites = get().favoriteItemIds;
        const already = favorites.includes(id);
        const updated = already ? favorites.filter((x) => x !== id) : [id, ...favorites];
        set({ favoriteItemIds: updated });
        get().addNotification(already ? 'Removed from favorites' : 'Saved to favorites', already ? 'warning' : 'success');
      },

      isFavorite: (id) => {
        return get().favoriteItemIds.includes(id);
      },

      // Orders Actions
      addLiveOrder: (order) => {
        const id = '#OS-' + Math.floor(1000 + Math.random() * 9000);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newOrder: LiveOrder = {
          id,
          name: order.name || 'Anonymous',
          items: order.items || 'Menu Items',
          total: order.total || 0.00,
          status: 'Pending',
          time
        };
        set({ orders: [newOrder, ...get().orders] });
        get().addNotification(`New incoming order ${id}`, 'success');
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          )
        });
        get().addNotification(`Order ${orderId} updated to ${status}`, 'info');
      },

      // Menu Actions
      updateMenuPrice: (itemId, price) => {
        set({
          menuItems: get().menuItems.map((item) =>
            item.id === itemId ? { ...item, price: Math.max(0.01, price) } : item
          )
        });
        get().addNotification(`Updated menu price to $${price.toFixed(2)}`, 'info');
      },

      addMenuItem: (item) => {
        const id = item.name.toLowerCase().replace(/\s+/g, '-');
        const newItem: MenuItem = {
          ...item,
          id,
          rating: '5.0'
        };
        set({ menuItems: [...get().menuItems, newItem] });
        get().addNotification(`Added ${item.name} to menu`, 'success');
      },

      deleteMenuItem: (itemId) => {
        const name = get().menuItems.find(i => i.id === itemId)?.name || 'Item';
        set({ menuItems: get().menuItems.filter(i => i.id !== itemId) });
        get().addNotification(`Deleted ${name} from menu`, 'warning');
      },

      // Reservation Actions
      addReservation: (res) => {
        const id = 'RES-' + Math.floor(10 + Math.random() * 90);
        const newRes: Reservation = {
          ...res,
          id,
          status: 'Pending'
        };
        set({ reservations: [...get().reservations, newRes] });
        get().addNotification(`Added pending reservation for ${res.guestName}`, 'success');
      },

      confirmReservation: (resId) => {
        set({
          reservations: get().reservations.map((r) =>
            r.id === resId ? { ...r, status: 'Confirmed' } : r
          )
        });
        get().addNotification(`Confirmed reservation ${resId}`, 'success');
      },

      cancelReservation: (resId) => {
        set({
          reservations: get().reservations.map((r) =>
            r.id === resId ? { ...r, status: 'Cancelled' } : r
          )
        });
        get().addNotification(`Cancelled reservation ${resId}`, 'warning');
      }
    }),
    {
      name: 'restaurant_os_state'
    }
  )
);
