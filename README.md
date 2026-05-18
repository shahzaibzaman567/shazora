# Shazora E-Commerce 🛍️

Shazora is a modern, premium E-Commerce web application built to provide a stunning shopping experience. It features dynamic animations, a fully-functional shopping cart, secure payments, and a powerful admin dashboard.

## 🌟 Features

- **Premium UI/UX:** Built with React, Tailwind CSS, Framer Motion, and GSAP for fluid, stunning micro-animations.
- **Authentication & Authorization:** Secure login and registration powered by InsForge.
- **Product Management:** Complete Admin Dashboard to add, edit, and delete products in real-time.
- **Order Tracking & Management:** View and update order statuses effortlessly.
- **Stripe Integration:** Secure and seamless checkout process using Stripe.
- **Serverless Architecture:** Fully migrated to InsForge (PostgreSQL, Auth, RLS) for high scalability.

## 🚀 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide React, Framer Motion, GSAP
- **Backend:** Node.js, Express (For Stripe Proxying) & **InsForge (Supabase Alternative)**
- **Database:** PostgreSQL (via InsForge)
- **Payments:** Stripe Checkout

## 📦 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shahzaibzaman567/shazora.git
   cd shazora
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up Environment Variables:**
   Create a `.env` in `server/` and `.env.local` in `client/` using the provided keys for Stripe and InsForge.

4. **Run the application:**
   ```bash
   npm run dev
   ```
   *This command concurrently starts both the frontend client and the backend proxy server.*

## 🛡️ Architecture & Security

Shazora leverages **Row Level Security (RLS)** in PostgreSQL to ensure that user data is isolated securely. The backend infrastructure is fully managed by InsForge, ensuring high availability and seamless data querying directly from the frontend using the `@insforge/sdk`.

## 📄 License

This project is open-source and available under the MIT License.
