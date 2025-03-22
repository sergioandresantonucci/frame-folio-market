
import React from 'react';
import { PhotoProvider } from '@/context/PhotoContext';
import { Layout } from '@/components/ui/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground max-w-xl">
            Gestisci le tue foto e vendi i tuoi servizi fotografici.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="animate-fadeIn hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-magenta" />
                Galleria Foto
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm">Visualizza e gestisci le tue foto caricate.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/gallery')}>
                Vai alla Galleria
              </Button>
            </CardFooter>
          </Card>

          <Card className="animate-fadeIn hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-magenta" />
                Carica Foto
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm">Carica nuove foto per i tuoi clienti.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/upload')}>
                Carica Foto
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="bg-gradient-to-br from-magenta/10 to-light-blue/20 rounded-lg p-6 animate-fadeIn">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold">Inizia subito</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Carica le tue prime foto, imposta i prezzi e inizia a venderle ai tuoi clienti in pochi minuti.
            </p>
            <Button className="bg-magenta hover:bg-magenta/90 mt-2" onClick={() => navigate('/upload')}>
              <Upload className="h-4 w-4 mr-2" />
              Carica Foto
            </Button>
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
