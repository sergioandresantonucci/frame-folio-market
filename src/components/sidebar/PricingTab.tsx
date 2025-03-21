
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export const PricingTab: React.FC = () => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-2">
        <Label htmlFor="base-price">Base Price (€)</Label>
        <Input id="base-price" type="number" defaultValue="15.00" min="0" step="0.5" />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="bulk-discount" />
        <Label htmlFor="bulk-discount">Enable Bulk Discounts</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount-quantity">Discount Quantity</Label>
        <Input id="discount-quantity" type="number" defaultValue="5" min="2" step="1" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount-percent">Discount (%)</Label>
        <Input id="discount-percent" type="number" defaultValue="10" min="0" max="100" step="1" />
      </div>

      <Button className="w-full bg-magenta hover:bg-magenta/90">
        Apply Pricing
      </Button>
    </div>
  );
};
