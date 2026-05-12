import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "../common/Button";
import { usePlayerStore } from "../../stores/playerStore";
import { usePlaylistStore } from "../../stores/playlistStore";

export function PlayerControls() {
  const player = usePlayerStore((state) => state.player);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const goNext = usePlaylistStore((state) => state.goNext);
  const goPrev = usePlaylistStore((state) => state.goPrev);
  const hasItems = usePlaylistStore((state) => state.items.length > 0);

  function handlePlayToggle() {
    if (isPlaying) {
      player?.pauseVideo();
      setIsPlaying(false);
      return;
    }

    player?.playVideo();
    setIsPlaying(true);
  }

  return (
    <section className="flex items-center justify-center gap-3 rounded-lg border border-white/10 bg-loop-surface p-3">
      <Button aria-label="이전 영상" disabled={!hasItems} onClick={goPrev} size="icon">
        <SkipBack size={18} />
      </Button>
      <Button
        aria-label={isPlaying ? "일시정지" : "재생"}
        disabled={!hasItems}
        onClick={handlePlayToggle}
        size="icon"
        variant="primary"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </Button>
      <Button aria-label="다음 영상" disabled={!hasItems} onClick={goNext} size="icon">
        <SkipForward size={18} />
      </Button>
    </section>
  );
}
