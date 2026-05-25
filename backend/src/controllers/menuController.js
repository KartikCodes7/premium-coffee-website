const getMemoryDb = (req) => req.db;

exports.getMenuItems = (req, res) => {
  const db = getMemoryDb(req);
  res.json(db.menuItems);
};

exports.updateMenuPrice = (req, res) => {
  const db = getMemoryDb(req);
  const { id } = req.params;
  const { price } = req.body;

  if (price === undefined || isNaN(price)) {
    return res.status(400).json({ error: 'Valid item price required' });
  }

  const item = db.menuItems.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  item.price = parseFloat(price);
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db.notifications.unshift({
    id: Date.now(),
    text: `Menu price of ${item.name} adjusted to $${item.price.toFixed(2)}`,
    time,
    type: 'info'
  });

  res.json(item);
};

exports.addMenuItem = (req, res) => {
  const db = getMemoryDb(req);
  const { name, price, category, description, image } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price required' });
  }

  const id = name.toLowerCase().replace(/\s+/g, '-');
  const newItem = {
    id,
    name,
    price: parseFloat(price),
    category: category || 'Entree',
    image: image || '/assets/placeholder.png',
    rating: '5.0',
    description: description || 'Luxury culinary gastronomy item.'
  };

  db.menuItems.push(newItem);
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db.notifications.unshift({
    id: Date.now(),
    text: `Added ${name} to restaurant active menus`,
    time,
    type: 'success'
  });

  res.status(201).json(newItem);
};

exports.deleteMenuItem = (req, res) => {
  const db = getMemoryDb(req);
  const { id } = req.params;

  const idx = db.menuItems.findIndex(i => i.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  const deleted = db.menuItems.splice(idx, 1)[0];
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db.notifications.unshift({
    id: Date.now(),
    text: `Deleted ${deleted.name} from active menus`,
    time,
    type: 'warning'
  });

  res.json(deleted);
};
