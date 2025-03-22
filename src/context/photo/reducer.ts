
import { PhotoState, PhotoAction } from './types';

export const initialState: PhotoState = {
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

export const photoReducer = (state: PhotoState, action: PhotoAction): PhotoState => {
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
