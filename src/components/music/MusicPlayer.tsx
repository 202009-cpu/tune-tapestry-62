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

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function MusicPlayer({ currentTrack, isPlaying, onPlayPause, onNext, onPrevious }: MusicPlayerProps) {
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([0]);
  const [isMuted, setIsMuted] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);

  // Load YouTube API
  useEffect(() => {
    console.log('Loading YouTube API...');
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API Ready!');
        initializePlayer();
      };
    } else {
      console.log('YouTube API already loaded');
      initializePlayer();
    }
  }, []);

  const initializePlayer = () => {
    console.log('Initializing player...', { 
      hasRef: !!playerRef.current, 
      hasYT: !!window.YT, 
      hasPlayer: !!(window.YT && window.YT.Player) 
    });
    
    if (playerRef.current && window.YT && window.YT.Player) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '200',
        width: '300',
        playerVars: {
          autoplay: 0,
          controls: 1,
          disablekb: 0,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            console.log('Player ready!', event.target);
            setPlayer(event.target);
            event.target.setVolume(volume[0]);
          },
          onStateChange: (event: any) => {
            console.log('Player state changed:', event.data);
            if (event.data === window.YT.PlayerState.ENDED) {
              onNext();
            }
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event.data);
          },
        },
      });
    } else {
      console.log('Cannot initialize player - missing dependencies');
    }
  };

  // Update player when track changes
  useEffect(() => {
    console.log('Track or player changed:', { 
      hasPlayer: !!player, 
      currentTrack: currentTrack?.title,
      videoId: currentTrack?.videoId 
    });
    if (player && currentTrack) {
      console.log('Loading video:', currentTrack.videoId);
      player.loadVideoById(currentTrack.videoId);
      if (isPlaying) {
        console.log('Auto-playing video');
        player.playVideo();
      }
    }
  }, [currentTrack, player]);

  // Update player state when play/pause changes
  useEffect(() => {
    if (player) {
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    }
  }, [isPlaying, player]);

  // Update volume
  useEffect(() => {
    if (player) {
      player.setVolume(isMuted ? 0 : volume[0]);
    }
  }, [volume, isMuted, player]);

  // Progress tracking
  useEffect(() => {
    if (!player || !isPlaying) return;

    const interval = setInterval(() => {
      if (player.getCurrentTime && player.getDuration) {
        const current = player.getCurrentTime();
        const total = player.getDuration();
        setCurrentTime(current);
        setDuration(total);
        setProgress([(current / total) * 100]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, isPlaying]);

  const handleProgressChange = (value: number[]) => {
    if (player && duration) {
      const newTime = (value[0] / 100) * duration;
      player.seekTo(newTime);
      setProgress(value);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      {/* YouTube Player - Temporarily Visible for Debugging */}
      <div
        ref={playerRef}
        style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 1000,
          border: '2px solid #1DB954',
          borderRadius: '8px'
        }}
      />
      
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
              <span className="text-xs text-spotify-text-muted">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={progress}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                className="flex-1"
              />
              <span className="text-xs text-spotify-text-muted">
                {duration ? formatTime(duration) : currentTrack.duration}
              </span>
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
    </>
  );
}