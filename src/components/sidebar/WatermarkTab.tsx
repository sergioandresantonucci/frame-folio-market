
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Image, Move } from 'lucide-react';

export const WatermarkTab: React.FC = () => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-2">
        <Label htmlFor="watermark-image">Watermark Image</Label>
        <div className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center">
          <div className="flex justify-center mb-2">
            <Image className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
          <Input id="watermark-image" type="file" accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="watermark-opacity">Opacity</Label>
        <Slider id="watermark-opacity" defaultValue={[50]} min={10} max={100} step={1} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="watermark-size">Size</Label>
        <Slider id="watermark-size" defaultValue={[20]} min={5} max={50} step={1} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="watermark-position">Position</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <Button variant="outline" size="sm" className="aspect-square p-0">
            <Move className="h-4 w-4" />
          </Button>
          {['Top Left', 'Top Center', 'Top Right', 'Middle Left', 'Center', 'Middle Right', 'Bottom Left', 'Bottom Center', 'Bottom Right'].map((pos) => (
            <Button key={pos} variant="outline" size="sm" className="aspect-square p-1">
              <div className="w-full h-full bg-gray-100 rounded-sm"></div>
            </Button>
          ))}
        </div>
      </div>

      <Button className="w-full bg-magenta hover:bg-magenta/90">
        Apply Watermark
      </Button>
    </div>
  );
};
