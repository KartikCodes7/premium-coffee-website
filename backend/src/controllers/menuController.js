const { prisma, isDbConnected, getOrCreateDefaultTenant } = require('../services/db');
const getMemoryDb = (req) => req.db;

exports.getMenuItems = async (req, res) => {
  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const items = await prisma.menuItem.findMany({
        where: { tenantId }
      });
      // Seed DB with memory database defaults if empty
      if (items.length === 0) {
        const seedItems = getMemoryDb(req).menuItems;
        const created = [];
        for (const it of seedItems) {
          const newItem = await prisma.menuItem.create({
            data: {
              name: it.name,
              price: it.price,
              category: it.category,
              image: it.image,
              rating: it.rating,
              description: it.description,
              tenantId
            }
          });
          created.push(newItem);
        }
        return res.json(created);
      }
      return res.json(items);
    } catch (e) {
      console.error('[Prisma] Error getting menu items:', e);
    }
  }

  const db = getMemoryDb(req);
  res.json(db.menuItems);
};

exports.updateMenuPrice = async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  if (price === undefined || isNaN(price)) {
    return res.status(400).json({ error: 'Valid item price required' });
  }

  const parsedPrice = parseFloat(price);

  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const updatedItem = await prisma.menuItem.update({
        where: { id },
        data: { price: parsedPrice }
      });

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await prisma.notification.create({
        data: {
          text: `Menu price of ${updatedItem.name} adjusted to $${updatedItem.price.toFixed(2)}`,
          time,
          type: 'info',
          tenantId
        }
      });

      return res.json(updatedItem);
    } catch (e) {
      console.error('[Prisma] Error updating menu price:', e);
    }
  }

  const db = getMemoryDb(req);
  const item = db.menuItems.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  item.price = parsedPrice;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db.notifications.unshift({
    id: Date.now(),
    text: `Menu price of ${item.name} adjusted to $${item.price.toFixed(2)}`,
    time,
    type: 'info'
  });

  res.json(item);
};

exports.addMenuItem = async (req, res) => {
  const { name, price, category, description, image } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price required' });
  }

  const parsedPrice = parseFloat(price);

  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const newItem = await prisma.menuItem.create({
        data: {
          name,
          price: parsedPrice,
          category: category || 'Entree',
          image: image || '/assets/placeholder.png',
          rating: '5.0',
          description: description || 'Luxury culinary gastronomy item.',
          tenantId
        }
      });

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await prisma.notification.create({
        data: {
          text: `Added ${name} to restaurant active menus`,
          time,
          type: 'success',
          tenantId
        }
      });

      return res.status(201).json(newItem);
    } catch (e) {
      console.error('[Prisma] Error adding menu item:', e);
    }
  }

  const db = getMemoryDb(req);
  const id = name.toLowerCase().replace(/\s+/g, '-');
  const newItem = {
    id,
    name,
    price: parsedPrice,
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

exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  if (isDbConnected) {
    try {
      const tenantId = await getOrCreateDefaultTenant();
      const deletedItem = await prisma.menuItem.delete({
        where: { id }
      });

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await prisma.notification.create({
        data: {
          text: `Deleted ${deletedItem.name} from active menus`,
          time,
          type: 'warning',
          tenantId
        }
      });

      return res.json(deletedItem);
    } catch (e) {
      console.error('[Prisma] Error deleting menu item:', e);
    }
  }

  const db = getMemoryDb(req);
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
