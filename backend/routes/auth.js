import express from 'express';
import passport from '../middlewares/passport-config.js'; // Path to your configured passport file

const router = express.Router();

// Route to initiate GitHub authentication
router.get('/github', passport.authenticate('github'));

// Route to handle the GitHub callback
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login', // Redirect here if authentication fails
    successRedirect: '/',      // Redirect here if authentication succeeds
  })
);

// Route to log out the user
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send(err.message); // Handle logout errors
    }
    res.redirect('/'); // Redirect to the home page or login page after logout
  });
});

export default router;
