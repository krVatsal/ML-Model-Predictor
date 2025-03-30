import express from 'express';
import passport from '../middlewares/passport-config.js'; // Path to your configured passport file

const router = express.Router();

// Route to initiate GitHub authentication
router.get('/github', passport.authenticate('github'));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: 'https://chanet-frontend-974929463300.asia-south2.run.app' }),
  (req, res) => {
    // Ensure session is saved before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Session save failed' });
      }
      res.redirect('https://chanet-frontend-974929463300.asia-south2.run.app');
    });
  }
);

// Update the status route to include better error handling
router.get('/status', (req, res) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('Is Authenticated:', req.isAuthenticated());
  
  if (req.isAuthenticated() && req.user) {
    return res.status(200).json({ 
      loggedIn: true, 
      user: {
        _id: req.user._id,
        displayName: req.user.displayName,
        username: req.user.username
      } 
    });
  }
  res.status(401).json({ loggedIn: false });
});

// Update logout route to handle session destruction
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid', {
      path: '/',
      secure: true,
      sameSite: 'none'
    });
    res.status(200).json({ message: 'Logged out successfully' });
  });
});
