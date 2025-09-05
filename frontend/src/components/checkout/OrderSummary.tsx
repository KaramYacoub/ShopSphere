import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
import { renderPrice } from "@/utils/utils";
import type { OrderSummaryProps } from "@/types/types";

export function OrderSummary({ cart, shippingCost }: OrderSummaryProps) {
  const tax = cart.total * 0.08;
  const total = cart.total + shippingCost + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item._id} className="flex justify-between">
              <div className="flex gap-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded"
                />
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-semibold">
                {renderPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{renderPrice(cart.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shippingCost === 0 ? "Free" : renderPrice(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{renderPrice(tax)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{renderPrice(total)}</span>
        </div>

        <div className="flex items-center justify-center gap-2 pt-3 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Secure checkout</span>
        </div>
      </CardContent>
    </Card>
  );
}
