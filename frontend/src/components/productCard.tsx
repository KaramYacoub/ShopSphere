import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Heart, Plus } from "lucide-react";
import { Button } from "./ui/button";
import type { ProductCardProps } from "@/types/types";
import { renderStars, renderPrice } from "@/utils/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useAddToCart,
  useCartStatus,
  useRemoveFromCart,
} from "@/hooks/useCart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlistStatus,
} from "@/hooks/useWishlist";
import { motion } from "framer-motion";

function ProductCard({
  product,
  isAuthenticated,
  onWishlistUpdate,
}: ProductCardProps) {
  const {
    _id,
    image,
    name,
    onSale,
    rating,
    numReviews,
    discountPrice,
    price,
    stock,
    categoryName,
    createdAt,
  } = product;

  const [isHovered, setIsHovered] = useState(false);
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();
  const navigate = useNavigate();

  const { mutate: addToWishlist, isPending: isAddingToWishlist } =
    useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemovingFromWishlist } =
    useRemoveFromWishlist();

  const { isInWishlist } = useWishlistStatus(_id);

  const { isInCart } = useCartStatus(_id);

  const isNew =
    new Date().getTime() - new Date(createdAt).getTime() <
    30 * 24 * 60 * 60 * 1000;

  const discountPercentage = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(_id, {
        onSuccess: () => {
          toast.success(`${name} removed from wishlist`);
          onWishlistUpdate?.();
        },
        onError: () => {
          toast.error("Failed to remove from wishlist");
        },
      });
    } else {
      addToWishlist(_id, {
        onSuccess: () => {
          toast.success(`${name} added to wishlist`);
          onWishlistUpdate?.();
        },
        onError: () => {
          toast.error("Failed to add to wishlist");
        },
      });
    }
  };

  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add to cart");
      return;
    }

    if (stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (isInCart) {
      removeFromCart(_id);
    } else {
      addToCart({ productId: _id, quantity: 1 });
    }
  };

  const handleClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card
        key={_id}
        className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 relative p-0 hover:cursor-pointer h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{
          minHeight: "400px",
        }}
      >
        {/* Main Image */}
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/${image}`}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>

        {/* Content container with gradient for readability */}
        <div className="relative z-10 h-full flex flex-col justify-end p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <CardContent className="p-0 text-white">
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              {/* NEW Badge */}
              {isNew && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                  NEW
                </div>
              )}

              {/* SALE Badge */}
              {onSale && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            {/* Quick actions on hover */}
            <div
              className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                variant="secondary"
                size="icon"
                className={`rounded-full h-9 w-9 shadow-md ${
                  isInWishlist
                    ? "bg-red-50 hover:bg-red-100"
                    : "bg-white/90 hover:bg-white"
                }`}
                onClick={handleWishlist}
                disabled={isAddingToWishlist || isRemovingFromWishlist}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isInWishlist ? "text-red-500 fill-red-500" : "text-gray-800"
                  }`}
                />
              </Button>
            </div>

            {/* Category */}
            <p className="text-xs font-medium text-white/80 uppercase tracking-wide mb-2">
              {categoryName}
            </p>

            {/* Product Name */}
            <h3 className="font-semibold text-xl mb-2 line-clamp-2">{name}</h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center text-amber-400">
                {renderStars(rating)}
              </div>
              <span className="text-sm text-white/80">({numReviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-white">
                {discountPrice
                  ? renderPrice(discountPrice)
                  : renderPrice(price)}
              </span>
              {discountPrice && (
                <span className="text-sm text-white/70 line-through">
                  {renderPrice(price)}
                </span>
              )}
            </div>

            {/* Stock & Add to Cart */}
            <div className="flex items-center justify-between">
              <p
                className={`text-xs font-medium ${
                  stock > 0 ? "text-green-300" : "text-red-300"
                }`}
              >
                {stock > 0 ? `${stock} left` : "Out of Stock"}
              </p>

              <Button
                className="gap-2 rounded-full px-4 transition-all duration-300 bg-white text-gray-900 hover:bg-gray-100"
                disabled={
                  !isAuthenticated || stock === 0 || isAdding || isRemoving
                }
                onClick={handleToggleCart}
                size="sm"
              >
                {isInCart ? (
                  <ShoppingBag className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {isRemoving
                  ? "Removing..."
                  : isAdding
                  ? "Adding..."
                  : isAuthenticated
                  ? stock > 0 && !isInCart
                    ? "Add to Cart"
                    : stock > 0 && isInCart
                    ? "Remove from Cart"
                    : "Out of Stock"
                  : "Login to Shop"}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

export default ProductCard;
