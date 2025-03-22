
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhotoContext, Photo } from '@/context/PhotoContext';
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
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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
    
    e.target.value = '';
  }, []);
  
  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);
  
  const handleUpload = useCallback(async () => {
    if (files.length === 0) {
      toast.warning("Seleziona delle foto da caricare");
      return;
    }
    
    if (!photographer) {
      toast.warning("Inserisci il nome del fotografo");
      return;
    }
    
    if (!eventDate) {
      toast.warning("Inserisci la data dell'evento");
      return;
    }
    
    setIsUploading(true);
    
    setFiles(prev => 
      prev.map(file => ({
        ...file,
        status: 'uploading'
      }))
    );
    
    const uploadPromises = files.map(async (fileItem) => {
      return new Promise<Photo>(async (resolve, reject) => {
        try {
          const fileExt = fileItem.file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `public/${fileName}`;
          
          // Update progress function
          const onProgress = (progress: { loaded: number; total: number }) => {
            setFiles(prev => 
              prev.map(f => f.id === fileItem.id 
                ? { ...f, progress: (progress.loaded / progress.total) * 100 } 
                : f
              )
            );
          };
          
          // Use XMLHttpRequest for progress tracking
          const uploadWithProgress = async () => {
            return new Promise<void>((resolveUpload, rejectUpload) => {
              const xhr = new XMLHttpRequest();
              
              xhr.upload.addEventListener('progress', onProgress);
              
              xhr.onreadystatechange = async function() {
                if (xhr.readyState === 4) {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    const options = {
                      cacheControl: '3600',
                      upsert: false
                    };
                    
                    // Now use the regular Supabase upload API
                    const { error: uploadError, data } = await supabase.storage
                      .from('photos')
                      .upload(filePath, fileItem.file, options);
                      
                    if (uploadError) {
                      rejectUpload(uploadError);
                    } else {
                      resolveUpload();
                    }
                  } else {
                    rejectUpload(new Error(`Upload failed with status: ${xhr.status}`));
                  }
                }
              };
              
              // Get the upload URL with a signed URL from Supabase
              supabase.storage.from('photos').createSignedUploadUrl(filePath)
                .then(({ data, error }) => {
                  if (error) {
                    rejectUpload(error);
                    return;
                  }
                  
                  const { signedUrl, token } = data;
                  
                  xhr.open('PUT', signedUrl);
                  xhr.setRequestHeader('Content-Type', fileItem.file.type);
                  xhr.send(fileItem.file);
                })
                .catch(rejectUpload);
            });
          };
          
          await uploadWithProgress();
          
          // Get the public URL for the uploaded file
          const { data: { publicUrl } } = supabase.storage
            .from('photos')
            .getPublicUrl(filePath);
          
          // Save photo information to the database
          const { error: dbError, data: photoData } = await supabase
            .from('photos')
            .insert({
              storage_path: filePath,
              thumbnail_path: filePath,
              title: fileItem.file.name,
              photographer,
              event_date: eventName || eventDate,
              price: 10,
              watermarked: true,
            })
            .select()
            .single();
            
          if (dbError) {
            setFiles(prev => 
              prev.map(f => f.id === fileItem.id ? { ...f, status: 'error' } : f)
            );
            reject(dbError);
            return;
          }
          
          setFiles(prev => 
            prev.map(f => f.id === fileItem.id ? { ...f, progress: 100, status: 'success' } : f)
          );
          
          const photo: Photo = {
            id: photoData.id,
            src: publicUrl,
            thumbnail: publicUrl,
            price: photoData.price || 10,
            watermarked: photoData.watermarked || true,
            selected: false,
            photographer: photoData.photographer,
            date: new Date().toISOString().split('T')[0],
            eventDate: photoData.event_date,
            name: fileItem.file.name
          };
          
          resolve(photo);
        } catch (error) {
          console.error("Upload error:", error);
          setFiles(prev => 
            prev.map(f => f.id === fileItem.id ? { ...f, status: 'error' } : f)
          );
          reject(error);
        }
      });
    });
    
    try {
      const uploadedPhotos = await Promise.all(uploadPromises);
      
      addPhotos(uploadedPhotos);
      
      toast.success(`${files.length} foto caricate con successo`);
      
      setTimeout(() => {
        navigate('/gallery');
      }, 1500);
    } catch (error) {
      console.error("Failed to upload photos:", error);
      toast.error("Si è verificato un errore durante il caricamento delle foto");
    } finally {
      setIsUploading(false);
    }
  }, [files, photographer, eventDate, eventName, addPhotos, navigate]);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Carica Foto</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="photographer">Fotografo</Label>
                <Input 
                  id="photographer" 
                  placeholder="Inserisci il nome del fotografo" 
                  value={photographer}
                  onChange={(e) => setPhotographer(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventDate">Data Evento</Label>
                <Input 
                  id="eventDate" 
                  type="date" 
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventName">Nome Evento</Label>
                <Input 
                  id="eventName" 
                  placeholder="Matrimonio, Compleanno, ecc." 
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              
              <div className="pt-4">
                <Button asChild className="w-full">
                  <label>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Seleziona Foto
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
              <h3 className="text-sm font-medium">Foto selezionate ({files.length})</h3>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFiles([])}
                  disabled={files.length === 0 || isUploading}
                >
                  Cancella tutto
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
                      Caricamento...
                    </>
                  ) : (
                    <>
                      Carica {files.length} Foto
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-md p-6 text-center">
                <ImagePlus className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">Nessuna foto selezionata</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Clicca su "Seleziona Foto" per scegliere le immagini da caricare
                </p>
                <Button asChild variant="outline" size="sm">
                  <label>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Seleziona Foto
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
  return <UploadContent />;
};

export default Upload;
