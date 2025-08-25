import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { PaymentFormData } from "@/pages/Checkout";

interface PaymentMethodProps {
  form: UseFormReturn<PaymentFormData>;
}

export function PaymentMethod({ form }: PaymentMethodProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
        Payment Information
      </h3>

      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Card Number</Label>
          <Input
            {...register("cardNumber")}
            placeholder="1234 5678 9012 3456"
          />
          {errors.cardNumber && (
            <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Input {...register("expiryDate")} placeholder="MM/YY" />
            {errors.expiryDate && (
              <p className="text-sm text-red-500">
                {errors.expiryDate.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>CVV</Label>
            <Input {...register("cvv")} placeholder="123" />
            {errors.cvv && (
              <p className="text-sm text-red-500">{errors.cvv.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Name on Card</Label>
          <Input {...register("nameOnCard")} placeholder="John Doe" />
          {errors.nameOnCard && (
            <p className="text-sm text-red-500">{errors.nameOnCard.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Order Notes (Optional)</Label>
        <Textarea
          {...register("orderNotes")}
          placeholder="Special instructions for delivery"
          rows={2}
        />
      </div>
    </div>
  );
}
