import Product from '../models/Product.js';

const makeDemoProducts = () => {
  const list = [];
  for (let i = 1; i <= 220; i += 1) {
    const category = i <= 110 ? 'men' : 'women';
    list.push({
      _id: `fallback-${i}`,
      name: `${category === 'men' ? 'Urban Fit' : 'Luna Wear'} ${i}`,
      image: category === 'men'
        ? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
        : 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80',
      brand: 'Shazora Demo',
      category,
      description: `Default ${category} product for storefront demos and testing.`,
      price: 30 + (i % 15) * 6,
      countInStock: 5 + (i % 10),
      rating: 4.2,
      numReviews: 18 + (i % 60),
    });
  }
  return list;
};

export const getProducts = async () => {
  const products = await Product.find({});
  if (!products.length) {
    return makeDemoProducts();
  }
  return products;
};

export const getProductById = async (id) => {
  return await Product.findById(id);
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (product) {
    await product.deleteOne();
    return true;
  }
  return false;
};

export const createProduct = async (data) => {
  const price = data.price !== undefined && data.price !== '' ? Number(data.price) : 0;
  const countInStock =
    data.countInStock !== undefined && data.countInStock !== ''
      ? Number(data.countInStock)
      : 0;

  const product = new Product({
    name: data.name || 'Sample Product',
    price: Number.isFinite(price) ? price : 0,
    user: data.userId,
    image: data.image || '/images/sample.jpg',
    brand: data.brand || 'Shazora',
    category: data.category || 'men',
    countInStock: Number.isFinite(countInStock) ? countInStock : 0,
    numReviews: 0,
    rating: 0,
    description: data.description || 'Sample description',
  });
  return await product.save();
};

export const updateProduct = async (id, data) => {
  const product = await Product.findById(id);
  if (!product) return null;

  if (data.name !== undefined) product.name = data.name;
  if (data.price !== undefined && data.price !== '') {
    const p = Number(data.price);
    if (Number.isFinite(p)) product.price = p;
  }
  if (data.description !== undefined) product.description = data.description;
  if (data.image !== undefined) product.image = data.image;
  if (data.brand !== undefined) product.brand = data.brand;
  if (data.category !== undefined) product.category = data.category;
  if (data.countInStock !== undefined && data.countInStock !== '') {
    const c = Number(data.countInStock);
    if (Number.isFinite(c)) product.countInStock = c;
  }

  return await product.save();
};
