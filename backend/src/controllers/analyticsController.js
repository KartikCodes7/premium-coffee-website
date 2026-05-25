const getMemoryDb = (req) => req.db;

exports.getAnalytics = (req, res) => {
  const db = getMemoryDb(req);

  // Compute shift revenue dynamically
  const shiftRevenue = db.orders
    .filter(o => o.status === 'Served' || o.status === 'Completed' || o.status === 'Preparing')
    .reduce((sum, o) => sum + o.total, 0);

  // Compute gross sales
  let grossRevenue = 142850.00;
  let totalOrdersCount = 2450;

  db.orders.forEach(o => {
    grossRevenue += o.total;
    totalOrdersCount += 1;
  });

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
      activeQueueCount: db.orders.filter(o => o.status === 'Preparing' || o.status === 'Pending').length,
      alertsCount: db.notifications.length
    },
    popularItems,
    cohortData,
    transactions: db.transactions
  });
};
