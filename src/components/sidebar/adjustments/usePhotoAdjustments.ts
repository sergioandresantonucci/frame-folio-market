
import { useCallback } from 'react';
import { PhotoAdjustmentsHook } from './types';
import { useAdjustmentState } from './hooks/useAdjustmentState';
import { useAdjustmentOperations } from './hooks/useAdjustmentOperations';
import { useAdjustmentPresets } from './hooks/useAdjustmentPresets';
import { useEffectApplication } from './hooks/useEffectApplication';
import { usePhotoContext } from '@/context/PhotoContext';

/**
 * Main hook for photo adjustments functionality
 */
export const usePhotoAdjustments = (): PhotoAdjustmentsHook => {
  const { state } = usePhotoContext();
  
  // Get adjustment state (slider values)
  const {
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
    processedPhotoId,
    resetValues,
    getCurrentValues,
    setValues
  } = useAdjustmentState();

  // Force hasActivePhoto to be true if there's an active photo in the context
  const photoSelected = Boolean(state.activePhoto);

  // Get operations (apply, undo, reset)
  const {
    canUndo,
    applyColorAdjustments,
    undoAdjustment,
    resetAdjustments
  } = useAdjustmentOperations(getCurrentValues, resetValues);

  // Get presets (auto, vibrant, sunset, cool)
  const {
    applyAutoFix,
    applyVibrantPreset,
    applySunsetPreset,
    applyCoolPreset
  } = useAdjustmentPresets(
    photoSelected, // Use photoSelected instead of hasActivePhoto
    setValues,
    applyColorAdjustments
  );

  // Apply side effects
  useEffectApplication(
    getCurrentValues(),
    processedPhotoId
  );

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
    hasActivePhoto: photoSelected, // Always return the context-based value
    canUndo,
    
    // Operations
    applyColorAdjustments,
    undoAdjustment,
    
    // Presets
    applyAutoFix,
    applyVibrantPreset,
    applySunsetPreset,
    applyCoolPreset,
    
    // Reset
    resetAdjustments
  };
};
