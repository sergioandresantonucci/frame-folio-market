
import { useCallback } from 'react';
import { PhotoAdjustmentsHook } from './types';
import { useAdjustmentState } from './hooks/useAdjustmentState';
import { useAdjustmentOperations } from './hooks/useAdjustmentOperations';
import { useAdjustmentPresets } from './hooks/useAdjustmentPresets';
import { useEffectApplication } from './hooks/useEffectApplication';

/**
 * Main hook for photo adjustments functionality
 */
export const usePhotoAdjustments = (): PhotoAdjustmentsHook => {
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
    hasActivePhoto,
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
    hasActivePhoto,
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
