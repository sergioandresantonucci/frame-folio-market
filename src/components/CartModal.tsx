
import React, { useState } from 'react';
import { usePhotoContext, Photo } from '@/context/PhotoContext';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X, 
  ShoppingCart, 
  CreditCard, 
  Trash2, 
  Check,
  Euro,
  Printer
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema di validazione per il form di pagamento
const paymentSchema = z.object({
  cardName: z.string().min(3, "Inserisci il nome completo"),
  cardNumber: z.string().min(16, "Inserisci un numero di carta valido").max(19),
  expiry: z.string().min(5, "Formato MM/YY richiesto"),
  cvc: z.string().min(3, "Inserisci un CVC valido").max(4),
  printFormat: z.enum(['none', 'a3', 'a4', 'a5']).optional(),
  printQuantity: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const printFormatPrices = {
  none: 0,
  a3: 12.99,
  a4: 8.99,
  a5: 5.99,
};

export const CartModal: React.FC = () => {
  const { state, toggleCart, removeFromCart, clearCart, getCartTotal } = usePhotoContext();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('digital');
  const [printFormat, setPrintFormat] = useState<'none' | 'a3' | 'a4' | 'a5'>('none');
  const [printQuantities, setPrintQuantities] = useState<Record<string, number>>({});

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      printFormat: 'none',
      printQuantity: '1',
    },
  });

  // Ottieni le foto nel carrello
  const cartPhotos = state.photos.filter(photo => state.cartItems.includes(photo.id));
  const cartTotal = getCartTotal();
  
  // Calcola il costo delle stampe
  const getPrintCost = () => {
    let totalPrintCost = 0;
    Object.keys(printQuantities).forEach(photoId => {
      const quantity = printQuantities[photoId] || 0;
      if (quantity > 0 && printFormat !== 'none') {
        totalPrintCost += quantity * printFormatPrices[printFormat];
      }
    });
    return totalPrintCost;
  };

  // Calcola il costo totale (digitale + stampe)
  const getTotalCost = () => {
    return cartTotal + getPrintCost();
  };
  
  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    // Rimuovi anche dalla lista delle quantità di stampa
    const newPrintQuantities = {...printQuantities};
    delete newPrintQuantities[id];
    setPrintQuantities(newPrintQuantities);
  };

  const handleCheckout = () => {
    if (cartPhotos.length === 0) {
      toast.warning("Il carrello è vuoto");
      return;
    }
    setIsCheckingOut(true);
  };

  const handlePrintFormatChange = (value: string) => {
    setPrintFormat(value as 'none' | 'a3' | 'a4' | 'a5');
  };

  const handlePrintQuantityChange = (photoId: string, quantity: number) => {
    setPrintQuantities(prev => ({
      ...prev,
      [photoId]: Math.max(0, quantity)
    }));
  };

  const handlePaymentSubmit = (values: PaymentFormValues) => {
    setIsProcessing(true);
    
    // Simula elaborazione del pagamento
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      
      toast.success("Pagamento completato con successo!");
      
      // Simula download dopo pagamento
      setTimeout(() => {
        toast.success(`${cartPhotos.length} foto pronte per il download`);
        
        if (printFormat !== 'none' && Object.values(printQuantities).some(q => q > 0)) {
          toast.success(`La tua richiesta di stampa in formato ${printFormat.toUpperCase()} è stata elaborata`);
        }
        
        clearCart();
        setIsCheckingOut(false);
        setPaymentComplete(false);
        toggleCart();
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={state.cartOpen} onOpenChange={toggleCart}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5" />
            {isCheckingOut ? "Pagamento" : "Il tuo carrello"}
          </DialogTitle>
        </DialogHeader>
        
        {!isCheckingOut ? (
          // Vista carrello
          <>
            {cartPhotos.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium">Il tuo carrello è vuoto</h3>
                <p className="text-sm text-gray-500 mt-1">Seleziona alcune foto per acquistarle</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Tabs defaultValue="digital" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="digital">Foto digitali</TabsTrigger>
                    <TabsTrigger value="print">Stampe</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="digital" className="mt-4">
                    <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-2">
                      {cartPhotos.map((photo) => (
                        <div key={photo.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                          <div className="h-16 w-16 relative rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                            <img 
                              src={photo.thumbnail || photo.src} 
                              alt="Foto" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Foto {photo.id.split('-')[1]}</span>
                              <div className="flex items-center">
                                <Euro className="h-3.5 w-3.5 text-gray-500 mr-1" />
                                <span>{photo.price.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-500 mt-1">
                              {photo.photographer && `Fotografo: ${photo.photographer}`}
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveItem(photo.id)}
                            className="h-8 w-8 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium">Totale digitale</span>
                      <span className="text-xl font-bold flex items-center">
                        <Euro className="h-4 w-4 mr-1" /> 
                        {cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="print" className="mt-4">
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Seleziona formato di stampa</h3>
                      <RadioGroup 
                        defaultValue="none" 
                        className="flex flex-wrap gap-3" 
                        onValueChange={handlePrintFormatChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="none" />
                          <FormLabel htmlFor="none">Nessuna stampa</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="a3" id="a3" />
                          <FormLabel htmlFor="a3">A3 (€{printFormatPrices.a3.toFixed(2)})</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="a4" id="a4" />
                          <FormLabel htmlFor="a4">A4 (€{printFormatPrices.a4.toFixed(2)})</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="a5" id="a5" />
                          <FormLabel htmlFor="a5">A5 (€{printFormatPrices.a5.toFixed(2)})</FormLabel>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {printFormat !== 'none' && (
                      <div className="max-h-[30vh] overflow-y-auto space-y-3 pr-2">
                        {cartPhotos.map((photo) => (
                          <div key={photo.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                            <div className="h-16 w-16 relative rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                              <img 
                                src={photo.thumbnail || photo.src} 
                                alt="Foto" 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-grow">
                              <span className="font-medium">Foto {photo.id.split('-')[1]}</span>
                              <div className="flex items-center mt-1">
                                <span className="text-sm text-gray-600 mr-2">Quantità:</span>
                                <div className="flex items-center">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6 text-xs"
                                    onClick={() => handlePrintQuantityChange(
                                      photo.id, 
                                      (printQuantities[photo.id] || 0) - 1
                                    )}
                                  >
                                    -
                                  </Button>
                                  <span className="w-8 text-center">
                                    {printQuantities[photo.id] || 0}
                                  </span>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6 text-xs"
                                    onClick={() => handlePrintQuantityChange(
                                      photo.id, 
                                      (printQuantities[photo.id] || 0) + 1
                                    )}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Euro className="h-3.5 w-3.5 text-gray-500 mr-1" />
                              <span>{(printFormatPrices[printFormat] * (printQuantities[photo.id] || 0)).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Separator className="my-4" />
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium">Costo stampe</span>
                      <span className="text-xl font-bold flex items-center">
                        <Euro className="h-4 w-4 mr-1" /> 
                        {getPrintCost().toFixed(2)}
                      </span>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium">Totale complessivo</span>
                  <span className="text-xl font-bold flex items-center">
                    <Euro className="h-4 w-4 mr-1" /> 
                    {getTotalCost().toFixed(2)}
                  </span>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={clearCart} 
                    disabled={cartPhotos.length === 0}
                  >
                    Svuota
                  </Button>
                  <Button 
                    onClick={handleCheckout} 
                    disabled={cartPhotos.length === 0}
                    className="bg-magenta hover:bg-magenta/90"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Procedi al pagamento
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Vista checkout
          <>
            {paymentComplete ? (
              <div className="py-6 text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Pagamento completato!</h3>
                <p className="text-gray-600 mb-6">Grazie per il tuo acquisto</p>
                
                <div className="flex justify-center">
                  <Button className="bg-magenta hover:bg-magenta/90">
                    Download delle foto
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePaymentSubmit)} className="space-y-4">
                  <div className="mb-4 bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Totale da pagare:</span>
                      <span className="font-bold text-lg">€{getTotalCost().toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {cartPhotos.length} foto senza filigrana
                      {getPrintCost() > 0 && ` + stampe in formato ${printFormat.toUpperCase()}`}
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome sulla carta</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome Cognome" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numero carta</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1234 5678 9012 3456" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data scadenza</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="MM/AA" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="123" type="password" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCheckingOut(false)}
                      disabled={isProcessing}
                    >
                      Indietro
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-magenta hover:bg-magenta/90"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Elaborazione...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Paga €{getTotalCost().toFixed(2)}
                        </span>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
