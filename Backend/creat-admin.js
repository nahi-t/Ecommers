// // create-admin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; // adjust path if your models folder is different

dotenv.config();



const createDefaultAdmin = async () => {
  if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@example.com';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin with email ${adminEmail} already exists.`);
      return; // Use return instead of process.exit here to allow proper cleanup in finally
    }

    const admin = new User({
      name: 'Admin User',
      email: adminEmail,
      password: 'admin123', 
      role: 'admin',
      phone: '1234567890',
      address: 'Admin Address',
      
    });

    await admin.save();
    console.log(`✅ Default admin created successfully`);

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Call the function!
 export { createDefaultAdmin };