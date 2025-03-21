
import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'filters' | 'adjustments' | 'pricing' | 'watermark' | 'face'>('filters');
  const { state, setFilters, setActivePhoto } = usePhotoContext();
  const isMobile = useIsMobile();
  
  // State for color adjustments
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);

  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
  };

  // Apply color adjustments function
  const applyColorAdjustments = () => {
    if (!state.activePhoto) {
      toast.error("Please select a photo to apply adjustments");
      return;
    }
    
    // Find the active photo element and apply CSS filters
    const photoId = state.activePhoto.id;
    const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
    
    if (photoElement) {
      // Apply CSS filters directly to the image
      const filterString = `
        brightness(${1 + brightness/100})
        contrast(${1 + contrast/100})
        saturate(${1 + saturation/100})
        ${temperature > 0 ? `sepia(${temperature/100})` : ''}
        ${temperature < 0 ? `hue-rotate(${temperature * 1.8}deg)` : ''}
      `;
      
      photoElement.style.filter = filterString;
      
      // Store the filter in sessionStorage to persist through renders
      sessionStorage.setItem(`filter-${photoId}`, filterString);
      
      toast.success(`Applied adjustments to photo: 
        Brightness: ${brightness}, 
        Contrast: ${contrast}, 
        Saturation: ${saturation}, 
        Temperature: ${temperature}`);
    } else {
      toast.error("Could not find the selected photo element");
    }
  };

  // Restore filters from sessionStorage when component mounts or active photo changes
  useEffect(() => {
    if (state.activePhoto) {
      const photoId = state.activePhoto.id;
      const savedFilter = sessionStorage.getItem(`filter-${photoId}`);
      
      if (savedFilter) {
        const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
        if (photoElement) {
          photoElement.style.filter = savedFilter;
        }
        
        // Try to extract values from saved filter
        const brightnessMatch = savedFilter.match(/brightness\(([0-9.]+)\)/);
        const contrastMatch = savedFilter.match(/contrast\(([0-9.]+)\)/);
        const saturateMatch = savedFilter.match(/saturate\(([0-9.]+)\)/);
        const sepiaMatch = savedFilter.match(/sepia\(([0-9.]+)\)/);
        const hueRotateMatch = savedFilter.match(/hue-rotate\(([0-9.-]+)deg\)/);
        
        if (brightnessMatch) setBrightness(Math.round((parseFloat(brightnessMatch[1]) - 1) * 100));
        if (contrastMatch) setContrast(Math.round((parseFloat(contrastMatch[1]) - 1) * 100));
        if (saturateMatch) setSaturation(Math.round((parseFloat(saturateMatch[1]) - 1) * 100));
        
        if (sepiaMatch) {
          setTemperature(Math.round(parseFloat(sepiaMatch[1]) * 100));
        } else if (hueRotateMatch) {
          setTemperature(Math.round(parseFloat(hueRotateMatch[1]) / 1.8));
        } else {
          setTemperature(0);
        }
      } else {
        // Reset sliders if no saved filter
        setBrightness(0);
        setContrast(0);
        setSaturation(0);
        setTemperature(0);
      }
    }
  }, [state.activePhoto]);

  // Apply auto-fix to selected photo
  const applyAutoFix = () => {
    if (!state.activePhoto) {
      toast.error("Please select a photo to apply auto fix");
      return;
    }
    
    // Set some good looking auto-adjustment values
    setBrightness(10);
    setContrast(15);
    setSaturation(5);
    setTemperature(-3);
    
    toast.success("Auto adjustment applied");
    
    // Apply the changes after a short delay
    setTimeout(() => {
      applyColorAdjustments();
    }, 300);
  };

  // Apply a vibrant preset
  const applyVibrantPreset = () => {
    if (!state.activePhoto) {
      toast.error("Please select a photo to apply preset");
      return;
    }
    
    toast.info("Applying 'Vibrant' preset");
    setBrightness(10);
    setContrast(20);
    setSaturation(30);
    setTemperature(5);
    
    // Apply the changes after a short delay
    setTimeout(() => {
      applyColorAdjustments();
    }, 300);
  };

  // Reset adjustments
  const resetAdjustments = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setTemperature(0);
    
    // If there's an active photo, reset its filters
    if (state.activePhoto) {
      const photoId = state.activePhoto.id;
      const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
      
      if (photoElement) {
        photoElement.style.filter = 'none';
        sessionStorage.removeItem(`filter-${photoId}`);
        toast.info("Adjustments reset");
      }
    }
  };

  const photographers = ['All Photographers', 'John Smith', 'Sarah Jones', 'Miguel Rodriguez'];
  const events = ['All Events', 'Wedding', 'Corporate Event', 'Birthday Party', 'Conference'];

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] flex flex-col border-r border-gray-100 bg-white transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-80" // Increased width from w-72 to w-80
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

      <div className="flex-grow overflow-y-auto p-3 space-y-3">
        <div className={cn(
          "flex flex-wrap gap-2",
          isMobile && "flex-col"
        )}>
          <Button 
            variant={activeTab === 'filters' ? 'default' : 'outline'} 
            size={isMobile ? "sm" : "icon"}
            className={cn(
              isMobile ? "w-full justify-start" : "h-10 w-10",
              activeTab === 'filters' && "bg-magenta hover:bg-magenta/90"
            )}
            onClick={() => setActiveTab('filters')}
          >
            <Sliders className="h-5 w-5 mr-2" />
            {isMobile && "Filters"}
          </Button>

          <Button 
            variant={activeTab === 'adjustments' ? 'default' : 'outline'} 
            size={isMobile ? "sm" : "icon"}
            className={cn(
              isMobile ? "w-full justify-start" : "h-10 w-10",
              activeTab === 'adjustments' && "bg-magenta hover:bg-magenta/90"
            )}
            onClick={() => setActiveTab('adjustments')}
          >
            <Palette className="h-5 w-5 mr-2" />
            {isMobile && "Color Correction"}
          </Button>

          <Button 
            variant={activeTab === 'pricing' ? 'default' : 'outline'} 
            size={isMobile ? "sm" : "icon"}
            className={cn(
              isMobile ? "w-full justify-start" : "h-10 w-10",
              activeTab === 'pricing' && "bg-magenta hover:bg-magenta/90"
            )}
            onClick={() => setActiveTab('pricing')}
          >
            <CircleDollarSign className="h-5 w-5 mr-2" />
            {isMobile && "Pricing"}
          </Button>

          <Button 
            variant={activeTab === 'watermark' ? 'default' : 'outline'} 
            size={isMobile ? "sm" : "icon"}
            className={cn(
              isMobile ? "w-full justify-start" : "h-10 w-10",
              activeTab === 'watermark' && "bg-magenta hover:bg-magenta/90"
            )}
            onClick={() => setActiveTab('watermark')}
          >
            <Image className="h-5 w-5 mr-2" />
            {isMobile && "Watermark"}
          </Button>

          <Button 
            variant={activeTab === 'face' ? 'default' : 'outline'} 
            size={isMobile ? "sm" : "icon"}
            className={cn(
              isMobile ? "w-full justify-start" : "h-10 w-10",
              activeTab === 'face' && "bg-magenta hover:bg-magenta/90"
            )}
            onClick={() => setActiveTab('face')}
          >
            <ScanFace className="h-5 w-5 mr-2" />
            {isMobile && "Face Detection"}
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
                    <Badge variant="outline" className="font-mono">{brightness}</Badge>
                  </div>
                  <Slider 
                    id="brightness" 
                    value={[brightness]} 
                    min={-100} 
                    max={100} 
                    step={1} 
                    onValueChange={(values) => setBrightness(values[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contrast">Contrast</Label>
                    <Badge variant="outline" className="font-mono">{contrast}</Badge>
                  </div>
                  <Slider 
                    id="contrast" 
                    value={[contrast]} 
                    min={-100} 
                    max={100} 
                    step={1} 
                    onValueChange={(values) => setContrast(values[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="saturation">Saturation</Label>
                    <Badge variant="outline" className="font-mono">{saturation}</Badge>
                  </div>
                  <Slider 
                    id="saturation" 
                    value={[saturation]} 
                    min={-100} 
                    max={100} 
                    step={1} 
                    onValueChange={(values) => setSaturation(values[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Badge variant="outline" className="font-mono">{temperature}</Badge>
                  </div>
                  <Slider 
                    id="temperature" 
                    value={[temperature]} 
                    min={-100} 
                    max={100} 
                    step={1} 
                    onValueChange={(values) => setTemperature(values[0])}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={applyAutoFix}
                  >
                    <Wand2 className="h-4 w-4" />
                    Auto Fix
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={applyVibrantPreset}
                  >
                    <Layers className="h-4 w-4" />
                    Presets
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={resetAdjustments}
                  >
                    Reset
                  </Button>
                  
                  <Button 
                    size="sm"
                    className="bg-magenta hover:bg-magenta/90"
                    onClick={applyColorAdjustments}
                    disabled={!state.activePhoto}
                  >
                    Apply
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
