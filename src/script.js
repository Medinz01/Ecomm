// scripts/syncSchema.js
import { sequelize } from './lib/db.js';
import { User } from './models/User.js'; // Add other models here if needed
import dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env manually


async function syncSchema() {
  try {
    console.log('🔄 Syncing DB schema...');
    await sequelize.sync({ alter: true }); // This updates columns/tables without data loss
    console.log('✅ Schema sync complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Schema sync failed:', error);
    process.exit(1);
  }
}

syncSchema();
