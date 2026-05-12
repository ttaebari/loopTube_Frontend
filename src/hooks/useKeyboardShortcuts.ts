import { useEffect } from "react";
import { usePlayerStore } from "../stores/playerStore";
import { usePlaylistStore } from "../stores/playlistStore";

export function useKeyboardShortcuts(onFocusLinkInput?: () => void) {
  const goNext = usePlaylistStore((state) => state.goNext);
  const goPrev = usePlaylistStore((state) => state.goPrev);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) return;

      if (event.code === "Space") {
        event.preventDefault();
        setIsPlaying(!isPlaying);
      }

      if (event.key.toLowerCase() === "n") goNext();
      if (event.key.toLowerCase() === "p") goPrev();
      if (event.key.toLowerCase() === "l") onFocusLinkInput?.();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, isPlaying, onFocusLinkInput, setIsPlaying]);
}
