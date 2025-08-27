import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from "@/hooks/useCart";
import { useCheckAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { renderPrice } from "@/utils/utils";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { Cart } from "@/types/types";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const { isAuthenticated } = useCheckAuth();
  const { data: cartData, refetch } = useCart();
  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: removeFromCart } = useRemoveFromCart();
  const { mutate: clearCart } = useClearCart();
  const navigate = useNavigate();

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

  const cart: Cart = cartData?.cart || { items: [], total: 0 };

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 py-8" dir={dir}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent className="py-12">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-4">{t("cart.empty")}</h2>
                <p className="text-muted-foreground mb-6">
                  {t("cart.loginPrompt")}
                </p>
                <Link to="/login">
                  <Button>{t("cart.loginToContinue")}</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 py-8" dir={dir}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent className="py-12">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-4">{t("cart.empty")}</h2>
                <p className="text-muted-foreground mb-6">
                  {t("cart.startShopping")}
                </p>
                <Link to="/products">
                  <Button>{t("cart.continueShopping")}</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8" dir={dir}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold">{t("cart.title")}</h1>
          <Button
            variant="outline"
            onClick={() => clearCart()}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {t("cart.clearCart")}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <motion.div
                key={item._id}
                variants={fadeUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${
                          item.image
                        }`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-muted-foreground">
                          {renderPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateCartItem({
                              productId: item.productId._id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartItem({
                              productId: item.productId._id,
                              quantity: Math.max(
                                1,
                                parseInt(e.target.value) || 1
                              ),
                            })
                          }
                          className="w-16 text-center text-white"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateCartItem({
                              productId: item.productId._id,
                              quantity: item.quantity + 1,
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {renderPrice(item.price * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.productId._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            variants={rtl}
            initial="initial"
            animate="animate"
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t("cart.orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t("cart.subtotal")}</span>
                  <span>{renderPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.shipping")}</span>
                  <span>{t("cart.free")}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("cart.total")}</span>
                  <span>{renderPrice(cart.total)}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => navigate("/checkout")}
                >
                  {t("cart.proceedToCheckout")}
                </Button>
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    {t("cart.continueShopping")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
