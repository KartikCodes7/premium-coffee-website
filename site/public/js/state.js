/**
 * RestaurantOS - Reactive State Engine
 * Manages global cart, operational sessions, active orders, and notifications across pages.
 */

class StateManager extends EventTarget {
    constructor() {
        super();
        this.storageKey = 'restaurant_os_state';
        
        // Load initial state or set defaults
        const defaultState = {
            cart: [
                {
                    id: 'wagyu-steak',
                    name: 'Signature Wagyu',
                    price: 124.00,
                    qty: 1,
                    image: 'assets/chatbot_steak.png',
                    options: { temperature: 'Medium Rare', sauce: 'Marrow Jus' }
                },
                {
                    id: 'napa-cabernet',
                    name: 'Napa Valley Cabernet 2018',
                    price: 95.00,
                    qty: 1,
                    image: 'assets/order_gin.png', // Fallback or wine
                    options: {}
                }
            ],
            session: {
                user: 'Elena Rostova',
                role: 'Owner', // Owner, Manager, Chef, Guest
                restaurant: 'Aura Gastronomy (London)'
            },
            notifications: [
                { id: 1, text: "Table 4 requested sommelier guidance", time: "19:42", type: "info" },
                { id: 2, text: "New reservation: Elena Rostova (4 guests) at 20:30", time: "19:35", type: "success" },
                { id: 3, text: "Supply alert: Wagyu beef stock below threshold", time: "19:10", type: "warning" }
            ],
            orders: [
                { id: '#OS-8902', name: 'Elena R.', items: 'Signature Wagyu, Napa Valley 2018', total: 219.00, status: 'Preparing', time: '19:42' },
                { id: '#OS-8901', name: 'Marcus K.', items: 'Seared Scallops, Obsidian Gin', total: 54.00, status: 'Served', time: '19:20' }
            ]
        };

        const stored = localStorage.getItem(this.storageKey);
        this.state = stored ? JSON.parse(stored) : defaultState;
    }

    _save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        this.dispatchEvent(new CustomEvent('statechange', { detail: this.state }));
    }

    // --- Cart Actions ---
    getCart() {
        return this.state.cart;
    }

    addToCart(item) {
        const existing = this.state.cart.find(i => i.id === item.id);
        if (existing) {
            existing.qty += (item.qty || 1);
        } else {
            this.state.cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty || 1,
                image: item.image || 'assets/placeholder.png',
                options: item.options || {}
            });
        }
        this.addNotification(`Added ${item.name} to cart`, 'success');
        this._save();
    }

    removeFromCart(id) {
        this.state.cart = this.state.cart.filter(item => item.id !== id);
        this._save();
    }

    updateCartQty(id, qty) {
        const item = this.state.cart.find(i => i.id === id);
        if (item) {
            item.qty = Math.max(1, qty);
            this._save();
        }
    }

    clearCart() {
        this.state.cart = [];
        this._save();
    }

    getCartSubtotal() {
        return this.state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    getCartCount() {
        return this.state.cart.reduce((sum, item) => sum + item.qty, 0);
    }

    // --- Session / Tenant Switcher ---
    getSession() {
        return this.state.session;
    }

    switchRole(role) {
        this.state.session.role = role;
        this.addNotification(`Switched role to ${role}`, 'info');
        this._save();
    }

    switchLocation(location) {
        this.state.session.restaurant = location;
        this.addNotification(`Switched location to ${location}`, 'info');
        this._save();
    }

    // --- Notifications Hub ---
    getNotifications() {
        return this.state.notifications;
    }

    addNotification(text, type = 'info') {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.state.notifications.unshift({
            id: Date.now(),
            text,
            time,
            type
        });
        // Limit notifications to 10
        if (this.state.notifications.length > 10) {
            this.state.notifications.pop();
        }
        this._save();
    }

    clearNotifications() {
        this.state.notifications = [];
        this._save();
    }

    // --- Live Orders Stream (Simulated Queue) ---
    getOrders() {
        return this.state.orders;
    }

    addLiveOrder(order) {
        const id = '#OS-' + Math.floor(1000 + Math.random() * 9000);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.state.orders.unshift({
            id,
            name: order.name || 'Anonymous',
            items: order.items || 'Menu Items',
            total: order.total || 0.00,
            status: 'Pending',
            time
        });
        this.addNotification(`New incoming order ${id}`, 'success');
        this._save();
    }

    updateOrderStatus(orderId, status) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            this.addNotification(`Order ${orderId} updated to ${status}`, 'info');
            this._save();
        }
    }
}

// Global Single Instance
window.AppStore = new StateManager();
