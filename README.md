# LoopTube

LoopTube는 YouTube 링크를 모아 2~5개 영상을 순서대로 무한 반복 재생하는 웹/PWA 앱입니다. 1차 MVP는 백엔드 없이 브라우저 `localStorage`에 리스트를 저장하고, 이후 Google 로그인과 서버 저장으로 확장합니다.

## 현재 단계

- Vite + React + TypeScript 프로젝트 골격
- Tailwind CSS v4 Vite 플러그인 설정
- Zustand 기반 playlist/player store 초안
- dnd-kit 기반 리스트 정렬 UI 골격
- vite-plugin-pwa 기반 manifest/service worker 생성 설정
- 기획/아키텍처 문서 정리

## 실행

```bash
npm install
npm run generate:icons
npm run dev
```

검증 빌드:

```bash
npm run build
```

## 주요 문서

- [제품 명세](./docs/product-spec.md)
- [MVP 범위](./docs/mvp-scope.md)
- [프론트엔드 아키텍처](./docs/frontend-architecture.md)
- [2차 백엔드 확장](./docs/backend-phase-2.md)

## 저장 정책

1차 MVP의 저장 key는 `looptube.playlist`입니다. 로그인/백엔드가 추가되기 전까지 playlist items, currentIndex, updatedAt만 브라우저에 저장합니다.
