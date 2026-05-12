import { create } from "zustand";
import type { PlayerState } from "../types/playlist";

export const usePlayerStore = create<PlayerState>((set) => ({
  player: null,
  isPlaying: false,
  isReady: false,
  repeatMode: "all",
  setPlayer: (player) => set({ player }),
  setIsPlaying: (value) => set({ isPlaying: value }),
  setIsReady: (value) => set({ isReady: value })
}));
