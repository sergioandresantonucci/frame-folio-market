
import React, { useState } from 'react';
import { PhotoProvider, usePhotoContext } from '@/context/PhotoContext';
import { Layout } from '@/components/ui/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Download, 
  Calendar, 
  Search, 
  CreditCard, 
  Euro, 
  User,
  ArrowUpDown,
  FileDown,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock sales data for demonstration
const mockSales = [
  { 
    id: 'sale-001', 
    date: '2023-06-15', 
    amount: 75.00, 
    photos: 5, 
    client: 'John Smith', 
    paymentMethod: 'Credit Card',
    status: 'completed'
  },
  { 
    id: 'sale-002', 
    date: '2023-06-18', 
    amount: 120.00, 
    photos: 8, 
    client: 'Maria Johnson', 
    paymentMethod: 'PayPal',
    status: 'completed'
  },
  { 
    id: 'sale-003', 
    date: '2023-06-20', 
    amount: 45.00, 
    photos: 3, 
    client: 'Robert Davis', 
    paymentMethod: 'Credit Card',
    status: 'completed'
  },
  { 
    id: 'sale-004', 
    date: '2023-06-25', 
    amount: 90.00, 
    photos: 6, 
    client: 'Sarah Wilson', 
    paymentMethod: 'PayPal',
    status: 'completed'
  },
  { 
    id: 'sale-005', 
    date: '2023-06-28', 
    amount: 150.00, 
    photos: 10, 
    client: 'Michael Brown', 
    paymentMethod: 'Credit Card',
    status: 'completed'
  },
  { 
    id: 'sale-006', 
    date: '2023-07-01', 
    amount: 60.00, 
    photos: 4, 
    client: 'Emma Taylor', 
    paymentMethod: 'PayPal',
    status: 'pending'
  },
  { 
    id: 'sale-007', 
    date: '2023-07-05', 
    amount: 105.00, 
    photos: 7, 
    client: 'David Miller', 
    paymentMethod: 'Credit Card',
    status: 'completed'
  },
  { 
    id: 'sale-008', 
    date: '2023-07-10', 
    amount: 30.00, 
    photos: 2, 
    client: 'Olivia Moore', 
    paymentMethod: 'PayPal',
    status: 'pending'
  }
];

type SortField = 'date' | 'amount' | 'photos' | 'client';
type SortDirection = 'asc' | 'desc';

const SalesContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const isMobile = useIsMobile();
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort sales data
  const filteredSales = mockSales
    .filter(sale => 
      sale.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.id.includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortField === 'photos') {
        return sortDirection === 'asc' ? a.photos - b.photos : b.photos - a.photos;
      } else if (sortField === 'client') {
        return sortDirection === 'asc' 
          ? a.client.localeCompare(b.client)
          : b.client.localeCompare(a.client);
      }
      return 0;
    });
  
  // Calculate statistics
  const totalSales = mockSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalPhotos = mockSales.reduce((sum, sale) => sum + sale.photos, 0);
  const completedSales = mockSales.filter(sale => sale.status === 'completed').length;
  const pendingSales = mockSales.filter(sale => sale.status === 'pending').length;
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-semibold">Sales & Payments</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Filter by Date
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
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">€{totalSales.toFixed(2)}</span>
                <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">+12.5%</Badge>
              </div>
              <CardDescription className="mt-1">From {mockSales.length} sales</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Photos Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPhotos}</div>
              <CardDescription className="mt-1">Avg. €{(totalSales / totalPhotos).toFixed(2)} per photo</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSales}</div>
              <CardDescription className="mt-1">{Math.round((completedSales / mockSales.length) * 100)}% completion rate</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingSales}</div>
              <CardDescription className="mt-1">Awaiting payment</CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <div className="rounded-md border">
          <div className="p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search sales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
                prefix={<Search className="h-4 w-4 text-gray-400" />}
              />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              Showing {filteredSales.length} of {mockSales.length} sales
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-medium"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    <ArrowUpDown className={cn(
                      "ml-2 h-3 w-3",
                      sortField === 'date' && "text-magenta"
                    )} />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-medium"
                    onClick={() => handleSort('client')}
                  >
                    Client
                    <ArrowUpDown className={cn(
                      "ml-2 h-3 w-3",
                      sortField === 'client' && "text-magenta"
                    )} />
                  </Button>
                </TableHead>
                {!isMobile && <TableHead>Payment Method</TableHead>}
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-medium"
                    onClick={() => handleSort('photos')}
                  >
                    Photos
                    <ArrowUpDown className={cn(
                      "ml-2 h-3 w-3",
                      sortField === 'photos' && "text-magenta"
                    )} />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-medium"
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                    <ArrowUpDown className={cn(
                      "ml-2 h-3 w-3",
                      sortField === 'amount' && "text-magenta"
                    )} />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id} className="group">
                  <TableCell className="font-medium">
                    {new Date(sale.date).toLocaleDateString('en-US', { 
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {sale.client}
                    </div>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      {sale.paymentMethod === 'Credit Card' ? (
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-blue-500" />
                          <span>Credit Card</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <svg className="h-4 w-4 text-blue-700" viewBox="0 0 24 24">
                            <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.026-.024.13a.804.804 0 0 1-.794.68h-2.52a.483.483 0 0 1-.477-.558l.79-5.02c.036-.222.226-.374.45-.374h1.307c3.905 0 6.214-2.168 7.066-5.13a4.21 4.21 0 0 0-.173-3.1" fill="#253d80"></path>
                          </svg>
                          <span>PayPal</span>
                        </div>
                      )}
                    </TableCell>
                  )}
                  <TableCell>{sale.photos}</TableCell>
                  <TableCell className="text-right font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <Euro className="h-4 w-4 text-gray-400" />
                      {sale.amount.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {sale.status === 'completed' ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Completed
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

const Sales: React.FC = () => {
  return (
    <PhotoProvider>
      <SalesContent />
    </PhotoProvider>
  );
};

export default Sales;
