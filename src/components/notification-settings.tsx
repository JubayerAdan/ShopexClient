import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <Label className="font-medium">Order Updates</Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications about order status
          </p>
        </div>
        <Switch />
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <Label className="font-medium">Promotional Offers</Label>
          <p className="text-sm text-muted-foreground">
            Get updates about special offers and discounts
          </p>
        </div>
        <Switch />
      </div>
    </div>
  );
} 