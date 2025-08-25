// hooks/useOrder.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

type orderData = {
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingMethod: {
    name: string;
    price: number;
    delivery: string;
  };
  paymentMethod: string;
  orderNotes: string;
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (orderData: orderData) =>
      api.post("/orders", orderData).then((res) => res.data),
    onSuccess: () => {},
    onError: (err: unknown) => {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        toast.error(
          String(err.response?.data?.message) || "Failed to Create Order"
        );
      } else {
        toast.error("Failed to Create Order");
      }
    },
  });
};

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders").then((res) => res.data),
  });
};

export const useGetOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
    enabled: !!orderId,
  });
};
