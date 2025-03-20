
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoProvider, usePhotoContext, Photo } from '@/context/PhotoContext';
import { Layout } from '@/components/ui/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload as UploadIcon, ImagePlus, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Helper function to generate a unique ID
const generateId = () => `photo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

interface UploadPreviewProps {
  file: File;
  onRemove: () => void;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
}

const UploadPreview: React.FC<UploadPreviewProps> = ({ file, onRemove, uploadProgress, status }) => {
  const [preview, setPreview] = useState<string | null>(null);
  
  React.useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    return () => {
      reader.abort();
    };
  }, [file]);
  
  return (
    <Card className="overflow-hidden relative group">
      <div className="aspect-square bg-gray-100 relative">
        {preview ? (
          <img 
            src={preview} 
            alt={file.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImagePlus className="h-12 w-12 text-gray-300" />
          </div>
        )}
        
        <Button 
          variant="destructive" 
          size="icon" 
          className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
        
        {status === 'uploading' && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <span className="text-sm font-medium">Uploading...</span>
            <Progress value={uploadProgress} className="w-full mt-2" />
          </div>
        )}
        
        {status === 'success' && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-500 border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              Uploaded
            </Badge>
          </div>
        )}
        
        {status === 'error' && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-500 border-0">
              <AlertCircle className="h-3 w-3 mr-1" />
              Failed
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <div className="text-xs font-medium truncate" title={file.name}>
          {file.name}
        </div>
        <div className="text-xs text-gray-500">
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </div>
      </CardContent>
    </Card>
  );
};

type UploadFile = {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
};

const UploadContent: React.FC = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [photographer, setPhotographer] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [eventName, setEventName] = useState<string>('');
  const { addPhotos } = usePhotoContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleFilesSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      id: generateId(),
      progress: 0,
      status: 'pending' as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  }, []);
  
  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);
  
  const handleUpload = useCallback(async () => {
    if (files.length === 0) {
      toast.warning("Please select files to upload");
      return;
    }
    
    if (!photographer) {
      toast.warning("Please enter photographer name");
      return;
    }
    
    if (!eventDate) {
      toast.warning("Please enter event date");
      return;
    }
    
    setIsUploading(true);
    
    // Mark all files as uploading
    setFiles(prev => 
      prev.map(file => ({
        ...file,
        status: 'uploading'
      }))
    );
    
    // Simulate upload process for each file
    const uploadPromises = files.map(async (fileItem) => {
      return new Promise<Photo>((resolve) => {
        let progress = 0;
        
        // Simulate progress updates
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Create a photo object from the file
            const reader = new FileReader();
            reader.onloadend = () => {
              // Update file status to success
              setFiles(prev => 
                prev.map(f => f.id === fileItem.id ? { ...f, progress: 100, status: 'success' } : f)
              );
              
              // Create the photo object
              const photo: Photo = {
                id: fileItem.id,
                src: reader.result as string,
                thumbnail: reader.result as string,
                price: 10, // Default price
                watermarked: true, // Default with watermark
                selected: false,
                photographer,
                date: new Date().toISOString().split('T')[0],
                eventDate: eventName || eventDate,
              };
              
              resolve(photo);
            };
            
            reader.readAsDataURL(fileItem.file);
          } else {
            // Update progress
            setFiles(prev => 
              prev.map(f => f.id === fileItem.id ? { ...f, progress } : f)
            );
          }
        }, 200);
      });
    });
    
    try {
      // Wait for all uploads to complete
      const uploadedPhotos = await Promise.all(uploadPromises);
      
      // Add all uploaded photos to context
      addPhotos(uploadedPhotos);
      
      toast.success(`Successfully uploaded ${files.length} photos`);
      
      // Navigate to gallery after a short delay
      setTimeout(() => {
        navigate('/gallery');
      }, 1500);
    } catch (error) {
      toast.error("Failed to upload some photos");
    } finally {
      setIsUploading(false);
    }
  }, [files, photographer, eventDate, eventName, addPhotos, navigate]);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Upload Photos</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="photographer">Photographer</Label>
                <Input 
                  id="photographer" 
                  placeholder="Enter photographer name" 
                  value={photographer}
                  onChange={(e) => setPhotographer(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input 
                  id="eventDate" 
                  type="date" 
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input 
                  id="eventName" 
                  placeholder="Wedding, Birthday, etc." 
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              
              <div className="pt-4">
                <Button asChild className="w-full">
                  <label>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Select Photos
                    <Input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleFilesSelected} 
                    />
                  </label>
                </Button>
              </div>
            </div>
          </Card>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Selected Photos ({files.length})</h3>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFiles([])}
                  disabled={files.length === 0 || isUploading}
                >
                  Clear All
                </Button>
                
                <Button 
                  size="sm"
                  className="bg-magenta hover:bg-magenta/90"
                  onClick={handleUpload}
                  disabled={files.length === 0 || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      Upload {files.length} Photos
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-md p-6 text-center">
                <ImagePlus className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No photos selected</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Click the "Select Photos" button to choose images for upload
                </p>
                <Button asChild variant="outline" size="sm">
                  <label>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Select Photos
                    <Input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleFilesSelected} 
                    />
                  </label>
                </Button>
              </div>
            ) : (
              <div className={cn(
                "grid gap-4 max-h-[500px] overflow-y-auto pr-2",
                isMobile ? "grid-cols-2" : "grid-cols-3"
              )}>
                {files.map((fileItem) => (
                  <UploadPreview
                    key={fileItem.id}
                    file={fileItem.file}
                    onRemove={() => handleRemoveFile(fileItem.id)}
                    uploadProgress={fileItem.progress}
                    status={fileItem.status}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Upload: React.FC = () => {
  return (
    <PhotoProvider>
      <UploadContent />
    </PhotoProvider>
  );
};

export default Upload;
