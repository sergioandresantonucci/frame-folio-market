
import React, { useState, useEffect } from 'react';
import { usePhotoContext, Photo } from '@/context/PhotoContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw,
  Download,
  CreditCard,
  ScanFace,
  Euro,
  ShoppingCart,
  Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export const PhotoViewer: React.FC = () => {
  const { state, setActivePhoto, addToCart, toggleCart } = usePhotoContext();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printFormat, setPrintFormat] = useState('a4');
  const activePhoto = state.activePhoto;

  useEffect(() => {
    // Reset zoom and rotation when a new photo is opened
    if (activePhoto) {
      setZoomLevel(100);
      setRotation(0);
    }
  }, [activePhoto?.id]);

  const handleClose = () => {
    setActivePhoto(null);
  };

  const navigateToPhoto = (direction: 'prev' | 'next') => {
    if (!activePhoto) return;
    
    const currentIndex = state.photos.findIndex(p => p.id === activePhoto.id);
    if (currentIndex === -1) return;
    
    let newIndex: number;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? state.photos.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === state.photos.length - 1 ? 0 : currentIndex + 1;
    }
    
    setActivePhoto(state.photos[newIndex].id);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      setZoomLevel(prev => Math.min(prev + 10, 200));
    } else {
      setZoomLevel(prev => Math.max(prev - 10, 50));
    }
  };

  const handleRotate = (direction: 'cw' | 'ccw') => {
    if (direction === 'cw') {
      setRotation(prev => (prev + 90) % 360);
    } else {
      setRotation(prev => (prev - 90 + 360) % 360);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Pagamento completato con successo!");
    setShowPaymentDialog(false);
    handleClose();
  };
  
  const handleAddToCart = () => {
    if (activePhoto) {
      addToCart(activePhoto.id);
      // Puoi anche decidere se chiudere il visualizzatore e aprire il carrello
      // setActivePhoto(null);
      // toggleCart();
    }
  };

  const handlePrintPhoto = () => {
    if (!activePhoto) return;
    setShowPrintDialog(true);
  };

  const handlePrintOrderSubmit = () => {
    toast.success(`Ordine di stampa in formato ${printFormat.toUpperCase()} aggiunto al carrello`);
    if (activePhoto) {
      addToCart(activePhoto.id);
    }
    setShowPrintDialog(false);
    toggleCart();
  };

  if (!activePhoto) return null;

  const isInCart = state.cartItems.includes(activePhoto.id);

  const printFormatPrices = {
    a3: 12.99,
    a4: 8.99,
    a5: 5.99,
  };

  return (
    <Dialog open={!!activePhoto} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg">Photo Viewer</DialogTitle>
              {activePhoto.faces && activePhoto.faces.length > 0 && (
                <Badge className="bg-blue-500 text-white border-0">
                  <ScanFace className="h-3.5 w-3.5 mr-1" />
                  Face Detected
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-grow flex items-center justify-center p-6 bg-black/5 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.src}
                alt="Selected photo"
                className={cn(
                  "max-h-full max-w-full object-contain transition-all duration-300",
                  activePhoto.watermarked && "opacity-90"
                )}
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                }}
              />
              
              {activePhoto.watermarked && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span className="text-black/30 font-bold text-4xl sm:text-6xl rotate-[-30deg]">
                    SAMPLE
                  </span>
                </div>
              )}
              
              {activePhoto.faces && activePhoto.faces.length > 0 && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  }}
                >
                  {activePhoto.faces.map((face, idx) => {
                    // Convert normalized coordinates to actual image coordinates
                    const imageElement = document.querySelector('.max-h-full.max-w-full') as HTMLImageElement;
                    if (!imageElement) return null;
                    
                    const [x, y, width, height] = face.bbox;
                    
                    return (
                      <div
                        key={idx}
                        className="absolute border-2 border-blue-500"
                        style={{
                          left: `${x * 100}%`,
                          top: `${y * 100}%`,
                          width: `${width * 100}%`,
                          height: `${height * 100}%`,
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() => navigateToPhoto('prev')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() => navigateToPhoto('next')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="border-t p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handleZoom('out')}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <Slider
                value={[zoomLevel]}
                min={50}
                max={200}
                step={5}
                className="w-32"
                onValueChange={(value) => setZoomLevel(value[0])}
              />
              
              <Button variant="outline" size="icon" onClick={() => handleZoom('in')}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-gray-500 min-w-[3rem]">{zoomLevel}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handleRotate('ccw')}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={() => handleRotate('cw')}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-md text-gray-700">
                <Euro className="h-4 w-4" />
                <span className="font-medium">{activePhoto.price.toFixed(2)}</span>
              </span>
              
              <Button
                variant={isInCart ? "outline" : "default"}
                className={isInCart ? "border-green-500 text-green-600" : ""}
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInCart ? "Già nel carrello" : "Aggiungi al carrello"}
              </Button>
              
              <Button
                variant="outline"
                onClick={handlePrintPhoto}
              >
                <Printer className="h-4 w-4 mr-2" />
                Stampa
              </Button>
              
              <Button
                className="bg-magenta hover:bg-magenta/90"
                onClick={() => toggleCart()}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Vai al carrello
              </Button>
              
              <Button
                className="bg-magenta hover:bg-magenta/90"
                onClick={() => setShowPaymentDialog(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Acquista
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      
      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Completa l'acquisto</DialogTitle>
            <DialogDescription>
              Procedi al pagamento per scaricare questa foto senza filigrana.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
              <span>Prezzo foto:</span>
              <span className="font-medium">€{activePhoto.price.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 h-16"
                onClick={handlePaymentSuccess}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.026-.024.13a.804.804 0 0 1-.794.68h-2.52a.483.483 0 0 1-.477-.558l.79-5.02c.036-.222.226-.374.45-.374h1.307c3.905 0 6.214-2.168 7.066-5.13a4.21 4.21 0 0 0-.173-3.1" fill="#253d80"></path>
                  <path d="M18.036 3.416c.63 3.488-2.818 7.14-6.62 7.14h-1.686a.483.483 0 0 0-.477.558l.79 5.016c.035.222.226.374.45.374h2.52a.805.805 0 0 0 .795-.68l.03-.17.59-3.736.038-.206a.804.804 0 0 1 .794-.68h.5c3.238 0 5.775-1.314 6.514-5.12.31-1.604.15-2.947-.722-3.894a3.4 3.4 0 0 0-1.023-.755" fill="#189bd7"></path>
                  <path d="M9.486 3.412a.483.483 0 0 1 .477-.558h6.05a6.23 6.23 0 0 1 1.314.141c.012 0 .025.004.036.004.313.07.6.17.86.302a4.77 4.77 0 0 0-1.22-2.956C16.07-.681 14.13.114 11.75.114H5.924a.805.805 0 0 0-.795.68L2.004 15.48a.483.483 0 0 0 .477.557h3.482l.88-5.563-.001-.038z" fill="#242e65"></path>
                </svg>
                PayPal
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 h-16"
                onClick={handlePaymentSuccess}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" fill="#635bff"/>
                </svg>
                Stripe
              </Button>
            </div>
            
            <div className="text-sm text-gray-500 mt-2">
              <p>Il tuo acquisto include:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Immagine ad alta risoluzione senza filigrana</li>
                <li>Diritti di utilizzo personale e commerciale</li>
                <li>Download istantaneo dopo il pagamento</li>
              </ul>
            </div>
          </div>
          
          <Button 
            variant="default" 
            className="w-full bg-magenta hover:bg-magenta/90"
            onClick={handlePaymentSuccess}
          >
            <Download className="h-4 w-4 mr-2" />
            Paga €{activePhoto.price.toFixed(2)} e scarica
          </Button>
        </DialogContent>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ordina stampa fotografica</DialogTitle>
            <DialogDescription>
              Seleziona il formato di stampa desiderato
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Formato di stampa</Label>
              <RadioGroup 
                defaultValue="a4" 
                value={printFormat} 
                onValueChange={setPrintFormat} 
                className="grid grid-cols-1 gap-2"
              >
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a3" id="print-a3" />
                    <Label htmlFor="print-a3" className="font-normal">A3 (297 × 420 mm)</Label>
                  </div>
                  <span className="text-sm font-medium">€{printFormatPrices.a3.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a4" id="print-a4" />
                    <Label htmlFor="print-a4" className="font-normal">A4 (210 × 297 mm)</Label>
                  </div>
                  <span className="text-sm font-medium">€{printFormatPrices.a4.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a5" id="print-a5" />
                    <Label htmlFor="print-a5" className="font-normal">A5 (148 × 210 mm)</Label>
                  </div>
                  <span className="text-sm font-medium">€{printFormatPrices.a5.toFixed(2)}</span>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between mt-4">
              <span>Costo stampa:</span>
              <span className="font-medium">€{printFormatPrices[printFormat as keyof typeof printFormatPrices].toFixed(2)}</span>
            </div>
            
            <div className="text-sm text-gray-500 mt-2">
              <p>Informazioni di stampa:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Carta fotografica premium</li>
                <li>Colori brillanti e definiti</li>
                <li>Spedizione in 3-5 giorni lavorativi</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowPrintDialog(false)}
            >
              Annulla
            </Button>
            
            <Button 
              type="button" 
              className="bg-magenta hover:bg-magenta/90"
              onClick={handlePrintOrderSubmit}
            >
              <Printer className="h-4 w-4 mr-2" />
              Aggiungi al carrello
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};
