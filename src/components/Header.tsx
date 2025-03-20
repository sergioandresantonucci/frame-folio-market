
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Laptop, 
  Upload, 
  UserCircle, 
  Image,
  Monitor,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePhotoContext } from '@/context/PhotoContext';
import { toast } from 'sonner';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { state, setDisplayMode } = usePhotoContext();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleClientViewToggle = () => {
    if (state.displayMode === 'grid') {
      setDisplayMode('client');
      if (window.screenLeft !== undefined) {
        // Attempt to detect multiple screens
        toast.info('Client view mode activated. Drag to secondary screen if available.');
      }
    } else {
      setDisplayMode('grid');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Image className="h-8 w-8 text-magenta" />
              <span className="font-semibold text-xl tracking-tight">
                Photo<span className="text-magenta">Manager</span>
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-magenta",
                isActive('/') && "text-magenta"
              )}
            >
              Dashboard
            </Link>
            <Link 
              to="/gallery"
              className={cn(
                "text-sm font-medium transition-colors hover:text-magenta",
                isActive('/gallery') && "text-magenta"
              )}
            >
              Gallery
            </Link>
            <Link 
              to="/events"
              className={cn(
                "text-sm font-medium transition-colors hover:text-magenta",
                isActive('/events') && "text-magenta"
              )}
            >
              Events
            </Link>
            <Link 
              to="/analytics"
              className={cn(
                "text-sm font-medium transition-colors hover:text-magenta",
                isActive('/analytics') && "text-magenta"
              )}
            >
              Analytics
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            {!state.isConnected && (
              <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Offline
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleClientViewToggle}
              className={cn(
                "hidden md:flex",
                state.displayMode === 'client' && "bg-light-blue/20"
              )}
              title={state.displayMode === 'grid' ? "Switch to client view" : "Switch to grid view"}
            >
              {state.displayMode === 'grid' ? (
                <Monitor className="h-5 w-5" />
              ) : (
                <Laptop className="h-5 w-5" />
              )}
            </Button>
            
            <Button asChild variant="outline" size="icon" className="hidden md:flex">
              <Link to="/upload">
                <Upload className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="icon" className="hidden md:flex">
              <Link to="/profile">
                <UserCircle className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container px-4 py-3 mx-auto">
            <nav className="flex flex-col gap-3">
              <Link 
                to="/"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive('/') ? "bg-muted text-magenta" : "hover:bg-muted"
                )}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/gallery"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive('/gallery') ? "bg-muted text-magenta" : "hover:bg-muted"
                )}
                onClick={() => setMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link 
                to="/events"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive('/events') ? "bg-muted text-magenta" : "hover:bg-muted"
                )}
                onClick={() => setMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                to="/analytics"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive('/analytics') ? "bg-muted text-magenta" : "hover:bg-muted"
                )}
                onClick={() => setMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link 
                to="/upload"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive('/upload') ? "bg-muted text-magenta" : "hover:bg-muted"
                )}
                onClick={() => setMenuOpen(false)}
              >
                Upload Photos
              </Link>
              <Link 
                to="/profile"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive('/profile') ? "bg-muted text-magenta" : "hover:bg-muted"
                )}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
