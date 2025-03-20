
import React from 'react';
import { PhotoProvider } from '@/context/PhotoContext';
import { Layout } from '@/components/ui/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  ImagePlus,
  CreditCard,
  BarChart3,
  Calendar,
  ArrowRight,
  Upload,
  ScanFace,
  Image,
  CircleDollarSign,
  MonitorSmartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground max-w-xl">
            Manage your photography business with advanced tools for photo organization, 
            sales tracking, and client management.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="animate-fadeIn">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Badge className="mr-2 bg-magenta/10 text-magenta border-0 h-8 w-8 rounded-full p-1.5">
                  <ImagePlus className="h-full w-full" />
                </Badge>
                Photo Management
              </CardTitle>
              <CardDescription>Upload, organize and manage photos</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm">Manage your photo collections with powerful organization tools.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/gallery')}>
                Go to Gallery
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="animate-fadeIn animate-delay-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Badge className="mr-2 bg-blue-50 text-blue-500 border-0 h-8 w-8 rounded-full p-1.5">
                  <CreditCard className="h-full w-full" />
                </Badge>
                Sales & Payments
              </CardTitle>
              <CardDescription>Manage transactions and payments</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm">Track sales, process payments, and manage your revenue.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Transactions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="animate-fadeIn animate-delay-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Badge className="mr-2 bg-green-50 text-green-500 border-0 h-8 w-8 rounded-full p-1.5">
                  <BarChart3 className="h-full w-full" />
                </Badge>
                Analytics
              </CardTitle>
              <CardDescription>Track performance and insights</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm">Gain insights into your business with detailed analytics.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Analytics
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Upload className="h-5 w-5 text-magenta" />,
                title: "Easy Photo Upload",
                description: "Seamlessly upload and sync photos across devices, even in offline mode."
              },
              {
                icon: <Image className="h-5 w-5 text-magenta" />,
                title: "Watermarking",
                description: "Apply custom watermarks to protect your work until payment is received."
              },
              {
                icon: <CircleDollarSign className="h-5 w-5 text-magenta" />,
                title: "Flexible Pricing",
                description: "Set individual or bulk pricing for your photos with customizable options."
              },
              {
                icon: <ScanFace className="h-5 w-5 text-magenta" />,
                title: "Face Detection",
                description: "Automatically identify and categorize photos with facial recognition."
              },
              {
                icon: <Calendar className="h-5 w-5 text-magenta" />,
                title: "Event Management",
                description: "Organize photos by events for better client experiences and management."
              },
              {
                icon: <MonitorSmartphone className="h-5 w-5 text-magenta" />,
                title: "Client View",
                description: "Dedicated presentation mode for showing photos to clients and making sales."
              }
            ].map((feature, index) => (
              <Card key={index} className={cn(
                "transition-all duration-300 hover:shadow-md hover:border-magenta/20",
                "animate-fadeIn animate-delay-300"
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {feature.icon}
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-gradient-to-br from-magenta/10 to-light-blue/20 p-6 animate-fadeIn animate-delay-400">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:w-2/3 space-y-4">
              <h2 className="text-xl font-semibold">Ready to start selling your photos?</h2>
              <p className="text-muted-foreground">
                Upload your first collection, set your prices, and start selling to clients in just a few minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-magenta hover:bg-magenta/90">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <img 
                src="https://source.unsplash.com/random/400x300?camera" 
                alt="Camera" 
                className="rounded-lg max-w-full h-auto shadow-lg" 
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const Index: React.FC = () => {
  return (
    <PhotoProvider>
      <DashboardContent />
    </PhotoProvider>
  );
};

export default Index;
