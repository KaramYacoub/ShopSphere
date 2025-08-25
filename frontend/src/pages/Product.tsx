import { useParams } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Plus } from "lucide-react";
import { useCheckAuth } from "@/hooks/useAuth";
import { useProductById } from "@/hooks/useProducts";
import {
  useAddToCart,
  useCartStatus,
  useRemoveFromCart,
} from "@/hooks/useCart";
import { renderStars, renderPrice } from "@/utils/utils";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "@/components/ui/loader";
import { toast } from "sonner";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useProductById(id || "");
  console.log("data:", data);
  const product = data?.product || {};
  const {
    _id,
    image,
    name,
    description,
    price,
    discountPrice,
    onSale,
    rating,
    numReviews,
    stock,
    categoryName,
  } = product;

  //   const { t } = useTranslation();
  const { isAuthenticated } = useCheckAuth();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { isInCart } = useCartStatus(_id);

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
  const handleWishlist = (product: { name: string }) => {
    console.log(product);
    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      return;
    }
    setIsWishlisted((prev) => !prev);
    toast.success(
      `${product.name} ${isWishlisted ? "removed to" : "added to"} wishlist`
    );
  };

  if (isLoading) return <Loader />;

  if (error || !data?.product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Product not found</p>
          <Link to="/products">
            <Button variant="outline" className="mt-4">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <img
                src={`/${image}`}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {categoryName}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mt-2">{name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-400">
                  {renderStars(rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({numReviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                {discountPrice
                  ? renderPrice(discountPrice)
                  : renderPrice(price)}
              </span>
              {discountPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {renderPrice(price)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className={stock > 0 ? "text-green-600" : "text-red-600"}>
                {stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
              {stock > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({stock} available)
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                className="flex-1 gap-2"
                disabled={
                  !isAuthenticated || stock === 0 || isAdding || isRemoving
                }
                onClick={handleToggleCart}
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

              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => handleWishlist(product)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Category:</span>
                  <p className="text-muted-foreground">{categoryName}</p>
                </div>
                <div>
                  <span className="font-semibold">SKU:</span>
                  <p className="text-muted-foreground">
                    #{product._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
                {onSale && (
                  <div>
                    <span className="font-semibold">Sale:</span>
                    <p className="text-muted-foreground">Active</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
