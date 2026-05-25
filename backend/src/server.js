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
    { id: '#OS-8902', name: 'Elena R.', items: 'Signature Wagyu, Napa Valley 2018', total: 219.00, status: 'Preparing', time: '19:42' },
    { id: '#OS-8901', name: 'Marcus K.', items: 'Seared Scallops, Obsidian Gin', total: 54.00, status: 'Served', time: '19:20' }
  ],
  notifications: [
    { id: 1, text: "Table 4 requested sommelier guidance", time: "19:42", type: "info" },
    { id: 2, text: "New reservation: Elena Rostova (4 guests) at 20:30", time: "19:35", type: "success" },
    { id: 3, text: "Supply alert: Wagyu beef stock below threshold", time: "19:10", type: "warning" }
  ],
  transactions: [
    { id: '#ROS-9241', name: 'Julianne Moore', items: 'Signature Wagyu (2x), Obsidian Gin & Tonic', total: 270.00, status: 'Served', time: 'Today, 18:45' },
    { id: '#ROS-9238', name: 'Theodore Vane', items: 'Signature Wagyu, Napa Valley Cabernet 2018', total: 219.00, status: 'Served', time: 'Today, 17:50' }
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
