import { useCallback } from "react";
import { parseYoutubeVideoId } from "../utils/parseYoutubeUrl";

export function useVideoIdParser() {
  return useCallback((url: string) => parseYoutubeVideoId(url), []);
}
