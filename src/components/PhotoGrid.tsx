
import React, { useState, useEffect, useRef } from 'react';
import { usePhotoContext, Photo } from '@/context/PhotoContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Image, 
  Check, 
  Euro, 
  Download,
  CreditCard,
  Trash,
  Eye,
  ScanFace,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface PhotoGridProps {
  className?: string;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ className }) => {
  const { 
    state, 
    selectPhoto, 
    deselectPhoto, 
    clearSelection,
    selectRange,
    setPrice,
    setActivePhoto,
    addToCart
  } = usePhotoContext();
  const [shiftKeyActive, setShiftKeyActive] = useState(false);
  const [ctrlKeyActive, setCtrlKeyActive] = useState(false);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Filter photos based on active filters
  const filteredPhotos = state.photos.filter(photo => {
    const { filters } = state;
    
    if (filters.photographer && photo.photographer !== filters.photographer) {
      return false;
    }
    
    if (filters.eventDate && photo.eventDate !== filters.eventDate) {
      return false;
    }
    
    if (filters.date && photo.date !== filters.date) {
      return false;
    }
    
    if (filters.hasFace === true && (!photo.faces || photo.faces.length === 0)) {
      return false;
    }
    
    return true;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKeyActive(true);
      }
      if (e.key === 'Control' || e.key === 'Meta') {
        setCtrlKeyActive(true);
      }
      
      // Select all photos with Ctrl+A
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        filteredPhotos.forEach(photo => selectPhoto(photo.id));
      }
      
      // Deselect all with Escape
      if (e.key === 'Escape') {
        clearSelection();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKeyActive(false);
      }
      if (e.key === 'Control' || e.key === 'Meta') {
        setCtrlKeyActive(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [filteredPhotos, clearSelection, selectPhoto]);

  const handlePhotoClick = (photo: Photo, index: number) => {
    if (shiftKeyActive && lastClickedIndex !== null) {
      selectRange(lastClickedIndex, index);
    } else if (ctrlKeyActive) {
      if (state.selectedIds.includes(photo.id)) {
        deselectPhoto(photo.id);
      } else {
        selectPhoto(photo.id);
      }
    } else {
      if (state.selectedIds.length === 1 && state.selectedIds[0] === photo.id) {
        // Double-click behavior: open the photo viewer
        setActivePhoto(photo.id);
      } else {
        clearSelection();
        selectPhoto(photo.id);
      }
    }
    
    setLastClickedIndex(index);
  };

  const handlePriceChange = (id: string, price: string) => {
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice) && numericPrice >= 0) {
      setPrice(id, numericPrice);
    }
  };

  const handleExportSelected = () => {
    if (state.selectedIds.length === 0) {
      toast.warning("Please select photos to export");
      return;
    }
    
    // In a real implementation, this would trigger a payment flow first
    toast.info(`Preparing ${state.selectedIds.length} photos for export`);
    
    // Simulate export delay
    setTimeout(() => {
      toast.success(`${state.selectedIds.length} photos exported successfully`);
    }, 1500);
  };

  const handleBulkDelete = () => {
    if (state.selectedIds.length === 0) {
      toast.warning("Please select photos to delete");
      return;
    }
    
    toast.info(`Deleted ${state.selectedIds.length} photos`);
    clearSelection();
  };

  const handleAddToCart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(id);
  };

  const handleAddSelectedToCart = () => {
    if (state.selectedIds.length === 0) {
      toast.warning("Please select photos to add to cart");
      return;
    }
    
    state.selectedIds.forEach(id => {
      addToCart(id);
    });
    
    toast.success(`Added ${state.selectedIds.length} photos to cart`);
  };

  if (filteredPhotos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <Image className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No photos found</h3>
        <p className="text-gray-500 max-w-md mb-6">
          No photos match your current filters or no photos have been uploaded yet.
        </p>
        <Button asChild className="bg-magenta hover:bg-magenta/90">
          <a href="/upload">Upload Photos</a>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-sm text-gray-500">
            {filteredPhotos.length} photos 
            {state.selectedIds.length > 0 && ` • ${state.selectedIds.length} selected`}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {state.selectedIds.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleExportSelected}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 bg-magenta text-white hover:bg-magenta/90"
                onClick={handleAddSelectedToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:border-red-200"
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        )}
      >
        {filteredPhotos.map((photo, index) => (
          <Card 
            key={photo.id}
            className={cn(
              "overflow-hidden relative group transition-all duration-200 border-2",
              state.selectedIds.includes(photo.id) 
                ? "border-magenta shadow-md scale-[0.98]" 
                : "border-transparent hover:border-gray-200",
              state.cartItems.includes(photo.id) && "border-green-500"
            )}
          >
            <div 
              className="aspect-square bg-gray-100 relative cursor-pointer overflow-hidden"
              onClick={() => handlePhotoClick(photo, index)}
            >
              {photo.src ? (
                <img
                  src={photo.src}
                  alt={`Photo ${index + 1}`}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-300",
                    "group-hover:scale-[1.03]"
                  )}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <Image className="h-12 w-12 text-gray-300" />
                </div>
              )}
              
              {photo.watermarked && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <span className="text-white font-medium rotate-[-30deg] text-2xl opacity-60">
                    SAMPLE
                  </span>
                </div>
              )}
              
              {photo.faces && photo.faces.length > 0 && (
                <Badge 
                  className="absolute top-2 right-2 bg-blue-500 text-white border-0"
                  title="Face detected"
                >
                  <ScanFace className="h-3 w-3 mr-1" />
                  {photo.faces.length}
                </Badge>
              )}
              
              <div className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 bg-white/20 text-white hover:bg-white/30 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhoto(photo.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-7 w-7 bg-white/20 text-white hover:bg-white/30 hover:text-white",
                      state.cartItems.includes(photo.id) && "bg-green-500/50 hover:bg-green-500/70"
                    )}
                    onClick={(e) => handleAddToCart(photo.id, e)}
                    title={state.cartItems.includes(photo.id) ? "Già nel carrello" : "Aggiungi al carrello"}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 bg-white/20 text-white hover:bg-white/30 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Processing payment...");
                      setTimeout(() => {
                        toast.success("Payment successful! Download started.");
                      }, 1500);
                    }}
                  >
                    <CreditCard className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-3 flex items-center justify-between">
              <Checkbox
                checked={state.selectedIds.includes(photo.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    selectPhoto(photo.id);
                  } else {
                    deselectPhoto(photo.id);
                  }
                }}
                className="data-[state=checked]:bg-magenta data-[state=checked]:border-magenta"
              />
              
              <div className="flex items-center">
                <Euro className="h-4 w-4 text-gray-400 mr-1" />
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  className="w-16 h-7 text-right pr-1"
                  value={photo.price.toString()}
                  onChange={(e) => handlePriceChange(photo.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            {state.selectedIds.includes(photo.id) && (
              <div className="absolute top-2 left-2 bg-magenta text-white p-1 rounded-full">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            {state.cartItems.includes(photo.id) && (
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <ShoppingCart className="h-4 w-4" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
