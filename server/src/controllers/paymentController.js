import Stripe from 'stripe';
import dotenv from 'dotenv';
// Order model removed - using InsForge instead
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_replace_me');

// @desc    Create a Stripe Checkout Session
// @route   POST /api/payment/create-checkout-session
// @access  Public
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { products, orderId } = req.body;
    
    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'No products provided' });
    }
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    const appUrl = (process.env.CLIENT_URL || req.headers.origin || 'http://localhost:5173').replace(/\/+$/, '');
    
    // Map products to Stripe line_items format
    const line_items = products.map((product) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100), // convert to cents
      },
      quantity: product.qty || product.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      client_reference_id: orderId, // The InsForge order ID
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe Webhook listener
// @route   POST /api/payment/webhook
// @access  Public (Stripe calls this)
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_replace_me';

  let event;
  try {
    // req.body must be raw string / buffer (from express.raw)
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const orderId = session.client_reference_id;
      
      if (orderId) {
        // Order is managed in InsForge - webhook for future integration
        console.log('Payment was successful! Order ID:', orderId);
        console.log('Payment Intent ID:', session.payment_intent);
        console.log('Payment Status:', session.payment_status);
      }
      break;
    }
    case 'checkout.session.expired': {
        const session = event.data.object;
        const orderId = session.client_reference_id;
        if(orderId) {
            console.log('Payment session expired for Order ID:', orderId);
        }
        break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};
