const { prisma, isDbConnected, getOrCreateDefaultTenant } = require('../services/db');
const getMemoryDb = (req) => req.db;

exports.getAnalytics = async (req, res) => {
  const db = getMemoryDb(req);

  let shiftRevenue = 0;
  let activeQueueCount = 0;
  let alertsCount = 0;
  let grossRevenue = 142850.00;
  let totalOrdersCount = 2450;
  let transactions = [];

  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const orders = await prisma.order.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' }
      });

      const notifications = await prisma.notification.findMany({
        where: { tenantId }
      });

      shiftRevenue = orders
        .filter(o => o.status === 'Served' || o.status === 'Completed' || o.status === 'Preparing')
        .reduce((sum, o) => sum + o.total, 0);

      activeQueueCount = orders.filter(o => o.status === 'Preparing' || o.status === 'Pending').length;
      alertsCount = notifications.length;

      orders.forEach(o => {
        grossRevenue += o.total;
        totalOrdersCount += 1;
      });

      transactions = orders.map(o => ({
        id: o.ticketNumber,
        name: o.customerName,
        items: 'Gastronomic culinary experience',
        total: o.total,
        status: o.status,
        time: `Today, ${o.time}`
      }));
    } catch (e) {
      console.error('[Prisma] Error getting analytics data:', e);
    }
  } else {
    shiftRevenue = db.orders
      .filter(o => o.status === 'Served' || o.status === 'Completed' || o.status === 'Preparing')
      .reduce((sum, o) => sum + o.total, 0);

    db.orders.forEach(o => {
      grossRevenue += o.total;
      totalOrdersCount += 1;
    });

    activeQueueCount = db.orders.filter(o => o.status === 'Preparing' || o.status === 'Pending').length;
    alertsCount = db.notifications.length;
    transactions = db.transactions;
  }

  const popularItems = [
    { name: 'Signature Wagyu', sold: 842, percentage: 85 },
    { name: 'Obsidian Gin & Tonic', sold: 621, percentage: 65 },
    { name: 'Seared Scallops', sold: 540, percentage: 55 },
    { name: 'Napa Valley Cabernet 2018', sold: 312, percentage: 35 }
  ];

  const cohortData = [
    { date: 'May 01', w0: '100%', w2: '42%', w4: '28%', w6: '15%' },
    { date: 'May 08', w0: '100%', w2: '38%', w4: '12%', w6: '8%' },
    { date: 'May 15', w0: '100%', w2: '24%', w4: '5%',  w6: '2%' },
    { date: 'May 22', w0: '100%', w2: '45%', w4: '18%',  w6: '—' }
  ];

  res.json({
    metrics: {
      grossRevenue,
      totalOrdersCount,
      avgOrderValue: 58.30,
      returningCohort: '68%',
      shiftRevenue,
      activeQueueCount,
      alertsCount
    },
    popularItems,
    cohortData,
    transactions
  });
};
