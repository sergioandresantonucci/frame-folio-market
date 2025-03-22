
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface AdjustmentSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  icon?: React.ReactNode;
  onChange: (value: number) => void;
}

export const AdjustmentSlider: React.FC<AdjustmentSliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  icon,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="flex items-center gap-1">
          {icon}
          {label}
        </Label>
        <Badge variant="outline" className="font-mono">{value}</Badge>
      </div>
      <Slider 
        id={id} 
        value={[value]} 
        min={min} 
        max={max} 
        step={step} 
        onValueChange={(values) => onChange(values[0])}
        className="my-1"
      />
    </div>
  );
};
