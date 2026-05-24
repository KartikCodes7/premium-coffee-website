/**
 * RestaurantOS - Shared UI & Interactive Components Component Library
 * Injects reactive B2B SaaS elements, headers, carts, role-switchers, and custom toast systems.
 */

class UIComponents {
    constructor() {
        // Run injection when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.injectToastContainer();
        this.injectHeader();
        this.injectRoleSwitcher();
        this.setupEventListeners();
        
        // Listen for state changes to re-render dynamic components
        window.AppStore?.addEventListener('statechange', () => {
            this.renderHeader();
            this.renderCartOverlay();
        });
    }

    // --- Toast Notifications System ---
    injectToastContainer() {
        if (document.getElementById('os-toast-container')) return;
        const container = document.createElement('div');
        container.id = 'os-toast-container';
        container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none';
        document.body.appendChild(container);

        // Listen for state changes to show toasts for new notifications
        let lastCount = window.AppStore?.getNotifications().length || 0;
        window.AppStore?.addEventListener('statechange', (e) => {
            const currentNotifs = e.detail.notifications || [];
            if (currentNotifs.length > lastCount) {
                const newest = currentNotifs[0];
                this.showToast(newest.text, newest.type);
            }
            lastCount = currentNotifs.length;
        });
    }

    showToast(text, type = 'info') {
        const container = document.getElementById('os-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'glass-card p-4 rounded-xl border-l-4 flex items-center gap-3 shadow-2xl pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-300';
        
        // Color coding for different notification types
        if (type === 'success') {
            toast.classList.add('border-l-green-500');
            toast.innerHTML = `<span class="material-symbols-outlined text-green-400">check_circle</span>`;
        } else if (type === 'warning') {
            toast.classList.add('border-l-amber-500');
            toast.innerHTML = `<span class="material-symbols-outlined text-amber-400">warning</span>`;
        } else if (type === 'error') {
            toast.classList.add('border-l-red-500');
            toast.innerHTML = `<span class="material-symbols-outlined text-red-400">error</span>`;
        } else {
            toast.classList.add('border-l-[#E5C158]');
            toast.innerHTML = `<span class="material-symbols-outlined text-[#E5C158]">info</span>`;
        }

        const msgSpan = document.createElement('span');
        msgSpan.className = 'text-label-sm font-medium text-premium-white flex-1';
        msgSpan.innerText = text;
        toast.appendChild(msgSpan);

        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            toast.classList.add('translate-y-[-10px]', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // --- Header Injection & Setup ---
    injectHeader() {
        const headerPlaceholder = document.getElementById('global-header');
        if (!headerPlaceholder) return;

        // Render template
        this.renderHeader();
    }

    renderHeader() {
        const container = document.getElementById('global-header');
        if (!container) return;

        const session = window.AppStore?.getSession() || { user: 'Elena', role: 'Owner', restaurant: 'Aura Gastronomy' };
        const cartCount = window.AppStore?.getCartCount() || 0;

        // Determine active tab
        const path = window.location.pathname;
        const isChat = path.includes('chatbot.html');
        const isOrder = path.includes('order.html');
        const isDashboard = path.includes('dashboard.html');
        const isAnalytics = path.includes('analytics.html');

        container.className = "fixed top-0 left-0 w-full h-nav-height bg-surface/85 backdrop-blur-xl border-b border-ice-border z-50 transition-all";
        container.innerHTML = `
            <div class="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full max-w-grid-max-width mx-auto">
                <div class="flex items-center gap-6">
                    <a href="index.html" class="flex items-center gap-3 spring-interaction">
                        <span class="material-symbols-outlined text-[#E5C158] text-2xl font-bold">restaurant</span>
                        <div class="flex flex-col">
                            <h1 class="font-display-lg text-headline-md font-extrabold text-[#E5C158] tracking-tight">RestaurantOS</h1>
                            <span class="text-[9px] font-mono uppercase tracking-widest text-[#8E939E] -mt-1">${session.restaurant}</span>
                        </div>
                    </a>
                </div>

                <!-- Navigation Tabs -->
                <div class="flex items-center gap-6">
                    <nav class="hidden md:flex gap-8">
                        <a class="${isChat ? 'text-[#E5C158] font-bold border-b-2 border-[#E5C158] pb-1' : 'text-[#8E939E] hover:text-[#F4F5F6]'} transition-all font-body-md text-body-md" href="chatbot.html">AI Sommelier</a>
                        <a class="${isOrder ? 'text-[#E5C158] font-bold border-b-2 border-[#E5C158] pb-1' : 'text-[#8E939E] hover:text-[#F4F5F6]'} transition-all font-body-md text-body-md" href="order.html">Order Menu</a>
                        <a class="${isDashboard ? 'text-[#E5C158] font-bold border-b-2 border-[#E5C158] pb-1' : 'text-[#8E939E] hover:text-[#F4F5F6]'} transition-all font-body-md text-body-md" href="dashboard.html">Ops Terminal</a>
                        <a class="${isAnalytics ? 'text-[#E5C158] font-bold border-b-2 border-[#E5C158] pb-1' : 'text-[#8E939E] hover:text-[#F4F5F6]'} transition-all font-body-md text-body-md" href="analytics.html">Analytics Hub</a>
                    </nav>
                </div>

                <!-- Cart & Account Switcher -->
                <div class="flex items-center gap-6">
                    <!-- Dynamic Cart Trigger -->
                    <div id="cart-trigger" class="relative cursor-pointer group spring-interaction p-2">
                        <span class="material-symbols-outlined text-premium-white text-2xl">shopping_cart</span>
                        ${cartCount > 0 ? `<span class="absolute top-0 right-0 bg-[#E5C158] text-canvas-charcoal text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-canvas-charcoal">${cartCount}</span>` : ''}
                    </div>

                    <!-- User / SaaS Role indicator -->
                    <div class="flex items-center gap-3 pl-4 border-l border-ice-border">
                        <div class="hidden lg:flex flex-col text-right">
                            <span class="text-xs font-semibold text-premium-white">${session.user}</span>
                            <span class="text-[9px] font-mono tracking-widest text-[#E5C158] uppercase">${session.role} Mode</span>
                        </div>
                        <div class="w-8 h-8 rounded-full border border-ice-border overflow-hidden bg-glass-fill flex items-center justify-center cursor-pointer hover:border-[#E5C158]/50 transition-colors" id="profile-indicator">
                            <span class="material-symbols-outlined text-[#8E939E] text-lg">account_circle</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind quick overlay cart click
        document.getElementById('cart-trigger')?.addEventListener('click', () => {
            this.toggleCartOverlay(true);
        });
    }

    // --- Dynamic Side Cart Overlay ---
    injectCartOverlay() {
        if (document.getElementById('cart-sidebar-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'cart-sidebar-overlay';
        overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] opacity-0 pointer-events-none transition-all duration-300 flex justify-end';
        overlay.innerHTML = `
            <div class="w-full max-w-md h-full bg-[#12141C] border-l border-ice-border shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300" id="cart-sidebar-container">
                <!-- Header -->
                <div class="p-6 border-b border-ice-border flex justify-between items-center bg-[#0B0C0E]/50">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[#E5C158]">shopping_bag</span>
                        <h2 class="text-lg font-bold text-premium-white tracking-tight">Active Table Bill</h2>
                    </div>
                    <button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 text-[#8E939E] hover:text-premium-white transition-colors" id="close-cart-btn">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <!-- Scrollable items -->
                <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" id="cart-sidebar-items">
                    <!-- Dynamic rendering -->
                </div>

                <!-- Footer Summary -->
                <div class="p-6 border-t border-ice-border bg-[#0B0C0E]/30 space-y-4" id="cart-sidebar-summary">
                    <!-- Dynamic calculations -->
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Bind close button
        document.getElementById('close-cart-btn')?.addEventListener('click', () => this.toggleCartOverlay(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.toggleCartOverlay(false);
        });

        this.renderCartOverlay();
    }

    toggleCartOverlay(show) {
        this.injectCartOverlay();
        const overlay = document.getElementById('cart-sidebar-overlay');
        const container = document.getElementById('cart-sidebar-container');
        if (!overlay || !container) return;

        if (show) {
            overlay.classList.remove('pointer-events-none', 'opacity-0');
            container.classList.remove('translate-x-full');
            this.renderCartOverlay();
        } else {
            overlay.classList.add('pointer-events-none', 'opacity-0');
            container.classList.add('translate-x-full');
        }
    }

    renderCartOverlay() {
        const itemsContainer = document.getElementById('cart-sidebar-items');
        const summaryContainer = document.getElementById('cart-sidebar-summary');
        if (!itemsContainer || !summaryContainer) return;

        const cart = window.AppStore?.getCart() || [];
        const subtotal = window.AppStore?.getCartSubtotal() || 0.00;

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="h-64 flex flex-col items-center justify-center text-center space-y-3">
                    <span class="material-symbols-outlined text-4xl text-[#8E939E]/30">receipt_long</span>
                    <p class="text-sm text-[#8E939E]">No items selected for this table session.</p>
                    <a href="order.html" class="px-4 py-2 bg-glass-fill border border-ice-border hover:border-[#E5C158]/50 text-xs font-semibold rounded-lg text-[#E5C158] transition-colors">Browse Menu Specials</a>
                </div>
            `;
            summaryContainer.innerHTML = `
                <div class="flex justify-between items-center text-[#8E939E]">
                    <span class="text-sm">Subtotal</span>
                    <span class="font-mono">$0.00</span>
                </div>
                <button disabled class="w-full py-4 bg-white/5 text-[#8E939E] cursor-not-allowed rounded-xl font-bold text-center text-sm">Cart is Empty</button>
            `;
            return;
        }

        // Render list of items
        itemsContainer.innerHTML = cart.map(item => `
            <div class="glass-card p-4 rounded-xl flex gap-4 items-center">
                <img class="w-12 h-12 rounded-lg object-cover" src="${item.image}" alt="${item.name}">
                <div class="flex-1">
                    <h3 class="text-xs font-bold text-premium-white leading-tight">${item.name}</h3>
                    <p class="text-[10px] text-[#E5C158] font-mono mt-1">$${item.price.toFixed(2)}</p>
                    ${Object.keys(item.options).length > 0 ? `
                        <div class="text-[9px] text-[#8E939E] mt-1 flex flex-wrap gap-1">
                            ${Object.entries(item.options).map(([k, v]) => `<span class="bg-white/5 px-1.5 py-0.5 rounded">${v}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <!-- Quantity adjust -->
                <div class="flex items-center gap-2">
                    <button class="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs" onclick="window.UI?.adjustOverlayQty('${item.id}', -1)">-</button>
                    <span class="text-xs font-mono w-4 text-center">${item.qty}</span>
                    <button class="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs" onclick="window.UI?.adjustOverlayQty('${item.id}', 1)">+</button>
                </div>
                <button class="w-8 h-8 rounded-full hover:bg-red-500/10 text-[#8E939E] hover:text-red-400 flex items-center justify-center transition-colors" onclick="window.UI?.removeOverlayItem('${item.id}')">
                    <span class="material-symbols-outlined text-sm">delete</span>
                </button>
            </div>
        `).join('');

        // Render subtotal + checkout links
        summaryContainer.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between items-center text-[#8E939E] text-xs">
                    <span>Subtotal</span>
                    <span class="font-mono text-premium-white">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between items-center text-[#8E939E] text-xs">
                    <span>Est. Service Tax & VAT</span>
                    <span class="font-mono text-premium-white">$${(subtotal * 0.125).toFixed(2)}</span>
                </div>
                <div class="flex justify-between items-center border-t border-ice-border pt-3 mt-2 text-premium-white font-bold text-sm">
                    <span>Total Session Value</span>
                    <span class="font-mono text-[#E5C158]">$${(subtotal * 1.125).toFixed(2)}</span>
                </div>
            </div>
            <a href="order.html" class="block w-full py-4 bg-[#E5C158] text-canvas-charcoal rounded-xl font-bold text-center text-sm hover:brightness-110 transition-all spring-interaction shadow-lg">
                Proceed to Secure Checkout
            </a>
        `;
    }

    adjustOverlayQty(id, delta) {
        const item = window.AppStore?.getCart().find(i => i.id === id);
        if (item) {
            window.AppStore?.updateCartQty(id, item.qty + delta);
        }
    }

    removeOverlayItem(id) {
        window.AppStore?.removeFromCart(id);
    }

    // --- Role Switcher & B2B SaaS Simulation Widget ---
    injectRoleSwitcher() {
        const switcherPlaceholder = document.getElementById('role-switcher-container');
        if (!switcherPlaceholder) return;

        switcherPlaceholder.className = "fixed bottom-6 left-6 z-[9998]";
        this.renderRoleSwitcher();
    }

    renderRoleSwitcher() {
        const container = document.getElementById('role-switcher-container');
        if (!container) return;

        const session = window.AppStore?.getSession() || { role: 'Owner', restaurant: 'London' };

        container.innerHTML = `
            <div class="relative group">
                <!-- Main toggle button -->
                <button class="glass-card p-3 rounded-full flex items-center gap-2 shadow-2xl hover:border-[#E5C158]/50 transition-colors spring-interaction" id="switcher-toggle-btn">
                    <span class="material-symbols-outlined text-[#E5C158] animate-pulse">tune</span>
                    <span class="text-xs font-semibold text-premium-white pr-2">${session.role} Console</span>
                </button>

                <!-- Hidden menu that reveals on click/hover -->
                <div class="absolute bottom-full left-0 mb-3 bg-[#12141C] border border-ice-border rounded-xl p-3 shadow-2xl w-56 flex flex-col gap-1 transition-all opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:pointer-events-auto z-[9999]" id="switcher-menu">
                    <h3 class="text-[9px] font-mono tracking-widest text-[#8E939E] uppercase px-2 mb-2">Simulate Operations Role</h3>
                    
                    <button onclick="window.UI?.changeActiveRole('Owner')" class="text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${session.role === 'Owner' ? 'bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/20' : 'text-[#8E939E]' }">
                        <span>Owner/HQ Overview</span>
                        <span class="material-symbols-outlined text-xs">monitoring</span>
                    </button>
                    
                    <button onclick="window.UI?.changeActiveRole('Chef')" class="text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${session.role === 'Chef' ? 'bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/20' : 'text-[#8E939E]' }">
                        <span>Kitchen Chef View</span>
                        <span class="material-symbols-outlined text-xs">restaurant_menu</span>
                    </button>

                    <button onclick="window.UI?.changeActiveRole('Guest')" class="text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${session.role === 'Guest' ? 'bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/20' : 'text-[#8E939E]' }">
                        <span>Customer Guest Flow</span>
                        <span class="material-symbols-outlined text-xs">local_dining</span>
                    </button>

                    <h3 class="text-[9px] font-mono tracking-widest text-[#8E939E] uppercase px-2 mt-3 mb-2">Multi-Tenant Store Location</h3>

                    <button onclick="window.UI?.changeActiveLocation('Aura London')" class="text-left px-3 py-1.5 rounded-lg text-[11px] flex items-center justify-between hover:bg-white/5 text-[#8E939E] ${session.restaurant.includes('London') ? 'text-[#E5C158]' : ''}">
                        <span>Aura Gastronomy (London)</span>
                    </button>

                    <button onclick="window.UI?.changeActiveLocation('Aura Tokyo')" class="text-left px-3 py-1.5 rounded-lg text-[11px] flex items-center justify-between hover:bg-white/5 text-[#8E939E] ${session.restaurant.includes('Tokyo') ? 'text-[#E5C158]' : ''}">
                        <span>Aura Sushi (Tokyo)</span>
                    </button>
                </div>
            </div>
        `;
    }

    changeActiveRole(role) {
        window.AppStore?.switchRole(role);
        this.renderRoleSwitcher();
        
        // Dynamic operational updates depending on page
        const isDashboard = window.location.pathname.includes('dashboard.html');
        if (isDashboard) {
            // Live refresh of dashboard elements if present
            window.location.reload(); 
        }
    }

    changeActiveLocation(loc) {
        window.AppStore?.switchLocation(loc);
        this.renderRoleSwitcher();
        setTimeout(() => window.location.reload(), 300);
    }

    setupEventListeners() {
        // Global focus bindings on input focus glow
        document.querySelectorAll('input, select, textarea').forEach(el => {
            el.addEventListener('focus', () => {
                const parentCard = el.closest('.glass-card');
                if (parentCard) {
                    parentCard.style.borderColor = 'rgba(229, 193, 88, 0.4)';
                    parentCard.style.boxShadow = '0 0 15px rgba(229, 193, 88, 0.08)';
                }
            });
            el.addEventListener('blur', () => {
                const parentCard = el.closest('.glass-card');
                if (parentCard) {
                    parentCard.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    parentCard.style.boxShadow = 'none';
                }
            });
        });
    }
}

// Global Single Instance
window.UI = new UIComponents();
