
import { NoPhotoSelected } from './adjustments/components/NoPhotoSelected';
import { usePhotoContext } from '@/context/PhotoContext';

export const AdjustmentsTab = () => {
  const { state } = usePhotoContext();
  
  // Check if there's an active photo directly from the context
  const photoSelected = Boolean(state.activePhoto);

  if (!photoSelected) {
    return <NoPhotoSelected />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-6 text-center">
        <p className="text-gray-500">
          Color correction functionality has been moved to a floating toolbar that appears when photos are selected.
        </p>
        <p className="text-gray-500 mt-4">
          Try selecting one or more photos to access the color adjustment tools.
        </p>
      </div>
    </div>
  );
};

// Export the clearElementCache function from domUtils
export { clearElementCache } from './adjustments/utils/domUtils';
