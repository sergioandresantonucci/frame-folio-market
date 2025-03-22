
import { useState, useEffect, useCallback } from 'react';
import { usePhotoContext } from '@/context/photo/PhotoContext';
import { toast } from 'sonner';
import { PhotoAdjustmentsHook } from './types';
import { useAdjustmentHistory } from './useAdjustmentHistory';
import { 
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
  const hasActivePhoto = Boolean(state.activePhoto);
  
  // Check if we can undo
  const canUndo = hasActivePhoto && Boolean(state.activePhoto) && hasHistoryFor(state.activePhoto.id);

  // Apply color adjustments function
  const applyColorAdjustments = useCallback(() => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per applicare le regolazioni");
      return;
    }
    
    const photoId = state.activePhoto.id;
    console.log("Applying color adjustments to photo:", photoId);
    
    // Save current filter in history before applying new one
    const currentFilter = getFilterFromStorage(photoId);
    if (currentFilter) {
      saveToHistory(photoId, currentFilter);
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
    
    console.log("Generated filter string:", filterString);
    
    // Apply the filter to all photo elements
    if (applyFilterToElements(photoId, filterString)) {
      // Store the filter in sessionStorage to persist through renders
      saveFilterToStorage(photoId, filterString);
      
      toast.success("Regolazioni colore applicate", {
        description: `Luminosità: ${brightness}, Contrasto: ${contrast}, Saturazione: ${saturation}`
      });
    } else {
      console.error("Failed to apply filters to photo elements");
    }
  }, [
    state.activePhoto, 
    brightness, 
    contrast, 
    saturation, 
    clarity, 
    temperature, 
    highlights, 
    saveToHistory
  ]);

  // Restore filters from sessionStorage when active photo changes
  useEffect(() => {
    if (state.activePhoto) {
      const photoId = state.activePhoto.id;
      const savedFilter = getFilterFromStorage(photoId);
      
      if (savedFilter) {
        console.log("Restoring saved filter for", photoId, ":", savedFilter);
        
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
        console.log("No saved filter found for", photoId, "resetting sliders");
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
  const undoAdjustment = useCallback(() => {
    if (!state.activePhoto) return;
    
    const photoId = state.activePhoto.id;
    const previousFilter = getFromHistory(photoId);
    
    if (previousFilter) {
      console.log("Restoring previous filter:", previousFilter);
      
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
  }, [state.activePhoto, getFromHistory, removeFromHistory]);

  // Apply auto-fix to selected photo
  const applyAutoFix = useCallback(() => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per applicare la correzione automatica");
      return;
    }
    
    console.log("Applying auto-fix to photo:", state.activePhoto.id);
    
    // Set auto-fix values
    const values = getAutoFixValues();
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
    
    toast.success("Correzione automatica applicata");
  }, [state.activePhoto, applyColorAdjustments]);

  // Apply vibrant preset
  const applyVibrantPreset = useCallback(() => {
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
  }, [hasActivePhoto, applyColorAdjustments]);

  // Apply warm sunset preset
  const applySunsetPreset = useCallback(() => {
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
  }, [hasActivePhoto, applyColorAdjustments]);

  // Apply cool tone preset
  const applyCoolPreset = useCallback(() => {
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
  }, [hasActivePhoto, applyColorAdjustments]);

  // Reset adjustments
  const resetAdjustments = useCallback(() => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per resettare le regolazioni");
      return;
    }
    
    console.log("Resetting adjustments for photo:", state.activePhoto.id);
    
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
  }, [state.activePhoto]);

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
