// backend/controllers/googleAuthController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Try to find the user by googleId
    let user = await User.findOne({ googleId: payload.sub });
    // If not found, try to find by email
    if (!user) {
      user = await User.findOne({ email: payload.email });
      if (user) {
        user.googleId = payload.sub;
        user.profileImage = payload.picture;
        await user.save();
      }
    }
    // If still not found, create a new user
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        profileImage: payload.picture,
        password: 'google_oauth', // placeholder
      });
      await user.save();
    }
    const jwtPayload = { id: user.id };
    jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, newToken) => {
      if (err) return res.status(500).json({ msg: 'Token generation error' });
      // Return both token and a sanitized user object
      res.json({
        token: newToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        },
      });
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ msg: 'Google token verification failed' });
  }
};
