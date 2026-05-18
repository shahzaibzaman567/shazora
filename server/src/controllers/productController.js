import * as productService from '../services/productService.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const success = await productService.deleteProduct(req.params.id);
    if (success) {
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) { next(error); }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, image, category } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400);
      throw new Error('Product name is required');
    }
    if (price === undefined || price === '' || Number.isNaN(Number(price))) {
      res.status(400);
      throw new Error('Valid price is required');
    }
    if (!image || typeof image !== 'string' || !image.trim()) {
      res.status(400);
      throw new Error('Image URL is required');
    }
    if (!category || typeof category !== 'string' || !category.trim()) {
      res.status(400);
      throw new Error('Category is required');
    }
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { name, price, image, category } = req.body;
    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      res.status(400);
      throw new Error('Invalid product name');
    }
    if (price !== undefined && price !== '' && Number.isNaN(Number(price))) {
      res.status(400);
      throw new Error('Invalid price');
    }
    if (image !== undefined && (typeof image !== 'string' || !image.trim())) {
      res.status(400);
      throw new Error('Invalid image URL');
    }
    if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
      res.status(400);
      throw new Error('Invalid category');
    }
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};
