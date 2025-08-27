export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const strongPassword = (v) =>
  typeof v === "string" && v.length >= 6 && /[A-Z]/.test(v) && /[0-9]/.test(v);

export const validateSignup = (name, email, password) => {
  const errors = [];

  if (!name || !email || !password) {
    errors.push("All fields are required");
  }

  if (!isEmail(email)) {
    errors.push("Invalid email format");
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return errors;
};

export const validateLogin = (email, password) => {
  const errors = [];

  if (!email || !password) {
    errors.push("All fields are required");
  }

  if (!isEmail(email)) {
    errors.push("Invalid email format");
  }

  return errors;
};
