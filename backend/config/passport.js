// import all the things we need  
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUserData = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value
        };

        try {
          // Check if user with this email already exists
          let user = await User.findOne({ email: newUserData.email });

          if (user) {
            // ⚠️ Email exists but maybe Google ID is different
            if (!user.googleId) {
              // Update user with Google ID if missing
              user.googleId = newUserData.googleId;
              await user.save();
            }
          } else {
            // No user with this email => create new
            user = await User.create(newUserData);
          }

          // ✅ Always generate a token for this user
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

          // Attach token to user object (temporary for redirect)
          user.token = token;

          done(null, user);
        } catch (err) {
          console.error('Google strategy error:', err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
