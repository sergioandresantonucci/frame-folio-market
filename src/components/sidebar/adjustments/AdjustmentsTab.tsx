
import React, { useState } from 'react';
import { Sliders, Sparkles, Sun, Moon, Droplet, Zap, RotateCw, Share2 } from 'lucide-react';
import { usePhotoAdjustments } from './usePhotoAdjustments';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

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

  const [activeTab, setActiveTab] = useState("sliders");

  if (!hasActivePhoto) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-[60vh] text-center">
        <div className="bg-gray-50 p-8 rounded-xl w-full">
          <Sliders className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Photo Selected</h3>
          <p className="text-sm text-gray-500 mb-6">
            Select a photo to start enhancing it with color adjustments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Magic presets section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-magenta" />
            Presets
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            onClick={applyAutoFix}
            className="flex flex-col items-center py-4 h-auto border-2 border-gray-100 hover:border-magenta hover:text-magenta transition-all duration-300"
          >
            <Zap className="h-5 w-5 mb-1" />
            <span className="text-xs">Auto Fix</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={applyVibrantPreset}
            className="flex flex-col items-center py-4 h-auto border-2 border-gray-100 hover:border-[#F97316] hover:text-[#F97316] transition-all duration-300"
          >
            <Droplet className="h-5 w-5 mb-1" />
            <span className="text-xs">Vibrant</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={applySunsetPreset}
            className="flex flex-col items-center py-4 h-auto border-2 border-gray-100 hover:border-[#FEC6A1] hover:text-amber-500 transition-all duration-300"
          >
            <Sun className="h-5 w-5 mb-1" />
            <span className="text-xs">Sunset</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={applyCoolPreset}
            className="flex flex-col items-center py-4 h-auto border-2 border-gray-100 hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all duration-300"
          >
            <Moon className="h-5 w-5 mb-1" />
            <span className="text-xs">Cool</span>
          </Button>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Tabs for different adjustment types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="sliders" className="flex-1">Adjustments</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sliders" className="space-y-5 mt-2">
          {/* Basic adjustment sliders with animations */}
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AdjustmentControl
              label="Brightness"
              value={brightness}
              min={-100}
              max={100}
              icon={<Sun className="h-4 w-4 text-amber-500" />}
              onChange={setBrightness}
            />
            
            <AdjustmentControl
              label="Contrast"
              value={contrast}
              min={-100}
              max={100}
              icon={<Share2 className="h-4 w-4 text-gray-500" />}
              onChange={setContrast}
            />
            
            <AdjustmentControl
              label="Saturation"
              value={saturation}
              min={-100}
              max={100}
              icon={<Droplet className="h-4 w-4 text-blue-500" />}
              onChange={setSaturation}
            />
            
            <AdjustmentControl
              label="Temperature"
              value={temperature}
              min={-100}
              max={100}
              icon={temperature >= 0 ? 
                <Sun className="h-4 w-4 text-amber-500" /> : 
                <Moon className="h-4 w-4 text-blue-500" />
              }
              onChange={setTemperature}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-5 mt-2">
          {/* Advanced adjustment sliders with animations */}
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AdjustmentControl
              label="Clarity"
              value={clarity}
              min={-30}
              max={30}
              icon={<Sparkles className="h-4 w-4 text-purple-500" />}
              onChange={setClarity}
            />
            
            <AdjustmentControl
              label="Highlights"
              value={highlights}
              min={-40}
              max={40}
              icon={<Zap className="h-4 w-4 text-yellow-500" />}
              onChange={setHighlights}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-4" />
      
      {/* Controls section */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={undoAdjustment}
          disabled={!canUndo}
          className="border-2"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Undo
        </Button>
        
        <Button
          variant="outline"
          onClick={resetAdjustments}
          className="border-2"
        >
          Clear
        </Button>
        
        <Button
          className="col-span-2 bg-gradient-to-r from-magenta to-purple-600 hover:from-magenta/90 hover:to-purple-700"
          onClick={applyColorAdjustments}
        >
          Apply Adjustments
        </Button>
      </div>
    </div>
  );
};

// Custom slider component for adjustments
const AdjustmentControl: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  icon?: React.ReactNode;
  onChange: (value: number) => void;
}> = ({ label, value, min, max, icon, onChange }) => {
  // Calculate gradient percentage for slider track
  const percent = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <Badge 
          variant="outline" 
          className={cn(
            "font-mono transition-colors",
            value !== 0 ? "bg-magenta/10 border-magenta/20 text-magenta" : ""
          )}
        >
          {value > 0 ? `+${value}` : value}
        </Badge>
      </div>
      
      <div className="relative pt-1">
        <Slider 
          value={[value]} 
          min={min} 
          max={max} 
          step={1} 
          onValueChange={(values) => onChange(values[0])}
          className="my-1"
        />
        
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{min}</span>
          <span>0</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
