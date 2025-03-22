
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { PhotoContextType, Photo } from './types';
import { photoReducer, initialState } from './reducer';

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(photoReducer, initialState);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      dispatch({ type: 'SET_CONNECTED', payload: navigator.onLine });
      
      if (navigator.onLine && state.pendingUploads.length > 0) {
        // Simulate syncing pending uploads
        setTimeout(() => {
          dispatch({ type: 'SYNC_COMPLETED' });
          toast.success('All photos synchronized successfully');
        }, 2000);
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [state.pendingUploads.length]);

  const selectPhoto = (id: string) => dispatch({ type: 'SELECT_PHOTO', payload: id });
  const deselectPhoto = (id: string) => dispatch({ type: 'DESELECT_PHOTO', payload: id });
  const clearSelection = () => dispatch({ type: 'CLEAR_SELECTION' });
  const selectRange = (start: number, end: number) => 
    dispatch({ type: 'SELECT_RANGE', payload: { start, end } });
  const addPhotos = (photos: Photo[]) => dispatch({ type: 'ADD_PHOTOS', payload: photos });
  const removePhotos = (ids: string[]) => dispatch({ type: 'REMOVE_PHOTOS', payload: ids });
  const setPrice = (id: string, price: number) => 
    dispatch({ type: 'SET_PRICE', payload: { id, price } });
  const toggleWatermark = (id: string) => dispatch({ type: 'TOGGLE_WATERMARK', payload: id });
  const setFilters = (filters: Partial<typeof state.filters>) => 
    dispatch({ type: 'SET_FILTERS', payload: filters });
  const setActivePhoto = (id: string | null) => 
    dispatch({ type: 'SET_ACTIVE_PHOTO', payload: id });
  const setDisplayMode = (mode: typeof state.displayMode) => 
    dispatch({ type: 'SET_DISPLAY_MODE', payload: mode });
  const addFaceData = (photoId: string, faces: Photo['faces']) => 
    dispatch({ type: 'ADD_FACE_DATA', payload: { photoId, faces } });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const addToCart = (id: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: id });
    toast.success('Foto aggiunta al carrello');
  };
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    toast.info('Foto rimossa dal carrello');
  };
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const setPhotoName = (id: string, name: string) => 
    dispatch({ type: 'SET_PHOTO_NAME', payload: { id, name } });

  const getCartTotal = () => {
    return state.cartItems.reduce((total, id) => {
      const photo = state.photos.find(p => p.id === id);
      return total + (photo ? photo.price : 0);
    }, 0);
  };

  return (
    <PhotoContext.Provider
      value={{
        state,
        dispatch,
        selectPhoto,
        deselectPhoto,
        selectRange,
        clearSelection,
        addPhotos,
        removePhotos,
        setPrice,
        toggleWatermark,
        setFilters,
        setActivePhoto,
        setDisplayMode,
        addFaceData,
        toggleCart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        setPhotoName
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotoContext = () => {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhotoContext must be used within a PhotoProvider');
  }
  return context;
};
