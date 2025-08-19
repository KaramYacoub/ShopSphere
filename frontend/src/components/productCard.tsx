import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "./ui/button";
import type { ProductCardProps } from "@/types/product";
import { renderStars, renderPrice } from "@/utils/utils";
import { useState } from "react";

function ProductCard({
  _id,
  image,
  name,
  onSale,
  rating,
  numReviews,
  discountPrice,
  price,
  stock,
  category,
  createdAt,
  isAuthenticated,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isNew =
    new Date().getTime() - new Date(createdAt).getTime() <
    30 * 24 * 60 * 60 * 1000;

  const discountPercentage = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <Card
      key={_id}
      className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 relative p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        minHeight: "400px",
      }}
    >
      {/* Main Image */}
      <img
        src={`/${image}`}
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
                isWishlisted
                  ? "bg-red-50 hover:bg-red-100"
                  : "bg-white/90 hover:bg-white"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted ? "text-red-500 fill-red-500" : "text-gray-800"
                }`}
              />
            </Button>
          </div>

          {/* Category */}
          <p className="text-xs font-medium text-white/80 uppercase tracking-wide mb-2">
            {category}
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
              {discountPrice ? renderPrice(discountPrice) : renderPrice(price)}
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
              disabled={!isAuthenticated || stock === 0}
              onClick={() => {
                if (isAuthenticated && stock > 0) {
                  console.log(`Added ${name} to cart`);
                }
              }}
              size="sm"
            >
              <ShoppingBag className="h-4 w-4" />
              {isAuthenticated
                ? stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"
                : "Login to Shop"}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default ProductCard;
