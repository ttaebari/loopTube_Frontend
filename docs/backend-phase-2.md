# 2차 백엔드 확장

## 목표

- Google 로그인
- 사용자별 Loop List 저장
- PostgreSQL 기반 DB 저장
- 여러 Loop List 생성
- 기기 간 동기화
- 공유 링크 기능

## 기술 후보

- Spring Boot
- Kotlin 또는 Java
- PostgreSQL
- JPA 또는 QueryDSL
- Google OAuth Login

## 로그인 정책

- 초기에는 Google 로그인만 지원한다.
- YouTube 계정 권한은 요청하지 않는다.
- 사용자의 YouTube 재생목록은 수정하지 않는다.
- Google 계정은 LoopTube 계정 식별용으로만 사용한다.
- 저장은 LoopTube 자체 DB에 한다.

## DB 초안

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  profile_image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE loop_lists (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE loop_list_items (
  id BIGSERIAL PRIMARY KEY,
  loop_list_id BIGINT NOT NULL REFERENCES loop_lists(id) ON DELETE CASCADE,
  youtube_url TEXT NOT NULL,
  video_id VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  thumbnail_url TEXT,
  order_index INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

## API 초안

### 인증

- `POST /api/auth/google`
- `GET /api/me`
- `POST /api/logout`

### 리스트

- `GET /api/loop-lists`
- `POST /api/loop-lists`
- `GET /api/loop-lists/{id}`
- `PATCH /api/loop-lists/{id}`
- `DELETE /api/loop-lists/{id}`

### 리스트 아이템

- `POST /api/loop-lists/{id}/items`
- `PATCH /api/loop-lists/{id}/items/reorder`
- `DELETE /api/loop-lists/{id}/items/{itemId}`
