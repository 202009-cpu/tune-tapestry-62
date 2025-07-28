import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Repeat, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function MusicPlayer({ currentTrack, isPlaying, onPlayPause, onNext, onPrevious }: MusicPlayerProps) {
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([0]);
  const [isMuted, setIsMuted] = useState(false);

  if (!currentTrack) {
    return null;
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 bg-spotify-gray border-spotify-light-gray shadow-player p-4 z-50">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-spotify-text truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-spotify-text-muted truncate">
              {currentTrack.artist}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-spotify-text-muted hover:text-spotify-green"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-2xl">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-spotify-text-muted hover:text-spotify-text"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrevious}
              className="text-spotify-text-muted hover:text-spotify-text"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              onClick={onPlayPause}
              className="bg-spotify-green hover:bg-spotify-green/90 text-black w-10 h-10 rounded-full"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              className="text-spotify-text-muted hover:text-spotify-text"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-spotify-text-muted hover:text-spotify-text"
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full max-w-lg">
            <span className="text-xs text-spotify-text-muted">0:00</span>
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-spotify-text-muted">{currentTrack.duration}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="text-spotify-text-muted hover:text-spotify-text"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          <Slider
            value={isMuted ? [0] : volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </Card>
  );
}