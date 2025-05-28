import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export function PaymentMethods() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-4">
          <CreditCard className="h-6 w-6 text-muted-foreground" />
          <div>
            <p className="font-medium">Visa •••• 4242</p>
            <p className="text-sm text-muted-foreground">Expires 12/25</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          Remove
        </Button>
      </div>
      
      <Button variant="outline" className="w-full">
        Add Payment Method
      </Button>
    </div>
  );
} 