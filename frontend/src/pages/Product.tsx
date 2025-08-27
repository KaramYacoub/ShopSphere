import { useParams } from "react-router-dom";
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
import { Link } from "react-router-dom";
import Loader from "@/components/ui/loader";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlistStatus,
} from "@/hooks/useWishlist";
export default function Product() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useProductById(id || "");
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

  const dir = i18n.dir();
  const { isAuthenticated } = useCheckAuth();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();

  const { mutate: addToWishlist, isPending: isAddingToWishlist } =
    useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemovingFromWishlist } =
    useRemoveFromWishlist();

  const { isInWishlist } = useWishlistStatus(_id);

  const { isInCart } = useCartStatus(_id);

  // Animation variants
  const fadeUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const rtl = {
    initial: { opacity: 0, x: 150 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  };

  const ltr = {
    initial: { opacity: 0, x: -150 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  };

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
        },
        onError: () => {
          toast.error("Failed to remove from wishlist");
        },
      });
    } else {
      addToWishlist(_id, {
        onSuccess: () => {
          toast.success(`${name} added to wishlist`);
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
      toast.error(t("product.loginToAddCart"));
      return;
    }

    if (stock === 0) {
      toast.error(t("product.outOfStock"));
      return;
    }

    if (isInCart) {
      removeFromCart(_id);
    } else {
      addToCart({ productId: _id, quantity: 1 });
    }
  };

  if (isLoading) return <Loader />;

  if (error || !data?.product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">
            {t("product.notFound")}
          </p>
          <Link to="/products">
            <Button variant="outline" className="mt-4">
              {t("product.backToProducts")}
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
    <div className="min-h-screen bg-muted/30 py-8" dir={dir}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Product Image */}
          <motion.div
            className="space-y-4"
            variants={ltr}
            initial="initial"
            animate="animate"
            viewport={{ once: true }}
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${image}`}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            variants={rtl}
            initial="initial"
            animate="animate"
            viewport={{ once: true }}
          >
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
                  ({numReviews} {t("product.reviews")})
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
                {stock > 0 ? t("product.inStock") : t("product.outOfStock")}
              </span>
              {stock > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({stock} {t("product.available")})
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("product.description")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Actions */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-6"
              variants={fadeUp}
              initial="initial"
              animate="animate"
              viewport={{ once: true }}
            >
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
                  ? t("product.removing")
                  : isAdding
                  ? t("product.adding")
                  : isAuthenticated
                  ? stock > 0 && !isInCart
                    ? t("product.addToCart")
                    : stock > 0 && isInCart
                    ? t("product.removeFromCart")
                    : t("product.outOfStock")
                  : t("product.loginToShop")}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={handleWishlist}
                disabled={isAddingToWishlist || isRemovingFromWishlist}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isInWishlist
                  ? t("product.wishlisted")
                  : t("product.addToWishlist")}
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              className="pt-6 border-t"
              variants={fadeUp}
              initial="initial"
              animate="animate"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">
                    {t("product.category")}:
                  </span>
                  <p className="text-muted-foreground">{categoryName}</p>
                </div>
                <div>
                  <span className="font-semibold">{t("product.sku")}:</span>
                  <p className="text-muted-foreground">
                    #{product._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
                {onSale && (
                  <div>
                    <span className="font-semibold">{t("product.sale")}:</span>
                    <p className="text-muted-foreground">
                      {t("product.active")}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
