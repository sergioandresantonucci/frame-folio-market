
import { useEffect, useRef } from 'react';
import { usePhotoContext } from '@/context/photo/PhotoContext';
import { applyFilterToElements, clearElementCache } from '../utils/domUtils';
import { buildFilterString } from '../utils/filterUtils';
import { AdjustmentValues } from '../types';

/**
 * Hook to handle side-effects for photo adjustments with performance optimizations
 */
export const useEffectApplication = (
  values: AdjustmentValues,
  processedPhotoId: string | null
) => {
  const { state } = usePhotoContext();
  // Use refs to track previous values to avoid unnecessary updates
  const prevValuesRef = useRef<AdjustmentValues | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Clean up function to clear any pending timers
  const cleanupTimers = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Force apply current filter whenever the viewer is opened or photo changes
  useEffect(() => {
    if (!state.activePhoto) return;
    
    const photoId = state.activePhoto.id;
    
    // Clear the element cache when the photo changes
    if (processedPhotoId !== photoId) {
      clearElementCache();
    }
    
    // Check if values have actually changed
    const valuesChanged = !prevValuesRef.current || 
      Object.entries(values).some(
        ([key, value]) => prevValuesRef.current?.[key as keyof AdjustmentValues] !== value
      );
    
    // Only update if the values have changed or photo changed
    if (valuesChanged || processedPhotoId !== photoId) {
      console.log("Values or photo changed, applying filters");
      
      cleanupTimers();
      
      // Apply the current filter values with debouncing
      timerRef.current = window.setTimeout(() => {
        const filterString = buildFilterString(
          values.brightness, 
          values.contrast, 
          values.saturation, 
          values.clarity, 
          values.temperature, 
          values.highlights
        );
        
        applyFilterToElements(photoId, filterString);
        // Update previous values
        prevValuesRef.current = {...values};
      }, 50); // Reduced delay for better responsiveness
    }
    
    return () => {
      cleanupTimers();
    };
  }, [
    state.activePhoto?.id, 
    values.brightness, 
    values.contrast, 
    values.saturation, 
    values.clarity, 
    values.temperature, 
    values.highlights,
    processedPhotoId
  ]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      cleanupTimers();
      // Clear all element caches on unmount
      clearElementCache();
    };
  }, []);
};
