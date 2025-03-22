
import { toast } from 'sonner';

/**
 * Finds all photo elements in the DOM with the given ID
 */
export const findPhotoElements = (photoId: string): HTMLImageElement[] => {
  const elements: HTMLImageElement[] = [];
  
  try {
    // Find elements in the grid
    const gridContainer = document.querySelector(`[data-photo-id="${photoId}"]`);
    if (gridContainer) {
      const gridImage = gridContainer.querySelector('img');
      if (gridImage instanceof HTMLImageElement) {
        elements.push(gridImage);
        console.log("Found grid element for photo", photoId);
      }
    }
    
    // Find the image in the viewer - more specific selector for dialog content
    const viewerContainer = document.querySelector('div[role="dialog"]');
    if (viewerContainer) {
      const viewerImage = viewerContainer.querySelector('img');
      if (viewerImage instanceof HTMLImageElement) {
        elements.push(viewerImage);
        console.log("Found viewer element");
      }
    }
    
    if (elements.length === 0) {
      console.error("No photo elements found with ID:", photoId);
    } else {
      console.log(`Found ${elements.length} elements for photo ${photoId}`);
    }
  } catch (error) {
    console.error("Error finding photo elements:", error);
  }
  
  return elements;
};

/**
 * Applies a filter string to the photo elements
 */
export const applyFilterToElements = (photoId: string, filterString: string): boolean => {
  console.log(`Attempting to apply filter: ${filterString} to photo ${photoId}`);
  
  try {
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
      
      // Validate that the filter was actually applied
      setTimeout(() => {
        if (element.style.filter !== filterString.trim()) {
          console.warn(`Filter didn't apply correctly to element ${index}`);
        } else {
          console.log(`Filter successfully applied to element ${index}`);
        }
      }, 100);
    });
    
    return true;
  } catch (error) {
    console.error("Error applying filter:", error);
    toast.error("Errore nell'applicazione dei filtri");
    return false;
  }
};

/**
 * Saves the current filter in session storage
 */
export const saveFilterToStorage = (photoId: string, filterString: string): void => {
  try {
    console.log(`Saving filter to storage for photo ${photoId}:`, filterString);
    sessionStorage.setItem(`filter-${photoId}`, filterString);
  } catch (error) {
    console.error("Error saving filter to storage:", error);
  }
};

/**
 * Retrieves a stored filter from session storage
 */
export const getFilterFromStorage = (photoId: string): string | null => {
  try {
    const filter = sessionStorage.getItem(`filter-${photoId}`);
    console.log(`Retrieved filter from storage for photo ${photoId}:`, filter);
    return filter;
  } catch (error) {
    console.error("Error retrieving filter from storage:", error);
    return null;
  }
};

/**
 * Removes a filter from session storage
 */
export const removeFilterFromStorage = (photoId: string): void => {
  try {
    console.log(`Removing filter from storage for photo ${photoId}`);
    sessionStorage.removeItem(`filter-${photoId}`);
  } catch (error) {
    console.error("Error removing filter from storage:", error);
  }
};
