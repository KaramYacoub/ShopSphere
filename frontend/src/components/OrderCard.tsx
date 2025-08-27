import type { Order } from "@/types/order";
import { Calendar, CheckCircle, Package, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { renderPrice } from "@/utils/utils";
import { Separator } from "./ui/separator";

export default function OrderCard({ order }: { order: Order }) {
  const { t, i18n } = useTranslation();

  const getStatusVariant = (
    status: string
  ):
    | "default"
    | "success"
    | "secondary"
    | "outline"
    | "destructive"
    | null
    | undefined => {
    switch (status) {
      case "confirmed":
        return "default";
      case "processing":
        return "secondary";
      case "shipped":
        return "outline";
      case "delivered":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 mr-2" />;
      case "processing":
        return <Package className="h-4 w-4 mr-2" />;
      case "shipped":
        return <Truck className="h-4 w-4 mr-2" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {t("orders.order")} # {order.orderNumber}
              <Badge variant={getStatusVariant(order.status)} className="ml-2">
                {getStatusIcon(order.status)}
                {t(`orders.status.${order.status}`)}
              </Badge>
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(order.createdAt).toLocaleDateString(i18n.language, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="text-lg font-semibold">
            {renderPrice(order.total)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Order Items */}
        <div className="p-6 pb-4">
          <h3 className="font-semibold mb-3">{t("orders.items")}</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${item.image}`}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.quantity")}: {item.quantity}
                  </p>
                </div>
                <div className="font-medium">
                  {renderPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              {t("orders.shippingAddress")}
            </h3>
            <div className="text-sm text-muted-foreground">
              <p>
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.email}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">{t("orders.orderSummary")}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t("orders.subtotal")}</span>
                <span>{renderPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("orders.shipping")}</span>
                <span>
                  {order.shippingCost === 0
                    ? t("orders.free")
                    : renderPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("orders.tax")}</span>
                <span>{renderPrice(order.tax)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>{t("orders.total")}</span>
                <span>{renderPrice(order.total)}</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">
                {t("orders.paymentMethod")}
              </h4>
              <p className="text-sm capitalize">{order.paymentMethod}</p>
            </div>

            {order.estimatedDelivery && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("orders.estimatedDelivery")}
                </h4>
                <p className="text-sm">
                  {new Date(order.estimatedDelivery).toLocaleDateString(
                    i18n.language,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
