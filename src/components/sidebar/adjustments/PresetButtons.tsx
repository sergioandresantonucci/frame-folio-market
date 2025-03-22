
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
    <div className="flex flex-col space-y-2 w-full">
      <Button 
        size="sm" 
        variant="outline" 
        className="flex items-center gap-2 w-full justify-start py-2"
        onClick={() => handlePreset('Vibrante', onApplyVibrant)}
        disabled={!hasActivePhoto}
      >
        <Sparkles className="h-4 w-4 text-purple-500" />
        <span>Vibrante</span>
      </Button>
      
      <Button 
        size="sm" 
        variant="outline" 
        className="flex items-center gap-2 w-full justify-start py-2"
        onClick={() => handlePreset('Freddo', onApplyCool)}
        disabled={!hasActivePhoto}
      >
        <Cloud className="h-4 w-4 text-blue-500" />
        <span>Freddo</span>
      </Button>
      
      <Button 
        size="sm" 
        variant="outline" 
        className="flex items-center gap-2 w-full justify-start py-2"
        onClick={() => handlePreset('Tramonto', onApplySunset)}
        disabled={!hasActivePhoto}
      >
        <Sunset className="h-4 w-4 text-orange-500" />
        <span>Tramonto</span>
      </Button>
    </div>
  );
};
