
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

export type PhotoState = {
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

export type PhotoAction =
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

export type PhotoContextType = {
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
