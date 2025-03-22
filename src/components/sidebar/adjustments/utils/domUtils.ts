
// Store of element caches for efficient dom manipulation
const elementCacheByPhotoId: Record<string, HTMLElement[]> = {};

/**
 * Clears the element cache for a specific photo ID or all photos if no ID is provided
 */
export const clearElementCache = (photoId?: string): void => {
  if (photoId) {
    delete elementCacheByPhotoId[photoId];
  } else {
    // Clear all caches
    Object.keys(elementCacheByPhotoId).forEach(key => {
      delete elementCacheByPhotoId[key];
    });
  }
};

/**
 * Finds all relevant photo elements in the DOM that need filters applied
 */
const findPhotoElements = (photoId: string): HTMLElement[] => {
  // Check if we already have these elements cached
  if (elementCacheByPhotoId[photoId]) {
    return elementCacheByPhotoId[photoId];
  }
  
  // Find all elements with the given photo ID
  const elements: HTMLElement[] = [];
  
  // Main image in the viewer modal
  const viewerImage = document.querySelector(`.photo-viewer[data-photo-id="${photoId}"] img`) as HTMLElement;
  if (viewerImage) {
    elements.push(viewerImage);
  }
  
  // Thumbnail in the grid
  const thumbnailEls = document.querySelectorAll(`.photo-grid-item[data-photo-id="${photoId}"] img, .photo-card[data-id="${photoId}"] img`) as NodeListOf<HTMLElement>;
  if (thumbnailEls.length > 0) {
    thumbnailEls.forEach(el => elements.push(el));
  }
  
  // Selected photo in the floating toolbar
  const selectedEl = document.querySelectorAll(`.selected-photo[data-id="${photoId}"] img`) as NodeListOf<HTMLElement>;
  if (selectedEl.length > 0) {
    selectedEl.forEach(el => elements.push(el));
  }
  
  // Store these elements in cache for future use
  if (elements.length > 0) {
    elementCacheByPhotoId[photoId] = elements;
  }
  
  console.log(`Found ${elements.length} elements for photo ${photoId}`);
  return elements;
};

/**
 * Applies a CSS filter string to all elements for a specific photo
 */
export const applyFilterToElements = (photoId: string, filterString: string): boolean => {
  // Find all elements for this photo
  const elements = findPhotoElements(photoId);
  
  // If no elements found, return false
  if (elements.length === 0) {
    console.warn(`No elements found for photo ${photoId}`);
    return false;
  }
  
  // Apply the filter to each element
  elements.forEach(el => {
    el.style.filter = filterString;
  });
  
  console.log(`Applied filter "${filterString}" to ${elements.length} elements for photo ${photoId}`);
  return true;
};

// Session storage key prefix for filters
const FILTER_STORAGE_PREFIX = 'photo_filter_';

/**
 * Saves a filter string to session storage for a specific photo
 */
export const saveFilterToStorage = (photoId: string, filterString: string): void => {
  sessionStorage.setItem(`${FILTER_STORAGE_PREFIX}${photoId}`, filterString);
};

/**
 * Gets a stored filter string from session storage for a specific photo
 */
export const getFilterFromStorage = (photoId: string): string | null => {
  return sessionStorage.getItem(`${FILTER_STORAGE_PREFIX}${photoId}`);
};

/**
 * Removes a stored filter from session storage for a specific photo
 */
export const removeFilterFromStorage = (photoId: string): void => {
  sessionStorage.removeItem(`${FILTER_STORAGE_PREFIX}${photoId}`);
};

/**
 * Restores filters for all photos currently visible in the DOM
 * This is useful after a page reload or when photos get re-rendered
 */
export const restoreAllFilters = (): void => {
  // Find all photo elements in the gallery
  const photoElements = document.querySelectorAll('[data-photo-id]');
  
  photoElements.forEach(el => {
    const photoId = el.getAttribute('data-photo-id');
    if (!photoId) return;
    
    const filterString = getFilterFromStorage(photoId);
    if (filterString) {
      applyFilterToElements(photoId, filterString);
    }
  });
};

// Automatically restore filters when the DOM is fully loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(restoreAllFilters, 500); // Add a small delay to ensure all elements are rendered
  });
}
