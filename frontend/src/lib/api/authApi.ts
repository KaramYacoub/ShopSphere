import axiosInstance from "@/lib/axios";

interface SignupData {
  name: string;
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const res = await axiosInstance.post("/auth/signup", data);
  return res.data;
};

export const login = async (data: LoginData) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const verifyEmail = async (token: string) => {
  const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  window.location.href = "/";
  return res.data;
};

export const checkAuth = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data: unknown) => {
  const res = await axiosInstance.put("/user/update-profile", data);
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axiosInstance.post("/user/forget-password", { email });
  return res.data;
};

export const resetPassword = async ({
  email,
  otp,
  newPassword,
}: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const res = await axiosInstance.post("/user/reset-password", {
    email,
    otp,
    newPassword,
  });
  return res.data;
};

export const contactUs = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const res = await axiosInstance.post("/user/contact-us", data);
  return res.data;
};

export const deleteAccount = async () => {
  const res = await axiosInstance.delete("/user/delete-account");
  return res.data;
};
