import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, // only required for email/password signup
    },
    googleId: {
      type: String, // store Google's unique user ID
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailChangeToken: {
      type: String,
      select: false,
    }, // to confirm email change
    emailChangeTokenExpires: {
      type: Date,
      select: false,
    }, // optional
    pendingEmail: {
      type: String,
      select: false,
    }, // holds new email until verified

    resetOTP: {
      type: String,
      select: false,
    },
    resetOTPExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.model("User", userSchema);

// Also export the model itself if needed elsewhere
export default User;
