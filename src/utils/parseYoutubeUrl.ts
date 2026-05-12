const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

function cleanCandidate(value: string | null) {
  if (!value) return null;

  const [candidate] = value.split(/[?&#/]/);
  return YOUTUBE_VIDEO_ID_PATTERN.test(candidate) ? candidate : null;
}

export function parseYoutubeVideoId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  if (YOUTUBE_VIDEO_ID_PATTERN.test(value)) {
    return value;
  }

  try {
    const parsedUrl = new URL(value);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return cleanCandidate(parsedUrl.pathname.replace("/", ""));
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        return cleanCandidate(parsedUrl.searchParams.get("v"));
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        return cleanCandidate(parsedUrl.pathname.replace("/shorts/", ""));
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return cleanCandidate(parsedUrl.pathname.replace("/embed/", ""));
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function youtubeThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}
