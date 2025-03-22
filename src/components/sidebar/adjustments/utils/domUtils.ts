
import { toast } from 'sonner';

/**
 * Finds the photo element in the DOM, either in grid or viewer
 */
export const findPhotoElement = (photoId: string): HTMLImageElement | null => {
  // Use document.querySelector to find the image element
  const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
  
  // If we can't find the element in the grid, try to find it in the viewer
  const viewerPhotoElement = document.querySelector(`.photo-viewer-image`) as HTMLImageElement;
  
  // Use either the grid element or the viewer element
  return photoElement || viewerPhotoElement || null;
};

/**
 * Applies a filter string to the photo elements
 */
export const applyFilterToElements = (photoId: string, filterString: string): boolean => {
  const photoElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
  const viewerPhotoElement = document.querySelector(`.photo-viewer-image`) as HTMLImageElement;
  
  let applied = false;
  
  if (photoElement) {
    photoElement.style.filter = filterString.trim();
    applied = true;
    console.log("Applied filter to grid photo:", filterString);
  }
  
  if (viewerPhotoElement) {
    viewerPhotoElement.style.filter = filterString.trim();
    applied = true;
    console.log("Applied filter to viewer photo:", filterString);
  }
  
  if (!applied) {
    console.error("Cannot find photo element with ID:", photoId);
    toast.error("Impossibile trovare l'elemento foto selezionato");
    return false;
  }
  
  return true;
};

/**
 * Saves the current filter in session storage
 */
export const saveFilterToStorage = (photoId: string, filterString: string): void => {
  sessionStorage.setItem(`filter-${photoId}`, filterString);
};

/**
 * Retrieves a stored filter from session storage
 */
export const getFilterFromStorage = (photoId: string): string | null => {
  return sessionStorage.getItem(`filter-${photoId}`);
};

/**
 * Removes a filter from session storage
 */
export const removeFilterFromStorage = (photoId: string): void => {
  sessionStorage.removeItem(`filter-${photoId}`);
};
