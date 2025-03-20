
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoProvider, usePhotoContext, Photo } from '@/context/PhotoContext';
import { Layout } from '@/components/ui/Layout';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoViewer } from '@/components/PhotoViewer';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw, BarChart3, CreditCard } from 'lucide-react';
import { detectFaces } from '@/utils/faceDetection';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Generate sample photos for demo purposes
const generateSamplePhotos = (count: number): Photo[] => {
  return Array.from({ length: count }).map((_, i) => {
    const id = `photo-${i + 1}`;
    const hasWatermark = Math.random() > 0.5;
    
    return {
      id,
      src: `https://source.unsplash.com/random/800x600?sig=${i}`,
      thumbnail: `https://source.unsplash.com/random/400x300?sig=${i}`,
      price: 5 + Math.floor(Math.random() * 15),
      watermarked: hasWatermark,
      selected: false,
      photographer: ['John Smith', 'Sarah Jones', 'Miguel Rodriguez'][Math.floor(Math.random() * 3)],
      date: new Date().toISOString().split('T')[0],
      eventDate: ['Wedding', 'Corporate Event', 'Birthday Party', 'Conference'][Math.floor(Math.random() * 4)],
    };
  });
};

const GalleryContent: React.FC = () => {
  const { state, addPhotos, addFaceData } = usePhotoContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load sample photos on first render if gallery is empty
    if (state.photos.length === 0) {
      const samplePhotos = generateSamplePhotos(24);
      addPhotos(samplePhotos);
      
      // Toast notification
      toast.success(`Loaded ${samplePhotos.length} sample photos`);
      
      // Simulate face detection for some photos
      const processPhotosWithFaces = async () => {
        // Process a few random photos for face detection
        const photoIndexesToProcess = Array.from({ length: 8 })
          .map(() => Math.floor(Math.random() * samplePhotos.length));
        
        toast.info('Running face detection on selected photos...', {
          duration: 3000,
        });
        
        for (const index of photoIndexesToProcess) {
          const photo = samplePhotos[index];
          if (!photo) continue;
          
          try {
            const result = await detectFaces(photo.src);
            if (result.faces.length > 0) {
              addFaceData(photo.id, result.faces);
            }
          } catch (error) {
            console.error('Face detection error:', error);
          }
        }
        
        toast.success('Face detection completed!');
      };
      
      // Run face detection after a delay
      setTimeout(processPhotosWithFaces, 2000);
    }
  }, []);

  // Render client view if in client display mode
  if (state.displayMode === 'client') {
    return (
      <div className="fixed inset-0 p-0 bg-black flex flex-col">
        <div className="bg-black/80 p-4 text-white flex items-center justify-between backdrop-blur-sm">
          <h2 className="text-xl font-medium">Client Preview</h2>
          <Button 
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
        </div>
        <div className="flex-grow p-4 md:p-8 overflow-auto">
          <PhotoGrid className="max-w-7xl mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-semibold">Photo Gallery</h1>
          
          <div className={cn(
            "flex",
            isMobile ? "w-full mt-2 gap-2" : "gap-3"
          )}>
            <Button asChild className="bg-magenta hover:bg-magenta/90 flex-1 md:flex-none">
              <a href="/upload">
                <Upload className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Upload Photos</span>
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none"
              onClick={() => navigate('/sales')}
            >
              <CreditCard className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Sales</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Analytics</span>
            </Button>
          </div>
        </div>
        
        <PhotoGrid />
        <PhotoViewer />
      </div>
    </Layout>
  );
};

const Gallery: React.FC = () => {
  return (
    <PhotoProvider>
      <GalleryContent />
    </PhotoProvider>
  );
};

export default Gallery;
