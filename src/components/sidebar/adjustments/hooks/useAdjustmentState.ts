import { useState, useEffect } from 'react';
import { usePhotoContext } from '@/context/photo/PhotoContext';
import { AdjustmentValues } from '../types';
import { getFilterFromStorage } from '../utils/domUtils';
import { extractValuesFromFilter } from '../utils/filterUtils';

/**
 * Hook to manage the state of photo adjustments
 */
export const useAdjustmentState = () => {
  const { state } = usePhotoContext();
  
  // State for color adjustments
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [clarity, setClarity] = useState<number>(0);
  const [highlights, setHighlights] = useState<number>(0);
  
  // Keep track of processed photos to avoid processing the same photo multiple times
  const [processedPhotoId, setProcessedPhotoId] = useState<string | null>(null);

  // Check if we have an active photo
  const hasActivePhoto = Boolean(state.activePhoto);
  
  // Monitor active photo changes and restore filters
  useEffect(() => {
    if (!state.activePhoto) return;
    
    const photoId = state.activePhoto.id;
    
    // Prevent processing the same photo multiple times if it's already loaded
    if (processedPhotoId === photoId) return;
    
    console.log("Active photo changed to:", photoId);
    setProcessedPhotoId(photoId);
    
    // Allow time for DOM elements to render
    const timer = setTimeout(() => {
      const savedFilter = getFilterFromStorage(photoId);
      
      if (savedFilter) {
        console.log("Restoring saved filter for", photoId, ":", savedFilter);
        
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
        resetValues();
      }
    }, 300); // Add delay to ensure the DOM is ready
    
    return () => clearTimeout(timer);
  }, [state.activePhoto]);

  // Reset all adjustment values to default
  const resetValues = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setTemperature(0);
    setClarity(0);
    setHighlights(0);
  };

  // Get current adjustment values as an object
  const getCurrentValues = (): AdjustmentValues => ({
    brightness,
    contrast,
    saturation,
    temperature,
    clarity,
    highlights
  });

  // Set all adjustment values at once
  const setValues = (values: AdjustmentValues) => {
    setBrightness(values.brightness);
    setContrast(values.contrast);
    setSaturation(values.saturation);
    setTemperature(values.temperature);
    setClarity(values.clarity);
    setHighlights(values.highlights);
  };

  return {
    // State values
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
    
    // Derived state
    hasActivePhoto,
    processedPhotoId,
    
    // Helper functions
    resetValues,
    getCurrentValues,
    setValues
  };
};
