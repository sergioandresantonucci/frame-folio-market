
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { usePhotoAdjustments } from './usePhotoAdjustments';
import { usePhotoContext } from '@/context/PhotoContext';
import { NoPhotoSelected } from './components/NoPhotoSelected';
import { PresetSection } from './components/PresetSection';
import { BasicAdjustments } from './components/BasicAdjustments';
import { AdvancedAdjustments } from './components/AdvancedAdjustments';
import { ControlsSection } from './components/ControlsSection';

export const AdjustmentsTab: React.FC = () => {
  const { state } = usePhotoContext();
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

  const [activeTab, setActiveTab] = useState("sliders");

  // Check if there's an active photo directly from the context
  const photoSelected = Boolean(state.activePhoto);

  if (!photoSelected) {
    return <NoPhotoSelected />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Magic presets section */}
      <PresetSection 
        applyAutoFix={applyAutoFix}
        applyVibrantPreset={applyVibrantPreset}
        applySunsetPreset={applySunsetPreset}
        applyCoolPreset={applyCoolPreset}
      />
      
      <Separator className="my-4" />
      
      {/* Tabs for different adjustment types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="sliders" className="flex-1">Adjustments</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sliders" className="space-y-5 mt-2">
          <BasicAdjustments 
            brightness={brightness}
            setBrightness={setBrightness}
            contrast={contrast}
            setContrast={setContrast}
            saturation={saturation}
            setSaturation={setSaturation}
            temperature={temperature}
            setTemperature={setTemperature}
          />
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-5 mt-2">
          <AdvancedAdjustments 
            clarity={clarity}
            setClarity={setClarity}
            highlights={highlights}
            setHighlights={setHighlights}
          />
        </TabsContent>
      </Tabs>
      
      <Separator className="my-4" />
      
      {/* Controls section */}
      <ControlsSection 
        canUndo={canUndo}
        undoAdjustment={undoAdjustment}
        resetAdjustments={resetAdjustments}
        applyColorAdjustments={applyColorAdjustments}
      />
    </div>
  );
};
