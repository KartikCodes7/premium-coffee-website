# Design System: RestaurantOS

## 1. Visual Theme & Atmosphere
A sleek, luxurious dark modern interface with confident asymmetric layouts and fluid spring-physics motion. The atmosphere is minimal, dark-mode first, with glassmorphic cards, smooth gradients, and premium typography that feels like a combination of Stripe and a high-end Michelin-star restaurant.

## 2. Color Palette & Roles
- **Canvas Charcoal** (#0B0C0E) — Primary background canvas (dark, deep, premium off-black)
- **Deep Surface** (#12141C) — Secondary surface, card background
- **Glass Card Fill** (rgba(25, 28, 41, 0.45)) — Glassmorphic container fill with subtle blur
- **Ice Border** (rgba(255, 255, 255, 0.08)) — Glassmorphic border, 1px structural lines
- **Lux Gold** (#E5C158) — Primary accent for critical actions, CTAs, highlight borders, and active indicators
- **Premium White** (#F4F5F6) — Primary title and body text
- **Muted Steel** (#8E939E) — Secondary description text, captions, and metadata

## 3. Typography Rules
- **Display & Headlines:** Cabinet Grotesk / Satoshi — Track-tight (-0.02em), bold, weight-driven hierarchy
- **Body & Secondary:** Satoshi — Relaxed leading, 65ch max-width, neutral white or muted steel
- **Monospace & Metrics:** Geist Mono — Used for orders, prices, tables, timestamps, and high-density numbers
- **Banned:** Inter, generic system fonts, oversaturated gradients

## 4. Component Stylings
- **Buttons:** Modern flat or subtle border. Hover: +1px Y translation and scale(1.02). Active: tactile -1px translate. Primary button: Accent Lux Gold background with Canvas Charcoal text. Secondary button: Glass background with Ice Border and Premium White text.
- **Cards:** Generously rounded corners (1rem / 16px). Ice Border and Glass Card Fill. Used to group controls or content blocks. 
- **Inputs:** Label above input in Muted Steel, Ice Border with Glass Card Fill, error below in subtle red (#EF4444). Focus state: border color scales to Lux Gold.
- **Loaders:** Custom skeletal shimmer matching exact layout dimensions — no circular spinners.
- **Empty States:** Composed editorial compositions indicating how to populate data.

## 5. Layout Principles
- **asymmetric split-screen** layouts for primary hero sections (left-aligned content, right-aligned interactive floating preview/ordering elements)
- **CSS Grid** architecture with strict containment (max-width: 1440px)
- **Generous white space** to convey luxury (minimum section spacing: clamp(4rem, 10vw, 8rem))
- **Mobile-first column collapse** (single column below 768px). No horizontal overflows.
- **Sticky navigation** bar (height: 72px) with heavy background blur (backdrop-filter: blur(12px))

## 6. Motion & Interaction
- Weighty, fast spring physics (stiffness: 140, damping: 22) for all hover states and page entry transitions
- Staggered waterfall reveals for listings, menus, and dashboards
- Perpetual micro-animations: infinite slow floating effect on hero mockups, scanning shimmers on active AI elements
- Hardware-accelerated transitions: restrict animations to `transform` and `opacity` to avoid layout thrashing

## 7. Anti-Patterns (Banned)
- No emojis anywhere
- No Inter font or Georgia/Times New Roman
- No pure black (#000000) or pure white shadows
- No oversaturated blue/purple neon glows (strictly stick to Canvas Charcoal, Deep Surface, and Lux Gold)
- No 3-column equal grid layouts (use 2-column asymmetric or horizontal swipe cards)
- No AI copywriting clichés ("elevate", "seamless", "next-gen")
- No fabricated data or statistics (use clear placeholder labels or real variables)
- No broken image links (use high-fidelity premium images from picsum.photos or custom svgs)
