
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export const PricingTab: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'both'>('card');

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-2">
        <Label htmlFor="base-price">Base Price (€)</Label>
        <Input id="base-price" type="number" defaultValue="15.00" min="0" step="0.5" />
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <RadioGroup 
          defaultValue="card" 
          value={paymentMethod} 
          onValueChange={(value) => setPaymentMethod(value as 'card' | 'cash' | 'both')}
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="payment-card" />
            <Label htmlFor="payment-card" className="text-sm">Card Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="payment-cash" />
            <Label htmlFor="payment-cash" className="text-sm">Cash Only</Label>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <RadioGroupItem value="both" id="payment-both" />
            <Label htmlFor="payment-both" className="text-sm">Accept Both</Label>
          </div>
        </RadioGroup>
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
