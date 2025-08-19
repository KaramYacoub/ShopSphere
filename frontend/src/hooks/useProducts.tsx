import { useQuery } from "@tanstack/react-query";

import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySearch,
  getFilteredProducts,
  getSortedProducts,
} from "@/lib/api/productApi";

import {
  getAllCategories,
  getAllProductsPublic,
  getRandomThreeFeatureProducts,
} from "@/lib/api/shared";

export function useAllProducts() {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllProductsPublic(params = {}) {
  return useQuery({
    queryKey: ["all-products-public", params],
    queryFn: () => getAllProductsPublic(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ["products-by-category", category],
    queryFn: () => getProductsByCategory(category),
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

export function useProductsBySearch(search: string) {
  return useQuery({
    queryKey: ["products-by-search", search],
    queryFn: () => getProductsBySearch(search),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSortedProducts(sort: string, order: string) {
  return useQuery({
    queryKey: ["sorted-products", sort, order],
    queryFn: () => getSortedProducts(sort, order),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFilteredProducts(
  category: string,
  min: number,
  max: number
) {
  return useQuery({
    queryKey: ["filtered-products"],
    queryFn: () => getFilteredProducts(category, min, max),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllCategories() {
  return useQuery({
    queryKey: ["all-categories"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 5,
  });
}
