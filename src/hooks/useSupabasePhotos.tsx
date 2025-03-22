
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Photo } from '@/context/PhotoContext';
import { toast } from 'sonner';

export function useSupabasePhotos() {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPhotos() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedPhotos: Photo[] = data.map(photo => {
            // Get public URLs for the photos
            const { data: { publicUrl } } = supabase.storage
              .from('photos')
              .getPublicUrl(photo.storage_path);
              
            const { data: { publicUrl: thumbnailUrl } } = supabase.storage
              .from('photos')
              .getPublicUrl(photo.thumbnail_path || photo.storage_path);
              
            return {
              id: photo.id,
              src: publicUrl,
              thumbnail: thumbnailUrl,
              price: photo.price || 10,
              watermarked: photo.watermarked || true,
              selected: false,
              photographer: photo.photographer,
              date: photo.created_at ? new Date(photo.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              eventDate: photo.event_date,
              name: photo.title
            };
          });
          
          setPhotos(formattedPhotos);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        toast.error("Errore nel caricamento delle foto");
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, [user]);

  return { photos, loading };
}
