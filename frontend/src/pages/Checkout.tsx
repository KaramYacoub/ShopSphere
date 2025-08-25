import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CheckoutSteps } from "../components/checkout/CheckoutSteps";
import { ShippingForm } from "../components/checkout/ShippingForm";
import { ShippingMethod } from "../components/checkout/ShippingMethod";
import { PaymentMethod } from "../components/checkout/PaymentMethod";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { EstimatedDelivery } from "../components/checkout/EstimatedDelivery";

import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrder";
import type { Cart } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { useCheckAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Define form validation schemas
const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  expiryDate: z.string().min(5, "Expiry date is required"),
  cvv: z.string().min(3, "CVV is required"),
  nameOnCard: z.string().min(1, "Name on card is required"),
  orderNotes: z.string().optional(),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;

function Checkout() {
  const { isAuthenticated } = useCheckAuth();
  const { data: cartData, refetch } = useCart();
  const createOrderMutation = useCreateOrder();
  const navigate = useNavigate();

  const cart: Cart = cartData?.cart || { items: [], total: 0 };
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");

  // React Hook Form for shipping information
  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: "United States",
    },
    mode: "onChange", // Add this to validate on change
  });

  // React Hook Form for payment information
  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange", // Add this to validate on change
  });

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 0,
      delivery: "5-7 business days",
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 9.99,
      delivery: "2-3 business days",
    },
    {
      id: "priority",
      name: "Priority Shipping",
      price: 19.99,
      delivery: "1-2 business days",
    },
  ];

  const selectedShipping = shippingMethods.find((m) => m.id === shippingMethod);
  const shippingCost = selectedShipping?.price || 0;

  const handleNextStep = async () => {
    try {
      if (step === 1) {
        const isValid = await shippingForm.trigger();
        if (!isValid) {
          toast.error("Please fill all required shipping information");
          return;
        }
      }
      if (step === 2) {
        if (!shippingMethod) {
          toast.error("Please select a shipping method");
          return;
        }
      }
      if (step === 3) {
        const isValid = await paymentForm.trigger();
        if (!isValid) {
          toast.error("Please fill all required payment information");
          return;
        }
      }
      setStep(step + 1);
    } catch (error) {
      console.error("Error validating form:", error);
      toast.error("Please check your form inputs");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isShippingValid = await shippingForm.trigger();
    const isPaymentValid = await paymentForm.trigger();

    if (!isShippingValid || !isPaymentValid || !shippingMethod) {
      toast.error("Please complete all required information");
      return;
    }

    // Get form data
    const shippingData = shippingForm.getValues();
    const paymentData = paymentForm.getValues();

    const orderData = {
      shippingAddress: shippingData,
      shippingMethod: {
        name: selectedShipping?.name || "Standard Shipping",
        price: shippingCost,
        delivery: selectedShipping?.delivery || "5-7 business days",
      },
      paymentMethod: "credit-card",
      orderNotes: paymentData.orderNotes || "",
    };

    const response = await createOrderMutation.mutateAsync(orderData);

    navigate("/order-confirmation", {
      state: { order: response.order },
    });
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card>
            <CardContent className="py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to add items to your cart
              </p>
              <Link to="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your purchase by filling in your details
          </p>
        </div>

        <CheckoutSteps step={step} />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {step === 1 && <ShippingForm form={shippingForm} />}
              {step === 2 && (
                <ShippingMethod
                  shippingMethod={shippingMethod}
                  setShippingMethod={setShippingMethod}
                  shippingMethods={shippingMethods}
                />
              )}
              {step === 3 && <PaymentMethod form={paymentForm} />}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {step > 1 ? "Previous" : "Back to Cart"}
                </Button>
                {step < 3 ? (
                  <Button type="button" onClick={handleNextStep} size="sm">
                    Continue to {step === 1 ? "Shipping" : "Payment"}{" "}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    size="sm"
                  >
                    {createOrderMutation.isPending ? (
                      "Processing..."
                    ) : (
                      <>
                        <Lock className="h-4 w-4" /> Place Order
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              <OrderSummary cart={cart} shippingCost={shippingCost} />
              <EstimatedDelivery delivery={selectedShipping?.delivery} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
