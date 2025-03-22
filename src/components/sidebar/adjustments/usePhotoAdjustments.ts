
import { useState, useEffect } from 'react';
import { usePhotoContext } from '@/context/photo/PhotoContext';
import { toast } from 'sonner';

export const usePhotoAdjustments = () => {
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

  // Check if we have an active photo
  const hasActivePhoto = !!state.activePhoto;
  
  // Check if we can undo
  const canUndo = hasActivePhoto && !!state.activePhoto && !!history[state.activePhoto.id];

  // Apply color adjustments function
  const applyColorAdjustments = () => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per applicare le regolazioni");
      return;
    }
    
    // Find the active photo element and apply CSS filters
    const photoId = state.activePhoto.id;
    const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
    
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
        const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
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
      const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
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
    
    // Apply the changes immediately
    setTimeout(() => {
      applyColorAdjustments();
    }, 100);
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
    
    // Apply the changes immediately
    setTimeout(() => {
      applyColorAdjustments();
    }, 100);
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
    
    // Apply the changes immediately
    setTimeout(() => {
      applyColorAdjustments();
    }, 100);
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
    
    // Apply the changes immediately
    setTimeout(() => {
      applyColorAdjustments();
    }, 100);
  };

  // Reset adjustments
  const resetAdjustments = () => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per resettare le regolazioni");
      return;
    }
    
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setTemperature(0);
    setClarity(0);
    setHighlights(0);
    
    // If there's an active photo, reset its filters
    if (state.activePhoto) {
      const photoId = state.activePhoto.id;
      const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
      
      if (photoElement) {
        photoElement.style.filter = 'none';
        sessionStorage.removeItem(`filter-${photoId}`);
        toast.info("Regolazioni resettate");
      }
    }
  };

  return {
    brightness,
    setBrightness,
    contrast,
    setContrast,
    saturation,
    setSaturation,
    temperature,
    setTemperature,
    clarity,
    setClarity,
    highlights,
    setHighlights,
    hasActivePhoto,
    canUndo,
    applyColorAdjustments,
    undoAdjustment,
    applyAutoFix,
    applyVibrantPreset,
    applySunsetPreset,
    applyCoolPreset,
    resetAdjustments
  };
};
