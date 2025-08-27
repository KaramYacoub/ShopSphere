import crypto from "crypto";

// function to hash token
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// function to generate OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// function to set auth cookie
export const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });
};

// function to clear auth cookie
export const clearAuthCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
};
