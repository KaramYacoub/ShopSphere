import { useQuery } from "@tanstack/react-query";

import {
  getAllCategories,
  getProductById,
  getAllProducts,
  getRandomThreeFeatureProducts,
} from "@/lib/api/shared";

export function useAllProducts(params = {}) {
  return useQuery({
    queryKey: ["all-products-public", params],
    queryFn: () => getAllProducts(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => await getProductById(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRandomThreeFeatureProducts() {
  return useQuery({
    queryKey: ["random-three-featured-products"],
    queryFn: getRandomThreeFeatureProducts,
    staleTime: Infinity,
  });
}

export function useAllCategories() {
  return useQuery({
    queryKey: ["all-categories"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 5,
  });
}
