
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { usePhotoContext } from '@/context/PhotoContext';
import {
  Image,
  CircleDollarSign,
  Crop,
  ScanFace,
  PaintBucket,
  Sliders,
  Calendar,
  User,
  ChevronLeft,
  Palette,
  Wand2,
  Sun,
  Contrast,
  Droplets,
  Layers,
  Move
} from 'lucide-react';
import { format } from 'date-fns';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'filters' | 'adjustments' | 'pricing' | 'watermark' | 'face'>('filters');
  const { state, setFilters } = usePhotoContext();

  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
  };

  const photographers = ['All Photographers', 'John Smith', 'Sarah Jones', 'Miguel Rodriguez'];
  const events = ['All Events', 'Wedding', 'Corporate Event', 'Birthday Party', 'Conference'];

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] flex flex-col border-r border-gray-100 bg-white transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-72"
      )}
    >
      <div className="flex items-center justify-between p-4 h-14 border-b border-gray-100">
        {!collapsed && <h2 className="text-sm font-medium">Tools</h2>}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleCollapse}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto p-2 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeTab === 'filters' ? 'default' : 'outline'} 
            size="icon"
            className={cn(
              "h-10 w-10",
              activeTab === 'filters' && "bg-magenta hover:bg-magenta/90"
            )}
            onClick={() => setActiveTab('filters')}
            title="Filters"
          >
            <Sliders className="h-5 w-5" />
          </Button>

          <Button 
            variant={activeTab === 'adjustments' ? 'default' : 'outline'} 
            size="icon"
            className={cn(
              "h-10 w-10",
              activeTab === 'adjustments' && "bg-magenta hover:bg-magenta/90"
            )}
            onClick={() => setActiveTab('adjustments')}
            title="Color Correction"
          >
            <Palette className="h-5 w-5" />
          </Button>

          <Button 
            variant={activeTab === 'pricing' ? 'default' : 'outline'} 
            size="icon"
            className={cn(
              "h-10 w-10",
              activeTab === 'pricing' && "bg-magenta hover:bg-magenta/90"
            )}
            onClick={() => setActiveTab('pricing')}
            title="Pricing"
          >
            <CircleDollarSign className="h-5 w-5" />
          </Button>

          <Button 
            variant={activeTab === 'watermark' ? 'default' : 'outline'} 
            size="icon"
            className={cn(
              "h-10 w-10",
              activeTab === 'watermark' && "bg-magenta hover:bg-magenta/90"
            )}
            onClick={() => setActiveTab('watermark')}
            title="Watermark"
          >
            <Image className="h-5 w-5" />
          </Button>

          <Button 
            variant={activeTab === 'face' ? 'default' : 'outline'} 
            size="icon"
            className={cn(
              "h-10 w-10",
              activeTab === 'face' && "bg-magenta hover:bg-magenta/90"
            )}
            onClick={() => setActiveTab('face')}
            title="Face Detection"
          >
            <ScanFace className="h-5 w-5" />
          </Button>
        </div>

        {!collapsed && (
          <>
            <Separator className="my-4" />

            {activeTab === 'filters' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <Label htmlFor="photographer">Photographer</Label>
                  <Select 
                    onValueChange={(value) => setFilters({ photographer: value !== 'All Photographers' ? value : null })}
                    defaultValue="All Photographers"
                  >
                    <SelectTrigger id="photographer" className="w-full">
                      <SelectValue placeholder="Select photographer" />
                    </SelectTrigger>
                    <SelectContent>
                      {photographers.map((photographer) => (
                        <SelectItem key={photographer} value={photographer}>
                          {photographer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event">Event</Label>
                  <Select 
                    onValueChange={(value) => setFilters({ eventDate: value !== 'All Events' ? value : null })}
                    defaultValue="All Events"
                  >
                    <SelectTrigger id="event" className="w-full">
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event} value={event}>
                          {event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    className="w-full" 
                    onChange={(e) => setFilters({ date: e.target.value || null })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="face-filter" 
                    onCheckedChange={(checked) => setFilters({ hasFace: checked ? true : null })}
                  />
                  <Label htmlFor="face-filter">Has Face</Label>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setFilters({ 
                      photographer: null,
                      eventDate: null,
                      date: null,
                      hasFace: null
                    })}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'adjustments' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="brightness">Brightness</Label>
                    <Badge variant="outline" className="font-mono">0</Badge>
                  </div>
                  <Slider id="brightness" defaultValue={[0]} min={-100} max={100} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contrast">Contrast</Label>
                    <Badge variant="outline" className="font-mono">0</Badge>
                  </div>
                  <Slider id="contrast" defaultValue={[0]} min={-100} max={100} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="saturation">Saturation</Label>
                    <Badge variant="outline" className="font-mono">0</Badge>
                  </div>
                  <Slider id="saturation" defaultValue={[0]} min={-100} max={100} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Badge variant="outline" className="font-mono">0</Badge>
                  </div>
                  <Slider id="temperature" defaultValue={[0]} min={-100} max={100} step={1} />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Wand2 className="h-4 w-4" />
                    Auto Fix
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    Presets
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <Label htmlFor="base-price">Base Price (€)</Label>
                  <Input id="base-price" type="number" defaultValue="15.00" min="0" step="0.5" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="bulk-discount" />
                  <Label htmlFor="bulk-discount">Enable Bulk Discounts</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount-quantity">Discount Quantity</Label>
                  <Input id="discount-quantity" type="number" defaultValue="5" min="2" step="1" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount-percent">Discount (%)</Label>
                  <Input id="discount-percent" type="number" defaultValue="10" min="0" max="100" step="1" />
                </div>

                <Button className="w-full bg-magenta hover:bg-magenta/90">
                  Apply Pricing
                </Button>
              </div>
            )}

            {activeTab === 'watermark' && (
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
            )}

            {activeTab === 'face' && (
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
            )}
          </>
        )}
      </div>

      {!collapsed && state.lastSyncTime && (
        <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
          Last sync: {format(new Date(state.lastSyncTime), 'dd MMM yyyy, HH:mm')}
        </div>
      )}
    </aside>
  );
};
