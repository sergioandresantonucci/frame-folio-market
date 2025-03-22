
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Undo2, Check } from 'lucide-react';

interface ControlButtonsProps {
  onAutoFix: () => void;
  onUndo: () => void;
  onReset: () => void;
  onApply: () => void;
  canUndo: boolean;
  hasActivePhoto: boolean;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  onAutoFix,
  onUndo,
  onReset,
  onApply,
  canUndo,
  hasActivePhoto
}) => {
  return (
    <div className="flex flex-col space-y-2 mt-4 w-full">
      <Button 
        size="sm" 
        variant="outline" 
        className="flex items-center gap-1 w-full justify-start"
        onClick={onAutoFix}
        disabled={!hasActivePhoto}
      >
        <Wand2 className="h-4 w-4" />
        Auto Fix
      </Button>
      
      <Button 
        size="sm" 
        variant="outline" 
        className="flex items-center gap-1 w-full justify-start"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <Undo2 className="h-4 w-4" />
        Annulla
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-1 w-full justify-start"
        onClick={onReset}
        disabled={!hasActivePhoto}
      >
        Reset
      </Button>
      
      <Button 
        size="sm"
        className="bg-primary hover:bg-primary/90 flex items-center gap-1 w-full justify-start"
        onClick={onApply}
        disabled={!hasActivePhoto}
      >
        <Check className="h-4 w-4" />
        Applica
      </Button>
    </div>
  );
};
