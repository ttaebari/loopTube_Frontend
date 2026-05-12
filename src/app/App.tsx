import { AppLayout } from "../components/layout/AppLayout";
import { NowPlaying } from "../components/player/NowPlaying";
import { PlayerControls } from "../components/player/PlayerControls";
import { YouTubePlayer } from "../components/player/YouTubePlayer";
import { PlaylistPanel } from "../components/playlist/PlaylistPanel";
import { usePlaylistStore } from "../stores/playlistStore";

export default function App() {
  const items = usePlaylistStore((state) => state.items);
  const currentIndex = usePlaylistStore((state) => state.currentIndex);
  const currentItem = items[currentIndex] ?? null;

  return (
    <AppLayout>
      <section className="grid min-h-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="flex min-w-0 flex-col gap-4">
          <YouTubePlayer item={currentItem} />
          <NowPlaying item={currentItem} currentIndex={currentIndex} total={items.length} />
          <PlayerControls />
        </div>
        <PlaylistPanel />
      </section>
    </AppLayout>
  );
}
