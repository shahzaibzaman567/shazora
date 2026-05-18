import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to this file's position (inside server/src/)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const INSFORGE_URL = process.env.INSFORGE_URL;
const INSFORGE_ANON_KEY = process.env.INSFORGE_ANON_KEY;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shazora';

// Premium storefront initial products to seed (30 Men's Fashion & 30 Women's Fashion)
const makeDemoProducts = () => {
  const menFashion = [
    { name: 'Jacket + Sunglasses Portrait', description: 'Modern jacket styling with sunglasses, perfect for hero banner image.', price: 39.99, image: 'https://images.pexels.com/photos/839016/pexels-photo-839016.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 15, rating: 4.8, numReviews: 24 },
    { name: 'Curly Hair Jacket Look', description: 'Trendy jacket with sunglasses, outdoor portrait vibe for fashion store.', price: 37.99, image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 12, rating: 4.5, numReviews: 18 },
    { name: 'Leather Jacket Side Profile', description: 'Bold leather jacket and sunglasses look, premium street fashion feel.', price: 49.99, image: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 20, rating: 4.6, numReviews: 32 },
    { name: 'Urban Color Backdrop Jacket', description: 'Stylish jacket portrait on colorful wall, great for product listing thumbnails.', price: 34.99, image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 8, rating: 4.9, numReviews: 15 },
    { name: 'City Jacket Street Pose', description: 'Clean urban jacket styling with shades, ideal for lifestyle catalog.', price: 36.99, image: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 25, rating: 4.4, numReviews: 40 },
    { name: 'Denim Fashion Editorial', description: 'Contemporary denim fashion portrait, modern style for denim category.', price: 44.99, image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 10, rating: 4.7, numReviews: 22 },
    { name: 'Denim Jacket Portrait', description: 'Denim jacket statement look, suitable for casual menwear listings.', price: 41.99, image: 'https://images.pexels.com/photos/936002/pexels-photo-936002.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 7, rating: 4.8, numReviews: 29 },
    { name: 'Denim Group Street Style', description: 'Denim street group fashion shot, good for lookbook and campaigns.', price: 52.99, image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 14, rating: 4.9, numReviews: 35 },
    { name: 'Oversized Denim Streetwear', description: 'Trendy oversized streetwear and denim, perfect for street collections.', price: 46.99, image: 'https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 6, rating: 4.7, numReviews: 12 },
    { name: 'Casual Denim Outdoor Portrait', description: 'Relaxed denim jacket look, everyday urban vibe for ecommerce.', price: 38.99, image: 'https://images.pexels.com/photos/845457/pexels-photo-845457.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 9, rating: 4.6, numReviews: 17 },
    { name: 'Autumn Trench Coat Studio', description: 'Seasonal trench coat styling with autumn props, premium outerwear feel.', price: 59.99, image: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 5, rating: 4.9, numReviews: 45 },
    { name: 'Trench Coat Autumn Mood', description: 'Cozy fall styling with trench coat, perfect for winter collection.', price: 57.99, image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 4, rating: 4.8, numReviews: 8 },
    { name: 'Moody Trench Coat Portrait', description: 'Indoor trench coat portrait, clean editorial vibe for menswear.', price: 54.99, image: 'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 3, rating: 4.7, numReviews: 14 },
    { name: 'Trench Coat Outdoor Pose', description: 'Outdoor trench coat pose, rugged fashion vibe for campaigns.', price: 62.99, image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 8, rating: 4.9, numReviews: 21 },
    { name: 'Trench Coat Sky Background', description: 'Stylish trench coat look under cloudy sky, bold fashion portrait.', price: 58.99, image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 2, rating: 5.0, numReviews: 50 },
    { name: 'Black Outfit Studio', description: 'Minimal black outfit studio shot, clean product display style.', price: 29.99, image: 'https://images.pexels.com/photos/93827/pexels-photo-93827.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 11, rating: 4.5, numReviews: 16 },
    { name: 'Ripped Jeans Studio Look', description: 'Casual ripped jeans studio style, modern street fashion feel.', price: 32.99, image: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 16, rating: 4.6, numReviews: 19 },
    { name: 'Graphic Tee Studio Outfit', description: 'Denim + graphic tee styling in studio, perfect for casual category.', price: 27.99, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 13, rating: 4.7, numReviews: 23 },
    { name: 'Orange Jacket Studio Pose', description: 'Color pop jacket for trending collection, studio product vibe.', price: 35.99, image: 'https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 18, rating: 4.4, numReviews: 11 },
    { name: 'Clean Casual Studio Portrait', description: 'Simple casual studio portrait, best for catalog and listing pages.', price: 28.99, image: 'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 22, rating: 4.3, numReviews: 15 },
    { name: 'Sweater Outdoor Portrait', description: 'Cozy sweater look outdoors, ideal for winter essentials listing.', price: 33.99, image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 30, rating: 4.2, numReviews: 8 },
    { name: 'B&W Sweater Portrait', description: 'Classic black and white sweater portrait, premium minimal vibe.', price: 31.99, image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 5, rating: 4.8, numReviews: 26 },
    { name: 'Smart Sweater + Pants', description: 'Elegant sweater outfit, clean styling for men casual collection.', price: 36.99, image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 4, rating: 4.9, numReviews: 31 },
    { name: 'Artistic Sweater Light', description: 'Creative lighting sweater portrait, good for editorial fashion use.', price: 34.99, image: 'https://images.pexels.com/photos/842927/pexels-photo-842927.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 3, rating: 4.7, numReviews: 13 },
    { name: 'Skatepark Sweater Look', description: 'Casual sweater outfit, youthful vibe, streetwear friendly.', price: 26.99, image: 'https://images.pexels.com/photos/842944/pexels-photo-842944.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 2, rating: 4.9, numReviews: 17 },
    { name: 'Blazer + Sunglasses Rose', description: 'Fashion blazer look with sunglasses, premium party/formal category.', price: 64.99, image: 'https://images.pexels.com/photos/842953/pexels-photo-842953.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 10, rating: 4.8, numReviews: 22 },
    { name: 'Checkered Suit Sunglasses', description: 'Classic checkered suit + sunglasses vibe, ideal for formal listings.', price: 69.99, image: 'https://images.pexels.com/photos/842959/pexels-photo-842959.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 9, rating: 4.6, numReviews: 18 },
    { name: 'Sneakers Street Closeup', description: 'Trendy sneakers street closeup, perfect for footwear product pages.', price: 49.99, image: 'https://images.pexels.com/photos/842971/pexels-photo-842971.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 12, rating: 4.7, numReviews: 29 },
    { name: 'Sneaker Showcase Portrait', description: 'Street-style sneaker focused portrait, great for shoe category banners.', price: 46.99, image: 'https://images.pexels.com/photos/842974/pexels-photo-842974.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 14, rating: 4.5, numReviews: 12 },
    { name: 'Watch + Wallet Flatlay', description: 'Men accessories flatlay (watch, wallet, glasses), ideal for accessories section.', price: 19.99, image: 'https://images.pexels.com/photos/842986/pexels-photo-842986.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'men', countInStock: 15, rating: 4.4, numReviews: 20 }
  ];

  const womenFashion = [
    { name: 'Women Stylish Suit Look', description: 'Modern suit styling, confident look, ideal for premium fashion listings.', price: 69.99, image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 12, rating: 4.8, numReviews: 32 },
    { name: 'Smart Casual Outfit Set', description: 'Trendy smart casual outfits, studio look, perfect for new arrivals.', price: 54.99, image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 15, rating: 4.6, numReviews: 19 },
    { name: 'Black Outfit Studio Look', description: 'Sleek black outfits, dramatic studio vibe, great for partywear category.', price: 59.99, image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 8, rating: 4.7, numReviews: 25 },
    { name: 'Minimal Brown Outfit', description: 'Clean minimal outfit, studio background, best for everyday fashion.', price: 39.99, image: 'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 20, rating: 4.5, numReviews: 14 },
    { name: 'Elegant Suit and Accessories', description: 'Chic outfit with accessories, modern styling, perfect for officewear.', price: 64.99, image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 10, rating: 4.9, numReviews: 18 },
    { name: 'Retro Streetwear Vibe', description: 'Urban street fashion portrait, bold vibe, best for streetwear brands.', price: 44.99, image: 'https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 14, rating: 4.6, numReviews: 27 },
    { name: 'Trendy Streetwear Walk', description: 'Modern streetwear look, bold styling, great for casual collections.', price: 46.99, image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 11, rating: 4.7, numReviews: 15 },
    { name: 'Urban Crosswalk Style', description: 'City fashion moment, stylish outfit, perfect for ecommerce banners.', price: 49.99, image: 'https://images.pexels.com/photos/794064/pexels-photo-794064.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 9, rating: 4.8, numReviews: 22 },
    { name: 'Vibrant Street Style Outfit', description: 'Colorful street look, standout fashion, best for seasonal campaigns.', price: 47.99, image: 'https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 13, rating: 4.5, numReviews: 31 },
    { name: 'Chic Sunglasses Street Look', description: 'Sunglasses + tote styling, city vibe, perfect for lifestyle store.', price: 42.99, image: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 16, rating: 4.4, numReviews: 16 },
    { name: 'Floral Black Dress', description: 'Elegant floral dress look, outdoor portrait, ideal for party and dinners.', price: 58.99, image: 'https://images.pexels.com/photos/1485031/pexels-photo-1485031.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 7, rating: 4.7, numReviews: 28 },
    { name: 'Beige Tulle Dress', description: 'Soft tulle dress, premium feel, perfect for events and shoots.', price: 74.99, image: 'https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 5, rating: 4.9, numReviews: 40 },
    { name: 'Traditional White Attire', description: 'Classic elegant look, bright outdoor portrait, premium clothing listing.', price: 52.99, image: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 18, rating: 4.8, numReviews: 14 },
    { name: 'Patterned Dress Look', description: 'Vibrant patterned dress, stylish pose, great for summer collection.', price: 61.99, image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 6, rating: 4.6, numReviews: 19 },
    { name: 'Satin Dress Elegant', description: 'Satin finish dress, luxury vibe, perfect for eveningwear category.', price: 79.99, image: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 4, rating: 4.9, numReviews: 33 },
    { name: 'Formal Blazer Group', description: 'Blazer fashion, confident pose, perfect for officewear category.', price: 66.99, image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 10, rating: 4.7, numReviews: 24 },
    { name: 'Color Blazer Duo', description: 'Bright blazer fashion, outdoor vibe, best for trending items.', price: 63.99, image: 'https://images.pexels.com/photos/1839904/pexels-photo-1839904.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 12, rating: 4.6, numReviews: 21 },
    { name: 'Blazer Shore Look', description: 'Blazer and pants styling, premium editorial vibe, modern collection.', price: 68.99, image: 'https://images.pexels.com/photos/1839905/pexels-photo-1839905.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 5, rating: 4.8, numReviews: 17 },
    { name: 'Minimal Pink Blazer Set', description: 'Clean studio blazer look, modern fit, ideal for workwear.', price: 62.99, image: 'https://images.pexels.com/photos/1858482/pexels-photo-1858482.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 8, rating: 4.7, numReviews: 13 },
    { name: 'Dramatic Blazer Pose', description: 'Dark backdrop blazer fashion, premium styling, perfect for hero images.', price: 64.99, image: 'https://images.pexels.com/photos/1839905/pexels-photo-1839905.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 9, rating: 4.5, numReviews: 29 },
    { name: 'Women Accessories Flatlay', description: 'Boots, blouse and accessories flatlay, perfect for ecommerce category pages.', price: 29.99, image: 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 30, rating: 4.3, numReviews: 10 },
    { name: 'Summer Flatlay Set', description: 'Hat, scarf, camera and outfit flatlay, summer campaign ready.', price: 27.99, image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 25, rating: 4.4, numReviews: 14 },
    { name: 'Bag and Flats Flatlay', description: 'Bag, flats and jewelry flatlay, ideal for accessories product listings.', price: 24.99, image: 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 22, rating: 4.2, numReviews: 11 },
    { name: 'Handbag and Makeup Flatlay', description: 'Handbag + sunglasses + makeup flatlay, perfect for beauty-fashion combo.', price: 26.99, image: 'https://images.pexels.com/photos/934069/pexels-photo-934069.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 28, rating: 4.5, numReviews: 18 },
    { name: 'Heels and Purse Flatlay', description: 'Heels with purse flatlay, premium vibe for women footwear category.', price: 31.99, image: 'https://images.pexels.com/photos/1374910/pexels-photo-1374910.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 15, rating: 4.6, numReviews: 24 },
    { name: 'Denim Jacket Street Pose', description: 'Trendy denim jacket look, colorful street background, casual category fit.', price: 44.99, image: 'https://images.pexels.com/photos/1390600/pexels-photo-1390600.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 14, rating: 4.5, numReviews: 16 },
    { name: 'Redhead Denim Jacket', description: 'Denim jacket portrait, street vibe, perfect for casualwear listings.', price: 42.99, image: 'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 12, rating: 4.4, numReviews: 12 },
    { name: 'Denim Set Urban Walk', description: 'Denim jacket and jeans, modern street feel, best for everyday wear.', price: 46.99, image: 'https://images.pexels.com/photos/1390602/pexels-photo-1390602.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 13, rating: 4.6, numReviews: 15 },
    { name: 'Denim Jacket Clean Look', description: 'Denim jacket styling, outdoor pose, great for minimal product pages.', price: 43.99, image: 'https://images.pexels.com/photos/1805411/pexels-photo-1805411.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 11, rating: 4.5, numReviews: 9 },
    { name: 'Leather Jacket Sidewalk', description: 'Leather jacket street outfit, modern bold vibe, perfect for winterwear.', price: 59.99, image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800', brand: 'Shazora', category: 'women', countInStock: 10, rating: 4.7, numReviews: 21 }
  ];

  return [...menFashion, ...womenFashion];
};

async function runMigration() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully!');

    // Check existing products count
    const existingProductsCount = await Product.countDocuments();
    console.log(`📊 Found ${existingProductsCount} existing products in MongoDB.`);

    let migratedProducts = [];
    let migratedUsers = [];
    let migratedOrders = [];

    let fetchedFromInsForge = false;

    if (INSFORGE_URL && INSFORGE_ANON_KEY) {
      console.log(`🔄 Attempting to fetch data from InsForge: ${INSFORGE_URL}`);
      const headers = {
        apikey: INSFORGE_ANON_KEY,
        Authorization: `Bearer ${INSFORGE_ANON_KEY}`,
      };

      try {
        // Fetch Products
        console.log('📦 Fetching products from InsForge REST API...');
        const prodRes = await fetch(`${INSFORGE_URL}/rest/v1/products?select=*`, { headers });
        if (!prodRes.ok) throw new Error(`HTTP ${prodRes.status} ${prodRes.statusText}`);
        migratedProducts = await prodRes.json();
        console.log(`✅ Fetched ${migratedProducts.length} products from InsForge.`);

        // Fetch Users (Profiles)
        console.log('👥 Fetching profiles from InsForge REST API...');
        const userRes = await fetch(`${INSFORGE_URL}/rest/v1/profiles?select=*`, { headers });
        if (!userRes.ok) throw new Error(`HTTP ${userRes.status} ${userRes.statusText}`);
        migratedUsers = await userRes.json();
        console.log(`✅ Fetched ${migratedUsers.length} profiles from InsForge.`);

        // Fetch Orders
        console.log('🛒 Fetching orders from InsForge REST API...');
        const orderRes = await fetch(`${INSFORGE_URL}/rest/v1/orders?select=*`, { headers });
        if (!orderRes.ok) throw new Error(`HTTP ${orderRes.status} ${orderRes.statusText}`);
        migratedOrders = await orderRes.json();
        console.log(`✅ Fetched ${migratedOrders.length} orders from InsForge.`);

        fetchedFromInsForge = true;
      } catch (err) {
        console.error('❌ Failed to query InsForge REST API:', err.message);
        console.log('⚠️  InsForge database is paused or unreachable. Falling back to seeding high-quality demo data.');
      }
    } else {
      console.log('⚠️  No InsForge keys found in .env. Seeding default demo data.');
    }

    // 1. Seed/Migrate Products
    if (fetchedFromInsForge && migratedProducts.length > 0) {
      console.log('💾 Migrating InsForge products to MongoDB...');
      await Product.deleteMany({}); // Clean slate
      
      const mappedProducts = migratedProducts.map(p => ({
        name: p.name,
        image: p.image,
        brand: p.brand || 'Shazora',
        category: p.category || 'men',
        description: p.description || 'Premium apparel',
        price: Number(p.price) || 0,
        countInStock: Number(p.count_in_stock || p.countStock) || 0,
        rating: Number(p.rating) || 0,
        numReviews: Number(p.num_reviews || p.numReviews) || 0,
      }));
      
      await Product.insertMany(mappedProducts);
      console.log(`🎉 Migrated ${mappedProducts.length} products to MongoDB!`);
    } else {
      console.log('💾 Seeding/Re-populating 60 premium demo products into MongoDB...');
      await Product.deleteMany({}); // Clear existing old/incomplete products
      const demoProds = makeDemoProducts();
      await Product.insertMany(demoProds);
      console.log(`🎉 Seeded ${demoProds.length} products successfully!`);
    }

    // 2. Seed/Migrate Users
    let userMap = {}; 
    if (fetchedFromInsForge && migratedUsers.length > 0) {
      console.log('💾 Migrating InsForge profiles to MongoDB...');
      
      for (const u of migratedUsers) {
        const email = u.email ? u.email.toLowerCase().trim() : `user-${u.id.substring(0, 6)}@shazora.com`;
        
        let mongoUser = await User.findOne({ email });
        if (!mongoUser) {
          mongoUser = await User.create({
            name: u.name || 'User',
            email: email,
            password: 'password123', // Default password for migrated users
            role: u.role || 'customer',
            status: 'active',
          });
        }
        userMap[u.id] = mongoUser;
      }
      console.log(`🎉 Migrated ${migratedUsers.length} profiles to MongoDB!`);
    } else {
      // Seed default platform owner/admin user
      const ADMIN_EMAIL = 'shahzaibzaman465@gmail.com';
      let adminUser = await User.findOne({ email: ADMIN_EMAIL });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'Shahzaib Admin',
          email: ADMIN_EMAIL,
          password: 'password123',
          role: 'admin',
          status: 'active',
        });
        console.log(`🎉 Seeded default platform owner Admin: ${ADMIN_EMAIL} (password: password123)`);
      }
    }

    // 3. Seed/Migrate Orders
    if (fetchedFromInsForge && migratedOrders.length > 0) {
      console.log('💾 Migrating InsForge orders to MongoDB...');
      await Order.deleteMany({}); // Clean slate

      const dbProducts = await Product.find({});
      const getProductRef = (name) => {
        const found = dbProducts.find(p => p.name === name);
        return found ? found._id : null;
      };

      const mappedOrders = [];
      for (const o of migratedOrders) {
        let userMongoRef = userMap[o.user_id];
        if (!userMongoRef) {
          userMongoRef = await User.findOne({});
        }

        if (!userMongoRef) continue;

        const items = Array.isArray(o.order_items) ? o.order_items : [];

        mappedOrders.push({
          user: userMongoRef._id,
          orderItems: items.map(item => ({
            name: item.name,
            qty: Number(item.qty) || 1,
            image: item.image,
            price: Number(item.price) || 0,
            product: getProductRef(item.name) || dbProducts[0]?._id,
          })),
          shippingAddress: {
            address: o.shipping_address?.address || '123 Main St',
            city: o.shipping_address?.city || 'City',
            postalCode: o.shipping_address?.zip || o.shipping_address?.postalCode || '00000',
            country: o.shipping_address?.country || 'USA',
          },
          paymentMethod: 'Stripe',
          totalPrice: Number(o.total_price) || 0,
          orderStatus: o.status || 'PENDING',
          isPaid: o.is_paid || true,
          paidAt: o.is_paid ? new Date(o.created_at) : null,
        });
      }

      if (mappedOrders.length > 0) {
        await Order.insertMany(mappedOrders);
        console.log(`🎉 Migrated ${mappedOrders.length} orders successfully!`);
      }
    }

    console.log('🏁 Migration process completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Critical error during migration:', error);
    process.exit(1);
  }
}

runMigration();
