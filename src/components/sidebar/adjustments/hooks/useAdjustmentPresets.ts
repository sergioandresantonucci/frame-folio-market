
import { useCallback } from 'react';
import { 
  getAutoFixValues,
  getVibrantPresetValues,
  getSunsetPresetValues,
  getCoolPresetValues,
  applyPreset
} from '../utils/presetUtils';

/**
 * Hook for applying preset adjustments to photos
 */
export const useAdjustmentPresets = (
  hasActivePhoto: boolean,
  setValues: (values: any) => void,
  applyColorAdjustments: () => void
) => {
  // Apply auto-fix to selected photo
  const applyAutoFix = useCallback(() => {
    applyPreset('Auto', hasActivePhoto, () => {
      const values = getAutoFixValues();
      setValues(values);
      
      // Apply the changes immediately
      setTimeout(() => {
        applyColorAdjustments();
      }, 100);
    });
  }, [hasActivePhoto, setValues, applyColorAdjustments]);

  // Apply vibrant preset
  const applyVibrantPreset = useCallback(() => {
    applyPreset('Vibrante', hasActivePhoto, () => {
      const values = getVibrantPresetValues();
      setValues(values);
      
      // Apply the changes immediately
      setTimeout(() => {
        applyColorAdjustments();
      }, 100);
    });
  }, [hasActivePhoto, setValues, applyColorAdjustments]);

  // Apply warm sunset preset
  const applySunsetPreset = useCallback(() => {
    applyPreset('Tramonto', hasActivePhoto, () => {
      const values = getSunsetPresetValues();
      setValues(values);
      
      // Apply the changes immediately
      setTimeout(() => {
        applyColorAdjustments();
      }, 100);
    });
  }, [hasActivePhoto, setValues, applyColorAdjustments]);

  // Apply cool tone preset
  const applyCoolPreset = useCallback(() => {
    applyPreset('Freddo', hasActivePhoto, () => {
      const values = getCoolPresetValues();
      setValues(values);
      
      // Apply the changes immediately
      setTimeout(() => {
        applyColorAdjustments();
      }, 100);
    });
  }, [hasActivePhoto, setValues, applyColorAdjustments]);

  return {
    applyAutoFix,
    applyVibrantPreset,
    applySunsetPreset,
    applyCoolPreset
  };
};
