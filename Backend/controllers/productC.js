import Product from '../models/Product.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).lean(); // .lean() for faster read-only queries
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// Get single product by ID or slug
export const getProduct = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Optional: Validate if identifier is ObjectId or slug
    let query = {};
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = identifier;
    } else {
      query.slug = identifier;
    }

    const product = await Product.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create product (with image from Multer)
export const createProduct = async (req, res) => {
  try {
    // req.file should be set by multer middleware
    let imageUrl = null;
    if (req.file) {
      // In production (Cloudinary): req.file.path is secure_url
      // In local: req.file.path is local path (e.g., 'uploads/...')
      imageUrl = req.file.path || req.file.location || req.file.secure_url; // Cloudinary often uses .secure_url / .location
    }

    const product = new Product({
      ...req.body,
      image: imageUrl,
      // Optional: Ensure slug is generated if not provided
      slug: req.body.slug || req.body.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ message: error.message || 'Invalid product data' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    // Handle new image upload (replace old one)
    if (req.file) {
      updateData.image = req.file.path || req.file.location || req.file.secure_url;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,          // Return updated doc
      runValidators: true // Enforce schema validation
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ message: error.message || 'Update failed' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Optional: Delete image from Cloudinary if exists
    if (product.image && product.image.includes('cloudinary.com')) {
      const publicId = extractPublicId(product.image); // implement helper
      await cloudinary.v2.uploader.destroy(publicId);
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};