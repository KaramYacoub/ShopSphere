import axiosInstance from "@/lib/axios";

export const getAllProducts = async () => {
  const res = await axiosInstance.get("/getAllProducts");
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await axiosInstance.get(`/getProductById/${id}`);
  return res.data;
};

export const getProductsByCategory = async (category: string) => {
  const res = await axiosInstance.get(`/getProductsByCategory/${category}`);
  return res.data;
};

export const getProductsBySearch = async (searchTerm: string) => {
  const res = await axiosInstance.get(`/getProductsBySearch/${searchTerm}`);
  return res.data;
};

export const getSortedProducts = async (sort: string, order: string) => {
  const res = await axiosInstance.get(`/getSortedProducts/${sort}/${order}`);
  return res.data;
};

export const getFilteredProducts = async (
  category: string,
  min: number,
  max: number
) => {
  const res = await axiosInstance.get(
    `/getFilteredProducts?category=${category}&min=${min}&max=${max}`
  );
  return res.data;
};
