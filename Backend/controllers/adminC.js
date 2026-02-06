import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
export default { getAllUsers };