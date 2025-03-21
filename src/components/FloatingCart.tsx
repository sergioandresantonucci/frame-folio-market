
import React from 'react';
import { usePhotoContext } from '@/context/PhotoContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FloatingCartProps {
  className?: string;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ className }) => {
  const { state, toggleCart } = usePhotoContext();
  
  // Don't show if there are no items or cart is already open
  if (state.cartItems.length === 0 || state.cartOpen) {
    return null;
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Button
        onClick={toggleCart}
        className="bg-magenta hover:bg-magenta/90 rounded-full h-14 w-14 shadow-lg flex items-center justify-center relative"
      >
        <ShoppingCart className="h-6 w-6" />
        {state.cartItems.length > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-white text-magenta border-0 h-6 min-w-6 flex items-center justify-center p-0">
            {state.cartItems.length}
          </Badge>
        )}
      </Button>
    </div>
  );
};
