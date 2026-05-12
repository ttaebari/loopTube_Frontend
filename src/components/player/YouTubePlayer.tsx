import { useEffect, useRef, useState } from "react";
import { useYouTubePlayer } from "../../hooks/useYouTubePlayer";
import { usePlayerStore } from "../../stores/playerStore";
import { usePlaylistStore } from "../../stores/playlistStore";
import type { PlaylistItem } from "../../types/playlist";
import type { YouTubePlayerInstance, YouTubeStateChangeEvent } from "../../types/youtube";

interface YouTubePlayerProps {
  item: PlaylistItem | null;
}

export function YouTubePlayer({ item }: YouTubePlayerProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayerInstance | null>(null);
  const loadedItemIdRef = useRef<string | null>(null);
  const currentItemRef = useRef<PlaylistItem | null>(item);
  const itemsLengthRef = useRef(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const { isApiReady } = useYouTubePlayer();
  const goNext = usePlaylistStore((state) => state.goNext);
  const itemsLength = usePlaylistStore((state) => state.items.length);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const setIsReady = usePlayerStore((state) => state.setIsReady);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const hasItem = Boolean(item);

  useEffect(() => {
    currentItemRef.current = item;
  }, [item]);

  useEffect(() => {
    itemsLengthRef.current = itemsLength;
  }, [itemsLength]);

  useEffect(() => {
    if (!item || !isApiReady || !shellRef.current || !window.YT?.Player) return;
    if (playerRef.current) return;

    const host = document.createElement("div");
    shellRef.current.replaceChildren(host);

    const player = new window.YT.Player(host, {
      height: "100%",
      width: "100%",
      videoId: item.videoId,
      playerVars: {
        enablejsapi: 1,
        origin: window.location.origin,
        playsinline: 1,
        rel: 0
      },
      events: {
        onReady: (event) => {
          playerRef.current = event.target;
          setPlayer(event.target);
          setIsPlayerReady(true);
          setIsReady(true);
        },
        onStateChange: (event: YouTubeStateChangeEvent) => {
          if (!window.YT) return;

          if (event.data === window.YT.PlayerState.ENDED) {
            const currentItem = currentItemRef.current;

            if (!currentItem || itemsLengthRef.current === 0) {
              setIsPlaying(false);
              return;
            }

            setIsPlaying(true);

            if (itemsLengthRef.current === 1) {
              event.target.loadVideoById(currentItem.videoId);
              return;
            }

            goNext();
            return;
          }

          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            return;
          }

          if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          }
        }
      }
    });

    playerRef.current = player;
    setPlayer(player);

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
      loadedItemIdRef.current = null;
      shellRef.current?.replaceChildren();
      setPlayer(null);
      setIsPlayerReady(false);
      setIsReady(false);
      setIsPlaying(false);
    };
  }, [goNext, hasItem, isApiReady, setIsPlaying, setIsReady, setPlayer]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isPlayerReady || !item) return;
    if (loadedItemIdRef.current === item.id) return;

    loadedItemIdRef.current = item.id;

    if (isPlaying) {
      player.loadVideoById(item.videoId);
      return;
    }

    player.cueVideoById(item.videoId);
  }, [isPlayerReady, isPlaying, item]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isPlayerReady || !item) return;

    if (isPlaying) {
      player.playVideo();
      return;
    }

    player.pauseVideo();
  }, [isPlayerReady, isPlaying, item]);

  if (!item) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-white/10 bg-loop-surface text-sm text-loop-muted">
        재생할 영상이 없습니다
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
      <div className="h-full w-full" ref={shellRef} />
    </div>
  );
}
