import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Set up Google strategy for Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in the database by email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If user does not exist, create a new one with a dummy password
          const hashedPassword = await bcrypt.hash('google_auth_dummy_password', 10); // Hash a dummy password
          
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName || '',
            email: profile.emails[0].value,
            userType: 'Customer', // Default user type
            contactNumber: 0, // You can later update this field
            password: hashedPassword, // Save the hashed password (optional)
          });
          await user.save(); // Save user to DB
        }

        return done(null, user); // Return the user for the session
      } catch (err) {
        return done(err, null); // If an error occurs, pass it to done
      }
    }
  )
);

// Serialize and deserialize user to support sessions
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Retrieve user from the DB by _id
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
