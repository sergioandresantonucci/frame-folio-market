
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { usePhotoContext } from '@/context/PhotoContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { TabButtonsGroup } from './TabButtonsGroup';
import { FiltersTab } from './FiltersTab';
import { AdjustmentsTab } from './AdjustmentsTab';
import { PricingTab } from './PricingTab';
import { WatermarkTab } from './WatermarkTab';
import { FaceDetectionTab } from './FaceDetectionTab';

export type SidebarTabType = 'filters' | 'adjustments' | 'pricing' | 'watermark' | 'face';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTabType>('filters');
  const { state } = usePhotoContext();
  
  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] flex flex-col border-r border-gray-100 bg-white transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-96" // Increased from w-80 to w-96
      )}
    >
      <div className="flex items-center justify-between p-4 h-14 border-b border-gray-100">
        {!collapsed && <h2 className="text-sm font-medium">Tools</h2>}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleCollapse}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto p-3 space-y-3">
        <TabButtonsGroup activeTab={activeTab} setActiveTab={setActiveTab} />

        {!collapsed && (
          <>
            <Separator className="my-4" />

            {activeTab === 'filters' && <FiltersTab />}
            {activeTab === 'adjustments' && <AdjustmentsTab />}
            {activeTab === 'pricing' && <PricingTab />}
            {activeTab === 'watermark' && <WatermarkTab />}
            {activeTab === 'face' && <FaceDetectionTab />}
          </>
        )}
      </div>

      {!collapsed && state.lastSyncTime && (
        <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
          Last sync: {format(new Date(state.lastSyncTime), 'dd MMM yyyy, HH:mm')}
        </div>
      )}
    </aside>
  );
};
