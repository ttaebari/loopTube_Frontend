export interface PlaylistItem {
  id: string;
  url: string;
  videoId: string;
  title?: string;
  thumbnailUrl?: string;
  addedAt: string;
}

export interface PlaylistState {
  items: PlaylistItem[];
  currentIndex: number;
  lastError: string | null;
  updatedAt: string;
  addItem: (url: string) => boolean;
  removeItem: (id: string) => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
  clearItems: () => void;
  setCurrentIndex: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  clearError: () => void;
}

export interface PlayerState {
  player: import("./youtube").YouTubePlayerInstance | null;
  isPlaying: boolean;
  isReady: boolean;
  repeatMode: "all";
  setPlayer: (player: import("./youtube").YouTubePlayerInstance | null) => void;
  setIsPlaying: (value: boolean) => void;
  setIsReady: (value: boolean) => void;
}
