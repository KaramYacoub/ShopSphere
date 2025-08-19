import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import User from "../models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      passReqToCallback: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || profile.name?.givenName || "User";
        if (!email)
          return done(new Error("Google account has no public email"));

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name,
            email,
            password: null,
            isVerified: true,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value ?? undefined,
          });
        } else {
          // If user exists but wasn't verified, verify it now
          if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
          }
          // attach googleId/provider if missing
          if (!user.googleId) {
            user.googleId = profile.id;
            user.provider = user.provider || "google";
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
