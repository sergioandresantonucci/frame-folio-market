
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePhotoContext } from '@/context/PhotoContext';
import { toast } from 'sonner';
import { 
  Wand2, 
  Layers, 
  Moon, 
  Sun, 
  Undo2,
  Check,
  Sparkles,
  Cloud,
  Sunset
} from 'lucide-react';

export const AdjustmentsTab: React.FC = () => {
  const { state } = usePhotoContext();
  
  // State for color adjustments
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [clarity, setClarity] = useState<number>(0);
  const [highlights, setHighlights] = useState<number>(0);

  // History for undo functionality
  const [history, setHistory] = useState<{[key: string]: string}>({});

  // Apply color adjustments function
  const applyColorAdjustments = () => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per applicare le regolazioni");
      return;
    }
    
    // Find the active photo element and apply CSS filters
    const photoId = state.activePhoto.id;
    const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`);
    
    if (photoElement) {
      // Save current filter in history before applying new one
      if (photoElement.style.filter) {
        setHistory(prev => ({
          ...prev,
          [photoId]: photoElement.style.filter
        }));
      }
      
      // Apply CSS filters directly to the image
      const filterString = `
        brightness(${1 + brightness/100})
        contrast(${1 + contrast/100})
        saturate(${1 + saturation/100})
        blur(${clarity < 0 ? Math.abs(clarity/200) : 0}px)
        ${temperature > 0 ? `sepia(${temperature/100})` : ''}
        ${temperature < 0 ? `hue-rotate(${temperature * 1.8}deg)` : ''}
        ${highlights > 0 ? `opacity(${1 - highlights/400})` : ''}
        ${highlights < 0 ? `drop-shadow(0 0 ${Math.abs(highlights)/50}px rgba(255,255,255,0.5))` : ''}
      `;
      
      photoElement.style.filter = filterString.trim();
      
      // Store the filter in sessionStorage to persist through renders
      sessionStorage.setItem(`filter-${photoId}`, filterString);
      
      toast.success("Regolazioni colore applicate", {
        description: `Luminosità: ${brightness}, Contrasto: ${contrast}, Saturazione: ${saturation}, Temperatura: ${temperature}`
      });
    } else {
      toast.error("Impossibile trovare l'elemento foto selezionato");
    }
  };

  // Restore filters from sessionStorage when component mounts or active photo changes
  useEffect(() => {
    if (state.activePhoto) {
      const photoId = state.activePhoto.id;
      const savedFilter = sessionStorage.getItem(`filter-${photoId}`);
      
      if (savedFilter) {
        const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`);
        if (photoElement) {
          photoElement.style.filter = savedFilter;
        }
        
        // Try to extract values from saved filter
        const brightnessMatch = savedFilter.match(/brightness\(([0-9.]+)\)/);
        const contrastMatch = savedFilter.match(/contrast\(([0-9.]+)\)/);
        const saturateMatch = savedFilter.match(/saturate\(([0-9.]+)\)/);
        const blurMatch = savedFilter.match(/blur\(([0-9.]+)px\)/);
        const sepiaMatch = savedFilter.match(/sepia\(([0-9.]+)\)/);
        const hueRotateMatch = savedFilter.match(/hue-rotate\(([0-9.-]+)deg\)/);
        const opacityMatch = savedFilter.match(/opacity\(([0-9.]+)\)/);
        const dropShadowMatch = savedFilter.match(/drop-shadow\(0 0 ([0-9.]+)px/);
        
        if (brightnessMatch) setBrightness(Math.round((parseFloat(brightnessMatch[1]) - 1) * 100));
        if (contrastMatch) setContrast(Math.round((parseFloat(contrastMatch[1]) - 1) * 100));
        if (saturateMatch) setSaturation(Math.round((parseFloat(saturateMatch[1]) - 1) * 100));
        if (blurMatch) setClarity(-Math.round(parseFloat(blurMatch[1]) * 200));
        
        if (sepiaMatch) {
          setTemperature(Math.round(parseFloat(sepiaMatch[1]) * 100));
        } else if (hueRotateMatch) {
          setTemperature(Math.round(parseFloat(hueRotateMatch[1]) / 1.8));
        } else {
          setTemperature(0);
        }
        
        if (opacityMatch) {
          setHighlights(Math.round((1 - parseFloat(opacityMatch[1])) * 400));
        } else if (dropShadowMatch) {
          setHighlights(-Math.round(parseFloat(dropShadowMatch[1]) * 50));
        } else {
          setHighlights(0);
        }
      } else {
        // Reset sliders if no saved filter
        setBrightness(0);
        setContrast(0);
        setSaturation(0);
        setTemperature(0);
        setClarity(0);
        setHighlights(0);
      }
    }
  }, [state.activePhoto]);

  // Undo last adjustment
  const undoAdjustment = () => {
    if (!state.activePhoto) return;
    
    const photoId = state.activePhoto.id;
    const previousFilter = history[photoId];
    
    if (previousFilter) {
      const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`);
      if (photoElement) {
        photoElement.style.filter = previousFilter;
        sessionStorage.setItem(`filter-${photoId}`, previousFilter);
        
        // Remove this entry from history
        const newHistory = {...history};
        delete newHistory[photoId];
        setHistory(newHistory);
        
        toast.info("Regolazione precedente ripristinata");
      }
    } else {
      toast.info("Nessuna regolazione precedente da annullare");
    }
  };

  // Apply auto-fix to selected photo
  const applyAutoFix = () => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per applicare la correzione automatica");
      return;
    }
    
    // Set some good looking auto-adjustment values
    setBrightness(10);
    setContrast(15);
    setSaturation(5);
    setTemperature(-3);
    setClarity(5);
    setHighlights(0);
    
    toast.success("Correzione automatica applicata");
    
    // Apply the changes after a short delay
    setTimeout(() => {
      applyColorAdjustments();
    }, 300);
  };

  // Apply vibrant preset
  const applyVibrantPreset = () => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per applicare il preset");
      return;
    }
    
    setBrightness(10);
    setContrast(20);
    setSaturation(30);
    setTemperature(5);
    setClarity(0);
    setHighlights(0);
    
    toast.success("Preset 'Vibrante' applicato");
    
    // Apply the changes after a short delay
    setTimeout(() => {
      applyColorAdjustments();
    }, 300);
  };

  // Apply warm sunset preset
  const applySunsetPreset = () => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per applicare il preset");
      return;
    }
    
    setBrightness(5);
    setContrast(10);
    setSaturation(15);
    setTemperature(20);
    setClarity(0);
    setHighlights(10);
    
    toast.success("Preset 'Tramonto' applicato");
    
    // Apply the changes after a short delay
    setTimeout(() => {
      applyColorAdjustments();
    }, 300);
  };

  // Apply cool tone preset
  const applyCoolPreset = () => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per applicare il preset");
      return;
    }
    
    setBrightness(0);
    setContrast(10);
    setSaturation(0);
    setTemperature(-25);
    setClarity(0);
    setHighlights(-5);
    
    toast.success("Preset 'Freddo' applicato");
    
    // Apply the changes after a short delay
    setTimeout(() => {
      applyColorAdjustments();
    }, 300);
  };

  // Reset adjustments
  const resetAdjustments = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setTemperature(0);
    setClarity(0);
    setHighlights(0);
    
    // If there's an active photo, reset its filters
    if (state.activePhoto) {
      const photoId = state.activePhoto.id;
      const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`);
      
      if (photoElement) {
        photoElement.style.filter = 'none';
        sessionStorage.removeItem(`filter-${photoId}`);
        toast.info("Regolazioni resettate");
      }
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="brightness" className="flex items-center gap-1">
            <Sun className="h-3.5 w-3.5" />
            Luminosità
          </Label>
          <Badge variant="outline" className="font-mono">{brightness}</Badge>
        </div>
        <Slider 
          id="brightness" 
          value={[brightness]} 
          min={-100} 
          max={100} 
          step={1} 
          onValueChange={(values) => setBrightness(values[0])}
          className="my-1"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="contrast">Contrasto</Label>
          <Badge variant="outline" className="font-mono">{contrast}</Badge>
        </div>
        <Slider 
          id="contrast" 
          value={[contrast]} 
          min={-100} 
          max={100} 
          step={1} 
          onValueChange={(values) => setContrast(values[0])}
          className="my-1"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="saturation">Saturazione</Label>
          <Badge variant="outline" className="font-mono">{saturation}</Badge>
        </div>
        <Slider 
          id="saturation" 
          value={[saturation]} 
          min={-100} 
          max={100} 
          step={1} 
          onValueChange={(values) => setSaturation(values[0])}
          className="my-1"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="temperature" className="flex items-center gap-1">
            {temperature >= 0 ? (
              <Sun className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-blue-500" />
            )}
            Temperatura
          </Label>
          <Badge variant="outline" className="font-mono">{temperature}</Badge>
        </div>
        <Slider 
          id="temperature" 
          value={[temperature]} 
          min={-100} 
          max={100} 
          step={1} 
          onValueChange={(values) => setTemperature(values[0])}
          className="my-1"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="clarity">Nitidezza</Label>
          <Badge variant="outline" className="font-mono">{clarity}</Badge>
        </div>
        <Slider 
          id="clarity" 
          value={[clarity]} 
          min={-30} 
          max={30} 
          step={1} 
          onValueChange={(values) => setClarity(values[0])}
          className="my-1"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="highlights">Luci</Label>
          <Badge variant="outline" className="font-mono">{highlights}</Badge>
        </div>
        <Slider 
          id="highlights" 
          value={[highlights]} 
          min={-40} 
          max={40} 
          step={1} 
          onValueChange={(values) => setHighlights(values[0])}
          className="my-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={applyAutoFix}
        >
          <Wand2 className="h-4 w-4" />
          Auto Fix
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={undoAdjustment}
          disabled={!state.activePhoto || !history[state.activePhoto.id]}
        >
          <Undo2 className="h-4 w-4" />
          Annulla
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex flex-col items-center gap-1 py-2"
          onClick={applyVibrantPreset}
        >
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="text-xs">Vibrante</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex flex-col items-center gap-1 py-2"
          onClick={applyCoolPreset}
        >
          <Cloud className="h-4 w-4 text-blue-500" />
          <span className="text-xs">Freddo</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex flex-col items-center gap-1 py-2"
          onClick={applySunsetPreset}
        >
          <Sunset className="h-4 w-4 text-orange-500" />
          <span className="text-xs">Tramonto</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={resetAdjustments}
        >
          Reset
        </Button>
        
        <Button 
          size="sm"
          className="bg-primary hover:bg-primary/90 flex items-center gap-1"
          onClick={applyColorAdjustments}
          disabled={!state.activePhoto}
        >
          <Check className="h-4 w-4" />
          Applica
        </Button>
      </div>
    </div>
  );
};
