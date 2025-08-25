import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import { renderPrice } from "@/utils/utils";

interface ShippingMethodProps {
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  shippingMethods: {
    id: string;
    name: string;
    price: number;
    delivery: string;
  }[];
}

export function ShippingMethod({
  shippingMethod,
  setShippingMethod,
  shippingMethods,
}: ShippingMethodProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
        Shipping Method
      </h3>

      <RadioGroup
        value={shippingMethod}
        onValueChange={setShippingMethod}
        className="space-y-2"
      >
        {shippingMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center space-x-3 p-4 border rounded-lg"
          >
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {method.delivery}
                  </p>
                </div>
                <span className="font-semibold">
                  {method.price === 0 ? "Free" : renderPrice(method.price)}
                </span>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
