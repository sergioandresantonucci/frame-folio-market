
import { toast } from 'sonner';
import { AdjustmentValues } from '../types';

/**
 * Auto-fix preset values
 */
export const getAutoFixValues = (): AdjustmentValues => ({
  brightness: 10,
  contrast: 15,
  saturation: 5,
  temperature: -3,
  clarity: 5,
  highlights: 0
});

/**
 * Vibrant preset values
 */
export const getVibrantPresetValues = (): AdjustmentValues => ({
  brightness: 10,
  contrast: 20,
  saturation: 30,
  temperature: 5,
  clarity: 0,
  highlights: 0
});

/**
 * Sunset preset values
 */
export const getSunsetPresetValues = (): AdjustmentValues => ({
  brightness: 5,
  contrast: 10,
  saturation: 15,
  temperature: 20,
  clarity: 0,
  highlights: 10
});

/**
 * Cool tone preset values
 */
export const getCoolPresetValues = (): AdjustmentValues => ({
  brightness: 0,
  contrast: 10,
  saturation: 0,
  temperature: -25,
  clarity: 0,
  highlights: -5
});

/**
 * Applies a preset and returns a toast message
 */
export const applyPreset = (
  preset: string,
  hasActivePhoto: boolean,
  callback: () => void
): void => {
  if (!hasActivePhoto) {
    toast.error("Seleziona una foto per applicare il preset");
    return;
  }
  callback();
  toast.success(`Preset '${preset}' applicato`);
};
