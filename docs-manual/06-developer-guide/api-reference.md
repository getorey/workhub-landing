# API 레퍼런스

MCP 서버에서 제공하는 도구(tool)와 REST API의 전체 명세입니다.

## MCP 도구

### send_message

채널, 토픽, 또는 DM에 메시지를 전송합니다.

- **Scope**: `messages:write`

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `content` | string | O | 메시지 내용 (마크다운 지원) |
| `channel_id` | string | - | 채널 UUID |
| `topic_id` | string | - | 토픽 UUID |
| `dm_room_id` | string | - | DM 방 UUID |

> `channel_id`, `topic_id`, `dm_room_id` 중 하나는 반드시 지정해야 합니다.

```json
{
  "method": "tools/call",
  "params": {
    "name": "send_message",
    "arguments": {
      "channel_id": "550e8400-e29b-41d4-a716-446655440000",
      "content": "배포가 완료되었습니다! :rocket:"
    }
  }
}
```

---

### read_messages

채널, 토픽, 또는 DM의 최근 메시지를 조회합니다.

- **Scope**: `messages:read`

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `channel_id` | string | - | - | 채널 UUID |
| `topic_id` | string | - | - | 토픽 UUID |
| `dm_room_id` | string | - | - | DM 방 UUID |
| `limit` | number | - | 20 | 조회 개수 (최대 100) |

```json
{
  "method": "tools/call",
  "params": {
    "name": "read_messages",
    "arguments": {
      "channel_id": "550e8400-e29b-41d4-a716-446655440000",
      "limit": 10
    }
  }
}
```

---

## 채널 & 프로젝트

### list_channels

채널, 프로젝트, 토픽 목록을 조회합니다.

- **Scope**: `channels:read`

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `type` | string | - | `"all"` | `"channels"`, `"projects"`, `"topics"`, `"all"` |
| `project_id` | string | - | - | 프로젝트별 토픽 필터 |

```json
{
  "method": "tools/call",
  "params": {
    "name": "list_channels",
    "arguments": {
      "type": "projects"
    }
  }
}
```

---

## 태스크

### create_task

토픽에 새 태스크를 생성합니다.

- **Scope**: `tasks:write`

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `topic_id` | string | O | - | 토픽 UUID |
| `title` | string | O | - | 태스크 제목 |
| `description` | string | - | - | 상세 설명 |
| `priority` | string | - | `"medium"` | `"low"`, `"medium"`, `"high"`, `"urgent"` |
| `assignee_id` | string | - | - | 담당자 UUID |
| `due_date` | string | - | - | 마감일 (`YYYY-MM-DD`) |

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_task",
    "arguments": {
      "topic_id": "topic-uuid",
      "title": "API 문서 작성",
      "priority": "high",
      "assignee_id": "user-uuid",
      "due_date": "2026-04-15"
    }
  }
}
```

---

### update_task

태스크의 상태, 제목, 우선순위 등을 수정합니다.

- **Scope**: `tasks:write`

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `task_id` | string | O | 태스크 UUID |
| `status` | string | - | `"todo"`, `"in_progress"`, `"review"`, `"done"` |
| `title` | string | - | 새 제목 |
| `priority` | string | - | `"low"`, `"medium"`, `"high"`, `"urgent"` |
| `assignee_id` | string | - | 새 담당자 UUID |
| `due_date` | string | - | 새 마감일 (`YYYY-MM-DD`) |

```json
{
  "method": "tools/call",
  "params": {
    "name": "update_task",
    "arguments": {
      "task_id": "task-uuid",
      "status": "done"
    }
  }
}
```

---

### list_tasks

토픽의 태스크 목록을 조회합니다.

- **Scope**: `tasks:read`

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `topic_id` | string | O | - | 토픽 UUID |
| `status` | string | - | `"all"` | `"todo"`, `"in_progress"`, `"review"`, `"done"`, `"all"` |
| `assignee_id` | string | - | - | 담당자 필터 |

```json
{
  "method": "tools/call",
  "params": {
    "name": "list_tasks",
    "arguments": {
      "topic_id": "topic-uuid",
      "status": "in_progress"
    }
  }
}
```

---

## 검색

### search

메시지, 사용자, 태스크, 채널을 통합 검색합니다.

- **Scope**: any (모든 Scope에서 사용 가능)

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `query` | string | O | - | 검색어 |
| `type` | string | - | `"all"` | `"messages"`, `"users"`, `"tasks"`, `"channels"`, `"all"` |
| `limit` | number | - | 10 | 카테고리별 최대 결과 수 (최대 50) |

```json
{
  "method": "tools/call",
  "params": {
    "name": "search",
    "arguments": {
      "query": "배포 일정",
      "type": "tasks",
      "limit": 20
    }
  }
}
```

---

## 사용자

### get_user_info

사용자 정보를 조회합니다. ID 또는 이메일로 검색합니다.

- **Scope**: `users:read`

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `user_id` | string | - | 사용자 UUID |
| `email` | string | - | 이메일 주소 |

> `user_id` 또는 `email` 중 하나는 반드시 지정해야 합니다.

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_user_info",
    "arguments": {
      "email": "hong@example.com"
    }
  }
}
```

**응답 포함 필드**: id, email, display_name, role, status, department

---

### list_users

조직 내 사용자 목록을 조회합니다.

- **Scope**: `users:read`

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `department` | string | - | - | 부서명 필터 (부분 일치) |
| `role` | string | - | - | `"system_admin"`, `"org_admin"`, `"dept_admin"`, `"member"` |
| `limit` | number | - | 50 | 최대 조회 수 (최대 200) |

```json
{
  "method": "tools/call",
  "params": {
    "name": "list_users",
    "arguments": {
      "department": "개발",
      "limit": 100
    }
  }
}
```

---

## REST API

MCP 도구 외에 REST API를 통해 추가 기능에 접근할 수 있습니다.

### 인증

| 엔드포인트 | 인증 | 설명 |
|-----------|------|------|
| `POST /api/bots/auth` | Bot API Key | 봇 인증 및 정보 조회 |
| `POST /api/bots/{id}/dm-messages` | Bot API Key | 봇이 DM 메시지 전송 |
| 그 외 `/api/bots/*` | User Token | 봇 관리 (CRUD, API 키, 웹훅 시크릿) |

---

### 봇 DM 메시지 전송

#### POST /api/bots/{botId}/dm-messages

봇이 특정 사용자에게 DM 메시지를 직접 전송합니다. 봇 API 키로 인증합니다.

```
POST /api/bots/{botId}/dm-messages
Authorization: Bearer {BOT_API_KEY}
Content-Type: application/json

{
  "user_id": "대상-사용자-UUID",
  "content": "안녕하세요! 봇에서 보내는 메시지입니다."
}
```

---

### 봇 API 키 관리

#### POST /api/bots/{botId}/api-keys

새 API 키를 발급합니다. Scope와 만료일을 설정할 수 있습니다.

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `key_type` | string | - | `"live"` (기본) 또는 `"test"` |
| `scopes` | string[] | - | 접근 범위 (미지정 시 전체) |
| `expires_in_days` | number | - | 만료일 (일 단위, 미지정 시 무제한) |

#### DELETE /api/bots/{botId}/api-keys/{keyId}

특정 API 키를 즉시 폐기합니다.

---

### 봇 Webhook Secret

#### POST /api/bots/{botId}/webhook-secret

Webhook 서명 검증용 시크릿을 생성합니다. 기존 시크릿이 있으면 새로 발급됩니다.

---

### 봇 커스텀 명령

#### GET /api/bots/{botId}/commands

봇에 등록된 커스텀 명령 목록을 조회합니다.

#### POST /api/bots/{botId}/commands

새 커스텀 명령을 등록합니다.

| 필드 | 타입 | 필수 | 제한 | 설명 |
|------|------|------|------|------|
| `command` | string | O | 100자 | 명령어 이름 |
| `description` | string | O | 500자 | 설명 |
| `usage_hint` | string | - | 500자 | 사용법 힌트 |

#### DELETE /api/bots/{botId}/commands/{commandName}

커스텀 명령을 삭제합니다.

---

### 채널 북마크

#### POST /api/channels/{channelId}/bookmarks

메시지를 북마크합니다. 채널 멤버만 사용 가능합니다.

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `message_id` | string | O | 북마크할 메시지 UUID |

#### GET /api/channels/{channelId}/bookmarks

북마크 목록을 조회합니다.

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `user_id` | string | - | 특정 사용자의 북마크만 필터 |
| `from` | string | - | 시작 날짜 (ISO 8601) |
| `to` | string | - | 종료 날짜 (ISO 8601) |
| `sort` | string | `"desc"` | `"asc"` 또는 `"desc"` |
| `limit` | number | 50 | 최대 100 |

#### DELETE /api/channels/{channelId}/bookmarks/{messageId}

북마크를 삭제합니다.

---

### 채널 파일

#### GET /api/channels/{channelId}/files

채널에 업로드된 파일을 검색/필터/정렬하여 조회합니다.

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `q` | string | - | 파일명 검색어 (최대 200자) |
| `type` | string | - | `"image"`, `"document"`, `"media"`, `"archive"` |
| `sort` | string | `"created_at"` | `"created_at"`, `"filename"`, `"size"` |
| `order` | string | `"desc"` | `"asc"` 또는 `"desc"` |
| `limit` | number | 20 | 최대 100 |
| `offset` | number | 0 | 페이지네이션 오프셋 |

---

### 멘션 검색

#### GET /api/mentions/users

멘션 대상(사용자, 부서, 봇, @all, @here)을 검색합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `q` | string | O | 검색어 |
| `channel_id` | string | - | 채널 멤버 우선 표시 |

응답은 `type` 필드로 구분됩니다: `"special"`, `"user"`, `"department"`, `"bot"`

---

### Incoming Webhook

#### POST /api/webhooks/incoming/{botId}

외부 서비스에서 Workhub으로 메시지를 전송합니다.

```json
{
  "content": "외부 시스템에서 보내는 알림입니다.",
  "channel_id": "채널-UUID"
}
```

---

### 해시태그

#### GET /api/hashtags/search

해시태그 대상(채널, 태스크, 프로젝트, 태그)을 검색합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `q` | string | O | 검색어 |

#### GET /api/hashtags/preview/{type}/{id}

해시태그 프리뷰 카드를 조회합니다.

| 경로 파라미터 | 설명 |
|---------------|------|
| `type` | `"channel"`, `"task"`, `"project"` |
| `id` | 대상 UUID |

---

### 슬래시 명령

#### GET /api/commands

사용 가능한 슬래시 명령 목록을 조회합니다.

#### POST /api/commands/execute

슬래시 명령을 실행합니다.

| 필드 | 타입 | 필수 | 제한 | 설명 |
|------|------|------|------|------|
| `text` | string | O | 1000자 | 명령어 텍스트 (예: `/status 회의 중`) |
| `channel_id` | string | - | - | 채널 UUID |
| `topic_id` | string | - | - | 토픽 UUID |
| `dm_room_id` | string | - | - | DM 방 UUID |
