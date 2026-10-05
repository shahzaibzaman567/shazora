// Shazora store knowledge base for the AI assistant.
// Keep values in sync with policies/pages in the codebase.

export const STORE_INFO = {
  name: 'Shazora',
  tagline: 'Define Your Style With Shazora',
  description:
    'Shazora is a premium online fashion store for men and women. We sell apparel, jackets, suits, denim, dresses, blazers, and accessories with modern styling and easy shopping.',
  categories: [
    { key: 'men', label: "Men's Collection", url: '/products/men' },
    { key: 'women', label: "Women's Collection", url: '/products/women' },
    { key: 'all', label: 'The Collection (all products)', url: '/products' },
  ],
  subTypes: {
    men: [
      'Streetwear',
      'Casual outfits',
      'Leather jackets',
      'Denim jackets',
      'Plaid jackets',
      'Coats & trench coats',
      'Suits & formal wear',
      'White suits (wedding/formal)',
      'Sporty street looks',
    ],
    women: [
      'Suits & blazers',
      'Smart casual sets',
      'Partywear & dresses (floral, tulle, satin, patterned)',
      'Streetwear',
      'Denim jackets & denim sets',
      'Leather jackets',
      'Accessories (bags, heels, flats, jewelry)',
      'Officewear',
    ],
  },
  priceRange: {
    men: 'USD $22.99 – $99.99',
    women: 'USD $24.99 – $79.99',
    currency: 'USD',
  },
  marketingStats: {
    customers: '25K+ active customers',
    products: '1,200+ premium products',
    cities: '80+ cities delivered',
  },
  pages: {
    home: '/',
    shop: '/products',
    men: '/products/men',
    women: '/products/women',
    about: '/about',
    contact: '/contact',
    trackOrder: '/track-order',
    myOrders: '/my-orders',
    cart: '/cart',
    checkout: '/checkout',
    returnPolicy: '/return-policy',
    privacyPolicy: '/privacy-policy',
    terms: '/terms',
    login: '/login',
    signup: '/signup',
  },
};

export const CONTACT_INFO = {
  email: 'support@shazora.com',
  phone: '+92 300 0000000',
  hours: 'Monday–Saturday, 10:00 AM – 8:00 PM',
  address: 'Shazora Commerce Hub, Main Fashion Avenue, Lahore, Pakistan',
  replyTime: 'Usually within 24 hours',
  supportTopics: ['Orders', 'Sizing', 'Returns', 'Collaboration'],
};

export const RETURN_POLICY = {
  window: '7 days from delivery',
  condition:
    'Product must be unworn, unwashed, with all original tags and packaging intact',
  nonReturnable: [
    'Innerwear and swimwear (hygiene reasons)',
    'Customized or personalized items',
    'Items bought during Final Clearance sales',
  ],
  refundProcess:
    'After Shazora receives the returned item and inspects its condition',
  refundTime: '3–5 business days after inspection',
  refundMethods: [
    'Original payment method (Credit/Debit Card, UPI)',
    'Shazora Wallet Credits (instant refund)',
  ],
  summary:
    'You can return any product within 7 days of delivery if it is unworn, unwashed, and has original tags/packaging. No returns on innerwear/swimwear, custom items, or Final Clearance sales. Refunds take 3–5 business days after inspection — back to original payment or instant Shazora Wallet Credits.',
};

export const ORDER_TRACKING = {
  idFormat: 'SHZ-XXXXXXXX (first 8 characters of your order ID, uppercase)',
  example: 'SHZ-3CD80562',
  statuses: ['PENDING (Order Placed)', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
  progressSteps: ['Order Placed', 'Processing', 'Shipped', 'Delivered'],
  estimatedDelivery: 'About 7 days from order date',
  waysToTrack: [
    'Log in → Track Order page (auto-loads your recent orders)',
    'Enter Order ID like SHZ-3CD80562 on the Track Order page',
    'Enter the phone number used at checkout on the Track Order page',
  ],
  whereToFindId: 'Success page after checkout shows the SHZ- ID with a Copy button. Also shown in the order-tracking toast and My Orders.',
  summary:
    'Your order tracking ID looks like SHZ-XXXXXXXX (first 8 characters of your order ID). Use the Track Order page with that ID, or the phone number used at checkout. Statuses: Order Placed → Processing → Shipped → Delivered. Estimated delivery is about 7 days from order date.',
};

export const CHECKOUT_INFO = {
  payment: 'Credit/Debit Card via Stripe (secure checkout)',
  currency: 'USD',
  loginRequired: true,
  shippingFields: ['Street address', 'Phone (required)', 'City', 'Postal code (optional)', 'Country'],
  ssl: 'SSL Encrypted Secure Payment',
  note: 'Checkout requires an account login. Phone number is required at checkout because it is used for order tracking.',
};

export const ACCOUNT_INFO = {
  signInMethods: ['Email/password', 'Google OAuth'],
  roles: ['customer', 'admin'],
  features: ['Wishlist', 'Recently viewed products', 'My Orders', 'Order tracking', 'Password reset via OTP/email'],
  forgotPassword: 'Use the Forgot Password page — OTP is sent to your email to reset the password.',
};

export const PRIVACY_SUMMARY = {
  dataCollected: [
    'Contact: name, email, phone, shipping address',
    'Payment: transaction history (full card numbers are NOT stored)',
    'Preferences: wishlist items, marketing preferences (only if opted in)',
  ],
  security: 'Industry-standard measures including SSL encryption and secure firewalls.',
  marketing: 'Promotional offers are sent only if you opted in.',
};

export const TERMS_SUMMARY = [
  'Comply with local laws when using the site; keep your account password confidential.',
  'All orders are subject to acceptance and product availability.',
  'Prices may change without notice.',
  'Shazora may refuse service, terminate accounts, or cancel orders at its discretion.',
  'Shazora is not liable for damages from use or inability to use the site, even if notified of the possibility.',
];

/**
 * Build a compact catalog text from live products for the AI prompt.
 * @param {Array} products - normalized products from getPublicProducts()
 */
export function formatCatalogForPrompt(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return 'Live product catalog is currently unavailable. Ask the customer to browse /products, /products/men, or /products/women for the latest items.';
  }

  const men = products.filter((p) => String(p.category).toLowerCase() === 'men');
  const women = products.filter((p) => String(p.category).toLowerCase() === 'women');
  const other = products.filter((p) => !['men', 'women'].includes(String(p.category).toLowerCase()));

  const line = (p) => {
    const stock = Number(p.countInStock) || 0;
    const stockLabel = stock > 0 ? `stock:${stock}` : 'OUT OF STOCK';
    const brand = p.brand ? ` brand:${p.brand}` : '';
    const rating = p.rating ? ` rating:${p.rating}/5 (${p.numReviews || 0} reviews)` : '';
    return `- ${p.name} | $${Number(p.price).toFixed(2)} | ${stockLabel}${brand}${rating} | id:${p.id || p._id || ''}`;
  };

  const parts = [];
  parts.push(`MEN (${men.length} items):\n${men.map(line).join('\n') || '(none)'}`);
  parts.push(`WOMEN (${women.length} items):\n${women.map(line).join('\n') || '(none)'}`);
  if (other.length) {
    parts.push(`OTHER/FEATURED (${other.length} items):\n${other.map(line).join('\n')}`);
  }
  parts.push(
    'When recommending products, prefer items from this LIVE catalog with exact names and prices. If stock is 0, say it is out of stock. If the user wants to see more or buy, point them to /product/:id or the Shop page.'
  );
  return parts.join('\n\n');
}

export function buildStoreKnowledgePrompt() {
  return `=== SHAZORA STORE KNOWLEDGE BASE (use these exact facts) ===

STORE
- Brand: ${STORE_INFO.name}
- Tagline: ${STORE_INFO.tagline}
- About: ${STORE_INFO.description}
- Stats: ${STORE_INFO.marketingStats.customers}; ${STORE_INFO.marketingStats.products}; ${STORE_INFO.marketingStats.cities}
- Categories: Men (/products/men), Women (/products/women), All (/products)
- Men's styles: ${STORE_INFO.subTypes.men.join(', ')}
- Women's styles: ${STORE_INFO.subTypes.women.join(', ')}
- Price ranges: Men ${STORE_INFO.priceRange.men}; Women ${STORE_INFO.priceRange.women} (currency: USD)

PAGES (tell customers these exact paths)
- Home: ${STORE_INFO.pages.home}
- Shop all: ${STORE_INFO.pages.shop}
- Men: ${STORE_INFO.pages.men}
- Women: ${STORE_INFO.pages.women}
- Track Order: ${STORE_INFO.pages.trackOrder}
- My Orders: ${STORE_INFO.pages.myOrders}
- Return Policy: ${STORE_INFO.pages.returnPolicy}
- Contact: ${STORE_INFO.pages.contact}
- About: ${STORE_INFO.pages.about}
- Login: ${STORE_INFO.pages.login} | Signup: ${STORE_INFO.pages.signup}
- Privacy: ${STORE_INFO.pages.privacyPolicy} | Terms: ${STORE_INFO.pages.terms}

CONTACT
- Email: ${CONTACT_INFO.email}
- Phone: ${CONTACT_INFO.phone}
- Hours: ${CONTACT_INFO.hours}
- Address: ${CONTACT_INFO.address}
- Reply time: ${CONTACT_INFO.replyTime}
- Support topics: ${CONTACT_INFO.supportTopics.join(', ')}

ORDER TRACKING
- ID format: ${ORDER_TRACKING.idFormat} (example: ${ORDER_TRACKING.example})
- Statuses: ${ORDER_TRACKING.statuses.join(' → ')}
- Progress: ${ORDER_TRACKING.progressSteps.join(' → ')}
- Estimated delivery: ${ORDER_TRACKING.estimatedDelivery}
- Ways to track: ${ORDER_TRACKING.waysToTrack.join(' | ')}
- Where to find ID: ${ORDER_TRACKING.whereToFindId}

RETURN & REFUND POLICY
- Return window: ${RETURN_POLICY.window}
- Condition required: ${RETURN_POLICY.condition}
- Non-returnable: ${RETURN_POLICY.nonReturnable.join('; ')}
- Refund after: ${RETURN_POLICY.refundProcess}
- Refund time: ${RETURN_POLICY.refundTime}
- Refund methods: ${RETURN_POLICY.refundMethods.join(' | ')}
- One-liner: ${RETURN_POLICY.summary}

CHECKOUT & PAYMENT
- Payment: ${CHECKOUT_INFO.payment}
- Currency: ${CHECKOUT_INFO.currency}
- Login required: Yes
- Shipping fields: ${CHECKOUT_INFO.shippingFields.join(', ')}
- SSL: ${CHECKOUT_INFO.ssl}
- Note: ${CHECKOUT_INFO.note}

ACCOUNT
- Sign-in: ${ACCOUNT_INFO.signInMethods.join(' and ')}
- Password reset: ${ACCOUNT_INFO.forgotPassword}

PRIVACY
- Data collected: ${PRIVACY_SUMMARY.dataCollected.join('; ')}
- Security: ${PRIVACY_SUMMARY.security}
- Marketing: ${PRIVACY_SUMMARY.marketing}

TERMS
${TERMS_SUMMARY.map((t) => `- ${t}`).join('\n')}

=== END STORE KNOWLEDGE ===`;
}
