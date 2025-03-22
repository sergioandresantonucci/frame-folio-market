
import { useState } from 'react';

export const useAdjustmentHistory = () => {
  // History for undo functionality
  const [history, setHistory] = useState<{[key: string]: string}>({});
  
  /**
   * Saves the current filter for a photo to history
   */
  const saveToHistory = (photoId: string, filterValue: string) => {
    setHistory(prev => ({
      ...prev,
      [photoId]: filterValue
    }));
  };
  
  /**
   * Gets a previous filter for a photo from history
   */
  const getFromHistory = (photoId: string): string | undefined => {
    return history[photoId];
  };
  
  /**
   * Removes an entry from history
   */
  const removeFromHistory = (photoId: string) => {
    setHistory(prev => {
      const newHistory = {...prev};
      delete newHistory[photoId];
      return newHistory;
    });
  };
  
  /**
   * Checks if there's a history entry for a photo
   */
  const hasHistoryFor = (photoId: string): boolean => {
    return !!history[photoId];
  };
  
  return {
    saveToHistory,
    getFromHistory,
    removeFromHistory,
    hasHistoryFor
  };
};
