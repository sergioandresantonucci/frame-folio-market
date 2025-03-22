
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Droplet, Sun, Moon } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PresetSectionProps {
  applyAutoFix: () => void;
  applyVibrantPreset: () => void;
  applySunsetPreset: () => void;
  applyCoolPreset: () => void;
}

export const PresetSection: React.FC<PresetSectionProps> = ({
  applyAutoFix,
  applyVibrantPreset,
  applySunsetPreset,
  applyCoolPreset
}) => {
  return (
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
  );
};
