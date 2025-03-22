
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

export const FaceDetectionTab: React.FC = () => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center space-x-2">
        <Switch id="enable-face-detection" disabled />
        <Label htmlFor="enable-face-detection" className="text-muted-foreground">Face Detection (Disabled)</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="min-confidence" className="text-muted-foreground">Minimum Confidence</Label>
        <Slider id="min-confidence" defaultValue={[70]} min={30} max={100} step={1} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="face-highlight" className="text-muted-foreground">Highlight Style</Label>
        <Select defaultValue="rectangle" disabled>
          <SelectTrigger id="face-highlight" className="text-muted-foreground">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rectangle">Rectangle</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="blur">Blur Background</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-sm font-medium text-muted-foreground">Face Detection Disabled</h4>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          Face detection functionality has been disabled as requested.
        </p>
      </div>

      <Button 
        className="w-full bg-magenta hover:bg-magenta/90"
        disabled
        onClick={() => toast.info("Face detection is currently disabled")}
      >
        Run Face Detection
      </Button>
    </div>
  );
};
