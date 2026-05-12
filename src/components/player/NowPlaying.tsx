import type { PlaylistItem } from "../../types/playlist";

interface NowPlayingProps {
  item: PlaylistItem | null;
  currentIndex: number;
  total: number;
}

export function NowPlaying({ currentIndex, item, total }: NowPlayingProps) {
  if (!item) {
    return (
      <section className="rounded-lg border border-white/10 bg-loop-surface p-4">
        <p className="text-sm text-loop-muted">현재 재생 중인 영상이 없습니다</p>
      </section>
    );
  }

  return (
    <section className="flex items-center gap-4 rounded-lg border border-white/10 bg-loop-surface p-4">
      <img
        alt=""
        className="h-16 w-28 rounded-md object-cover"
        src={item.thumbnailUrl}
      />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase text-loop-primary">
          {currentIndex + 1} / {total}
        </p>
        <h2 className="truncate text-base font-semibold">{item.title ?? item.videoId}</h2>
        <p className="truncate text-sm text-loop-muted">{item.url}</p>
      </div>
    </section>
  );
}
