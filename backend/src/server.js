const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend communications
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Memory Fallback DB for local operations testing if PostgreSQL is not active
const memoryDb = {
  orders: [
    { id: '#OS-8902', name: 'Elena R.', items: 'Silk Flat White (1x), Almond Croissant (1x)', total: 11.30, status: 'Preparing', time: '15:28' },
    { id: '#OS-8901', name: 'Marcus K.', items: 'Nitro Cold Brew (1x), Truffle Egg Sandwich (1x)', total: 16.00, status: 'Served', time: '14:20' }
  ],
  notifications: [
    { id: 1, text: "Table 4 requested a waiter's assistance", time: "15:20", type: "info" },
    { id: 2, text: "New reservation: Charles V. (2 guests) tomorrow at 18:00", time: "14:45", type: "success" },
    { id: 3, text: "Supply alert: Premium Oat Milk stock below 20%", time: "11:10", type: "warning" }
  ],
  transactions: [
    { id: '#ROS-9241', name: 'Julianne Moore', items: 'Obsidian Iced Mocha (2x), Atelier Cinnamon Roll (1x)', total: 19.70, status: 'Served', time: 'Today, 14:15' },
    { id: '#ROS-9238', name: 'Theodore Vane', items: 'Silk Flat White (1x), Pastry (1x)', total: 11.30, status: 'Served', time: 'Today, 11:30' }
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
  ]
};

// Share memory db in request scope
app.use((req, res, next) => {
  req.db = memoryDb;
  next();
});

// Import route modules
const ordersRouter = require('./routes/orders');
const menuRouter = require('./routes/menu');
const reservationsRouter = require('./routes/reservations');
const chatRouter = require('./routes/chat');
const analyticsRouter = require('./routes/analytics');

// Register routes
app.use('/api/orders', ordersRouter);
app.use('/api/menu', menuRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/analytics', analyticsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`[RestaurantOS Backend] Running in modular mode on http://localhost:${PORT}`);
});
