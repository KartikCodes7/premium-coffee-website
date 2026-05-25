// In-memory fallback dataset for REST queries
const getMemoryDb = (req) => req.db;

exports.getOrders = (req, res) => {
  const db = getMemoryDb(req);
  res.json(db.orders);
};

exports.createOrder = (req, res) => {
  const db = getMemoryDb(req);
  const { name, items, total } = req.body;

  if (!items || total === undefined) {
    return res.status(400).json({ error: 'Missing items or total' });
  }

  const id = '#OS-' + Math.floor(1000 + Math.random() * 9000);
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const newOrder = {
    id,
    name: name || 'Anonymous',
    items,
    total: parseFloat(total),
    status: 'Pending',
    time
  };

  db.orders.unshift(newOrder);

  // Push notification alert
  db.notifications.unshift({
    id: Date.now(),
    text: `New incoming order ${id}`,
    time,
    type: 'success'
  });

  // Push telemetry transactions
  db.transactions.unshift({
    id,
    name: newOrder.name,
    items: newOrder.items,
    total: newOrder.total,
    status: 'Pending',
    time: `Today, ${time}`
  });

  res.status(201).json(newOrder);
};

exports.updateOrderStatus = (req, res) => {
  const db = getMemoryDb(req);
  const { id } = req.params;
  const { status } = req.body;

  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Logging shift notification
  db.notifications.unshift({
    id: Date.now(),
    text: `Order ${id} updated to ${status}`,
    time,
    type: 'info'
  });

  res.json(order);
};
