# Shazora E-Commerce 🛍️

Shazora is a modern, premium E-Commerce web application built to provide a stunning shopping experience. It features vibrant aesthetics, smooth animations, a fully-functional shopping cart, secure payments, and a complete admin management system.

Now powered by a robust **MongoDB + Express + Passport.js** authentication architecture with a seamless popup-based Google Sign-In flow.

---

## 🌟 Key Features

- **Rich & Premium UI/UX:** Built with React, Tailwind CSS, and Framer Motion for modern, responsive aesthetics and fluid micro-animations.
- **Secure Popup Google Auth:** A smooth "Continue with Google" popup flow that handles redirects on the frontend, logs the user in securely via sessions, and syncs user profiles on the dashboard automatically.
- **Real-Time Admin Dashboard:** Complete control for store owners to manage products, categories, stock, and update order tracking statuses.
- **Seamless Stripe Integration:** Secure, redirect-based checkout processing with Webhook support for automated order status updates.
- **Serverless Ready:** Configured to run flawlessly as a serverless application on Vercel.

---

## 🚀 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Framer Motion
- **Backend:** Node.js, Express, Passport.js (Session & Google OAuth20 Strategies)
- **Database:** MongoDB (via Mongoose ODM) with database connection pooling for serverless performance
- **Payments:** Stripe Checkout API & Stripe Webhooks

---

## ⚙️ Environment Configuration

To run Shazora, you need to configure the following environment files.

### 1. Backend Configuration (`server/.env`)
Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# Session & Security
SESSION_SECRET=your_session_secret_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### 2. Frontend Configuration (`client/.env.local`)
Create a `.env.local` file in the `client/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_AUTH_START_URL=http://localhost:5000/api/auth/google
```

---

## 📦 Local Development Setup

Follow these steps to run the application locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shahzaibzaman567/shazora.git
   cd shazora
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create and fill in `server/.env` and `client/.env.local` as described in the configuration section.

4. **Run the development servers:**
   ```bash
   npm run dev
   ```
   *This command starts both the Vite frontend client (port `5173`) and the Express backend server (port `5000`) concurrently.*

---

## ☁️ Vercel Production Deployment

Shazora is pre-configured for Vercel using `vercel.json` and a serverless entry point in `api/index.js`. 

### Crucial Steps for a Successful Production Launch:

1. **MongoDB Atlas IP Whitelist (Must-Do):**
   Since Vercel runs on dynamic IP addresses, you must allow incoming connections from anywhere on your MongoDB cluster:
   - Go to **MongoDB Atlas Dashboard** -> **Network Access**.
   - Click **Add IP Address**.
   - Enter **`0.0.0.0/0`** (Allow Access from Anywhere) and click **Confirm**.

2. **Add Environment Variables to Vercel:**
   Configure these variables in your Vercel Project Settings -> **Environment Variables**:
   - `MONGO_URI`
   - `SESSION_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` = `https://your-domain.vercel.app/auth/google/callback`

3. **Push to Production:**
   Simply push your changes to GitHub to trigger Vercel's automatic deploy:
   ```bash
   git add .
   git commit -m "Deploy Shazora to Vercel"
   git push origin main
   ```

---

## 📄 License

This project is licensed under the MIT License.
