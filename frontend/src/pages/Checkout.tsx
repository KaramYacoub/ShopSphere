import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { CheckoutSteps } from "../components/checkout/CheckoutSteps";
import { ShippingForm } from "../components/checkout/ShippingForm";
import { ShippingMethod } from "../components/checkout/ShippingMethod";
import { PaymentMethod } from "../components/checkout/PaymentMethod";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { EstimatedDelivery } from "../components/checkout/EstimatedDelivery";

import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrder";
import type { Cart, ShippingFormData, PaymentFormData, CreateOrderData } from "@/types/types";
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

function Checkout() {
  const { i18n } = useTranslation();
  const dir = i18n.dir();
  const { isAuthenticated } = useCheckAuth();
  const { data: cartData, refetch } = useCart();
  const createOrderMutation = useCreateOrder();
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

  const ltr = {
    initial: { opacity: 0, x: -150 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  };

  const cart: Cart = cartData?.cart || { items: [], total: 0 };
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");

  // React Hook Form for shipping information
  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
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

    const orderData: CreateOrderData = {
      shippingAddress: { ...shippingData },
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
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Start shopping to add items to your cart
                </p>
                <Link to="/products">
                  <Button>Continue Shopping</Button>
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
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/cart" className="inline-flex items-center text-sm mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Checkout Steps */}
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              viewport={{ once: true }}
            >
              <CheckoutSteps step={step} />
            </motion.div>

            {/* Form Sections */}
            <form onSubmit={handleSubmit}>
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <motion.div
                  variants={ltr}
                  initial="initial"
                  animate="animate"
                  viewport={{ once: true }}
                >
                  <ShippingForm form={shippingForm} />
                </motion.div>
              )}

              {/* Step 2: Shipping Method */}
              {step === 2 && (
                <motion.div
                  variants={ltr}
                  initial="initial"
                  animate="animate"
                  viewport={{ once: true }}
                >
                  <ShippingMethod
                    shippingMethod={shippingMethod}
                    setShippingMethod={setShippingMethod}
                    shippingMethods={shippingMethods}
                  />
                </motion.div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <motion.div
                  variants={ltr}
                  initial="initial"
                  animate="animate"
                  viewport={{ once: true }}
                >
                  <PaymentMethod form={paymentForm} />
                </motion.div>
              )}

              {/* Step 4: Review Order */}
              {step === 4 && (
                <motion.div
                  variants={ltr}
                  initial="initial"
                  animate="animate"
                  viewport={{ once: true }}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Review Your Order
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">
                            Shipping Information
                          </h4>
                          <p className="text-muted-foreground">
                            {shippingForm.watch("firstName")}{" "}
                            {shippingForm.watch("lastName")}
                            <br />
                            {shippingForm.watch("address")}
                            <br />
                            {shippingForm.watch("city")},{" "}
                            {shippingForm.watch("state")}{" "}
                            {shippingForm.watch("zipCode")}
                            <br />
                            {shippingForm.watch("country")}
                            <br />
                            {shippingForm.watch("email")}
                            <br />
                            {shippingForm.watch("phone")}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Shipping Method</h4>
                          <p className="text-muted-foreground">
                            {selectedShipping?.name} -{" "}
                            {selectedShipping?.delivery}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Payment Method</h4>
                          <p className="text-muted-foreground">
                            Credit Card ending in{" "}
                            {paymentForm.watch("cardNumber")?.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <motion.div
                className="flex justify-between pt-8"
                variants={fadeUp}
                initial="initial"
                animate="animate"
                viewport={{ once: true }}
              >
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}
                {step < 4 ? (
                  <Button type="button" onClick={handleNextStep}>
                    Continue
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    {createOrderMutation.isPending
                      ? "Processing..."
                      : "Complete Order"}
                  </Button>
                )}
              </motion.div>
            </form>
          </div>

          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            variants={rtl}
            initial="initial"
            animate="animate"
            viewport={{ once: true }}
          >
            <OrderSummary cart={cart} shippingCost={shippingCost} />
            <EstimatedDelivery delivery={selectedShipping?.delivery} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
