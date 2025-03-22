
import { toast } from 'sonner';

// Cache for DOM elements to avoid repeated queries
const elementCache: Record<string, HTMLImageElement[]> = {};

/**
 * Finds all photo elements in the DOM with the given ID
 * With performance optimization through caching and more specific selectors
 */
export const findPhotoElements = (photoId: string): HTMLImageElement[] => {
  // Check cache first
  if (elementCache[photoId]?.length) {
    return elementCache[photoId];
  }

  const elements: HTMLImageElement[] = [];
  
  try {
    // Find elements in the grid with more specific selectors
    const gridContainer = document.querySelector(`[data-photo-id="${photoId}"]`);
    if (gridContainer) {
      const gridImage = gridContainer.querySelector('img');
      if (gridImage instanceof HTMLImageElement) {
        elements.push(gridImage);
        console.log("Found grid element for photo", photoId);
      }
    }
    
    // Find the image in the viewer with more specific selection
    const viewerContainer = document.querySelector('div[role="dialog"]');
    if (viewerContainer) {
      // Using a more specific path to the image in the dialog
      const viewerImage = viewerContainer.querySelector('.max-h-full.max-w-full');
      if (viewerImage instanceof HTMLImageElement) {
        elements.push(viewerImage);
        console.log("Found viewer element");
      }
    }
    
    if (elements.length === 0) {
      console.warn("No photo elements found with ID:", photoId);
      return [];
    } else {
      console.log(`Found ${elements.length} elements for photo ${photoId}`);
      // Update cache
      elementCache[photoId] = elements;
    }
  } catch (error) {
    console.error("Error finding photo elements:", error);
  }
  
  return elements;
};

/**
 * Clears the element cache for a specific photo or all photos
 */
export const clearElementCache = (photoId?: string): void => {
  if (photoId) {
    delete elementCache[photoId];
  } else {
    // Clear all cache
    for (const key in elementCache) {
      delete elementCache[key];
    }
  }
};

/**
 * Applies a filter string to the photo elements with performance optimization
 */
export const applyFilterToElements = (photoId: string, filterString: string): boolean => {
  console.log(`Applying filter: ${filterString} to photo ${photoId}`);
  
  try {
    const elements = findPhotoElements(photoId);
    
    if (elements.length === 0) {
      // Don't show error toast for normal operation flows
      // This can happen during normal component mounting/unmounting
      console.warn(`Cannot find any photo elements with ID: ${photoId}`);
      return false;
    }
    
    // Use requestAnimationFrame for smooth filter application
    requestAnimationFrame(() => {
      // Apply filter to all found elements
      elements.forEach((element, index) => {
        // Only update if the filter value has changed
        if (element.style.filter !== filterString.trim()) {
          element.style.filter = filterString.trim();
          console.log(`Applied filter to element ${index}:`, filterString);
        }
      });
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
    // Also clear element cache when removing filter
    clearElementCache(photoId);
  } catch (error) {
    console.error("Error removing filter from storage:", error);
  }
};
