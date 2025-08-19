import axiosInstance from "../axios";

export const getRandomThreeFeatureProducts = async () => {
  const res = await axiosInstance.get("shared/featured/random");
  return res.data;
};

export const getAllProductsPublic = async (params = {}) => {
  const res = await axiosInstance.get("shared/products", { params });
  return res.data;
};

export const getAllCategories = async () => {
  const res = await axiosInstance.get("shared/categories");
  return res.data;
};
