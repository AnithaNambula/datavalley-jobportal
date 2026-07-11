const passport = require('passport');

// Only register Google strategy if credentials are configured
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id' &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret'
) {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  const User = require('../models/User');

  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) return done(null, user);

      const email = profile.emails?.[0]?.value;
      user = await User.findOne({ email });
      if (user) {
        user.googleId = profile.id;
        if (!user.avatar && profile.photos?.[0]?.value) user.avatar = profile.photos[0].value;
        await user.save();
        return done(null, user);
      }

      user = await User.create({
        name:     profile.displayName,
        email,
        googleId: profile.id,
        avatar:   profile.photos?.[0]?.value || '',
        role:     'jobseeker',
      });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(id);
    done(null, user);
  } catch (err) { done(err, null); }
});

module.exports = passport;
