import api from "@/lib/axios";

export const getWishlist = async (params: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const response = await api.get("/wishlist", { params });
  return response.data;
};

export const addToWishlist = async (productId: string) => {
  const response = await api.post("/wishlist", { productId });
  return response.data;
};

export const removeFromWishlist = async (productId: string) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};
