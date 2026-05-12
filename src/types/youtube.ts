export interface YouTubePlayerInstance {
  cueVideoById: (videoId: string) => void;
  destroy: () => void;
  loadVideoById: (videoId: string) => void;
  pauseVideo: () => void;
  playVideo: () => void;
  stopVideo: () => void;
}

export interface YouTubeReadyEvent {
  target: YouTubePlayerInstance;
}

export interface YouTubeStateChangeEvent {
  data: number;
  target: YouTubePlayerInstance;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          events?: {
            onReady?: (event: YouTubeReadyEvent) => void;
            onStateChange?: (event: YouTubeStateChangeEvent) => void;
          };
          height?: string;
          playerVars?: Record<string, string | number>;
          videoId?: string;
          width?: string;
        }
      ) => YouTubePlayerInstance;
      PlayerState: {
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
  }
}
