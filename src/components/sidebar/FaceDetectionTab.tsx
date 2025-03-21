
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const FaceDetectionTab: React.FC = () => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center space-x-2">
        <Switch id="enable-face-detection" defaultChecked />
        <Label htmlFor="enable-face-detection">Enable Face Detection</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="min-confidence">Minimum Confidence</Label>
        <Slider id="min-confidence" defaultValue={[70]} min={30} max={100} step={1} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="face-highlight">Highlight Style</Label>
        <Select defaultValue="rectangle">
          <SelectTrigger id="face-highlight">
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
        <h4 className="text-sm font-medium mb-2">Statistics</h4>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Photos with faces:</span>
            <span className="font-medium">24</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total faces detected:</span>
            <span className="font-medium">68</span>
          </div>
        </div>
      </div>

      <Button className="w-full bg-magenta hover:bg-magenta/90">
        Run Face Detection
      </Button>
    </div>
  );
};
