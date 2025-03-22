
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
    <>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={onAutoFix}
        >
          <Wand2 className="h-4 w-4" />
          Auto Fix
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
          Annulla
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-1">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={onReset}
        >
          Reset
        </Button>
        
        <Button 
          size="sm"
          className="bg-primary hover:bg-primary/90 flex items-center gap-1"
          onClick={onApply}
          disabled={!hasActivePhoto}
        >
          <Check className="h-4 w-4" />
          Applica
        </Button>
      </div>
    </>
  );
};
