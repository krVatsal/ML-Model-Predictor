import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import User from '../models/user.js'; 
import History from '../models/history.js';

const GITHUB_CLIENT_ID = process.env.CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.CLIENT_SECRET;
const GITHUB_CALLBACK_URL = 'https://chanet-frontend-974929463300.asia-south2.run.app/auth/github/callback';

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName || profile.username, // Fallback to username if displayName is null
            avatarUrl: profile.photos[0]?.value || '',
            email: profile.emails?.[0]?.value || profile._json.email || '',
          });

          // Create history for new user with empty sessions array
          let history = await History.findOne({ author: user._id });
          if (!history) {
            history = new History({ 
              author: user._id, 
              sessions: [] // Fixed syntax
            });
            await history.save();
          }
        }

        done(null, user);

      } catch (error) {
        console.error('Auth Error:', error); // Added error logging
        done(error, null);
      }
    }
  )
);

export default passport;