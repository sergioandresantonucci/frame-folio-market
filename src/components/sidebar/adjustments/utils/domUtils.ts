
import { toast } from 'sonner';

/**
 * Finds all photo elements in the DOM with the given ID
 */
export const findPhotoElements = (photoId: string): HTMLImageElement[] => {
  const elements: HTMLImageElement[] = [];
  
  // Find elements in the grid
  const gridElement = document.querySelector(`[data-photo-id="${photoId}"] img`) as HTMLImageElement;
  if (gridElement) {
    elements.push(gridElement);
    console.log("Found grid element for photo", photoId);
  }
  
  // Find the image in the viewer
  const viewerElement = document.querySelector(`.photo-viewer-image`) as HTMLImageElement;
  if (viewerElement) {
    elements.push(viewerElement);
    console.log("Found viewer element");
  }
  
  if (elements.length === 0) {
    console.error("No photo elements found with ID:", photoId);
  } else {
    console.log(`Found ${elements.length} elements for photo ${photoId}`);
  }
  
  return elements;
};

/**
 * Applies a filter string to the photo elements
 */
export const applyFilterToElements = (photoId: string, filterString: string): boolean => {
  console.log(`Attempting to apply filter: ${filterString} to photo ${photoId}`);
  
  const elements = findPhotoElements(photoId);
  
  if (elements.length === 0) {
    console.error(`Cannot find any photo elements with ID: ${photoId}`);
    toast.error("Impossibile trovare l'elemento foto selezionato");
    return false;
  }
  
  // Apply filter to all found elements
  elements.forEach((element, index) => {
    console.log(`Applying filter to element ${index}:`, filterString);
    element.style.filter = filterString.trim();
  });
  
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
