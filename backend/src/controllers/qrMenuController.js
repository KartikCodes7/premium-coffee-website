const getMemoryDb = (req) => req.db;

exports.getQrMenu = async (req, res) => {
  const db = getMemoryDb(req);
  res.json(db.qrMenuItems || []);
};

