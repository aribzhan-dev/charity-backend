const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const dotenv = require('dotenv');

dotenv.config();

ADMIN_EMAIL = process.env.ADMIN_EMAIL
ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
MONGO_URI = process.env.MONGO_URI

const createDefaultAdmin = async () => {
  try {
    const existing = await Admin.findOne({ email: ADMIN_EMAIL });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await Admin.create({
        email: ADMIN_EMAIL,
        password: hashedPassword
      });
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Failed to create admin:', error.message);
  }
};


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    await createDefaultAdmin();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;