import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  onPlay: (track: Track) => void;
  onPause: () => void;
}

export function TrackCard({ track, isPlaying, isCurrentTrack, onPlay, onPause }: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayPause = () => {
    if (isCurrentTrack && isPlaying) {
      onPause();
    } else {
      onPlay(track);
    }
  };

  return (
    <Card
      className="group bg-spotify-gray hover:bg-spotify-light-gray transition-all duration-300 cursor-pointer border-none shadow-music-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="relative mb-4">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <Button
            onClick={handlePlayPause}
            className={`absolute bottom-2 right-2 bg-spotify-green hover:bg-spotify-green/90 text-black w-12 h-12 rounded-full transition-all duration-300 ${
              isHovered || isCurrentTrack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-semibold text-spotify-text text-sm truncate group-hover:text-spotify-green transition-colors">
            {track.title}
          </h3>
          <p className="text-xs text-spotify-text-muted truncate">
            {track.artist}
          </p>
          <p className="text-xs text-spotify-text-muted">
            {track.duration}
          </p>
        </div>
      </div>
    </Card>
  );
}