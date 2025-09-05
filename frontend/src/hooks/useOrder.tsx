// hooks/useOrder.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import type { CreateOrderData } from "@/types/types";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (orderData: CreateOrderData) =>
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
