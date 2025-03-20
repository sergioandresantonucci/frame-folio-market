
import React from 'react';
import { PhotoProvider, usePhotoContext } from '@/context/PhotoContext';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoViewer } from '@/components/PhotoViewer';
import { CartModal } from '@/components/CartModal';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ShoppingCart, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const ClientViewContent: React.FC = () => {
  const { state, setDisplayMode, toggleCart, addToCart } = usePhotoContext();
  const navigate = useNavigate();

  const exitClientView = () => {
    setDisplayMode('grid');
    navigate('/gallery');
  };

  const handleAddSelectedToCart = () => {
    if (state.selectedIds.length === 0) {
      return;
    }
    
    // Aggiungi ogni foto selezionata al carrello
    state.selectedIds.forEach(id => {
      addToCart(id);
    });
    
    // Apri il carrello dopo aver aggiunto le foto
    toggleCart();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={exitClientView}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Exit Client View
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="text-xl font-medium">Photo Selection</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {state.selectedIds.length > 0 && (
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                {state.selectedIds.length} selected
              </span>
            )}
            
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Carrello
              {state.cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-magenta text-white border-0 h-5 min-w-5 flex items-center justify-center p-0">
                  {state.cartItems.length}
                </Badge>
              )}
            </Button>
            
            <Button
              className={cn(
                "bg-magenta hover:bg-magenta/90",
                state.selectedIds.length === 0 && "opacity-50 cursor-not-allowed"
              )}
              disabled={state.selectedIds.length === 0}
              onClick={handleAddSelectedToCart}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Aggiungi al carrello
            </Button>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <PhotoGrid />
        <PhotoViewer />
        <CartModal />
      </main>
    </div>
  );
};

const ClientView: React.FC = () => {
  return (
    <PhotoProvider>
      <ClientViewContent />
    </PhotoProvider>
  );
};

export default ClientView;
