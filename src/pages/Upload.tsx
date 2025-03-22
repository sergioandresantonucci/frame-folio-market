
import React from 'react';
import { PhotoProvider, usePhotoContext } from '@/context/PhotoContext';
import { Layout } from '@/components/ui/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, Image, FolderUp, X, Check, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
type FileWithPreview = File & { preview: string; id: string; progress: number; status: UploadStatus; error?: string };

const UploadContent: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [overallStatus, setOverallStatus] = useState<UploadStatus>('idle');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addPhotos } = usePhotoContext();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2),
        progress: 0,
        status: 'idle' as UploadStatus
      })
    );
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    }
  });

  const removeFile = (id: string) => {
    setFiles(files => {
      const fileToRemove = files.find(file => file.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return files.filter(file => file.id !== id);
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setOverallStatus('uploading');
    let completedFiles = 0;
    
    // Update all files to uploading status
    setFiles(prev => prev.map(file => ({...file, status: 'uploading' as UploadStatus})));
    
    // Simulate file upload with progress
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simulate upload for each file
      for (let progress = 0; progress <= 100; progress += 5) {
        await new Promise(resolve => setTimeout(resolve, 50));
        
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? {...f, progress} 
              : f
          )
        );
        
        // Update overall progress
        const currentTotalProgress = (completedFiles * 100 + progress) / files.length;
        setUploadProgress(currentTotalProgress);
      }
      
      // Mark file as complete
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? {...f, status: Math.random() > 0.9 ? 'error' : 'success', error: 'Upload failed'} 
            : f
        )
      );
      
      completedFiles++;
    }
    
    // Check if any files failed
    setFiles(prev => {
      const hasErrors = prev.some(file => file.status === 'error');
      setOverallStatus(hasErrors ? 'error' : 'success');
      return prev;
    });
    
    // Add successfully uploaded photos to context with the required properties
    const successfulUploads = files
      .filter(file => file.status === 'success')
      .map(file => ({
        id: file.id,
        src: file.preview,
        title: file.name,
        description: '',
        tags: [],
        uploadedAt: new Date().toISOString(),
        // Add the missing required properties from the Photo type
        price: 0,
        watermarked: false,
        selected: false
      }));
    
    if (successfulUploads.length > 0) {
      addPhotos(successfulUploads);
      
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${successfulUploads.length} of ${files.length} photos.`,
      });
      
      // Navigate to gallery after short delay
      setTimeout(() => {
        navigate('/gallery');
      }, 2000);
    }
  };

  return (
    <Layout showSidebar={false}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Upload Photos</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setFiles([])}
              disabled={files.length === 0 || overallStatus === 'uploading'}
            >
              Clear All
            </Button>
            
            <Button 
              onClick={uploadFiles}
              disabled={files.length === 0 || overallStatus === 'uploading'}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              {overallStatus === 'uploading' ? 'Uploading...' : 'Upload All'}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="upload">
          <TabsList>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Photos</CardTitle>
                <CardDescription>
                  Drag and drop your photos or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center gap-4">
                    <FolderUp className="h-12 w-12 text-gray-400" />
                    {isDragActive ? (
                      <p>Drop the photos here...</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Drag photos here or click to select</p>
                        <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF, WEBP</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Queue ({files.length} files)</CardTitle>
                  {overallStatus === 'uploading' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file) => (
                      <div key={file.id} className="relative border rounded-lg overflow-hidden group">
                        <div className="aspect-square relative">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="object-cover w-full h-full"
                            onLoad={() => { URL.revokeObjectURL(file.preview) }}
                          />
                          {file.status === 'uploading' && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="w-3/4">
                                <Progress value={file.progress} className="h-2" />
                                <p className="text-white text-xs mt-2 text-center">{file.progress}%</p>
                              </div>
                            </div>
                          )}
                          {file.status === 'success' && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="bg-green-500 rounded-full p-2">
                                <Check className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          )}
                          {file.status === 'error' && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="bg-red-500 rounded-full p-2">
                                <AlertCircle className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-2 text-sm truncate">{file.name}</div>
                        <button 
                          onClick={() => removeFile(file.id)}
                          className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={overallStatus === 'uploading'}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Upload Settings</CardTitle>
                <CardDescription>
                  Configure how your photos are processed during upload
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event">Event Name</Label>
                  <Input id="event" placeholder="Enter event name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resize">Resize Images</Label>
                  <select 
                    id="resize" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="none">No resizing</option>
                    <option value="large">Large (2048px)</option>
                    <option value="medium">Medium (1024px)</option>
                    <option value="small">Small (800px)</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="watermark" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="watermark">Apply watermark</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="metadata" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="metadata">Preserve EXIF metadata</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
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
