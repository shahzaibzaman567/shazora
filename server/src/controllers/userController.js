import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const ADMIN_EMAIL = 'shahzaibzaman465@gmail.com';
const ASSIGNABLE_ROLES = ['admin', 'customer', 'delivery_boy'];

// @desc    Auth user & get token
// @route   POST /api/users/login
export const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'inactive') {
        res.status(403);
        throw new Error('Account is inactive');
      }
      // Auto-correct role for the platform owner
      if (user.email === ADMIN_EMAIL && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }

      const token = generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) { next(error); }
};

// @desc    Auth via Google (Mock for now or verify Google Token)
// @route   POST /api/users/google
// @access  Public
export const googleAuthUser = async (req, res, next) => {
  try {
    const { email, name, googleId } = req.body;
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create user if they don't exist
      user = await User.create({
        name,
        email,
        password: googleId + Math.random().toString(), // Random password for oauth users
      });
    }

    const token = generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/users
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: normalizedEmail === ADMIN_EMAIL ? 'admin' : 'customer',
    });
    
    if (user) {
      generateToken(res, user._id);
      const token = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) { next(error); }
};

// @desc    Add to Recently Viewed
// @route   POST /api/users/recently-viewed
export const addRecentlyViewed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId } = req.body;
    
    // Remove if already exists so we can add to top
    user.recentlyViewed = user.recentlyViewed.filter(id => id.toString() !== productId);
    user.recentlyViewed.unshift(productId);
    
    // Keep max 10
    if (user.recentlyViewed.length > 10) user.recentlyViewed.pop();
    await user.save();
    res.json(user.recentlyViewed);
  } catch (error) { next(error); }
};

// @desc    Toggle Wishlist
// @route   POST /api/users/wishlist
export const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId } = req.body;
    
    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      user.wishlist.splice(index, 1); // remove
    } else {
      user.wishlist.push(productId); // add
    }
    
    await user.save();
    res.json(user.wishlist);
  } catch (error) { next(error); }
};

// @desc    Get user profile (includes wishlist and recently viewed populated)
// @route   GET /api/users/profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('wishlist')
      .populate('recentlyViewed');

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) { next(error); }
};
import nodemailer from 'nodemailer';

// @desc    Forgot Password (Send OTP)
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('No user found with this email');
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    console.log(`[DEV MODE] OTP for ${email} is: ${otp}`);

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'shahzaibzaman465@gmail.com',
          pass: process.env.EMAIL_PASS || 'ecvgviqsqncnsrig'
        }
      });

      const senderEmail = process.env.EMAIL_USER || 'shahzaibzaman465@gmail.com';

      await transporter.sendMail({
        from: `"Shazora Support" <${senderEmail}>`,
        to: user.email,
        subject: 'Password Reset Verification Code',
        html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;border:1px solid #eee;border-radius:12px;">
               <h2 style="color:#0A1128;">Password Reset Request</h2>
               <p>Your verification code is:</p>
               <div style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#1D4ED8;padding:20px;text-align:center;background:#f9f9f9;border-radius:8px;">${otp}</div>
               <p style="color:#666;margin-top:20px;">This code will expire in <strong>10 minutes</strong>.</p>
               <p style="color:#999;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
               </div>`
      });
    } catch (err) {
      console.error('Nodemailer Error:', err);
      console.warn('Email could not be sent. Check SMTP credentials in backend. OTP logged in console.');
    }

    res.json({ message: 'Verification code sent to your email.' });
  } catch (error) { next(error); }
};

// @desc    Verify OTP only (no reset yet)
// @route   POST /api/users/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired verification code');
    }
    res.json({ valid: true });
  } catch (error) { next(error); }
};

// @desc    Reset Password with OTP
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired verification code');
    }

    // Reset password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) { next(error); }
};

// @desc    Update user password
// @route   PUT /api/users/profile/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;

    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401);
      throw new Error('Invalid old password');
    }
  } catch (error) { next(error); }
};

// @desc    Update user role (admin only)
// @route   PATCH /api/users/:id/role
// @access  Private / Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!ASSIGNABLE_ROLES.includes(role)) {
      res.status(400);
      throw new Error('Invalid role. Allowed: admin, customer, delivery_boy');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.email === ADMIN_EMAIL && role !== 'admin') {
      res.status(400);
      throw new Error('Cannot change platform owner role');
    }

    user.role = role;
    await user.save();

    const updated = await User.findById(user._id).select('-password');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
