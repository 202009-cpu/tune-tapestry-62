import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchBar } from '@/components/music/SearchBar';
import { TrackCard } from '@/components/music/TrackCard';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { useYouTubeAPI, Track } from '@/hooks/useYouTubeAPI';
import { Button } from '@/components/ui/button';
import { Music, Sparkles, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeSection, setActiveSection] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { searchVideos, isLoading, error } = useYouTubeAPI();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const results = await searchVideos(searchQuery);
      setTracks(results);
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try searching for different keywords",
        });
      }
    } catch (err) {
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    toast({
      title: "Now Playing",
      description: `${track.title} by ${track.artist}`,
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handlePlayTrack(tracks[nextIndex]);
  };

  const handlePrevious = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    handlePlayTrack(tracks[previousIndex]);
  };

  const popularSearches = [
    "Ed Sheeran Perfect",
    "Billie Eilish Bad Guy",
    "The Weeknd Blinding Lights",
    "Taylor Swift Anti-Hero",
    "Harry Styles As It Was",
    "Dua Lipa Levitating"
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-64 pb-24">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Music className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-spotify-text">Spotify Clone</h1>
                <p className="text-spotify-text-muted">Discover and play music from YouTube</p>
              </div>
            </div>
            
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>

          {/* Search Results */}
          {activeSection === 'search' && (
            <div>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green"></div>
                  <p className="mt-4 text-spotify-text-muted">Searching for music...</p>
                </div>
              ) : tracks.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold text-spotify-text mb-6">Search Results</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {tracks.map((track) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        isPlaying={isPlaying}
                        isCurrentTrack={currentTrack?.id === track.id}
                        onPlay={handlePlayTrack}
                        onPause={handlePause}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-spotify-gray rounded-full flex items-center justify-center mx-auto mb-6">
                      <Music className="h-12 w-12 text-spotify-text-muted" />
                    </div>
                    <h3 className="text-xl font-bold text-spotify-text mb-4">Start searching for music</h3>
                    <p className="text-spotify-text-muted mb-8">Find your favorite songs, artists, and albums</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-4 w-4 text-spotify-green" />
                        <span className="text-sm font-medium text-spotify-text">Popular searches</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {popularSearches.map((search, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="bg-spotify-gray hover:bg-spotify-light-gray border-spotify-light-gray text-spotify-text justify-start"
                            onClick={() => {
                              setSearchQuery(search);
                              handleSearch();
                            }}
                          >
                            <Sparkles className="h-4 w-4 mr-2 text-spotify-green" />
                            {search}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other sections */}
          {activeSection === 'home' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-spotify-text mb-4">Welcome to Spotify Clone</h2>
              <p className="text-spotify-text-muted">Start exploring music by searching above</p>
            </div>
          )}

          {activeSection === 'library' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-spotify-text mb-4">Your Library</h2>
              <p className="text-spotify-text-muted">Your playlists and saved songs will appear here</p>
            </div>
          )}
        </div>
      </main>

      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default Index;
