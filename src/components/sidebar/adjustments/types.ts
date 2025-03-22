
export interface AdjustmentValues {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  clarity: number;
  highlights: number;
}

export interface PhotoAdjustmentsHook extends AdjustmentValues {
  setBrightness: (value: number) => void;
  setContrast: (value: number) => void;
  setSaturation: (value: number) => void;
  setTemperature: (value: number) => void;
  setClarity: (value: number) => void;
  setHighlights: (value: number) => void;
  hasActivePhoto: boolean;
  canUndo: boolean;
  applyColorAdjustments: () => void;
  undoAdjustment: () => void;
  applyAutoFix: () => void;
  applyVibrantPreset: () => void;
  applySunsetPreset: () => void;
  applyCoolPreset: () => void;
  resetAdjustments: () => void;
}
