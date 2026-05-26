const { prisma, isDbConnected, getOrCreateDefaultTenant } = require('../services/db');
const getMemoryDb = (req) => req.db;

exports.getOrders = async (req, res) => {
  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const orders = await prisma.order.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' }
      });
      const formatted = orders.map(o => ({
        id: o.ticketNumber,
        name: o.customerName,
        items: 'Gastronomic culinary experience',
        total: o.total,
        status: o.status,
        time: o.time
      }));
      return res.json(formatted);
    } catch (e) {
      console.error('[Prisma] Error getting orders:', e);
    }
  }

  const db = getMemoryDb(req);
  res.json(db.orders);
};

exports.createOrder = async (req, res) => {
  const { name, items, total } = req.body;

  if (!items || total === undefined) {
    return res.status(400).json({ error: 'Missing items or total' });
  }

  const ticketNumber = '#OS-' + Math.floor(1000 + Math.random() * 9000);
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const parsedTotal = parseFloat(total);

  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const newOrder = await prisma.order.create({
        data: {
          ticketNumber,
          customerName: name || 'Anonymous',
          total: parsedTotal,
          status: 'Pending',
          time,
          tenantId
        }
      });

      await prisma.notification.create({
        data: {
          text: `New incoming order ${ticketNumber}`,
          time,
          type: 'success',
          tenantId
        }
      });

      return res.status(201).json({
        id: ticketNumber,
        name: newOrder.customerName,
        items,
        total: newOrder.total,
        status: newOrder.status,
        time: newOrder.time
      });
    } catch (e) {
      console.error('[Prisma] Error creating order:', e);
    }
  }

  const db = getMemoryDb(req);
  const newOrder = {
    id: ticketNumber,
    name: name || 'Anonymous',
    items,
    total: parsedTotal,
    status: 'Pending',
    time
  };

  db.orders.unshift(newOrder);

  db.notifications.unshift({
    id: Date.now(),
    text: `New incoming order ${ticketNumber}`,
    time,
    type: 'success'
  });

  db.transactions.unshift({
    id: ticketNumber,
    name: newOrder.name,
    items: newOrder.items,
    total: newOrder.total,
    status: 'Pending',
    time: `Today, ${time}`
  });

  res.status(201).json(newOrder);
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const order = await prisma.order.update({
        where: { ticketNumber: id },
        data: { status }
      });

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await prisma.notification.create({
        data: {
          text: `Order ${id} updated to ${status}`,
          time,
          type: 'info',
          tenantId
        }
      });

      return res.json({
        id: order.ticketNumber,
        name: order.customerName,
        items: 'Gastronomic culinary experience',
        total: order.total,
        status: order.status,
        time: order.time
      });
    } catch (e) {
      console.error('[Prisma] Error updating order status:', e);
    }
  }

  const db = getMemoryDb(req);
  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db.notifications.unshift({
    id: Date.now(),
    text: `Order ${id} updated to ${status}`,
    time,
    type: 'info'
  });

  res.json(order);
};
