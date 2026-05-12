# 프론트엔드 아키텍처

## 기술 스택

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- dnd-kit
- YouTube IFrame Player API
- vite-plugin-pwa

## 폴더 구조

```text
src/
  app/
    App.tsx
    router.tsx
  components/
    common/
    layout/
    player/
    playlist/
  hooks/
  stores/
  types/
  utils/
```

## 상태 설계

### PlaylistItem

```ts
export interface PlaylistItem {
  id: string;
  url: string;
  videoId: string;
  title?: string;
  thumbnailUrl?: string;
  addedAt: string;
}
```

### PlaylistState

```ts
export interface PlaylistState {
  items: PlaylistItem[];
  currentIndex: number;
  addItem: (url: string) => boolean;
  removeItem: (id: string) => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
  clearItems: () => void;
  setCurrentIndex: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
}
```

### PlayerState

```ts
export interface PlayerState {
  isPlaying: boolean;
  isReady: boolean;
  repeatMode: "all";
  setIsPlaying: (value: boolean) => void;
  setIsReady: (value: boolean) => void;
}
```

## YouTube URL 파싱

지원 URL:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

videoId는 11자리 `a-zA-Z0-9_-` 패턴으로 검증합니다.

## 재생 루프 규칙

```ts
const nextIndex = (currentIndex + 1) % items.length;
```

YouTube IFrame Player API의 `onStateChange`에서 `YT.PlayerState.ENDED`를 받으면 `goNext()`를 호출합니다. `currentIndex`가 변경되면 `player.loadVideoById(currentItem.videoId)`를 호출합니다.

## PWA 설정

`vite-plugin-pwa`로 manifest와 service worker를 생성합니다.

- `display: "standalone"`
- `theme_color: "#ff0033"`
- `background_color: "#0f0f0f"`
- 192px, 512px PNG 아이콘 제공
- `registerType: "autoUpdate"`

## localStorage

key:

```text
looptube.playlist
```

저장 데이터:

```json
{
  "items": [],
  "currentIndex": 0,
  "updatedAt": "2026-05-12T00:00:00.000Z"
}
```
