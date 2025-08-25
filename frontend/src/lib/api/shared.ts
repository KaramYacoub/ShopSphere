import axiosInstance from "../axios";

export const getRandomThreeFeatureProducts = async () => {
  const res = await axiosInstance.get("shared/featured/random");
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await axiosInstance.get(`shared/product/${id}`);
  return res.data;
};

export const getAllProducts = async (params = {}) => {
  const res = await axiosInstance.get("shared/products", { params });
  return res.data;
};

export const getAllCategories = async () => {
  const res = await axiosInstance.get("shared/categories");
  return res.data;
};
