
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePhotoContext } from '@/context/PhotoContext';

export const FiltersTab: React.FC = () => {
  const { setFilters } = usePhotoContext();
  const photographers = ['All Photographers', 'John Smith', 'Sarah Jones', 'Miguel Rodriguez'];
  const events = ['All Events', 'Wedding', 'Corporate Event', 'Birthday Party', 'Conference'];

  return (
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
  );
};
