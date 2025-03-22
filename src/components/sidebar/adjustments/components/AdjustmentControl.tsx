
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

// Utility function for class names
const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

interface AdjustmentControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  icon?: React.ReactNode;
  onChange: (value: number) => void;
}

export const AdjustmentControl: React.FC<AdjustmentControlProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  icon, 
  onChange 
}) => {
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
