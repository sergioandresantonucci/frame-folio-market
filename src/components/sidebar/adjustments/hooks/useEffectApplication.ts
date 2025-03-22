
import { useEffect } from 'react';
import { usePhotoContext } from '@/context/photo/PhotoContext';
import { applyFilterToElements } from '../utils/domUtils';
import { buildFilterString } from '../utils/filterUtils';
import { AdjustmentValues } from '../types';

/**
 * Hook to handle side-effects for photo adjustments
 */
export const useEffectApplication = (
  values: AdjustmentValues,
  processedPhotoId: string | null
) => {
  const { state } = usePhotoContext();

  // Force apply current filter whenever the viewer is opened or photo changes
  useEffect(() => {
    if (!state.activePhoto) return;
    
    const photoId = state.activePhoto.id;
    
    // Apply the current filter values when the photo viewer is opened
    const timer = setTimeout(() => {
      const filterString = buildFilterString(
        values.brightness, 
        values.contrast, 
        values.saturation, 
        values.clarity, 
        values.temperature, 
        values.highlights
      );
      
      applyFilterToElements(photoId, filterString);
    }, 500); // Delay to ensure the viewer component is fully rendered
    
    return () => clearTimeout(timer);
  }, [
    state.activePhoto?.id, 
    values.brightness, 
    values.contrast, 
    values.saturation, 
    values.clarity, 
    values.temperature, 
    values.highlights
  ]);
};
