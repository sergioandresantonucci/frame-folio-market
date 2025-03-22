
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { AdjustmentSlider } from './AdjustmentSlider';
import { PresetButtons } from './PresetButtons';
import { ControlButtons } from './ControlButtons';
import { usePhotoAdjustments } from './usePhotoAdjustments';

export const AdjustmentsTab: React.FC = () => {
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
    canUndo,
    applyColorAdjustments,
    undoAdjustment,
    applyAutoFix,
    applyVibrantPreset,
    applySunsetPreset,
    applyCoolPreset,
    resetAdjustments
  } = usePhotoAdjustments();

  return (
    <div className="space-y-4 animate-fadeIn flex flex-col">
      <div className="space-y-3 mb-4">
        <AdjustmentSlider
          id="brightness"
          label="Luminosità"
          value={brightness}
          min={-100}
          max={100}
          icon={<Sun className="h-3.5 w-3.5" />}
          onChange={setBrightness}
        />

        <AdjustmentSlider
          id="contrast"
          label="Contrasto"
          value={contrast}
          min={-100}
          max={100}
          onChange={setContrast}
        />

        <AdjustmentSlider
          id="saturation"
          label="Saturazione"
          value={saturation}
          min={-100}
          max={100}
          onChange={setSaturation}
        />

        <AdjustmentSlider
          id="temperature"
          label="Temperatura"
          value={temperature}
          min={-100}
          max={100}
          icon={temperature >= 0 ? (
            <Sun className="h-3.5 w-3.5 text-amber-500" />
          ) : (
            <Moon className="h-3.5 w-3.5 text-blue-500" />
          )}
          onChange={setTemperature}
        />
        
        <AdjustmentSlider
          id="clarity"
          label="Nitidezza"
          value={clarity}
          min={-30}
          max={30}
          onChange={setClarity}
        />
        
        <AdjustmentSlider
          id="highlights"
          label="Luci"
          value={highlights}
          min={-40}
          max={40}
          onChange={setHighlights}
        />
      </div>

      <div className="flex flex-col space-y-4">
        <ControlButtons
          onAutoFix={applyAutoFix}
          onUndo={undoAdjustment}
          onReset={resetAdjustments}
          onApply={applyColorAdjustments}
          canUndo={canUndo}
          hasActivePhoto={hasActivePhoto}
        />
        
        <PresetButtons
          onApplyVibrant={applyVibrantPreset}
          onApplyCool={applyCoolPreset}
          onApplySunset={applySunsetPreset}
          hasActivePhoto={hasActivePhoto}
        />
      </div>
    </div>
  );
};
