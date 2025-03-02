const express = require('express');
const multer = require('multer');
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const googleAuthController = require('../controllers/googleAuthController');

console.log('googleAuthController.googleLogin:', googleAuthController.googleLogin);

const router = express.Router();

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Registration and Login Routes
router.post('/register', upload.single('profileImage'), authController.register);
router.post('/login', authController.login);

// Google OAuth Strategy (redirect-based)
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await require('../models/User').findOne({ googleId: profile.id });
        if (!user) {
          user = await require('../models/User').findOne({ email: profile.emails[0].value });
          if (user) {
            user.googleId = profile.id;
            user.profileImage = profile.photos[0].value;
            await user.save();
            return done(null, user);
          }
        }
        if (!user) {
          user = new (require('../models/User'))({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profileImage: profile.photos[0].value,
            password: 'google_oauth',
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        console.error(err);
        done(err, false);
      }
    }
  )
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login' }),
  (req, res) => {
    const payload = { id: req.user.id };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT error in Google callback:', err);
        return res.status(500).send('Token generation error');
      }
      res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    });
  }
);

// New Endpoint for Client-Side Google Login
router.post('/google-login', googleAuthController.googleLogin);

// Protected Route Example
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ msg: 'This is a protected route', user: req.user });
});

// Change Password Route
router.put(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  authController.changePassword
);

// Update Profile Route
router.put(
  '/update-profile',
  passport.authenticate('jwt', { session: false }),
  upload.single('profileImage'),
  authController.updateProfile
);

module.exports = router;
