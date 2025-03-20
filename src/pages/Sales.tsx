
import React, { useState } from 'react';
import { Layout } from '@/components/ui/Layout';
import { Table } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  CircleDollarSign, 
  Calendar, 
  CreditCard, 
  Download, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Sample data for sales
const salesData = [
  { 
    id: '1', 
    date: '2023-09-15', 
    client: 'Wedding Smith Family',
    photos: 8,
    total: 240,
    paymentMethod: 'Credit Card'
  },
  { 
    id: '2', 
    date: '2023-09-17', 
    client: 'Maria Johnson Birthday',
    photos: 5,
    total: 125,
    paymentMethod: 'PayPal'
  },
  { 
    id: '3', 
    date: '2023-09-20', 
    client: 'Tech Conference',
    photos: 12,
    total: 360,
    paymentMethod: 'Credit Card'
  },
  { 
    id: '4', 
    date: '2023-09-22', 
    client: 'Johnson Family Portraits',
    photos: 4,
    total: 120,
    paymentMethod: 'Credit Card'
  },
  { 
    id: '5', 
    date: '2023-09-25', 
    client: 'Garcia Wedding',
    photos: 15,
    total: 450,
    paymentMethod: 'PayPal'
  },
];

// Payment methods breakdown
const paymentMethodsData = [
  { method: 'Credit Card', amount: 920, percentage: 65 },
  { method: 'PayPal', amount: 575, percentage: 35 },
];

const Sales = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate total sales
  const totalSales = salesData.reduce((sum, sale) => sum + sale.total, 0);
  const totalPhotos = salesData.reduce((sum, sale) => sum + sale.photos, 0);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Sales & Payments</h1>
          
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              This Month
            </Button>
            
            <Button>
              <a href="#export" className="flex items-center bg-magenta hover:bg-magenta/90">
                <Download className="h-4 w-4 mr-2" />
                Export
              </a>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{totalSales}</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      +12.5% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Photos Sold</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPhotos}</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      +7.2% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesData.length}</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      +18.1% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{(totalSales / totalPhotos).toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-red-500 flex items-center">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      -3.2% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made {salesData.length} sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Photos</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.slice(0, 5).map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.date}</td>
                          <td>{sale.client}</td>
                          <td>{sale.photos}</td>
                          <td>€{sale.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Distribution of payment methods used.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethodsData.map((payment) => (
                    <div key={payment.method} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {payment.method === "Credit Card" ? (
                            <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                          ) : (
                            <CircleDollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          )}
                          <span>{payment.method}</span>
                        </div>
                        <span className="text-sm">€{payment.amount}</span>
                      </div>
                      
                      <Progress value={payment.percentage} />
                      
                      <p className="text-xs text-muted-foreground text-right">
                        {payment.percentage}% of total sales
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>A list of all your sales transactions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client</th>
                      <th>Photos</th>
                      <th>Total</th>
                      <th>Payment Method</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((sale) => (
                      <tr key={sale.id}>
                        <td>{sale.date}</td>
                        <td>{sale.client}</td>
                        <td>{sale.photos}</td>
                        <td>€{sale.total}</td>
                        <td>{sale.paymentMethod}</td>
                        <td>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payouts</CardTitle>
                <CardDescription>History of funds transferred to your bank account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-10 text-center text-muted-foreground">
                  <CircleDollarSign className="mx-auto h-10 w-10 mb-4" />
                  <p>No payouts have been processed yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Sales;
