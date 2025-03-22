
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sliders, CircleDollarSign, Image, ScanFace } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarTabType } from './Sidebar';

interface TabButtonsGroupProps {
  activeTab: SidebarTabType;
  setActiveTab: (tab: SidebarTabType) => void;
}

export const TabButtonsGroup: React.FC<TabButtonsGroupProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex flex-wrap gap-2",
      isMobile && "flex-col"
    )}>
      <Button 
        variant={activeTab === 'filters' ? 'default' : 'outline'} 
        size={isMobile ? "sm" : "icon"}
        className={cn(
          isMobile ? "w-full justify-start" : "h-10 w-10",
          activeTab === 'filters' && "bg-magenta hover:bg-magenta/90"
        )}
        onClick={() => setActiveTab('filters')}
      >
        <Sliders className="h-5 w-5 mr-2" />
        {isMobile && "Filters"}
      </Button>

      <Button 
        variant={activeTab === 'pricing' ? 'default' : 'outline'} 
        size={isMobile ? "sm" : "icon"}
        className={cn(
          isMobile ? "w-full justify-start" : "h-10 w-10",
          activeTab === 'pricing' && "bg-magenta hover:bg-magenta/90"
        )}
        onClick={() => setActiveTab('pricing')}
      >
        <CircleDollarSign className="h-5 w-5 mr-2" />
        {isMobile && "Pricing"}
      </Button>

      <Button 
        variant={activeTab === 'watermark' ? 'default' : 'outline'} 
        size={isMobile ? "sm" : "icon"}
        className={cn(
          isMobile ? "w-full justify-start" : "h-10 w-10",
          activeTab === 'watermark' && "bg-magenta hover:bg-magenta/90"
        )}
        onClick={() => setActiveTab('watermark')}
      >
        <Image className="h-5 w-5 mr-2" />
        {isMobile && "Watermark"}
      </Button>

      <Button 
        variant={activeTab === 'face' ? 'default' : 'outline'} 
        size={isMobile ? "sm" : "icon"}
        className={cn(
          isMobile ? "w-full justify-start" : "h-10 w-10",
          activeTab === 'face' && "bg-magenta hover:bg-magenta/90"
        )}
        onClick={() => setActiveTab('face')}
      >
        <ScanFace className="h-5 w-5 mr-2" />
        {isMobile && "Face Detection"}
      </Button>
    </div>
  );
};
