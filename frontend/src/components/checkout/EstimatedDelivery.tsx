import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface EstimatedDeliveryProps {
  delivery?: string;
}

export function EstimatedDelivery({ delivery }: EstimatedDeliveryProps) {
  return (
    <Card>
      <CardContent className="flex gap-3 p-4">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium">Estimated Delivery</p>
          <p className="text-sm text-muted-foreground">
            {delivery || "5-7 business days"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
