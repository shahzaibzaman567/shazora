import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const menProducts = [
  { name: "Urban Street Fashion Look", price: 29.99, image: "https://images.pexels.com/photos/8975722/pexels-photo-8975722.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Urban Street", countInStock: 20, description: "White male model, modern street style outfit, perfect for lookbook." },
  { name: "Studio Crouch Outfit", price: 34.99, image: "https://images.pexels.com/photos/7326618/pexels-photo-7326618.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Studio Fit", countInStock: 15, description: "White male model studio pose, trendy casual fashion, clean background." },
  { name: "Vintage Tennis Style", price: 27.99, image: "https://images.pexels.com/photos/5730455/pexels-photo-5730455.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Classic Men", countInStock: 10, description: "White male model, retro sporty outfit, classic men fashion aesthetic." },
  { name: "Coat and Hat Street Look", price: 39.99, image: "https://images.pexels.com/photos/19216135/pexels-photo-19216135.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Winter Street", countInStock: 12, description: "White male model in coat and hat, winter street fashion vibe." },
  { name: "Color Wall Casual Style", price: 24.99, image: "https://images.pexels.com/photos/17399977/pexels-photo-17399977.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Lifestyle", countInStock: 25, description: "White male model, casual outfit against vibrant wall, lifestyle feel." },
  { name: "Blonde Jacket Street Look", price: 44.99, image: "https://images.pexels.com/photos/18838795/pexels-photo-18838795.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Blonde Men", countInStock: 18, description: "Blonde white male model, jacket styling for modern menswear listing." },
  { name: "Milan Shopping Street Style", price: 49.99, image: "https://images.pexels.com/photos/15369459/pexels-photo-15369459.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Premium City", countInStock: 30, description: "White male model with jacket and sunglasses, premium city fashion vibe." },
  { name: "Night Leather Jacket Look", price: 54.99, image: "https://images.pexels.com/photos/17719354/pexels-photo-17719354.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Nightlife", countInStock: 8, description: "White male model, leather jacket and shades, edgy nightlife fashion." },
  { name: "Indoor Leather Jacket Portrait", price: 59.99, image: "https://images.pexels.com/photos/10274710/pexels-photo-10274710.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Outerwear Noir", countInStock: 5, description: "White male model, leather jacket portrait, premium outerwear hero image." },
  { name: "City Street Leather Jacket", price: 57.99, image: "https://images.pexels.com/photos/16466397/pexels-photo-16466397.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Street Edge", countInStock: 22, description: "White male model, leather jacket street pose, strong ecommerce banner shot." },
  { name: "European Suit Walk", price: 89.99, image: "https://images.pexels.com/photos/36397417/pexels-photo-36397417.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Luxury Vibe", countInStock: 10, description: "White male model, suit in European architecture background, luxury vibe." },
  { name: "Floral Suit Statement", price: 94.99, image: "https://images.pexels.com/photos/10826548/pexels-photo-10826548.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Designer Floral", countInStock: 4, description: "White male model, bold floral suit, designer style for premium category." },
  { name: "Suit Between Pillars", price: 92.99, image: "https://images.pexels.com/photos/33502693/pexels-photo-33502693.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Formal Men", countInStock: 7, description: "White male model, classic suit portrait outdoors, elegant formalwear listing." },
  { name: "Outdoor Suit Portrait", price: 88.99, image: "https://images.pexels.com/photos/33502702/pexels-photo-33502702.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Clean Formal", countInStock: 11, description: "White male model, dark suit outdoors, clean formal menswear vibe." },
  { name: "Overcoat Suit Streetwear", price: 99.99, image: "https://images.pexels.com/photos/6133511/pexels-photo-6133511.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Winter Formal", countInStock: 6, description: "White male model, suit + overcoat, premium winter formal category." },
  { name: "Streetwear Trio Pose", price: 33.99, image: "https://images.pexels.com/photos/2479830/pexels-photo-2479830.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Collective Street", countInStock: 20, description: "White male models, casual streetwear group shot, lookbook ready." },
  { name: "Plaid Jacket Street Style", price: 36.99, image: "https://images.pexels.com/photos/18503338/pexels-photo-18503338.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Plaid Modern", countInStock: 16, description: "White male model, plaid jacket styling, modern street fashion product shot." },
  { name: "Denim Jacket City Pose", price: 41.99, image: "https://images.pexels.com/photos/11434887/pexels-photo-11434887.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Denim Fit", countInStock: 14, description: "White male model, denim jacket lifestyle shot, casualwear category." },
  { name: "Black Street Clothing Studio", price: 32.99, image: "https://images.pexels.com/photos/12738118/pexels-photo-12738118.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Sporty Street", countInStock: 25, description: "White male model studio fashion, sporty street outfit, trendy listing." },
  { name: "Crosswalk Casual Outfit", price: 26.99, image: "https://images.pexels.com/photos/18339043/pexels-photo-18339043.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Everyday Vibe", countInStock: 40, description: "White male model, city crosswalk casual style, everyday menswear vibe." },
  { name: "Night Street Funny Pose", price: 22.99, image: "https://images.pexels.com/photos/12820779/pexels-photo-12820779.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Funny Street", countInStock: 50, description: "White male model, night street portrait, casual outfit vibe." },
  { name: "B&W Suit Portrait", price: 79.99, image: "https://images.pexels.com/photos/35689789/pexels-photo-35689789.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Editorial Suite", countInStock: 10, description: "White male model, black and white suit portrait, premium editorial style." },
  { name: "Sophisticated B&W Suit", price: 82.99, image: "https://images.pexels.com/photos/35633119/pexels-photo-35633119.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Luxury B&W", countInStock: 5, description: "White male model, classic suit portrait, luxury formal listing vibe." },
  { name: "White Suit Serious Look", price: 96.99, image: "https://images.pexels.com/photos/10147911/pexels-photo-10147911.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Wedding Ready", countInStock: 9, description: "White male model, white suit formal portrait, wedding/formal category." },
  { name: "White Suit Studio Portrait", price: 98.99, image: "https://images.pexels.com/photos/30977338/pexels-photo-30977338.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Confident Class", countInStock: 6, description: "White male model, clean studio white suit shot, premium ecommerce hero." },
  { name: "Leather Jacket Indoor Portrait", price: 58.99, image: "https://images.pexels.com/photos/35055802/pexels-photo-35055802.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Moody Fashion", countInStock: 11, description: "White male model leather jacket, moody indoor fashion portrait." },
  { name: "Leather Jacket Waterfront", price: 56.99, image: "https://images.pexels.com/photos/14285434/pexels-photo-14285434.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Waterfront Edge", countInStock: 13, description: "White male model, leather jacket outdoor portrait, premium menswear feel." },
  { name: "Leather Jacket Studio Pose", price: 55.99, image: "https://images.pexels.com/photos/7823891/pexels-photo-7823891.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Product High", countInStock: 15, description: "White male model, leather jacket studio portrait, product campaign ready." },
  { name: "Denim Jacket Sunglasses", price: 37.99, image: "https://images.pexels.com/photos/9909123/pexels-photo-9909123.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Street Sunglasses", countInStock: 18, description: "White male model, denim jacket with sunglasses, casual streetwear vibe." },
  { name: "Minimal Studio Casual", price: 28.99, image: "https://images.pexels.com/photos/31568697/pexels-photo-31568697.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Minimal Studio", countInStock: 20, description: "White male model seated, minimal studio fashion, clean ecommerce aesthetic." },
  { name: "Denim Streetwear Look", price: 41.99, image: "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800", category: "men", brand: "Modern Denim", countInStock: 15, description: "White male model in a modern denim streetwear style, perfect for a casual menswear product page or banner." }
];

const seedProducts = async () => {
  try {
    // Delete existing men products first to avoid duplicates if re-running
    await Product.deleteMany({ category: 'men' });
    
    await Product.insertMany(menProducts);
    console.log('30 Men fashion products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Failure to seed products:', error);
    process.exit(1);
  }
};

seedProducts();
