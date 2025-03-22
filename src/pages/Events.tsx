
import React, { useState } from 'react';
import { Layout } from '@/components/ui/Layout';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
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

// Event type definition
export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
}

const Events = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Wedding Photo Session',
      date: new Date(2023, 5, 15),
      location: 'Central Park, New York',
      description: 'Wedding photography for Johnson family'
    },
    {
      id: '2',
      title: 'Corporate Headshots',
      date: new Date(2023, 6, 22),
      location: 'ABC Company Office',
      description: 'Headshot session for 15 employees'
    },
    {
      id: '3',
      title: 'Fashion Portfolio',
      date: new Date(2023, 7, 10),
      location: 'Downtown Studio',
      description: 'Summer collection photoshoot'
    },
    {
      id: '4',
      title: 'Birthday Party',
      date: new Date(2023, 9, 5),
      location: 'Sunshine Restaurant',
      description: 'Birthday celebration photography'
    },
    {
      id: '5',
      title: 'Product Photography',
      date: new Date(2023, 11, 12),
      location: 'Home Studio',
      description: 'E-commerce products for online store'
    }
  ]);

  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    const event = {
      ...newEvent,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, event]);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Photography Events</h1>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Insert Event
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No events found. Click "Insert Event" to add one.
                  </TableCell>
                </TableRow>
              ) : (
                events.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {event.title}
                      </div>
                    </TableCell>
                    <TableCell>{format(event.date, 'dd MMM yyyy')}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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
