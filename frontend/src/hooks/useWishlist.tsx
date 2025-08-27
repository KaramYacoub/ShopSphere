import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/lib/api/wishlist";
import type { ProductCardProps } from "@/types/types";
import { useCheckAuth } from "./useAuth";

export const useWishlist = (queryParams: {
  page: number | undefined;
  limit: number | undefined;
  sortBy: string | undefined;
  sortOrder: string | undefined;
}) => {
  return useQuery({
    queryKey: ["wishlist", queryParams],
    queryFn: () => getWishlist(queryParams),
    enabled: useCheckAuth().isAuthenticated,
  });
};

export const useWishlistStatus = (productId: string) => {
  const { data: wishlistData } = useWishlist({
    page: undefined,
    limit: undefined,
    sortBy: undefined,
    sortOrder: undefined,
  });

  const isInWishlist =
    wishlistData?.products?.some(
      (product: ProductCardProps["product"]) => product._id === productId
    ) || false;

  return { isInWishlist };
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
