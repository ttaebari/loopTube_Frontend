import type { PlaylistItem } from "../types/playlist";

export const PLAYLIST_STORAGE_KEY = "looptube.playlist";

export interface StoredPlaylist {
  items: PlaylistItem[];
  currentIndex: number;
  updatedAt: string;
}

export function loadStoredPlaylist(): StoredPlaylist | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(PLAYLIST_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as StoredPlaylist;
    return {
      currentIndex: Number.isInteger(parsed.currentIndex) ? parsed.currentIndex : 0,
      items: Array.isArray(parsed.items) ? parsed.items : [],
      updatedAt: parsed.updatedAt ?? new Date().toISOString()
    };
  } catch {
    return null;
  }
}

export function saveStoredPlaylist(playlist: StoredPlaylist) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlist));
}
