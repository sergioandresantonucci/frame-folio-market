
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

interface ControlsSectionProps {
  canUndo: boolean;
  undoAdjustment: () => void;
  resetAdjustments: () => void;
  applyColorAdjustments: () => void;
}

export const ControlsSection: React.FC<ControlsSectionProps> = ({
  canUndo,
  undoAdjustment,
  resetAdjustments,
  applyColorAdjustments
}) => {
  return (
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
  );
};
