import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import User from "../models/user.js";

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
};

if (
  !googleConfig.clientID ||
  !googleConfig.clientSecret ||
  !googleConfig.callbackURL
) {
  throw new Error("Missing Google OAuth credentials in environment variables");
}

passport.use(
  "google",
  new GoogleStrategy(
    googleConfig,
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
        }

        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);
