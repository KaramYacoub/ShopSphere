import axiosInstance from "../axios";

export const getCart = async () => {
  const res = await axiosInstance.get("/cart");
  return res.data;
};

export const addToCart = async (data: {
  productId: string;
  quantity?: number;
}) => {
  const res = await axiosInstance.post("/cart/add", data);
  return res.data;
};

export const updateCartItem = async (
  productId: string,
  data: { quantity: number }
) => {
  const res = await axiosInstance.put(`/cart/update/${productId}`, data);
  return res.data;
};

export const removeFromCart = async (productId: string) => {
  const res = await axiosInstance.delete(`/cart/remove/${productId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await axiosInstance.delete("/cart/clear");
  return res.data;
};
