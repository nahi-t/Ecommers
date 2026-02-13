// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  size: {
    type: [String],
    required: true,
    default: [],
  },
  image: {
    type: String,
    required: true,
  },
  // slug: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // ──────────────── NEW FIELD ────────────────
  category: {

  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category',
  required: true,
},
    
 
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);