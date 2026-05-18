import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = 'shahzaibzaman465@gmail.com';

await mongoose.connect(MONGO_URI);
const db = mongoose.connection.db;
const users = db.collection('users');

const existing = await users.findOne({ email: ADMIN_EMAIL });
if (existing) {
  await users.updateOne({ email: ADMIN_EMAIL }, { $set: { role: 'admin', status: 'active' } });
  console.log('✅ Admin role confirmed for:', ADMIN_EMAIL);
} else {
  const hash = await bcrypt.hash('admin123', 10);
  await users.insertOne({
    name: 'Shahzaib Admin',
    email: ADMIN_EMAIL,
    password: hash,
    role: 'admin',
    status: 'active',
    wishlist: [],
    recentlyViewed: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('✅ Admin created:', ADMIN_EMAIL, '/ password: admin123');
}

const count = await users.countDocuments();
const admins = await users.find({ role: 'admin' }).toArray();
console.log('Total users:', count, '| Admins:', admins.map(a => a.email));
await mongoose.disconnect();
process.exit(0);
