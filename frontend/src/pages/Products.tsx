import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import { useAllProducts, useAllCategories } from "@/hooks/useProducts";
import { useCheckAuth } from "@/hooks/useAuth";
import ProductCard from "@/components/productCard";
import type { ProductCardProps } from "@/types/types";
import FiltersSidebar from "@/components/FiltersSidebar";
import ProductPagination from "@/components/Pagination";

import { motion } from "framer-motion";

export default function Products() {
  const { t } = useTranslation();
  const { isAuthenticated } = useCheckAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const fadeUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const ltr = {
    initial: { opacity: 0, x: -150 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  };

  // State for active filters
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : "",
    max: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : "",
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name");
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "asc"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // Build query parameters
  const queryParams = {
    page: currentPage,
    limit: 9,
    ...(searchTerm && { search: searchTerm }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(priceRange.min && { minPrice: priceRange.min }),
    ...(priceRange.max && { maxPrice: priceRange.max }),
    sortBy,
    sortOrder,
  };

  // Fetch data
  const { data: productsData, isLoading: productsLoading } =
    useAllProducts(queryParams);
  const { data: categoriesData, isLoading: categoriesLoading } =
    useAllCategories();

  // Extracted data
  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];
  const pagination = productsData?.pagination || {};

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (priceRange.min) params.set("minPrice", priceRange.min.toString());
    if (priceRange.max) params.set("maxPrice", priceRange.max.toString());
    if (sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (currentPage !== 1) params.set("page", currentPage.toString());

    setSearchParams(params);
  }, [
    searchTerm,
    selectedCategory,
    priceRange,
    sortBy,
    sortOrder,
    currentPage,
    setSearchParams,
  ]);

  // Handle filters change from sidebar
  const handleFiltersChange = (filters: {
    searchTerm: string;
    selectedCategory: string;
    priceRange: { min: number | string; max: number | string };
  }) => {
    setSearchTerm(filters.searchTerm);
    setSelectedCategory(filters.selectedCategory);
    setPriceRange(filters.priceRange);
    setCurrentPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    priceRange.min,
    priceRange.max,
    sortBy,
    sortOrder,
  ]);

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("products.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-8 border-b"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("products.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("products.subtitle", { count: pagination.totalProducts || 0 })}
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            className="lg:w-80"
            variants={ltr}
            initial="initial"
            animate="animate"
            viewport={{ once: true }}
          >
            <FiltersSidebar
              initialSearchTerm={searchTerm}
              initialSelectedCategory={selectedCategory}
              initialPriceRange={priceRange}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              categories={categories}
            />
          </motion.div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div
              className="flex flex-col sm:flex-row justify-end items-center sm:items-center gap-4 mb-6"
              variants={fadeUp}
              initial="initial"
              animate="animate"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {t("products.toolbar.sortBy", {
                        field:
                          sortBy === "name"
                            ? t("products.toolbar.sort.name")
                            : sortBy === "price"
                            ? t("products.toolbar.sort.price")
                            : t("products.toolbar.sort.rating"),
                      })}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy("name")}>
                      {t("products.toolbar.sort.name")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price")}>
                      {t("products.toolbar.sort.price")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("rating")}>
                      {t("products.toolbar.sort.rating")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Order */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc"
                    ? t("products.toolbar.sort.asc")
                    : t("products.toolbar.sort.desc")}
                </Button>
              </div>
            </motion.div>

            {/* Products */}
            {products.length > 0 ? (
              <>
                {" "}
                {/* Products Grid */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  viewport={{ once: true }}
                >
                  {products.map(
                    (product: ProductCardProps["product"], index: number) => (
                      <motion.div
                        key={product._id}
                        variants={fadeUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                      >
                        <ProductCard
                          key={product._id}
                          product={product}
                          isAuthenticated={isAuthenticated}
                        />
                      </motion.div>
                    )
                  )}
                </motion.div>
                {/* Pagination */}
                <div className="mt-8">
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages || 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground text-lg">
                    {t("products.noResults.title")}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="mt-4"
                  >
                    {t("products.noResults.clearFilters")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
