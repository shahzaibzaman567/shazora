import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const womenProducts = [
  { name: "Women Stylish Suit Look", price: 69.99, image: "https://images.pexels.com/photos/9861670/pexels-photo-9861670.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Classic Chic", countInStock: 15, description: "Modern suit styling, confident look, ideal for premium fashion listings." },
  { name: "Smart Casual Outfit Set", price: 54.99, image: "https://images.pexels.com/photos/10438438/pexels-photo-10438438.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Urban Wear", countInStock: 20, description: "Trendy smart casual outfits, studio look, perfect for new arrivals." },
  { name: "Black Outfit Studio Look", price: 59.99, image: "https://images.pexels.com/photos/7871178/pexels-photo-7871178.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Noir Fashion", countInStock: 12, description: "Sleek black outfits, dramatic studio vibe, great for partywear category." },
  { name: "Minimal Brown Outfit", price: 39.99, image: "https://images.pexels.com/photos/11288126/pexels-photo-11288126.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Minimalist", countInStock: 25, description: "Clean minimal outfit, studio background, best for everyday fashion." },
  { name: "Elegant Suit and Accessories", price: 64.99, image: "https://images.pexels.com/photos/8330427/pexels-photo-8330427.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Office Professional", countInStock: 18, description: "Chic outfit with accessories, modern styling, perfect for officewear." },
  { name: "Retro Streetwear Vibe", price: 44.99, image: "https://images.pexels.com/photos/31774563/pexels-photo-31774563.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Retro City", countInStock: 30, description: "Urban street fashion portrait, bold vibe, best for streetwear brands." },
  { name: "Trendy Streetwear Walk", price: 46.99, image: "https://images.pexels.com/photos/29466121/pexels-photo-29466121.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Street Trend", countInStock: 22, description: "Modern streetwear look, bold styling, great for casual collections." },
  { name: "Urban Crosswalk Style", price: 49.99, image: "https://images.pexels.com/photos/36389101/pexels-photo-36389101.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "City Moment", countInStock: 28, description: "City fashion moment, stylish outfit, perfect for ecommerce banners." },
  { name: "Vibrant Street Style Outfit", price: 47.99, image: "https://images.pexels.com/photos/32455651/pexels-photo-32455651.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Standout Fashion", countInStock: 14, description: "Colorful street look, standout fashion, best for seasonal campaigns." },
  { name: "Chic Sunglasses Street Look", price: 42.99, image: "https://images.pexels.com/photos/29117244/pexels-photo-29117244.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Lifestyle Chic", countInStock: 19, description: "Sunglasses + tote styling, city vibe, perfect for lifestyle store." },
  { name: "Floral Black Dress", price: 58.99, image: "https://images.pexels.com/photos/18255465/pexels-photo-18255465.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Evening Bloom", countInStock: 10, description: "Elegant floral dress look, outdoor portrait, ideal for party and dinners." },
  { name: "Beige Tulle Dress", price: 74.99, image: "https://images.pexels.com/photos/20520631/pexels-photo-20520631.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Tulle Dreams", countInStock: 8, description: "Soft tulle dress, premium feel, perfect for events and shoots." },
  { name: "Traditional White Attire", price: 52.99, image: "https://images.pexels.com/photos/24905990/pexels-photo-24905990.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Classic Elegant", countInStock: 16, description: "Classic elegant look, bright outdoor portrait, premium clothing listing." },
  { name: "Patterned Dress Look", price: 61.99, image: "https://images.pexels.com/photos/33992524/pexels-photo-33992524.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Summer Pattern", countInStock: 20, description: "Vibrant patterned dress, stylish pose, great for summer collection." },
  { name: "Satin Dress Elegant", price: 79.99, image: "https://images.pexels.com/photos/25961106/pexels-photo-25961106.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Luxury Satin", countInStock: 5, description: "Satin finish dress, luxury vibe, perfect for eveningwear category." },
  { name: "Formal Blazer Group", price: 66.99, image: "https://images.pexels.com/photos/8367851/pexels-photo-8367851.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Executive Blazer", countInStock: 12, description: "Blazer fashion, confident pose, perfect for officewear category." },
  { name: "Color Blazer Duo", price: 63.99, image: "https://images.pexels.com/photos/9168237/pexels-photo-9168237.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Trending Duo", countInStock: 14, description: "Bright blazer fashion, outdoor vibe, best for trending items." },
  { name: "Blazer Shore Look", price: 68.99, image: "https://images.pexels.com/photos/9834877/pexels-photo-9834877.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Editorial Shore", countInStock: 9, description: "Blazer and pants styling, premium editorial vibe, modern collection." },
  { name: "Minimal Pink Blazer Set", price: 62.99, image: "https://images.pexels.com/photos/7203740/pexels-photo-7203740.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Pink Career", countInStock: 11, description: "Clean studio blazer look, modern fit, ideal for workwear." },
  { name: "Dramatic Blazer Pose", price: 64.99, image: "https://images.pexels.com/photos/9861661/pexels-photo-9861661.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Hero Drama", countInStock: 7, description: "Dark backdrop blazer fashion, premium styling, perfect for hero images." },
  { name: "Women Accessories Flatlay", price: 29.99, image: "https://images.pexels.com/photos/31871762/pexels-photo-31871762.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Flatlay Studio", countInStock: 40, description: "Boots, blouse and accessories flatlay, perfect for ecommerce category pages." },
  { name: "Summer Flatlay Set", price: 27.99, image: "https://images.pexels.com/photos/5405644/pexels-photo-5405644.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Summer Ready", countInStock: 50, description: "Hat, scarf, camera and outfit flatlay, summer campaign ready." },
  { name: "Bag and Flats Flatlay", price: 24.99, image: "https://images.pexels.com/photos/32616677/pexels-photo-32616677.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Accessory Collection", countInStock: 60, description: "Bag, flats and jewelry flatlay, ideal for accessories product listings." },
  { name: "Handbag and Makeup Flatlay", price: 26.99, image: "https://images.pexels.com/photos/34976481/pexels-photo-34976481.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Beauty Combo", countInStock: 35, description: "Handbag + sunglasses + makeup flatlay, perfect for beauty-fashion combo." },
  { name: "Heels and Purse Flatlay", price: 31.99, image: "https://images.pexels.com/photos/32107582/pexels-photo-32107582.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Footwear Chic", countInStock: 21, description: "Heels with purse flatlay, premium vibe for women footwear category." },
  { name: "Denim Jacket Street Pose", price: 44.99, image: "https://images.pexels.com/photos/19243412/pexels-photo-19243412.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Casual Street", countInStock: 23, description: "Trendy denim jacket look, colorful street background, casual category fit." },
  { name: "Redhead Denim Jacket", price: 42.99, image: "https://images.pexels.com/photos/6089635/pexels-photo-6089635.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Casual Redhead", countInStock: 18, description: "Denim jacket portrait, street vibe, perfect for casualwear listings." },
  { name: "Denim Set Urban Walk", price: 46.99, image: "https://images.pexels.com/photos/15114415/pexels-photo-15114415.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Modern Urban", countInStock: 26, description: "Denim jacket and jeans, modern street feel, best for everyday wear." },
  { name: "Denim Jacket Clean Look", price: 43.99, image: "https://images.pexels.com/photos/20761365/pexels-photo-20761365.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Clean Denim", countInStock: 20, description: "Denim jacket styling, outdoor pose, great for minimal product pages." },
  { name: "Leather Jacket Sidewalk", price: 59.99, image: "https://images.pexels.com/photos/23547647/pexels-photo-23547647.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Sidewalk Bold", countInStock: 15, description: "Leather jacket street outfit, modern bold vibe, perfect for winterwear." },
  { name: "Urban Street Style Fashion", price: 49.99, image: "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=800", category: "women", brand: "Urban Edge", countInStock: 18, description: "Stylish woman in an urban street style look, ideal for women fashion category banners and product listings." }
];

const seedProducts = async () => {
  try {
    // Delete existing women products first to avoid duplicates if re-running
    await Product.deleteMany({ category: 'women' });
    
    await Product.insertMany(womenProducts);
    console.log('30 Women fashion products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Failure to seed products:', error);
    process.exit(1);
  }
};

seedProducts();
