import { create } from "zustand";
import type { PlaylistItem, PlaylistState } from "../types/playlist";
import { parseYoutubeVideoId, youtubeThumbnailUrl } from "../utils/parseYoutubeUrl";
import { loadStoredPlaylist, saveStoredPlaylist } from "../utils/storage";

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [removed] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, removed);
  return nextItems;
}

function normalizeIndex(index: number, length: number) {
  if (length <= 0) return 0;
  if (index < 0) return length - 1;
  return index % length;
}

function touch() {
  return new Date().toISOString();
}

function persistPlaylist(state: Pick<PlaylistState, "currentIndex" | "items" | "updatedAt">) {
  saveStoredPlaylist(state);
  return state;
}

const storedPlaylist = loadStoredPlaylist();
const initialItems = storedPlaylist?.items ?? [];

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  currentIndex: normalizeIndex(storedPlaylist?.currentIndex ?? 0, initialItems.length),
  items: initialItems,
  lastError: null,
  updatedAt: storedPlaylist?.updatedAt ?? touch(),
  addItem: (url) => {
    const trimmedUrl = url.trim();
    const videoId = parseYoutubeVideoId(trimmedUrl);

    if (!videoId) {
      set({ lastError: "지원하는 YouTube 링크가 아닙니다." });
      return false;
    }

    const item: PlaylistItem = {
      addedAt: touch(),
      id: createId(),
      thumbnailUrl: youtubeThumbnailUrl(videoId),
      title: `YouTube ${videoId}`,
      url: trimmedUrl,
      videoId
    };

    set((state) => {
      const nextState = {
        currentIndex: state.items.length === 0 ? 0 : state.currentIndex,
        items: [...state.items, item],
        updatedAt: touch()
      };

      return {
        ...persistPlaylist(nextState),
        lastError: null
      };
    });

    return true;
  },
  clearError: () => set({ lastError: null }),
  clearItems: () =>
    set(() => {
      const nextState = {
        currentIndex: 0,
        items: [],
        updatedAt: touch()
      };

      return {
        ...persistPlaylist(nextState),
        lastError: null
      };
    }),
  goNext: () => {
    const { currentIndex, items } = get();
    const nextState = {
      currentIndex: normalizeIndex(currentIndex + 1, items.length),
      items,
      updatedAt: touch()
    };

    set(persistPlaylist(nextState));
  },
  goPrev: () => {
    const { currentIndex, items } = get();
    const nextState = {
      currentIndex: normalizeIndex(currentIndex - 1, items.length),
      items,
      updatedAt: touch()
    };

    set(persistPlaylist(nextState));
  },
  removeItem: (id) =>
    set((state) => {
      const removedIndex = state.items.findIndex((item) => item.id === id);
      if (removedIndex < 0) return state;

      const items = state.items.filter((item) => item.id !== id);
      let currentIndex = state.currentIndex;

      if (items.length === 0) currentIndex = 0;
      else if (removedIndex < state.currentIndex) currentIndex -= 1;
      else if (currentIndex >= items.length) currentIndex = 0;

      return persistPlaylist({
        currentIndex,
        items,
        updatedAt: touch()
      });
    }),
  reorderItems: (fromIndex, toIndex) =>
    set((state) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.items.length ||
        toIndex >= state.items.length
      ) {
        return state;
      }

      const currentItem = state.items[state.currentIndex];
      const items = moveItem(state.items, fromIndex, toIndex);
      const currentIndex = currentItem
        ? items.findIndex((item) => item.id === currentItem.id)
        : 0;

      return persistPlaylist({
        currentIndex: normalizeIndex(currentIndex, items.length),
        items,
        updatedAt: touch()
      });
    }),
  setCurrentIndex: (index) =>
    set((state) =>
      persistPlaylist({
        currentIndex: normalizeIndex(index, state.items.length),
        items: state.items,
        updatedAt: touch()
      })
    )
}));
