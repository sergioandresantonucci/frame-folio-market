
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePhotoContext } from '@/context/PhotoContext';
import { toast } from 'sonner';
import { Wand2, Layers } from 'lucide-react';

export const AdjustmentsTab: React.FC = () => {
  const { state } = usePhotoContext();
  
  // State for color adjustments
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);

  // Apply color adjustments function
  const applyColorAdjustments = () => {
    if (!state.activePhoto) {
      toast.error("Please select a photo to apply adjustments");
      return;
    }
    
    // Find the active photo element and apply CSS filters
    const photoId = state.activePhoto.id;
    const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
    
    if (photoElement) {
      // Apply CSS filters directly to the image
      const filterString = `
        brightness(${1 + brightness/100})
        contrast(${1 + contrast/100})
        saturate(${1 + saturation/100})
        ${temperature > 0 ? `sepia(${temperature/100})` : ''}
        ${temperature < 0 ? `hue-rotate(${temperature * 1.8}deg)` : ''}
      `;
      
      photoElement.style.filter = filterString;
      
      // Store the filter in sessionStorage to persist through renders
      sessionStorage.setItem(`filter-${photoId}`, filterString);
      
      toast.success(`Applied adjustments to photo: 
        Brightness: ${brightness}, 
        Contrast: ${contrast}, 
        Saturation: ${saturation}, 
        Temperature: ${temperature}`);
    } else {
      toast.error("Could not find the selected photo element");
    }
  };

  // Restore filters from sessionStorage when component mounts or active photo changes
  useEffect(() => {
    if (state.activePhoto) {
      const photoId = state.activePhoto.id;
      const savedFilter = sessionStorage.getItem(`filter-${photoId}`);
      
      if (savedFilter) {
        const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
        if (photoElement) {
          photoElement.style.filter = savedFilter;
        }
        
        // Try to extract values from saved filter
        const brightnessMatch = savedFilter.match(/brightness\(([0-9.]+)\)/);
        const contrastMatch = savedFilter.match(/contrast\(([0-9.]+)\)/);
        const saturateMatch = savedFilter.match(/saturate\(([0-9.]+)\)/);
        const sepiaMatch = savedFilter.match(/sepia\(([0-9.]+)\)/);
        const hueRotateMatch = savedFilter.match(/hue-rotate\(([0-9.-]+)deg\)/);
        
        if (brightnessMatch) setBrightness(Math.round((parseFloat(brightnessMatch[1]) - 1) * 100));
        if (contrastMatch) setContrast(Math.round((parseFloat(contrastMatch[1]) - 1) * 100));
        if (saturateMatch) setSaturation(Math.round((parseFloat(saturateMatch[1]) - 1) * 100));
        
        if (sepiaMatch) {
          setTemperature(Math.round(parseFloat(sepiaMatch[1]) * 100));
        } else if (hueRotateMatch) {
          setTemperature(Math.round(parseFloat(hueRotateMatch[1]) / 1.8));
        } else {
          setTemperature(0);
        }
      } else {
        // Reset sliders if no saved filter
        setBrightness(0);
        setContrast(0);
        setSaturation(0);
        setTemperature(0);
      }
    }
  }, [state.activePhoto]);

  // Apply auto-fix to selected photo
  const applyAutoFix = () => {
    if (!state.activePhoto) {
      toast.error("Please select a photo to apply auto fix");
      return;
    }
    
    // Set some good looking auto-adjustment values
    setBrightness(10);
    setContrast(15);
    setSaturation(5);
    setTemperature(-3);
    
    toast.success("Auto adjustment applied");
    
    // Apply the changes after a short delay
    setTimeout(() => {
      applyColorAdjustments();
    }, 300);
  };

  // Apply a vibrant preset
  const applyVibrantPreset = () => {
    if (!state.activePhoto) {
      toast.error("Please select a photo to apply preset");
      return;
    }
    
    toast.info("Applying 'Vibrant' preset");
    setBrightness(10);
    setContrast(20);
    setSaturation(30);
    setTemperature(5);
    
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
    
    // If there's an active photo, reset its filters
    if (state.activePhoto) {
      const photoId = state.activePhoto.id;
      const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
      
      if (photoElement) {
        photoElement.style.filter = 'none';
        sessionStorage.removeItem(`filter-${photoId}`);
        toast.info("Adjustments reset");
      }
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="brightness">Brightness</Label>
          <Badge variant="outline" className="font-mono">{brightness}</Badge>
        </div>
        <Slider 
          id="brightness" 
          value={[brightness]} 
          min={-100} 
          max={100} 
          step={1} 
          onValueChange={(values) => setBrightness(values[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="contrast">Contrast</Label>
          <Badge variant="outline" className="font-mono">{contrast}</Badge>
        </div>
        <Slider 
          id="contrast" 
          value={[contrast]} 
          min={-100} 
          max={100} 
          step={1} 
          onValueChange={(values) => setContrast(values[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="saturation">Saturation</Label>
          <Badge variant="outline" className="font-mono">{saturation}</Badge>
        </div>
        <Slider 
          id="saturation" 
          value={[saturation]} 
          min={-100} 
          max={100} 
          step={1} 
          onValueChange={(values) => setSaturation(values[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="temperature">Temperature</Label>
          <Badge variant="outline" className="font-mono">{temperature}</Badge>
        </div>
        <Slider 
          id="temperature" 
          value={[temperature]} 
          min={-100} 
          max={100} 
          step={1} 
          onValueChange={(values) => setTemperature(values[0])}
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
          onClick={applyVibrantPreset}
        >
          <Layers className="h-4 w-4" />
          Presets
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
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
          className="bg-magenta hover:bg-magenta/90"
          onClick={applyColorAdjustments}
          disabled={!state.activePhoto}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
