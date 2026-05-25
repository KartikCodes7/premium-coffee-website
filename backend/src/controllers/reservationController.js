const getMemoryDb = (req) => req.db;

exports.getReservations = (req, res) => {
  const db = getMemoryDb(req);
  res.json(db.reservations);
};

exports.createReservation = (req, res) => {
  const db = getMemoryDb(req);
  const { guestName, date, hour, guestsCount, booth } = req.body;

  if (!guestName || !date || !hour || !guestsCount) {
    return res.status(400).json({ error: 'Missing reservation parameters' });
  }

  const id = 'RES-' + Math.floor(10 + Math.random() * 90);
  const newRes = {
    id,
    guestName,
    date,
    hour,
    guestsCount: parseInt(guestsCount),
    booth: booth || 'Booth ' + Math.floor(1 + Math.random() * 8),
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

exports.confirmReservation = (req, res) => {
  const db = getMemoryDb(req);
  const { id } = req.params;

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

exports.cancelReservation = (req, res) => {
  const db = getMemoryDb(req);
  const { id } = req.params;

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
