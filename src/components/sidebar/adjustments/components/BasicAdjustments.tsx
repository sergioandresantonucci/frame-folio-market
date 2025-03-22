
import React from 'react';
import { Sun, Share2, Droplet, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdjustmentControl } from './AdjustmentControl';

interface BasicAdjustmentsProps {
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  saturation: number;
  setSaturation: (value: number) => void;
  temperature: number;
  setTemperature: (value: number) => void;
}

export const BasicAdjustments: React.FC<BasicAdjustmentsProps> = ({
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
  temperature,
  setTemperature
}) => {
  return (
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
  );
};
