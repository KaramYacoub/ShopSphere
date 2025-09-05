import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import { useCheckAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import ProductCard from "@/components/productCard";
import type { ProductCardProps, PaginationParams } from "@/types/types";
import ProductPagination from "@/components/Pagination";

import { motion } from "framer-motion";

export default function Wishlist() {
  const { t } = useTranslation();
  const { isAuthenticated } = useCheckAuth();

  const fadeUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  // State for sorting
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Build query parameters
  const queryParams: PaginationParams = {
    page: currentPage,
    limit: 9,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
  };

  // Fetch wishlist data
  const {
    data: wishlistData,
    isLoading: wishlistLoading,
    refetch,
  } = useWishlist(queryParams);

  // Extracted data
  const wishlistProducts = wishlistData?.products || [];
  const pagination = wishlistData?.pagination || {};

  if (wishlistLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("wishlist.loading")}</p>
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
          {t("wishlist.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("wishlist.subtitle", { count: pagination.totalProducts || 0 })}
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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
                <Button variant="outline" className="flex items-center gap-2">
                  {t("wishlist.toolbar.sortBy", {
                    field:
                      sortBy === "name"
                        ? t("wishlist.toolbar.sort.name")
                        : sortBy === "price"
                        ? t("wishlist.toolbar.sort.price")
                        : t("wishlist.toolbar.sort.rating"),
                  })}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  {t("wishlist.toolbar.sort.name")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price")}>
                  {t("wishlist.toolbar.sort.price")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>
                  {t("wishlist.toolbar.sort.rating")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Order */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc"
                ? t("wishlist.toolbar.sort.asc")
                : t("wishlist.toolbar.sort.desc")}
            </Button>
          </div>
        </motion.div>

        {/* Wishlist Products */}
        {wishlistProducts.length > 0 ? (
          <>
            {/* Products Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              variants={fadeUp}
              initial="initial"
              animate="animate"
              viewport={{ once: true }}
            >
              {wishlistProducts.map(
                (product: ProductCardProps["product"], index: number) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      isAuthenticated={isAuthenticated}
                      onWishlistUpdate={() => refetch()}
                    />
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ProductPagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              </motion.div>
            )}
          </>
        ) : (
          // Empty Wishlist State
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-md mx-auto">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">
                {t("wishlist.empty.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("wishlist.empty.description")}
              </p>
              <Button asChild>
                <a href="/products">{t("wishlist.empty.cta")}</a>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
