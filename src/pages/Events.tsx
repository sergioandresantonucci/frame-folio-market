
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/Layout';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Image as ImageIcon } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { EventModal } from '@/components/events/EventModal';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePhotoContext, Photo } from '@/context/PhotoContext';
import { useNavigate } from 'react-router-dom';

// Event type definition
export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  photoIds: string[]; // Array of photo IDs associated with this event
}

const Events = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { state: photoState } = usePhotoContext();
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Wedding Photo Session',
      date: new Date(2023, 5, 15),
      location: 'Central Park, New York',
      description: 'Wedding photography for Johnson family',
      photoIds: []
    },
    {
      id: '2',
      title: 'Corporate Headshots',
      date: new Date(2023, 6, 22),
      location: 'ABC Company Office',
      description: 'Headshot session for 15 employees',
      photoIds: []
    },
    {
      id: '3',
      title: 'Fashion Portfolio',
      date: new Date(2023, 7, 10),
      location: 'Downtown Studio',
      description: 'Summer collection photoshoot',
      photoIds: []
    },
    {
      id: '4',
      title: 'Birthday Party',
      date: new Date(2023, 9, 5),
      location: 'Sunshine Restaurant',
      description: 'Birthday celebration photography',
      photoIds: []
    },
    {
      id: '5',
      title: 'Product Photography',
      date: new Date(2023, 11, 12),
      location: 'Home Studio',
      description: 'E-commerce products for online store',
      photoIds: []
    }
  ]);

  // Effect to link photos to events based on eventDate
  useEffect(() => {
    if (photoState.photos.length > 0) {
      const updatedEvents = events.map(event => {
        // Find photos that have an eventDate matching this event's title
        const matchingPhotoIds = photoState.photos
          .filter(photo => photo.eventDate === event.title)
          .map(photo => photo.id);
        
        return {
          ...event,
          photoIds: matchingPhotoIds
        };
      });
      
      setEvents(updatedEvents);
    }
  }, [photoState.photos, events]);

  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    const event = {
      ...newEvent,
      id: Date.now().toString(),
      photoIds: []
    };
    setEvents(prev => [...prev, event]);
    setIsModalOpen(false);
  };

  const viewEventPhotos = (eventTitle: string) => {
    // Navigate to the gallery with a filter for this event
    navigate(`/gallery?event=${encodeURIComponent(eventTitle)}`);
  };

  const getPhotoCountForEvent = (event: Event) => {
    return event.photoIds.length;
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Photography Events</h1>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <Plus className="h-4 w-4" />
            Insert Event
          </Button>
        </div>

        {isMobile ? (
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-muted-foreground">No events found. Click "Insert Event" to add one.</p>
              </div>
            ) : (
              events.map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 font-medium text-lg mb-2">
                      <Calendar className="h-4 w-4 text-magenta" />
                      {event.title}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Date:</div>
                      <div>{format(event.date, 'dd MMM yyyy')}</div>
                      
                      <div className="font-medium">Location:</div>
                      <div>{event.location}</div>
                      
                      <div className="font-medium">Description:</div>
                      <div>{event.description}</div>
                      
                      <div className="font-medium">Photos:</div>
                      <div className="flex items-center">
                        <Badge 
                          className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                          onClick={() => viewEventPhotos(event.title)}
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {getPhotoCountForEvent(event)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Photos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No events found. Click "Insert Event" to add one.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map(event => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-magenta" />
                          {event.title}
                        </div>
                      </TableCell>
                      <TableCell>{format(event.date, 'dd MMM yyyy')}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>
                        <Badge 
                          className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                          onClick={() => viewEventPhotos(event.title)}
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {getPhotoCountForEvent(event)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addEvent}
      />
    </Layout>
  );
};

export default Events;
