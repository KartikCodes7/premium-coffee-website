import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  category?: string;
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
  status: 'Pending' | 'Preparing' | 'Ready' | 'Served';
  time: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Hot Coffee' | 'Cold Coffee' | 'Signature Drinks' | 'Bakery' | 'Desserts' | 'Refreshers' | 'Sandwiches';
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
  tableNumber: string | null;
  isOffline: boolean;
  pastOrders: LiveOrder[];

  // Global Context Actions
  setTableNumber: (table: string | null) => void;
  setOffline: (offline: boolean) => void;
  callWaiter: () => void;

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
  reorderPastOrder: (orderId: string) => void;

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
      cart: [] as CartItem[],
      session: {
        user: 'Elena Rostova',
        role: 'Owner',
        restaurant: 'Aura Premium Café (London)'
      },
      notifications: [
        { id: 1, text: "Table 4 requested a waiter's assistance", time: "15:20", type: "info" },
        { id: 2, text: "New reservation: Charles V. (2 guests) tomorrow at 18:00", time: "14:45", type: "success" },
        { id: 3, text: "Supply alert: Premium Oat Milk stock below 20%", time: "11:10", type: "warning" }
      ],
      favoriteItemIds: ['flat-white-silk', 'nitro-cold-brew'],
      orders: [
        { id: '#OS-8902', name: 'Elena R.', items: 'Silk Flat White (1x), Almond Croissant (1x)', total: 11.30, status: 'Preparing', time: '15:28' },
        { id: '#OS-8901', name: 'Marcus K.', items: 'Nitro Cold Brew (1x), Truffle Egg Sandwich (1x)', total: 16.00, status: 'Served', time: '14:20' }
      ],
      menuItems: [
        {
          id: 'flat-white-silk',
          name: 'Silk Flat White',
          price: 5.90,
          category: 'Hot Coffee',
          image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20flat%20white%20in%20a%20minimalist%20porcelain%20cup%20with%20latte%20art%20rosette%2C%20warm%20amber%20lighting%2C%20cinematic%20shadows%2C%20coffee%20shop%20aesthetic%2C%208k%2C%20shallow%20depth%20of%20field&image_size=portrait_4_3',
          rating: '4.8',
          description: 'Ristretto-forward, glossy microfoam, caramel warmth.'
        },
        {
          id: 'nitro-cold-brew',
          name: 'Nitro Cold Brew',
          price: 6.20,
          category: 'Cold Coffee',
          image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20nitro%20cold%20brew%20cascading%20in%20a%20tall%20glass%2C%20thick%20creamy%20foam%20head%2C%20moody%20dark%20background%2C%20warm%20highlights%2C%20high%20contrast%2C%208k%20beverage%20photography&image_size=portrait_4_3',
          rating: '4.9',
          description: 'Cascade pour, creamy head, chocolate-forward cold extraction.'
        },
        {
          id: 'almond-croissant',
          name: 'Almond Croissant',
          price: 5.40,
          category: 'Bakery',
          image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20almond%20croissant%20on%20matte%20stone%20plate%2C%20flaky%20layers%2C%20toasted%20almonds%2C%20warm%20cafe%20lighting%2C%20premium%20bakery%20photography%2C%208k%2C%20shallow%20depth%20of%20field&image_size=portrait_4_3',
          rating: '4.8',
          description: 'Flaky layers, almond cream, toasted finish.'
        }
      ],
      reservations: [
        { id: 'RES-01', guestName: 'Elena Rostova', date: 'TONIGHT', hour: '20:30', guestsCount: 4, booth: 'Window Booth 4', status: 'Confirmed' },
        { id: 'RES-02', guestName: 'Charles V.', date: 'TOMORROW', hour: '18:00', guestsCount: 2, booth: 'Booth 2', status: 'Pending' }
      ],
      tableNumber: null,
      isOffline: false,
      pastOrders: [
        { id: '#OS-7821', name: 'You', items: 'Noir Cortado (1x), Espresso Tiramisu (1x)', total: 13.00, status: 'Served', time: 'Yesterday, 14:15' },
        { id: '#OS-7603', name: 'You', items: 'Iced Vanilla Latte (1x), Atelier Cinnamon Roll (1x)', total: 12.00, status: 'Served', time: 'May 24, 09:30' }
      ],

      // Global Context Actions
      setTableNumber: (table) => set({ tableNumber: table }),
      setOffline: (offline) => {
        set({ isOffline: offline });
        get().addNotification(
          offline ? 'B2B Telemetry offline: Reconnecting to kitchen...' : 'B2B Telemetry active: Live kitchen queue linked!',
          offline ? 'error' : 'success'
        );
      },
      callWaiter: () => {
        const table = get().tableNumber || '4';
        get().addNotification(`Call Waiter: Dispatching specialist to Table ${table}...`, 'info');
        
        // Custom B2B Telemetry Alert inside the system
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newNotification: NotificationItem = {
          id: Date.now(),
          text: `Table ${table} requested assistance`,
          time,
          type: 'warning'
        };
        set({ notifications: [newNotification, ...get().notifications].slice(0, 10) });
      },

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

      reorderPastOrder: (orderId) => {
        const past = get().pastOrders.find(o => o.id === orderId);
        if (!past) return;
        
        // Seed past items into active cart (simulating adding the items)
        get().addNotification('Restoring past menu items to cart...', 'success');
        
        // Parse items string (e.g. "Noir Cortado (1x), Espresso Tiramisu (1x)")
        const regex = /([a-zA-Z\s]+)\((\d+)x\)/g;
        let match;
        const itemsToFind: { name: string, qty: number }[] = [];
        
        while ((match = regex.exec(past.items)) !== null) {
          itemsToFind.push({
            name: match[1].trim(),
            qty: parseInt(match[2])
          });
        }

        // Add matching items from menuItems or default list to cart
        itemsToFind.forEach(item => {
          // Look up menu item in current store
          const found = get().menuItems.find(m => m.name.toLowerCase() === item.name.toLowerCase()) || 
                        { id: item.name.toLowerCase().replace(/\s+/g, '-'), name: item.name, price: 6.00, image: '/assets/placeholder.png', category: 'Hot Coffee', rating: '5.0', description: 'Gourmet selection' };
          
          get().addToCart({
            id: found.id,
            name: found.name,
            price: found.price,
            image: found.image,
            qty: item.qty,
            options: { note: 'Reordered' }
          });
        });
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
