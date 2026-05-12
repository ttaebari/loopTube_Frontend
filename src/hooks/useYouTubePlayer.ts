import { useEffect, useState } from "react";
import type { YouTubePlayerInstance } from "../types/youtube";

const apiScriptId = "youtube-iframe-api";
let apiReadyPromise: Promise<void> | null = null;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (apiReadyPromise) return apiReadyPromise;

  apiReadyPromise = new Promise((resolve) => {
    const existingScript = document.getElementById(apiScriptId);
    window.onYouTubeIframeAPIReady = () => resolve();

    if (existingScript) return;

    const script = document.createElement("script");
    script.id = apiScriptId;
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });

  return apiReadyPromise;
}

export function useYouTubePlayer() {
  const [player, setPlayer] = useState<YouTubePlayerInstance | null>(null);
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadYouTubeIframeApi().then(() => {
      if (mounted) setIsApiReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { isApiReady, player, setPlayer };
}
