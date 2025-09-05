import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Download, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { Order } from "@/types/types";
import { renderPrice } from "@/utils/utils";

function OrderConfirmation() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const location = useLocation();
  const order: Order = location.state?.order;

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

  if (!order) {
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
                <h2 className="text-2xl font-bold mb-4">
                  {t("OrderNotFound.title")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("OrderNotFound.description")}
                </p>
                <Link to="/products">
                  <Button>{t("OrderNotFound.button")}</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const formatDate = (dateValue: string | Date) => {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8" dir={dir}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">
            {t("Order.confirmed.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("Order.confirmed.message")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            className="space-y-6"
            variants={ltr}
            initial="initial"
            animate="animate"
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("Order.summary.title")}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t("Order.summary.number")}</span>
                    <span className="font-mono">#{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Order.summary.date")}</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Order.summary.total")}</span>
                    <span className="font-semibold">
                      {renderPrice(order.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Order.summary.payment.method")}</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Order.summary.shipping.method")}</span>
                    <span>{order.shippingMethod.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Order.summary.estimated.delivery")}</span>
                    <span>{formatDate(order.estimatedDelivery)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("Order.summary.shipping.address")}
                </h3>
                <p className="text-muted-foreground">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                  <br />
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                  <br />
                  {order.shippingAddress.email}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Items */}
          <motion.div
            className="space-y-6"
            variants={rtl}
            initial="initial"
            animate="animate"
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("Order.summary.order.title")}
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      className="flex items-center gap-4"
                      variants={fadeUp}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: index * 0.1 }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t("Order.summary.order.quantity")} {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {renderPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>{t("Order.summary.order.subtotal")}</span>
                    <span>
                      {renderPrice(
                        order.items.reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("Order.summary.order.shipping")}</span>
                    <span>{renderPrice(order.shippingMethod.price)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-2">
                    <span>{t("Order.summary.order.total")}</span>
                    <span>{renderPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <motion.div
              className="flex flex-col gap-3"
              variants={fadeUp}
              initial="initial"
              animate="animate"
              viewport={{ once: true }}
            >
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t("Order.summary.action.download")}
              </Button>
              <Link to="/products">
                <Button className="w-full">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {t("Order.summary.action.continue")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
