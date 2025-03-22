
// Simulated face detection module - DISABLED
// In a real implementation, this would use a library like face-api.js or tensorflow.js

export interface FaceDetectionResult {
  faces: Array<{
    id: string;
    bbox: [number, number, number, number]; // [x, y, width, height] normalized coordinates (0-1)
    confidence: number;
  }>;
  imageWidth: number;
  imageHeight: number;
}

/**
 * Detect faces in an image - Currently disabled
 * @param imageUrl URL of the image to process
 * @param minConfidence Minimum confidence threshold (0-1)
 */
export const detectFaces = async (
  imageUrl: string,
  minConfidence: number = 0.7
): Promise<FaceDetectionResult> => {
  console.log('Face detection has been disabled');
  
  // Return empty result since we've disabled face detection
  return {
    faces: [],
    imageWidth: 800,
    imageHeight: 600
  };
};

/**
 * Process a batch of images for face detection - Currently disabled
 * @param imageUrls List of image URLs to process
 * @param progressCallback Callback for progress updates
 */
export const batchDetectFaces = async (
  imageUrls: string[],
  progressCallback?: (processed: number, total: number) => void
): Promise<Map<string, FaceDetectionResult>> => {
  console.log('Batch face detection has been disabled');
  const results = new Map<string, FaceDetectionResult>();
  
  // Process to satisfy the interface, but don't perform actual detection
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    results.set(url, {
      faces: [],
      imageWidth: 800,
      imageHeight: 600
    });
    
    if (progressCallback) {
      progressCallback(i + 1, imageUrls.length);
    }
  }
  
  return results;
};
