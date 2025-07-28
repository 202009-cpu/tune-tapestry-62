import { useState } from 'react';

const API_KEY = 'AIzaSyCZ3p7-ejKo_l-BdjPrkkksxADWvtU_QFY';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
    };
    publishedAt: string;
  };
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

export function useYouTubeAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVideos = async (query: string, maxResults: number = 20): Promise<Track[]> => {
    if (!query.trim()) return [];

    setIsLoading(true);
    setError(null);

    try {
      const searchResponse = await fetch(
        `${BASE_URL}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(
          query + ' music'
        )}&type=video&key=${API_KEY}`
      );

      if (!searchResponse.ok) {
        throw new Error('Failed to fetch search results');
      }

      const searchData = await searchResponse.json();
      const videoIds = searchData.items.map((item: YouTubeVideo) => item.id.videoId).join(',');

      // Get video details including duration
      const detailsResponse = await fetch(
        `${BASE_URL}/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
      );

      if (!detailsResponse.ok) {
        throw new Error('Failed to fetch video details');
      }

      const detailsData = await detailsResponse.json();

      const tracks: Track[] = detailsData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.high?.url,
        duration: formatDuration(item.contentDetails.duration),
        videoId: item.id,
      }));

      return tracks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return {
    searchVideos,
    isLoading,
    error,
  };
}