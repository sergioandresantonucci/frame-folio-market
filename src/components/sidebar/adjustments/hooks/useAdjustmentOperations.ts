
import { useCallback } from 'react';
import { usePhotoContext } from '@/context/photo/PhotoContext';
import { toast } from 'sonner';
import { useAdjustmentHistory } from '../useAdjustmentHistory';
import { 
  applyFilterToElements, 
  saveFilterToStorage, 
  getFilterFromStorage,
  removeFilterFromStorage 
} from '../utils/domUtils';
import { buildFilterString } from '../utils/filterUtils';
import { AdjustmentValues } from '../types';

/**
 * Hook for photo adjustment operations like applying, undoing and resetting
 */
export const useAdjustmentOperations = (
  getCurrentValues: () => AdjustmentValues,
  resetValues: () => void
) => {
  const { state } = usePhotoContext();
  const { 
    saveToHistory, 
    getFromHistory, 
    removeFromHistory,
    hasHistoryFor 
  } = useAdjustmentHistory();
  
  // Check if we can undo
  const canUndo = Boolean(state.activePhoto) && hasHistoryFor(state.activePhoto?.id || '');

  // Apply current color adjustments to the active photo
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
    
    // Get current adjustment values
    const values = getCurrentValues();
    
    // Build the filter string from current adjustment values
    const filterString = buildFilterString(
      values.brightness, 
      values.contrast, 
      values.saturation, 
      values.clarity, 
      values.temperature, 
      values.highlights
    );
    
    console.log("Generated filter string:", filterString);
    
    // Apply the filter to all photo elements
    const success = applyFilterToElements(photoId, filterString);
    
    if (success) {
      // Store the filter in sessionStorage to persist through renders
      saveFilterToStorage(photoId, filterString);
      
      toast.success("Regolazioni colore applicate", {
        description: `Luminosità: ${values.brightness}, Contrasto: ${values.contrast}, Saturazione: ${values.saturation}`
      });
    } else {
      console.error("Failed to apply filters to photo elements");
    }
  }, [state.activePhoto, getCurrentValues, saveToHistory]);

  // Undo last adjustment
  const undoAdjustment = useCallback(() => {
    if (!state.activePhoto) return;
    
    const photoId = state.activePhoto.id;
    const previousFilter = getFromHistory(photoId);
    
    if (previousFilter) {
      console.log("Restoring previous filter:", previousFilter);
      
      // Apply previous filter to DOM elements
      const success = applyFilterToElements(photoId, previousFilter);
      
      if (success) {
        // Update session storage
        saveFilterToStorage(photoId, previousFilter);
        
        // Extract and update adjustment values
        const { extractValuesFromFilter } = require('../utils/filterUtils');
        const values = extractValuesFromFilter(previousFilter);
        
        // Import setValues function to update state
        const { setValues } = require('./useAdjustmentState');
        setValues(values);
        
        // Remove this entry from history
        removeFromHistory(photoId);
        
        toast.info("Regolazione precedente ripristinata");
      }
    } else {
      toast.info("Nessuna regolazione precedente da annullare");
    }
  }, [state.activePhoto, getFromHistory, removeFromHistory]);

  // Reset all adjustments for the active photo
  const resetAdjustments = useCallback(() => {
    if (!state.activePhoto) {
      toast.error("Seleziona una foto per resettare le regolazioni");
      return;
    }
    
    console.log("Resetting adjustments for photo:", state.activePhoto.id);
    
    // Reset all adjustment values
    resetValues();
    
    // If there's an active photo, reset its filters
    if (state.activePhoto) {
      const photoId = state.activePhoto.id;
      
      // Apply 'none' filter to DOM elements
      applyFilterToElements(photoId, 'none');
      
      // Remove from session storage
      removeFilterFromStorage(photoId);
      toast.info("Regolazioni resettate");
    }
  }, [state.activePhoto, resetValues]);

  return {
    canUndo,
    applyColorAdjustments,
    undoAdjustment,
    resetAdjustments
  };
};
