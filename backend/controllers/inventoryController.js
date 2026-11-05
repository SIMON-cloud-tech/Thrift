const crypto = require('crypto');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const Product = require('../models/Products');

// ─── helpers ───
const parseSizes = (raw) => {
  if (raw === undefined || raw === null || raw === '') return [];
  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(arr) ? arr.map(Number).filter((n) => !isNaN(n)) : [];
  } catch {
    return [];
  }
};

const uploadMany = (files = []) =>
  Promise.all(files.map((f) => uploadToCloudinary(f.buffer, 'dripmtaani/products')));

const getUploadedFiles = (req) =>
  req.files || (req.file ? [req.file] : []);

// ─── PUBLIC: get all products (optional ?category=) ───
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PUBLIC: get single product by id ───
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: add a new product ───
exports.addProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, price, description, category, badge } = req.body;
    const sizes = parseSizes(req.body.sizes);
    const files = getUploadedFiles(req);

    if (!name || !price || !description || !category) {
      return res
        .status(400)
        .json({ message: 'Name, price, description, and category are required' });
    }

    if (!sizes.length) {
      return res.status(400).json({ message: 'At least one size is required' });
    }

    const images = await uploadMany(files.slice(0, 4));

    const newProduct = new Product({
      id: crypto.randomUUID(),
      userId,
      name,
      price: parseFloat(price),
      description,
      category,
      badge: badge || '',
      sizes,
      images,
      image: images[0] || '',
      rating: 0,
      reviews: 0,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: update a product ───
exports.updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { name, price, description, category, badge } = req.body;
    const files = getUploadedFiles(req);

    const product = await Product.findOne({ id: productId, userId });
    if (!product) {
      return res
        .status(404)
        .json({ message: 'Product not found or unauthorized' });
    }

    // ── Determine which existing images to keep ──
    let keptImages = product.images?.length
      ? product.images
      : product.image
      ? [product.image]
      : [];

    if (req.body.existingImages !== undefined) {
      try {
        const parsed = JSON.parse(req.body.existingImages);
        if (Array.isArray(parsed)) keptImages = parsed;
      } catch {
        // ignore malformed payload, keep current
      }
    }

    // ── Upload any new files ──
    const remainingSlots = Math.max(0, 4 - keptImages.length);
    const newImages = await uploadMany(files.slice(0, remainingSlots));

    // ── Combine + cap at 4 ──
    const combined = [...keptImages, ...newImages].slice(0, 4);

    // ── Apply text fields (honor explicit empty values where meaningful) ──
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = parseFloat(price);
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (badge !== undefined) product.badge = badge;
    if (req.body.sizes !== undefined) product.sizes = parseSizes(req.body.sizes);

    product.images = combined;
    product.image = combined[0] || '';

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: delete a product ───
exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const result = await Product.deleteOne({ id: productId, userId });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: 'Product not found or unauthorized' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};