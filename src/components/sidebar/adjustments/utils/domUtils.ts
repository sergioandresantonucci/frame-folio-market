
import { toast } from 'sonner';

/**
 * Finds the photo element in the DOM, either in grid or viewer
 */
export const findPhotoElement = (photoId: string): HTMLImageElement | null => {
  // Look for the image in the grid
  const gridElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
  
  // Look for the image in the viewer
  const viewerElement = document.querySelector(`.photo-viewer-image`) as HTMLImageElement;
  
  console.log(`Looking for photo elements: Grid=${!!gridElement}, Viewer=${!!viewerElement}`);
  
  return gridElement || viewerElement || null;
};

/**
 * Applies a filter string to the photo elements
 */
export const applyFilterToElements = (photoId: string, filterString: string): boolean => {
  console.log(`Attempting to apply filter: ${filterString} to photo ${photoId}`);
  
  // Get all related elements that need the filter
  const gridElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
  const viewerElement = document.querySelector(`.photo-viewer-image`) as HTMLImageElement;
  
  let applied = false;
  
  if (gridElement) {
    console.log("Applying filter to grid element:", gridElement);
    gridElement.style.filter = filterString.trim();
    applied = true;
  }
  
  if (viewerElement) {
    console.log("Applying filter to viewer element:", viewerElement);
    viewerElement.style.filter = filterString.trim();
    applied = true;
  }
  
  if (!applied) {
    console.error("Cannot find any photo elements with ID:", photoId);
    toast.error("Impossibile trovare l'elemento foto selezionato");
    return false;
  }
  
  return true;
};

/**
 * Saves the current filter in session storage
 */
export const saveFilterToStorage = (photoId: string, filterString: string): void => {
  console.log(`Saving filter to storage for photo ${photoId}:`, filterString);
  sessionStorage.setItem(`filter-${photoId}`, filterString);
};

/**
 * Retrieves a stored filter from session storage
 */
export const getFilterFromStorage = (photoId: string): string | null => {
  const filter = sessionStorage.getItem(`filter-${photoId}`);
  console.log(`Retrieved filter from storage for photo ${photoId}:`, filter);
  return filter;
};

/**
 * Removes a filter from session storage
 */
export const removeFilterFromStorage = (photoId: string): void => {
  console.log(`Removing filter from storage for photo ${photoId}`);
  sessionStorage.removeItem(`filter-${photoId}`);
};
