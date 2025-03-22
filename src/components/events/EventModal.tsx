import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Event } from '@/pages/Events';
import { Textarea } from '@/components/ui/textarea';

// Define our form schema with location validation
const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  date: z.date({ required_error: 'Please select a date' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters' }),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id' | 'photoIds'>) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave }) => {
  const isMobile = useIsMobile();
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      date: new Date(),
      location: '',
      description: '',
    },
  });

  // Initialize Google Places Autocomplete
  useEffect(() => {
    // Check if Google Maps API is loaded
    if (isOpen && locationInputRef.current && window.google && window.google.maps && !autocompleteRef.current) {
      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(locationInputRef.current, {
          types: ['address'],
        });

        // Listen for place selection
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.formatted_address) {
            form.setValue('location', place.formatted_address, { shouldValidate: true });
          }
        });
      } catch (error) {
        console.error("Error initializing Google Places Autocomplete:", error);
      }
    }

    return () => {
      // Clean up listener when component unmounts
      if (autocompleteRef.current && window.google && window.google.maps) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [form, isOpen]);

  const onSubmit = (data: FormValues) => {
    onSave({
      title: data.title,
      date: data.date,
      location: data.location,
      description: data.description,
    });
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[500px]",
        isMobile && "w-[calc(100%-2rem)] p-4"
      )}>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align={isMobile ? "center" : "start"}>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter event location" 
                      {...field} 
                      ref={locationInputRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter event description" 
                      className="resize-none" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className={isMobile ? "w-full" : ""}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className={isMobile ? "w-full" : ""}
              >
                Save Event
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
