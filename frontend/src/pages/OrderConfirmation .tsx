import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Download,
  Mail,
  Truck,
  Home,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { renderPrice } from "@/utils/utils";
import { Separator } from "@/components/ui/separator";
import { type Order } from "@/types/order";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const order: Order = location.state?.order;

  useEffect(() => {
    if (!location.state?.order) {
      navigate("/");
    }
  }, [location.state, navigate]);

  if (!location.state?.order) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card>
            <CardContent className="py-12">
              <AlertCircle className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find your order details. Please check your order
                history.
              </p>
              <Button onClick={() => navigate("/")}>Return to Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleViewOrderHistory = () => {
    navigate("/orders");
  };

  const handleDownloadInvoice = () => {
    // TODO: implement invoice download
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order #{order.orderNumber} has
            been confirmed.
          </p>
          <p className="text-muted-foreground">
            A confirmation email has been sent to {order.shippingAddress.email}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
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
                    <span>{renderPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {order.shippingCost === 0
                        ? "Free"
                        : renderPrice(order.shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{renderPrice(order.tax)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{renderPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Truck className="h-5 w-5" />
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p>
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="mt-2">{order.shippingAddress.phone}</p>
                    <p>{order.shippingAddress.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Method</h3>
                    <p>{order.shippingMethod?.name || "Standard Shipping"}</p>
                    <p className="mt-4 font-semibold">Estimated Delivery</p>
                    <p>
                      {order.shippingMethod?.delivery || "5-7 business days"}
                    </p>
                    <p className="mt-2 font-semibold">Shipping Cost</p>
                    <p>
                      {order.shippingCost === 0
                        ? "Free"
                        : renderPrice(order.shippingCost)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      Email sent to {order.shippingAddress.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Shipping Updates</p>
                    <p className="text-sm text-muted-foreground">
                      We'll notify you when your order ships
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full" onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewOrderHistory}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                View Order History
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleContinueShopping}
              >
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about your order, please contact our
                  customer service.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
