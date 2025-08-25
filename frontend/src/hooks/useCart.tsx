import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/lib/api/cart";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.setQueryData(["cart"], data);
      toast.success("Product added to cart");
    },
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
          String(err.response?.data?.message) || "Failed to add to cart"
        );
      } else {
        toast.error("Failed to add to cart");
      }
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => updateCartItem(productId, { quantity }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.setQueryData(["cart"], data);
    },
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
          String(err.response?.data?.message) || "Failed to update cart"
        );
      } else {
        toast.error("Failed to update cart");
      }
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.setQueryData(["cart"], data);
      toast.success("Item removed from cart");
    },
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
          String(err.response?.data?.message) || "Failed to remove from cart"
        );
      } else {
        toast.error("Failed to remove from cart");
      }
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.setQueryData(["cart"], { cart: { items: [], total: 0 } });
      toast.success("Cart cleared");
    },
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
          String(err.response?.data?.message) || "Failed to clear cart"
        );
      } else {
        toast.error("Failed to clear cart");
      }
    },
  });
};

export function useCartStatus(productId: string) {
  const { data: cartResponse } = useCart();

  const isInCart =
    cartResponse?.cart?.items?.some(
      (item: { productId: { _id: string } }) => item.productId._id === productId
    ) || false;

  return { isInCart };
}
