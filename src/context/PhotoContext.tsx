import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type Photo = {
  id: string;
  src: string;
  thumbnail?: string;
  price: number;
  watermarked: boolean;
  originalSrc?: string;
  selected: boolean;
  photographer?: string;
  date?: string;
  eventDate?: string;
  faces?: { id: string; bbox: [number, number, number, number] }[];
  metadata?: Record<string, any>;
  name?: string;
};

type PhotoState = {
  photos: Photo[];
  selectedIds: string[];
  isSelecting: boolean;
  startSelectionIndex: number | null;
  filters: {
    photographer: string | null;
    eventDate: string | null;
    date: string | null;
    hasFace: boolean | null;
    numberRange: { from: number; to: number | null } | null;
  };
  isConnected: boolean;
  pendingUploads: Photo[];
  activePhoto: Photo | null;
  displayMode: 'grid' | 'client';
  lastSyncTime: string | null;
  cartOpen: boolean;
  cartItems: string[];
};

type PhotoAction =
  | { type: 'ADD_PHOTOS'; payload: Photo[] }
  | { type: 'REMOVE_PHOTOS'; payload: string[] }
  | { type: 'SELECT_PHOTO'; payload: string }
  | { type: 'DESELECT_PHOTO'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SELECT_RANGE'; payload: { start: number; end: number } }
  | { type: 'SET_PRICE'; payload: { id: string; price: number } }
  | { type: 'TOGGLE_WATERMARK'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<PhotoState['filters']> }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SYNC_COMPLETED' }
  | { type: 'SET_ACTIVE_PHOTO'; payload: string | null }
  | { type: 'SET_DISPLAY_MODE'; payload: PhotoState['displayMode'] }
  | { type: 'ADD_FACE_DATA'; payload: { photoId: string; faces: Photo['faces'] } }
  | { type: 'TOGGLE_CART' }
  | { type: 'ADD_TO_CART'; payload: string }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_PHOTO_NAME'; payload: { id: string; name: string } };

type PhotoContextType = {
  state: PhotoState;
  dispatch: React.Dispatch<PhotoAction>;
  selectPhoto: (id: string) => void;
  deselectPhoto: (id: string) => void;
  selectRange: (startIndex: number, endIndex: number) => void;
  clearSelection: () => void;
  addPhotos: (photos: Photo[]) => void;
  removePhotos: (ids: string[]) => void;
  setPrice: (id: string, price: number) => void;
  toggleWatermark: (id: string) => void;
  setFilters: (filters: Partial<PhotoState['filters']>) => void;
  setActivePhoto: (id: string | null) => void;
  setDisplayMode: (mode: PhotoState['displayMode']) => void;
  addFaceData: (photoId: string, faces: Photo['faces']) => void;
  toggleCart: () => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  setPhotoName: (id: string, name: string) => void;
};

const initialState: PhotoState = {
  photos: [],
  selectedIds: [],
  isSelecting: false,
  startSelectionIndex: null,
  filters: {
    photographer: null,
    eventDate: null,
    date: null,
    hasFace: null,
    numberRange: null,
  },
  isConnected: navigator.onLine,
  pendingUploads: [],
  activePhoto: null,
  displayMode: 'grid',
  lastSyncTime: null,
  cartOpen: false,
  cartItems: [],
};

const photoReducer = (state: PhotoState, action: PhotoAction): PhotoState => {
  switch (action.type) {
    case 'ADD_PHOTOS':
      return {
        ...state,
        photos: [...state.photos, ...action.payload],
      };
    case 'REMOVE_PHOTOS':
      return {
        ...state,
        photos: state.photos.filter(photo => !action.payload.includes(photo.id)),
        selectedIds: state.selectedIds.filter(id => !action.payload.includes(id)),
        cartItems: state.cartItems.filter(id => !action.payload.includes(id)),
      };
    case 'SELECT_PHOTO':
      return {
        ...state,
        selectedIds: [...state.selectedIds, action.payload],
      };
    case 'DESELECT_PHOTO':
      return {
        ...state,
        selectedIds: state.selectedIds.filter(id => id !== action.payload),
      };
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedIds: [],
        startSelectionIndex: null,
      };
    case 'SELECT_RANGE':
      const { start, end } = action.payload;
      const idsInRange = state.photos
        .slice(Math.min(start, end), Math.max(start, end) + 1)
        .map(photo => photo.id);
      return {
        ...state,
        selectedIds: [...new Set([...state.selectedIds, ...idsInRange])],
      };
    case 'SET_PRICE':
      return {
        ...state,
        photos: state.photos.map(photo =>
          photo.id === action.payload.id ? { ...photo, price: action.payload.price } : photo
        ),
      };
    case 'TOGGLE_WATERMARK':
      return {
        ...state,
        photos: state.photos.map(photo =>
          photo.id === action.payload ? { ...photo, watermarked: !photo.watermarked } : photo
        ),
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'SYNC_COMPLETED':
      return {
        ...state,
        pendingUploads: [],
        lastSyncTime: new Date().toISOString(),
      };
    case 'SET_ACTIVE_PHOTO':
      const activePhoto = action.payload 
        ? state.photos.find(p => p.id === action.payload) || null
        : null;
      return {
        ...state,
        activePhoto,
      };
    case 'SET_DISPLAY_MODE':
      return {
        ...state,
        displayMode: action.payload,
      };
    case 'ADD_FACE_DATA':
      return {
        ...state,
        photos: state.photos.map(photo =>
          photo.id === action.payload.photoId ? { ...photo, faces: action.payload.faces } : photo
        ),
      };
    case 'TOGGLE_CART':
      return {
        ...state,
        cartOpen: !state.cartOpen,
      };
    case 'ADD_TO_CART':
      if (state.cartItems.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(id => id !== action.payload),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };
    case 'SET_PHOTO_NAME':
      return {
        ...state,
        photos: state.photos.map(photo =>
          photo.id === action.payload.id ? { ...photo, name: action.payload.name } : photo
        ),
      };
    default:
      return state;
  }
};

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
  const setFilters = (filters: Partial<PhotoState['filters']>) => 
    dispatch({ type: 'SET_FILTERS', payload: filters });
  const setActivePhoto = (id: string | null) => 
    dispatch({ type: 'SET_ACTIVE_PHOTO', payload: id });
  const setDisplayMode = (mode: PhotoState['displayMode']) => 
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
