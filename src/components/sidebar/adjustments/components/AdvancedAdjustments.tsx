
import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdjustmentControl } from './AdjustmentControl';

interface AdvancedAdjustmentsProps {
  clarity: number;
  setClarity: (value: number) => void;
  highlights: number;
  setHighlights: (value: number) => void;
}

export const AdvancedAdjustments: React.FC<AdvancedAdjustmentsProps> = ({
  clarity,
  setClarity,
  highlights,
  setHighlights
}) => {
  return (
    <motion.div 
      className="space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <AdjustmentControl
        label="Clarity"
        value={clarity}
        min={-30}
        max={30}
        icon={<Sparkles className="h-4 w-4 text-purple-500" />}
        onChange={setClarity}
      />
      
      <AdjustmentControl
        label="Highlights"
        value={highlights}
        min={-40}
        max={40}
        icon={<Zap className="h-4 w-4 text-yellow-500" />}
        onChange={setHighlights}
      />
    </motion.div>
  );
};
