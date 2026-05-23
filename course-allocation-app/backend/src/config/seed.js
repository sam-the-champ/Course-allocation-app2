require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const Admin = require('../models/Admin');

const seed = async () => {
  await connectDB();

  const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
  if (existing) {
    console.log('⚠️  Admin already exists. Skipping seed.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await Admin.create({ username: process.env.ADMIN_USERNAME, password: hashed });

  console.log(`✅ Admin created: ${process.env.ADMIN_USERNAME}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
