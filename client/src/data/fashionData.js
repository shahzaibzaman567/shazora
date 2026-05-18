const menData = [
  { name: "Urban Street Fashion Look", price: 29.99, image: "https://images.pexels.com/photos/8975722/pexels-photo-8975722.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, modern street style outfit, perfect for lookbook." },
  { name: "Studio Crouch Outfit", price: 34.99, image: "https://images.pexels.com/photos/7326618/pexels-photo-7326618.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model studio pose, trendy casual fashion, clean background." },
  { name: "Vintage Tennis Style", price: 27.99, image: "https://images.pexels.com/photos/5730455/pexels-photo-5730455.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, retro sporty outfit, classic men fashion aesthetic." },
  { name: "Coat and Hat Street Look", price: 39.99, image: "https://images.pexels.com/photos/19216135/pexels-photo-19216135.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model in coat and hat, winter street fashion vibe." },
  { name: "Color Wall Casual Style", price: 24.99, image: "https://images.pexels.com/photos/17399977/pexels-photo-17399977.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, casual outfit against vibrant wall, lifestyle feel." },
  { name: "Blonde Jacket Street Look", price: 44.99, image: "https://images.pexels.com/photos/18838795/pexels-photo-18838795.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Blonde white male model, jacket styling for modern menswear listing." },
  { name: "Milan Shopping Street Style", price: 49.99, image: "https://images.pexels.com/photos/15369459/pexels-photo-15369459.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model with jacket and sunglasses, premium city fashion vibe." },
  { name: "Night Leather Jacket Look", price: 54.99, image: "https://images.pexels.com/photos/17719354/pexels-photo-17719354.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, leather jacket and shades, edgy nightlife fashion." },
  { name: "Indoor Leather Jacket Portrait", price: 59.99, image: "https://images.pexels.com/photos/10274710/pexels-photo-10274710.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, leather jacket portrait, premium outerwear hero image." },
  { name: "City Street Leather Jacket", price: 57.99, image: "https://images.pexels.com/photos/16466397/pexels-photo-16466397.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, leather jacket street pose, strong ecommerce banner shot." },
  { name: "European Suit Walk", price: 89.99, image: "https://images.pexels.com/photos/36397417/pexels-photo-36397417.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, suit in European architecture background, luxury vibe." },
  { name: "Floral Suit Statement", price: 94.99, image: "https://images.pexels.com/photos/10826548/pexels-photo-10826548.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, bold floral suit, designer style for premium category." },
  { name: "Suit Between Pillars", price: 92.99, image: "https://images.pexels.com/photos/33502693/pexels-photo-33502693.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, classic suit portrait outdoors, elegant formalwear listing." },
  { name: "Outdoor Suit Portrait", price: 88.99, image: "https://images.pexels.com/photos/33502702/pexels-photo-33502702.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, dark suit outdoors, clean formal menswear vibe." },
  { name: "Overcoat Suit Streetwear", price: 99.99, image: "https://images.pexels.com/photos/6133511/pexels-photo-6133511.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, suit + overcoat, premium winter formal category." },
  { name: "Streetwear Trio Pose", price: 33.99, image: "https://images.pexels.com/photos/2479830/pexels-photo-2479830.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male models, casual streetwear group shot, lookbook ready." },
  { name: "Plaid Jacket Street Style", price: 36.99, image: "https://images.pexels.com/photos/18503338/pexels-photo-18503338.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, plaid jacket styling, modern street fashion product shot." },
  { name: "Denim Jacket City Pose", price: 41.99, image: "https://images.pexels.com/photos/11434887/pexels-photo-11434887.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, denim jacket lifestyle shot, casualwear category." },
  { name: "Black Street Clothing Studio", price: 32.99, image: "https://images.pexels.com/photos/12738118/pexels-photo-12738118.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model studio fashion, sporty street outfit, trendy listing." },
  { name: "Crosswalk Casual Outfit", price: 26.99, image: "https://images.pexels.com/photos/18339043/pexels-photo-18339043.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, city crosswalk casual style, everyday menswear vibe." },
  { name: "Night Street Funny Pose", price: 22.99, image: "https://images.pexels.com/photos/12820779/pexels-photo-12820779.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, night street portrait, casual outfit vibe." },
  { name: "B&W Suit Portrait", price: 79.99, image: "https://images.pexels.com/photos/35689789/pexels-photo-35689789.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, black and white suit portrait, premium editorial style." },
  { name: "Sophisticated B&W Suit", price: 82.99, image: "https://images.pexels.com/photos/35633119/pexels-photo-35633119.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, classic suit portrait, luxury formal listing vibe." },
  { name: "White Suit Serious Look", price: 96.99, image: "https://images.pexels.com/photos/10147911/pexels-photo-10147911.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, white suit formal portrait, wedding/formal category." },
  { name: "White Suit Studio Portrait", price: 98.99, image: "https://images.pexels.com/photos/30977338/pexels-photo-30977338.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, clean studio white suit shot, premium ecommerce hero." },
  { name: "Leather Jacket Indoor Portrait", price: 58.99, image: "https://images.pexels.com/photos/35055802/pexels-photo-35055802.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model leather jacket, moody indoor fashion portrait." },
  { name: "Leather Jacket Waterfront", price: 56.99, image: "https://images.pexels.com/photos/14285434/pexels-photo-14285434.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, leather jacket outdoor portrait, premium menswear feel." },
  { name: "Leather Jacket Studio Pose", price: 55.99, image: "https://images.pexels.com/photos/7823891/pexels-photo-7823891.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, leather jacket studio portrait, product campaign ready." },
  { name: "Denim Jacket Sunglasses", price: 37.99, image: "https://images.pexels.com/photos/9909123/pexels-photo-9909123.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model, denim jacket with sunglasses, casual streetwear vibe." },
  { name: "Minimal Studio Casual", price: 28.99, image: "https://images.pexels.com/photos/31568697/pexels-photo-31568697.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model seated, minimal studio fashion, clean ecommerce aesthetic." },
  { name: "Denim Streetwear Look", price: 41.99, image: "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800", description: "White male model in a modern denim streetwear style, perfect for a casual menswear product page or banner." }
];

const womenData = [
  { name: "Women Stylish Suit Look", price: 69.99, image: "https://images.pexels.com/photos/9861670/pexels-photo-9861670.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Modern suit styling, confident look, ideal for premium fashion listings." },
  { name: "Smart Casual Outfit Set", price: 54.99, image: "https://images.pexels.com/photos/10438438/pexels-photo-10438438.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Trendy smart casual outfits, studio look, perfect for new arrivals." },
  { name: "Black Outfit Studio Look", price: 59.99, image: "https://images.pexels.com/photos/7871178/pexels-photo-7871178.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Sleek black outfits, dramatic studio vibe, great for partywear category." },
  { name: "Minimal Brown Outfit", price: 39.99, image: "https://images.pexels.com/photos/11288126/pexels-photo-11288126.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Clean minimal outfit, studio background, best for everyday fashion." },
  { name: "Elegant Suit and Accessories", price: 64.99, image: "https://images.pexels.com/photos/8330427/pexels-photo-8330427.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Chic outfit with accessories, modern styling, perfect for officewear." },
  { name: "Retro Streetwear Vibe", price: 44.99, image: "https://images.pexels.com/photos/31774563/pexels-photo-31774563.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Urban street fashion portrait, bold vibe, best for streetwear brands." },
  { name: "Trendy Streetwear Walk", price: 46.99, image: "https://images.pexels.com/photos/29466121/pexels-photo-29466121.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Modern streetwear look, bold styling, great for casual collections." },
  { name: "Urban Crosswalk Style", price: 49.99, image: "https://images.pexels.com/photos/36389101/pexels-photo-36389101.jpeg?auto=compress&cs=tinysrgb&w=800", description: "City fashion moment, stylish outfit, perfect for ecommerce banners." },
  { name: "Vibrant Street Style Outfit", price: 47.99, image: "https://images.pexels.com/photos/32455651/pexels-photo-32455651.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Colorful street look, standout fashion, best for seasonal campaigns." },
  { name: "Chic Sunglasses Street Look", price: 42.99, image: "https://images.pexels.com/photos/29117244/pexels-photo-29117244.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Sunglasses + tote styling, city vibe, perfect for lifestyle store." },
  { name: "Floral Black Dress", price: 58.99, image: "https://images.pexels.com/photos/18255465/pexels-photo-18255465.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Elegant floral dress look, outdoor portrait, ideal for party and dinners." },
  { name: "Beige Tulle Dress", price: 74.99, image: "https://images.pexels.com/photos/20520631/pexels-photo-20520631.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Soft tulle dress, premium feel, perfect for events and shoots." },
  { name: "Traditional White Attire", price: 52.99, image: "https://images.pexels.com/photos/24905990/pexels-photo-24905990.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Classic elegant look, bright outdoor portrait, premium clothing listing." },
  { name: "Patterned Dress Look", price: 61.99, image: "https://images.pexels.com/photos/33992524/pexels-photo-33992524.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Vibrant patterned dress, stylish pose, great for summer collection." },
  { name: "Satin Dress Elegant", price: 79.99, image: "https://images.pexels.com/photos/25961106/pexels-photo-25961106.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Satin finish dress, luxury vibe, perfect for eveningwear category." },
  { name: "Formal Blazer Group", price: 66.99, image: "https://images.pexels.com/photos/8367851/pexels-photo-8367851.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Blazer fashion, confident pose, perfect for officewear category." },
  { name: "Color Blazer Duo", price: 63.99, image: "https://images.pexels.com/photos/9168237/pexels-photo-9168237.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Bright blazer fashion, outdoor vibe, best for trending items." },
  { name: "Blazer Shore Look", price: 68.99, image: "https://images.pexels.com/photos/9834877/pexels-photo-9834877.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Blazer and pants styling, premium editorial vibe, modern collection." },
  { name: "Minimal Pink Blazer Set", price: 62.99, image: "https://images.pexels.com/photos/7203740/pexels-photo-7203740.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Clean studio blazer look, modern fit, ideal for workwear." },
  { name: "Dramatic Blazer Pose", price: 64.99, image: "https://images.pexels.com/photos/9861661/pexels-photo-9861661.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Dark backdrop blazer fashion, premium styling, perfect for hero images." },
  { name: "Women Accessories Flatlay", price: 29.99, image: "https://images.pexels.com/photos/31871762/pexels-photo-31871762.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Boots, blouse and accessories flatlay, perfect for ecommerce category pages." },
  { name: "Summer Flatlay Set", price: 27.99, image: "https://images.pexels.com/photos/5405644/pexels-photo-5405644.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Hat, scarf, camera and outfit flatlay, summer campaign ready." },
  { name: "Bag and Flats Flatlay", price: 24.99, image: "https://images.pexels.com/photos/32616677/pexels-photo-32616677.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Bag, flats and jewelry flatlay, ideal for accessories product listings." },
  { name: "Handbag and Makeup Flatlay", price: 26.99, image: "https://images.pexels.com/photos/34976481/pexels-photo-34976481.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Handbag + sunglasses + makeup flatlay, perfect for beauty-fashion combo." },
  { name: "Heels and Purse Flatlay", price: 31.99, image: "https://images.pexels.com/photos/32107582/pexels-photo-32107582.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Heels with purse flatlay, premium vibe for women footwear category." },
  { name: "Denim Jacket Street Pose", price: 44.99, image: "https://images.pexels.com/photos/19243412/pexels-photo-19243412.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Trendy denim jacket look, colorful street background, casual category fit." },
  { name: "Redhead Denim Jacket", price: 42.99, image: "https://images.pexels.com/photos/6089635/pexels-photo-6089635.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Denim jacket portrait, street vibe, perfect for casualwear listings." },
  { name: "Denim Set Urban Walk", price: 46.99, image: "https://images.pexels.com/photos/15114415/pexels-photo-15114415.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Denim jacket and jeans, modern street feel, best for everyday wear." },
  { name: "Denim Jacket Clean Look", price: 43.99, image: "https://images.pexels.com/photos/20761365/pexels-photo-20761365.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Denim jacket styling, outdoor pose, great for minimal product pages." },
  { name: "Leather Jacket Sidewalk", price: 59.99, image: "https://images.pexels.com/photos/23547647/pexels-photo-23547647.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Leather jacket street outfit, modern bold vibe, perfect for winterwear." },
  { name: "Urban Street Style Fashion", price: 49.99, image: "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Stylish woman in an urban street style look, ideal for women fashion category banners and product listings." }
];

const brands = ['Shazora Studio', 'Noir Label', 'Arc Line', 'Urban Muse', 'Classic Craft'];

const buildProducts = () => {
  const items = [];
  
  /**
   * CRITICAL: DO NOT REMOVE OR CHANGE THESE FIRST 3 IMAGES. 
   * These specific Pexels images are pinned to the homepage by user request.
   */
  // 1. Studio shot of man and woman (ID: 18428517)
  items.push({
    _id: 'featured-1',
    name: 'Shazora Duo Studio',
    brand: brands[0],
    category: 'exclusive',
    description: 'User-pinned: Signature studio fashion featuring high-contrast red backdrop.',
    image: 'https://images.pexels.com/photos/18428517/pexels-photo-18428517.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 85.0,
    countInStock: 5,
    rating: 4.9,
    numReviews: 120,
  });

  // 2. Fashionable men posing (ID: 30953650)
  items.push({
    _id: 'featured-2',
    name: 'Urban Men Collective',
    brand: brands[1],
    category: 'men',
    description: 'User-pinned: Modern stylish men outfits captured indoors.',
    image: 'https://images.pexels.com/photos/30953650/pexels-photo-30953650.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 65.0,
    countInStock: 15,
    rating: 4.7,
    numReviews: 45,
  });

  // 3. Young women in clothing store (ID: 15761457)
  items.push({
    _id: 'featured-3',
    name: 'Young Women Retail',
    brand: brands[2],
    category: 'women',
    description: 'User-pinned: Stylish women posing in our curated clothing store.',
    image: 'https://images.pexels.com/photos/15761457/pexels-photo-15761457.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 75.0,
    countInStock: 10,
    rating: 4.8,
    numReviews: 88,
  });

  // Adding the 30 specific Men as products
  menData.forEach((man, i) => {
    items.push({
      _id: `product-m-${i+1}`,
      name: man.name,
      brand: brands[i % brands.length],
      category: 'men',
      description: man.description,
      image: man.image,
      price: man.price,
      countInStock: 12,
      rating: 4.5,
      numReviews: 18,
    });
  });

  // Adding the 30 specific Women as products
  womenData.forEach((woman, i) => {
    items.push({
      _id: `product-w-${i+1}`,
      name: woman.name,
      brand: brands[i % brands.length],
      category: 'women',
      description: woman.description,
      image: woman.image,
      price: woman.price,
      countInStock: 12,
      rating: 4.6,
      numReviews: 24,
    });
  });

  return items;
};

export const fashionProducts = buildProducts();

// Also exporting the user list for the Admin User Manager
export const demoUsers = menData.map((u, i) => ({
  name: u.name,
  email: u.email,
  role: 'user',
  status: i % 7 === 0 ? 'inactive' : 'active',
  date: '2024-04-17'
}));

export const featureStats = [
  { label: 'Active Customers', value: '25K+' },
  { label: 'Premium Products', value: '1,200+' },
  { label: 'Cities Delivered', value: '80+' },
];

export const aboutHighlights = [
  {
    title: 'Curated Fashion',
    text: 'Every collection is selected by stylists to ensure quality and contemporary trends.',
  },
  {
    title: 'Fast Fulfillment',
    text: 'Our operations team processes orders quickly with secure packaging.',
  },
  {
    title: 'Customer Focus',
    text: 'Shazora support is built for trust and convenience.',
  },
];

export const adminGraphFallback = [
  { day: 'Mon', sales: 2200, users: 42, productsSold: 34 },
  { day: 'Tue', sales: 3100, users: 58, productsSold: 47 },
  { day: 'Wed', sales: 2800, users: 51, productsSold: 39 },
  { day: 'Thu', sales: 4100, users: 73, productsSold: 66 },
  { day: 'Fri', sales: 5200, users: 91, productsSold: 88 },
  { day: 'Sat', sales: 6100, users: 115, productsSold: 102 },
  { day: 'Sun', sales: 4900, users: 84, productsSold: 71 },
];
