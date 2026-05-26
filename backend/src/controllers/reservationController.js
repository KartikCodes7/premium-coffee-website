const { prisma, isDbConnected, getOrCreateDefaultTenant } = require('../services/db');
const getMemoryDb = (req) => req.db;

exports.getReservations = async (req, res) => {
  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const reservations = await prisma.reservation.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(reservations);
    } catch (e) {
      console.error('[Prisma] Error getting reservations:', e);
    }
  }

  const db = getMemoryDb(req);
  res.json(db.reservations);
};

exports.createReservation = async (req, res) => {
  const { guestName, date, hour, guestsCount, booth } = req.body;

  if (!guestName || !date || !hour || !guestsCount) {
    return res.status(400).json({ error: 'Missing reservation parameters' });
  }

  const parsedGuestsCount = parseInt(guestsCount);
  const resolvedBooth = booth || 'Booth ' + Math.floor(1 + Math.random() * 8);

  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const newRes = await prisma.reservation.create({
        data: {
          guestName,
          date,
          hour,
          guestsCount: parsedGuestsCount,
          booth: resolvedBooth,
          status: 'Pending',
          tenantId
        }
      });

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await prisma.notification.create({
        data: {
          text: `Table reservation requested by ${guestName}`,
          time,
          type: 'success',
          tenantId
        }
      });

      return res.status(201).json(newRes);
    } catch (e) {
      console.error('[Prisma] Error creating reservation:', e);
    }
  }

  const db = getMemoryDb(req);
  const id = 'RES-' + Math.floor(10 + Math.random() * 90);
  const newRes = {
    id,
    guestName,
    date,
    hour,
    guestsCount: parsedGuestsCount,
    booth: resolvedBooth,
    status: 'Pending'
  };

  db.reservations.push(newRes);
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db.notifications.unshift({
    id: Date.now(),
    text: `Table reservation requested by ${guestName}`,
    time,
    type: 'success'
  });

  res.status(201).json(newRes);
};

exports.confirmReservation = async (req, res) => {
  const { id } = req.params;

  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const resv = await prisma.reservation.update({
        where: { id },
        data: { status: 'Confirmed' }
      });

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await prisma.notification.create({
        data: {
          text: `Table locked for ${resv.guestName} tonight at ${resv.hour}`,
          time,
          type: 'success',
          tenantId
        }
      });

      return res.json(resv);
    } catch (e) {
      console.error('[Prisma] Error confirming reservation:', e);
    }
  }

  const db = getMemoryDb(req);
  const resv = db.reservations.find(r => r.id === id);
  if (!resv) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  resv.status = 'Confirmed';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db.notifications.unshift({
    id: Date.now(),
    text: `Table locked for ${resv.guestName} tonight at ${resv.hour}`,
    time,
    type: 'success'
  });

  res.json(resv);
};

exports.cancelReservation = async (req, res) => {
  const { id } = req.params;

  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const resv = await prisma.reservation.update({
        where: { id },
        data: { status: 'Cancelled' }
      });

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await prisma.notification.create({
        data: {
          text: `Reservation for ${resv.guestName} cancelled`,
          time,
          type: 'warning',
          tenantId
        }
      });

      return res.json(resv);
    } catch (e) {
      console.error('[Prisma] Error cancelling reservation:', e);
    }
  }

  const db = getMemoryDb(req);
  const resv = db.reservations.find(r => r.id === id);
  if (!resv) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  resv.status = 'Cancelled';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db.notifications.unshift({
    id: Date.now(),
    text: `Reservation for ${resv.guestName} cancelled`,
    time,
    type: 'warning'
  });

  res.json(resv);
};
