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
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error: any) {
    // If it's a 401 (Unauthorized), return null instead of throwing
    if (error.response?.status === 401) {
      return { user: null };
    }
    // For other errors, throw to let React Query handle them
    throw error;
  }
};
