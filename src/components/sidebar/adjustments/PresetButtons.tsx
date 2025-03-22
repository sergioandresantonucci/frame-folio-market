
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Cloud, Sunset } from 'lucide-react';
import { toast } from 'sonner';

interface PresetButtonsProps {
  onApplyVibrant: () => void;
  onApplyCool: () => void;
  onApplySunset: () => void;
  hasActivePhoto: boolean;
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({
  onApplyVibrant,
  onApplyCool,
  onApplySunset,
  hasActivePhoto
}) => {
  const handlePreset = (preset: string, callback: () => void) => {
    if (!hasActivePhoto) {
      toast.error("Seleziona una foto per applicare il preset");
      return;
    }
    callback();
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        className="flex flex-col items-center gap-1 py-2"
        onClick={() => handlePreset('Vibrante', onApplyVibrant)}
      >
        <Sparkles className="h-4 w-4 text-purple-500" />
        <span className="text-xs">Vibrante</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="flex flex-col items-center gap-1 py-2"
        onClick={() => handlePreset('Freddo', onApplyCool)}
      >
        <Cloud className="h-4 w-4 text-blue-500" />
        <span className="text-xs">Freddo</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="flex flex-col items-center gap-1 py-2"
        onClick={() => handlePreset('Tramonto', onApplySunset)}
      >
        <Sunset className="h-4 w-4 text-orange-500" />
        <span className="text-xs">Tramonto</span>
      </Button>
    </div>
  );
};
