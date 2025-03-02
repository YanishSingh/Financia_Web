const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();

module.exports = (passport) => {
  // JWT Strategy
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_SECRET;
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        console.error('JWT Strategy error:', err);
        return done(err, false);
      }
    })
  );

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Google profile:', profile);
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          }
          // If not found by googleId, try finding by email (for users registered manually)
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.googleId = profile.id;
            user.profileImage = profile.photos[0].value;
            await user.save();
            return done(null, user);
          }
          // Otherwise, create a new user
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profileImage: profile.photos[0].value,
            password: 'google_oauth' // placeholder, since Google users won't use this
          });
          await user.save();
          return done(null, user);
        } catch (err) {
          console.error('Google OAuth error:', err);
          return done(err, false);
        }
      }
    )
  );
};

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
