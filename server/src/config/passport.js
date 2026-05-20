import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

dotenv.config();

const ADMIN_EMAIL = 'shahzaibzaman465@gmail.com';

passport.serializeUser((user, done) => {
  done(null, String(user._id));
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user || false);
  } catch (error) {
    done(error, false);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase().trim();
        if (!email) {
          return done(new Error('Google account did not return an email'), false);
        }

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || email.split('@')[0] || 'Google User',
            email,
            password: null,
            profilePicture: profile.photos?.[0]?.value || '',
            role: email === ADMIN_EMAIL ? 'admin' : 'customer',
          });
        } else {
          user.googleId = profile.id;
          user.name = profile.displayName || user.name;
          user.email = email;
          user.profilePicture = profile.photos?.[0]?.value || user.profilePicture || '';
          if (email === ADMIN_EMAIL) {
            user.role = 'admin';
          }
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

export default passport;
