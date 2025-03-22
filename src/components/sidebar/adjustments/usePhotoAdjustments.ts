
import { useState, useEffect } from 'react';
import { usePhotoContext } from '@/context/photo/PhotoContext';
import { toast } from 'sonner';
import { PhotoAdjustmentsHook } from './types';
import { useAdjustmentHistory } from './useAdjustmentHistory';
import { 
  findPhotoElement, 
  applyFilterToElements, 
  saveFilterToStorage, 
  getFilterFromStorage,
  removeFilterFromStorage 
} from './utils/domUtils';
import { 
  buildFilterString, 
  extractValuesFromFilter 
} from './utils/filterUtils';
import {
  getAutoFixValues,
  getVibrantPresetValues,
  getSunsetPresetValues,
  getCoolPresetValues,
  applyPreset
} from './utils/presetUtils';

export const usePhotoAdjustments = (): PhotoAdjustmentsHook => {
  const { state } = usePhotoContext();
  const { 
    saveToHistory, 
    getFromHistory, 
    removeFromHistory,
    hasHistoryFor 
  } = useAdjustmentHistory();
  
  // State for color adjustments
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [clarity, setClarity] = useState<number>(0);
  const [highlights, setHighlights] = useState<number>(0);

  // Check if we have an active photo
  const hasActivePhoto = !!state.activePhoto;
  
  // Check if we can undo
  const canUndo = hasActivePhoto && !!state.activePhoto && hasHistoryFor(state.activePhoto.id);

  // Apply color adjustments function
  const applyColorAdjustments = () => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per applicare le regolazioni");
      return;
    }
    
    // Find the active photo element and apply CSS filters
    const photoId = state.activePhoto.id;
    const targetElement = findPhotoElement(photoId);
    
    if (targetElement) {
      console.log("Found photo element, applying filters:", targetElement);
      
      // Save current filter in history before applying new one
      if (targetElement.style.filter) {
        saveToHistory(photoId, targetElement.style.filter);
      }
      
      // Build the filter string from current adjustment values
      const filterString = buildFilterString(
        brightness, 
        contrast, 
        saturation, 
        clarity, 
        temperature, 
        highlights
      );
      
      console.log("Applying filter:", filterString);
      
      // Apply the filter to both grid and viewer elements
      if (applyFilterToElements(photoId, filterString)) {
        // Store the filter in sessionStorage to persist through renders
        saveFilterToStorage(photoId, filterString);
        
        toast.success("Regolazioni colore applicate", {
          description: `Luminosità: ${brightness}, Contrasto: ${contrast}, Saturazione: ${saturation}, Temperatura: ${temperature}`
        });
      }
    } else {
      console.error("Cannot find photo element with ID:", photoId);
      toast.error("Impossibile trovare l'elemento foto selezionato");
    }
  };

  // Restore filters from sessionStorage when component mounts or active photo changes
  useEffect(() => {
    if (state.activePhoto) {
      const photoId = state.activePhoto.id;
      const savedFilter = getFilterFromStorage(photoId);
      
      if (savedFilter) {
        // Apply saved filter to DOM elements
        applyFilterToElements(photoId, savedFilter);
        
        // Extract adjustment values from saved filter
        const values = extractValuesFromFilter(savedFilter);
        
        // Update state with extracted values
        setBrightness(values.brightness);
        setContrast(values.contrast);
        setSaturation(values.saturation);
        setClarity(values.clarity);
        setTemperature(values.temperature);
        setHighlights(values.highlights);
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
    const previousFilter = getFromHistory(photoId);
    
    if (previousFilter) {
      // Apply previous filter to DOM elements
      applyFilterToElements(photoId, previousFilter);
      
      // Update session storage
      saveFilterToStorage(photoId, previousFilter);
      
      // Extract and update adjustment values
      const values = extractValuesFromFilter(previousFilter);
      setBrightness(values.brightness);
      setContrast(values.contrast);
      setSaturation(values.saturation);
      setClarity(values.clarity);
      setTemperature(values.temperature);
      setHighlights(values.highlights);
      
      // Remove this entry from history
      removeFromHistory(photoId);
      
      toast.info("Regolazione precedente ripristinata");
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
    
    // Set auto-fix values
    const values = getAutoFixValues();
    setBrightness(values.brightness);
    setContrast(values.contrast);
    setSaturation(values.saturation);
    setTemperature(values.temperature);
    setClarity(values.clarity);
    setHighlights(values.highlights);
    
    toast.success("Correzione automatica applicata");
    
    // Apply the changes immediately
    setTimeout(() => {
      applyColorAdjustments();
    }, 100);
  };

  // Apply vibrant preset
  const applyVibrantPreset = () => {
    applyPreset('Vibrante', hasActivePhoto, () => {
      const values = getVibrantPresetValues();
      setBrightness(values.brightness);
      setContrast(values.contrast);
      setSaturation(values.saturation);
      setTemperature(values.temperature);
      setClarity(values.clarity);
      setHighlights(values.highlights);
      
      // Apply the changes immediately
      setTimeout(() => {
        applyColorAdjustments();
      }, 100);
    });
  };

  // Apply warm sunset preset
  const applySunsetPreset = () => {
    applyPreset('Tramonto', hasActivePhoto, () => {
      const values = getSunsetPresetValues();
      setBrightness(values.brightness);
      setContrast(values.contrast);
      setSaturation(values.saturation);
      setTemperature(values.temperature);
      setClarity(values.clarity);
      setHighlights(values.highlights);
      
      // Apply the changes immediately
      setTimeout(() => {
        applyColorAdjustments();
      }, 100);
    });
  };

  // Apply cool tone preset
  const applyCoolPreset = () => {
    applyPreset('Freddo', hasActivePhoto, () => {
      const values = getCoolPresetValues();
      setBrightness(values.brightness);
      setContrast(values.contrast);
      setSaturation(values.saturation);
      setTemperature(values.temperature);
      setClarity(values.clarity);
      setHighlights(values.highlights);
      
      // Apply the changes immediately
      setTimeout(() => {
        applyColorAdjustments();
      }, 100);
    });
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
      
      // Apply 'none' filter to DOM elements
      applyFilterToElements(photoId, 'none');
      
      // Remove from session storage
      removeFilterFromStorage(photoId);
      toast.info("Regolazioni resettate");
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
