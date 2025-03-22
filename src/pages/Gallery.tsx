import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoProvider, usePhotoContext, Photo } from '@/context/PhotoContext';
import { Layout } from '@/components/ui/Layout';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoViewer } from '@/components/PhotoViewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, RefreshCw, BarChart3, CreditCard, Search } from 'lucide-react';
import { detectFaces } from '@/utils/faceDetection';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { FloatingCart } from '@/components/FloatingCart';
import { CartModal } from '@/components/CartModal';
import { ColorCorrectionBar } from '@/components/ColorCorrectionBar';

const sampleImages = [
  {
    id: 'photo-1',
    src: 'https://images.unsplash.com/photo-1553525553-f103c606fa4a?q=80&w=1000',
    desc: 'Wedding photo, couple in a field'
  },
  {
    id: 'photo-2',
    src: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=1000',
    desc: 'Portrait of woman in urban setting'
  },
  {
    id: 'photo-3',
    src: 'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?q=80&w=1000',
    desc: 'Family portrait in studio'
  },
  {
    id: 'photo-4',
    src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000',
    desc: 'Corporate headshot'
  },
  {
    id: 'photo-5',
    src: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1000',
    desc: 'Event photography, concert'
  },
  {
    id: 'photo-6',
    src: 'https://images.unsplash.com/photo-1580824456624-90e15a2fe5b1?q=80&w=1000',
    desc: 'Product photography'
  },
  {
    id: 'photo-7',
    src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1000',
    desc: 'Food photography'
  },
  {
    id: 'photo-8',
    src: 'https://images.unsplash.com/photo-1652509755556-f1f90e3afb4c?q=80&w=1000',
    desc: 'Wedding ceremony'
  },
  {
    id: 'photo-9',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000',
    desc: 'Couple portrait'
  },
  {
    id: 'photo-10',
    src: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?q=80&w=1000',
    desc: 'Fashion photography'
  },
  {
    id: 'photo-11',
    src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000',
    desc: 'Graduation portrait'
  },
  {
    id: 'photo-12',
    src: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?q=80&w=1000',
    desc: 'Corporate event'
  },
  {
    id: 'photo-13',
    src: 'https://images.unsplash.com/photo-1502163140606-888448ae8cfe?q=80&w=1000',
    desc: 'Wedding reception'
  },
  {
    id: 'photo-14',
    src: 'https://images.unsplash.com/photo-1523354177913-be035fcee55e?q=80&w=1000',
    desc: 'Sports photography'
  },
  {
    id: 'photo-15',
    src: 'https://images.unsplash.com/photo-1619462729253-509057d96327?q=80&w=1000',
    desc: 'Portrait in studio'
  },
  {
    id: 'photo-16',
    src: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1000',
    desc: 'Child portrait'
  },
  {
    id: 'photo-17',
    src: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=1000',
    desc: 'Wedding detail shot'
  },
  {
    id: 'photo-18',
    src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1000',
    desc: 'Urban portrait'
  },
  {
    id: 'photo-19',
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000',
    desc: 'Close-up portrait'
  },
  {
    id: 'photo-20',
    src: 'https://images.unsplash.com/photo-1505503693641-1926193e8d57?q=80&w=1000',
    desc: 'Engagement photo'
  },
  {
    id: 'photo-21',
    src: 'https://images.unsplash.com/photo-1621190611717-0c4d4d606cae?q=80&w=1000',
    desc: 'Real estate photography'
  },
  {
    id: 'photo-22',
    src: 'https://images.unsplash.com/photo-1626104800582-18121be41b5d?q=80&w=1000',
    desc: 'Wedding portrait'
  },
  {
    id: 'photo-23',
    src: 'https://images.unsplash.com/photo-1509335035496-c47fc836517f?q=80&w=1000',
    desc: 'Event photography, party'
  },
  {
    id: 'photo-24',
    src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000',
    desc: 'Fashion portrait'
  }
];

const generateSamplePhotos = (count: number): Photo[] => {
  return sampleImages.slice(0, count).map((image, i) => {
    const hasWatermark = Math.random() > 0.5;
    const photographer = ['John Smith', 'Sarah Jones', 'Miguel Rodriguez'][Math.floor(Math.random() * 3)];
    const eventType = ['Wedding', 'Corporate Event', 'Birthday Party', 'Conference'][Math.floor(Math.random() * 4)];
    
    return {
      id: image.id,
      src: image.src,
      thumbnail: image.src,
      price: 5 + Math.floor(Math.random() * 15),
      watermarked: hasWatermark,
      selected: false,
      photographer,
      date: new Date().toISOString().split('T')[0],
      eventDate: eventType,
      metadata: {
        description: image.desc
      },
      name: `Photo ${i + 1} - ${image.desc}` // Add default name for each photo
    };
  });
};

const GalleryContent: React.FC = () => {
  const { state, addPhotos, addFaceData } = usePhotoContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (state.photos.length === 0) {
      const samplePhotos = generateSamplePhotos(24);
      addPhotos(samplePhotos);
      
      toast.success(`Loaded ${samplePhotos.length} sample photos`);
      
      const processPhotosWithFaces = async () => {
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
      
      setTimeout(processPhotosWithFaces, 2000);
    }
  }, []);

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
          <PhotoGrid className="max-w-7xl mx-auto" searchQuery={searchQuery} />
        </div>
        <FloatingCart />
        <CartModal />
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-semibold">Photo Gallery</h1>
          
          <div className={cn(
            "flex items-center",
            isMobile ? "w-full mt-2 gap-2" : "gap-3"
          )}>
            <div className="relative flex-grow mr-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search photos..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
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
        
        <PhotoGrid searchQuery={searchQuery} />
        <PhotoViewer />
        <CartModal />
        <FloatingCart />
        
        <ColorCorrectionBar />
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
