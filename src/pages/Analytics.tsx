
import React from 'react';
import { PhotoProvider, usePhotoContext } from '@/context/PhotoContext';
import { Layout } from '@/components/ui/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  BarChart, 
  LineChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  CalendarRange, 
  Download, 
  TrendingUp, 
  Users, 
  CreditCard,
  Image,
  Filter,
  FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for charts
const salesData = [
  { month: 'Jan', revenue: 1200, photos: 80 },
  { month: 'Feb', revenue: 1900, photos: 125 },
  { month: 'Mar', revenue: 1500, photos: 95 },
  { month: 'Apr', revenue: 2200, photos: 140 },
  { month: 'May', revenue: 1800, photos: 110 },
  { month: 'Jun', revenue: 2400, photos: 160 },
  { month: 'Jul', revenue: 2100, photos: 135 },
];

const photographerData = [
  { name: 'John Smith', revenue: 3200, photos: 220 },
  { name: 'Sarah Jones', revenue: 2800, photos: 180 },
  { name: 'Miguel Rodriguez', revenue: 3500, photos: 240 },
];

const eventTypeData = [
  { name: 'Wedding', value: 45 },
  { name: 'Corporate Event', value: 25 },
  { name: 'Birthday Party', value: 15 },
  { name: 'Conference', value: 15 },
];

const COLORS = ['#E5007D', '#000000', '#cee2ef', '#999999'];

const AnalyticsContent: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Calculate overall statistics
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalPhotos = salesData.reduce((sum, item) => sum + item.photos, 0);
  const averageOrderValue = totalRevenue / salesData.length;
  
  return (
    <Layout showSidebar={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarRange className="h-4 w-4 mr-2" />
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-magenta" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
              <CardDescription className="mt-1">+18% from last period</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Image className="h-4 w-4 mr-2 text-magenta" />
                Photos Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPhotos}</div>
              <CardDescription className="mt-1">Across all events</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-magenta" />
                Top Photographer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{photographerData[0].name}</div>
              <CardDescription className="mt-1">€{photographerData[0].revenue} in sales</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-magenta" />
                Avg Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{Math.round(averageOrderValue)}</div>
              <CardDescription className="mt-1">Per transaction</CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="revenue">
          <TabsList className="mb-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="photographers">Photographers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>
                  Monthly revenue for the current year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`€${value}`, 'Revenue']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Revenue" 
                        stroke="#E5007D" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Photos Sold</CardTitle>
                <CardDescription>
                  Number of photos sold per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="photos" name="Photos Sold" fill="#E5007D" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Event Types</CardTitle>
                  <CardDescription>
                    Distribution of events by type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={eventTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {eventTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Events</CardTitle>
                  <CardDescription>
                    Number of events per month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: 'Jan', events: 4 },
                          { month: 'Feb', events: 6 },
                          { month: 'Mar', events: 5 },
                          { month: 'Apr', events: 7 },
                          { month: 'May', events: 5 },
                          { month: 'Jun', events: 8 },
                          { month: 'Jul', events: 6 },
                        ]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="events" name="Events" fill="#cee2ef" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="photographers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Photographer Performance</CardTitle>
                <CardDescription>
                  Revenue and photos sold by photographer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={photographerData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      layout={isMobile ? "vertical" : "horizontal"}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      {isMobile ? (
                        <>
                          <YAxis dataKey="name" type="category" />
                          <XAxis type="number" />
                        </>
                      ) : (
                        <>
                          <XAxis dataKey="name" />
                          <YAxis />
                        </>
                      )}
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue (€)" fill="#E5007D" />
                      <Bar dataKey="photos" name="Photos Sold" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

const Analytics: React.FC = () => {
  return (
    <PhotoProvider>
      <AnalyticsContent />
    </PhotoProvider>
  );
};

export default Analytics;
