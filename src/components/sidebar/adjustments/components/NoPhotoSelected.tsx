
import React from 'react';
import { Sliders } from 'lucide-react';

export const NoPhotoSelected: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 h-[60vh] text-center">
      <div className="bg-gray-50 p-8 rounded-xl w-full">
        <Sliders className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Photo Selected</h3>
        <p className="text-sm text-gray-500 mb-6">
          Select a photo to start enhancing it with color adjustments.
        </p>
      </div>
    </div>
  );
};
