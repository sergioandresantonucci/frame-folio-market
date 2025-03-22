
import React, { useState, useEffect } from 'react';
import { usePhotoContext } from '@/context/PhotoContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sun, 
  Contrast, 
  Droplet, 
  Thermometer, 
  Lightbulb, 
  Moon,
  PanelTop,
  Sparkles,
  RotateCw,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

export const ColorCorrectionBar: React.FC = () => {
  const { state } = usePhotoContext();
  
  // State for sliders
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [clarity, setClarity] = useState<number>(0);
  const [highlights, setHighlights] = useState<number>(0);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Check if at least one photo is selected
  const isPhotoSelected = state.selectedIds.length > 0;
  
  // Reset values when selection changes
  useEffect(() => {
    resetValues();
  }, [state.selectedIds]);
  
  const resetValues = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setTemperature(0);
    setClarity(0);
    setHighlights(0);
  };
  
  // Apply preset functions
  const applyAutoPreset = () => {
    setBrightness(10);
    setContrast(15);
    setSaturation(5);
    setTemperature(0);
    setClarity(10);
    setHighlights(0);
    toast.success("Auto preset applied");
  };
  
  const applyVibrantPreset = () => {
    setBrightness(5);
    setContrast(20);
    setSaturation(30);
    setTemperature(5);
    setClarity(15);
    setHighlights(-10);
    toast.success("Vibrant preset applied");
  };
  
  const applySunsetPreset = () => {
    setBrightness(5);
    setContrast(10);
    setSaturation(15);
    setTemperature(20);
    setClarity(5);
    setHighlights(15);
    toast.success("Sunset preset applied");
  };
  
  const applyCoolPreset = () => {
    setBrightness(0);
    setContrast(5);
    setSaturation(-5);
    setTemperature(-15);
    setClarity(10);
    setHighlights(-5);
    toast.success("Cool preset applied");
  };
  
  // Apply color corrections
  const applyColorAdjustments = () => {
    if (state.selectedIds.length === 0) {
      toast.error("No photos selected");
      return;
    }
    
    toast.success(`Applied adjustments to ${state.selectedIds.length} photo(s)`, {
      description: `Brightness: ${brightness}, Contrast: ${contrast}, Saturation: ${saturation}`
    });
    
    // In a real app, this would apply the filters to the selected photos
  };
  
  if (!isPhotoSelected) {
    return null;
  }
  
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-lg border border-gray-200 p-4 w-[600px] max-w-[95vw] z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" /> 
          Color Correction
          <Badge className="ml-2">
            {state.selectedIds.length} photo{state.selectedIds.length !== 1 ? 's' : ''} selected
          </Badge>
        </h3>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Presets</h4>
        <div className="grid grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-auto py-2 flex flex-col items-center gap-1"
            onClick={applyAutoPreset}
          >
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-xs">Auto</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-auto py-2 flex flex-col items-center gap-1"
            onClick={applyVibrantPreset}
          >
            <Droplet className="h-4 w-4 text-purple-500" />
            <span className="text-xs">Vibrant</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-auto py-2 flex flex-col items-center gap-1"
            onClick={applySunsetPreset}
          >
            <Sun className="h-4 w-4 text-orange-500" />
            <span className="text-xs">Sunset</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-auto py-2 flex flex-col items-center gap-1"
            onClick={applyCoolPreset}
          >
            <Thermometer className="h-4 w-4 text-cyan-500" />
            <span className="text-xs">Cool</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic">Basic Adjustments</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Brightness</span>
                </div>
                <Badge variant="outline" className={brightness !== 0 ? "bg-amber-50 text-amber-600" : ""}>
                  {brightness > 0 ? `+${brightness}` : brightness}
                </Badge>
              </div>
              <Slider 
                value={[brightness]} 
                min={-100} 
                max={100} 
                step={1} 
                onValueChange={(values) => setBrightness(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Contrast className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Contrast</span>
                </div>
                <Badge variant="outline" className={contrast !== 0 ? "bg-blue-50 text-blue-600" : ""}>
                  {contrast > 0 ? `+${contrast}` : contrast}
                </Badge>
              </div>
              <Slider 
                value={[contrast]} 
                min={-100} 
                max={100} 
                step={1} 
                onValueChange={(values) => setContrast(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Saturation</span>
                </div>
                <Badge variant="outline" className={saturation !== 0 ? "bg-purple-50 text-purple-600" : ""}>
                  {saturation > 0 ? `+${saturation}` : saturation}
                </Badge>
              </div>
              <Slider 
                value={[saturation]} 
                min={-100} 
                max={100} 
                step={1} 
                onValueChange={(values) => setSaturation(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Temperature</span>
                </div>
                <Badge variant="outline" className={temperature !== 0 ? "bg-red-50 text-red-600" : ""}>
                  {temperature > 0 ? `+${temperature}` : temperature}
                </Badge>
              </div>
              <Slider 
                value={[temperature]} 
                min={-100} 
                max={100} 
                step={1} 
                onValueChange={(values) => setTemperature(values[0])}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Clarity</span>
                </div>
                <Badge variant="outline" className={clarity !== 0 ? "bg-yellow-50 text-yellow-600" : ""}>
                  {clarity > 0 ? `+${clarity}` : clarity}
                </Badge>
              </div>
              <Slider 
                value={[clarity]} 
                min={-100} 
                max={100} 
                step={1} 
                onValueChange={(values) => setClarity(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Highlights</span>
                </div>
                <Badge variant="outline" className={highlights !== 0 ? "bg-indigo-50 text-indigo-600" : ""}>
                  {highlights > 0 ? `+${highlights}` : highlights}
                </Badge>
              </div>
              <Slider 
                value={[highlights]} 
                min={-100} 
                max={100} 
                step={1} 
                onValueChange={(values) => setHighlights(values[0])}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetValues}
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <Button 
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          onClick={applyColorAdjustments}
        >
          <Check className="h-4 w-4 mr-2" />
          Apply to {state.selectedIds.length} photo{state.selectedIds.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
};
