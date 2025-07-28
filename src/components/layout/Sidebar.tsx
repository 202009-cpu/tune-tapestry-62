import { Home, Search, Library, Plus, Heart, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
  ];

  const playlistItems = [
    { id: 'liked', label: 'Liked Songs', icon: Heart },
    { id: 'playlist1', label: 'My Playlist #1', icon: Music },
    { id: 'playlist2', label: 'Chill Vibes', icon: Music },
    { id: 'playlist3', label: 'Workout Mix', icon: Music },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-spotify-darker p-2 flex flex-col gap-2">
      {/* Main Navigation */}
      <Card className="bg-spotify-gray border-none p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-left font-medium transition-colors ${
                activeSection === item.id
                  ? 'text-spotify-text bg-spotify-light-gray'
                  : 'text-spotify-text-muted hover:text-spotify-text hover:bg-spotify-light-gray'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Library */}
      <Card className="bg-spotify-gray border-none p-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-spotify-text-muted font-medium text-sm">YOUR LIBRARY</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-spotify-text-muted hover:text-spotify-text"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {playlistItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-left font-normal transition-colors ${
                activeSection === item.id
                  ? 'text-spotify-text bg-spotify-light-gray'
                  : 'text-spotify-text-muted hover:text-spotify-text hover:bg-spotify-light-gray'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}