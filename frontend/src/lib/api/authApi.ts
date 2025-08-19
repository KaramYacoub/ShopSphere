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
  return res.data;
};

export const checkAuth = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};
