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
  phone?: string;
  tableNumber?: string;
  paymentMethod?: string;
  specialInstructions?: string;
  kotNumber?: string;
  createdAt?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Bistro Dining' | 'Café Craft' | 'Signature Cocktails' | 'Pastries & Bakery' | 'Artisan Desserts';
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
  locationType: 'Restaurant' | 'Café' | 'Hotel' | null;
  locationId: string | null;
  guestName: string;
  guestPhone: string;
  guestInstructions: string;
  isOffline: boolean;
  pastOrders: LiveOrder[];

  // Global Context Actions
  setTableNumber: (table: string | null) => void;
  setLocation: (type: 'Restaurant' | 'Café' | 'Hotel' | null, id: string | null) => void;
  setGuestDetails: (name: string, phone: string, instructions: string) => void;
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
  completeNotification: (id: number) => void;

  // Favorites Actions
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Orders Actions
  addLiveOrder: (order: {
    name: string;
    items: string;
    total: number;
    phone?: string;
    tableNumber?: string;
    paymentMethod?: string;
    specialInstructions?: string;
    kotNumber?: string;
    createdAt?: number;
    id?: string;
    status?: LiveOrder['status'];
    time?: string;
  }) => void;
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
        restaurant: 'Aura Grand Bistro & Café (London)'
      },
      notifications: [
        { id: 1, text: "Table 4 requested guest service assistance", time: "15:20", type: "info" },
        { id: 2, text: "New reservation: Charles V. (2 guests) tomorrow at 18:00", time: "14:45", type: "success" },
        { id: 3, text: "Supply alert: Premium Ingredients stock below 20%", time: "11:10", type: "warning" }
      ],
      favoriteItemIds: ['flat-white-silk', 'bistro-steak'],
      orders: [
        {
          id: '#OS-8902',
          name: 'Elena Rostova',
          items: 'Silk Flat White (1x), Almond Croissant (1x)',
          total: 11.30,
          status: 'Preparing',
          time: '15:28',
          phone: '9876543210',
          tableNumber: '4',
          paymentMethod: 'UPI',
          specialInstructions: 'Extra chocolate drizzle',
          kotNumber: 'KOT-101',
          createdAt: Date.now() - 600000
        },
        {
          id: '#OS-8901',
          name: 'Marcus Aurelius',
          items: 'Nitro Craft Brew (1x), Truffle Scramble Brioche (1x)',
          total: 17.70,
          status: 'Served',
          time: '14:20',
          phone: '9876501234',
          tableNumber: '2',
          paymentMethod: 'POS',
          specialInstructions: 'Gluten allergy warning',
          kotNumber: 'KOT-100',
          createdAt: Date.now() - 3600000
        }
      ],
      menuItems: [
        {
          id: 'flat-white-silk',
          name: 'Silk Flat White',
          price: 5.90,
          category: 'Café Craft',
          image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20flat%20white%20in%20a%20minimalist%20porcelain%20cup%20with%20latte%20art%20rosette%2C%20warm%20amber%20lighting%2C%20cinematic%20shadows%2C%20coffee%20shop%20aesthetic%2C%208k%2C%20shallow%20depth%20of%20field&image_size=portrait_4_3',
          rating: '4.8',
          description: 'Double ristretto-forward, glossy organic microfoam, natural caramel warmth.'
        },
        {
          id: 'bistro-steak',
          name: 'Aged Angus Bistro Steak',
          price: 24.50,
          category: 'Bistro Dining',
          image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20gourmet%20pan%20seared%20ribeye%20steak%20on%20dark%20stoneware%20plate%2C%20herb%20butter%20melting%20on%20top%2C%2520rosemary%2520sprig%2C%2520asparagus%2520spears%2C%2520warm%2520cinematic%2520lighting%2C%25208k%2520food%2520photography&image_size=portrait_4_3',
          rating: '4.9',
          description: 'Prime cut flat iron steak, herb compound butter, charred asparagus, micro-greens.'
        },
        {
          id: 'almond-croissant',
          name: 'Almond Croissant',
          price: 5.40,
          category: 'Pastries & Bakery',
          image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20almond%20croissant%20on%20matte%20stone%20plate%2C%20flaky%20layers%2C%20toasted%20almonds%2C%20warm%20cafe%20lighting%2C%20premium%20bakery%20photography%2C%208k%2C%20shallow%20depth%20of%20field&image_size=portrait_4_3',
          rating: '4.8',
          description: 'Flaky multi-layered puff pastry, sweet almond frangipane, toasted almond flakes.'
        }
      ],
      reservations: [
        { id: 'RES-01', guestName: 'Elena Rostova', date: 'TONIGHT', hour: '20:30', guestsCount: 4, booth: 'Window Booth 4', status: 'Confirmed' },
        { id: 'RES-02', guestName: 'Charles V.', date: 'TOMORROW', hour: '18:00', guestsCount: 2, booth: 'Booth 2', status: 'Pending' }
      ],
      tableNumber: null,
      locationType: null,
      locationId: null,
      guestName: '',
      guestPhone: '',
      guestInstructions: '',
      isOffline: false,
      pastOrders: [
        { id: '#OS-7821', name: 'You', items: 'Noir Cortado (1x), Espresso Tiramisu (1x)', total: 13.00, status: 'Served', time: 'Yesterday, 14:15' },
        { id: '#OS-7603', name: 'You', items: 'Iced Vanilla Latte (1x), Atelier Cinnamon Roll (1x)', total: 12.00, status: 'Served', time: 'May 24, 09:30' }
      ],

      // Global Context Actions
      setTableNumber: (table) => set({ tableNumber: table }),
      setLocation: (type, id) => set({ locationType: type, locationId: id }),
      setGuestDetails: (name, phone, instructions) => set({ guestName: name, guestPhone: phone, guestInstructions: instructions }),
      setOffline: (offline) => {
        set({ isOffline: offline });
        get().addNotification(
          offline ? 'Operations Telemetry offline: Reconnecting to kitchen...' : 'Operations Telemetry active: Live dispatch linked!',
          offline ? 'error' : 'success'
        );
      },
      callWaiter: () => {
        const rawLocation = get().locationId || get().tableNumber || '4';
        const formattedLocation = (rawLocation.includes('Table') || rawLocation.includes('Room') || rawLocation.includes('Café') || rawLocation.includes('Coffee'))
          ? rawLocation
          : `Table ${rawLocation}`;
        
        get().addNotification(`Call Service: Dispatching assistant to ${formattedLocation}...`, 'info');
        
        // Custom Operations Telemetry Alert inside the system
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newNotification: NotificationItem = {
          id: Date.now(),
          text: `${formattedLocation} requested assistance`,
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
        get().addNotification(`Added ${item.name} to Guest Request`, 'success');
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
      
      completeNotification: (id) => {
        set({
          notifications: get().notifications.filter((n) => n.id !== id)
        });
      },

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
        const id = order.id || '#OS-' + Math.floor(1000 + Math.random() * 9000);
        const time = order.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newOrder: LiveOrder = {
          id,
          name: order.name || 'Anonymous',
          items: order.items || 'Menu Items',
          total: order.total || 0.00,
          status: order.status || 'Pending',
          time,
          phone: order.phone || '9876543210',
          tableNumber: order.tableNumber || get().tableNumber || '4',
          paymentMethod: order.paymentMethod || 'UPI',
          specialInstructions: order.specialInstructions || '',
          kotNumber: order.kotNumber || ('KOT-' + Math.floor(100 + Math.random() * 900)),
          createdAt: order.createdAt || Date.now()
        };
        set({ orders: [newOrder, ...get().orders] });
        get().addNotification(`New incoming guest request ${id}`, 'success');
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          )
        });
        get().addNotification(`Request ${orderId} updated to ${status}`, 'info');
      },

      reorderPastOrder: (orderId) => {
        const past = get().pastOrders.find(o => o.id === orderId);
        if (!past) return;
        
        get().addNotification('Restoring past menu items to cart...', 'success');
        
        const regex = /([a-zA-Z\s]+)\((\d+)x\)/g;
        let match;
        const itemsToFind: { name: string, qty: number }[] = [];
        
        while ((match = regex.exec(past.items)) !== null) {
          itemsToFind.push({
            name: match[1].trim(),
            qty: parseInt(match[2])
          });
        }

        itemsToFind.forEach(item => {
          const found = get().menuItems.find(m => m.name.toLowerCase() === item.name.toLowerCase()) || 
                        { id: item.name.toLowerCase().replace(/\s+/g, '-'), name: item.name, price: 6.00, image: '/assets/placeholder.png', category: 'Café Craft', rating: '5.0', description: 'Gourmet selection' };
          
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
        get().addNotification(`Updated price to $${price.toFixed(2)}`, 'info');
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
      name: 'hospitality_os_state'
    }
  )
);
