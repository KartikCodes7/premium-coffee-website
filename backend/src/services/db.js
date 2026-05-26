const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const isDbConnected = !!process.env.DATABASE_URL;
let prisma = null;

if (isDbConnected) {
  try {
    prisma = new PrismaClient();
    console.log('[Prisma] Client successfully initialized using DATABASE_URL.');
  } catch (error) {
    console.error('[Prisma] Failed to initialize Prisma Client:', error);
  }
} else {
  console.log('[Prisma] DATABASE_URL is not set. Operating in in-memory database fallback mode.');
}

async function getOrCreateDefaultTenant() {
  if (!prisma) return null;
  try {
    const tenant = await prisma.tenant.upsert({
      where: { slug: 'aura-gastronomy' },
      update: {},
      create: {
        name: 'Aura Gastronomy',
        slug: 'aura-gastronomy',
        currency: 'USD',
        taxRate: 0.125,
        serviceRate: 0.10
      }
    });
    return tenant.id;
  } catch (error) {
    console.error('[Prisma] Error upserting default tenant:', error);
    return null;
  }
}

module.exports = {
  prisma,
  isDbConnected,
  getOrCreateDefaultTenant
};
