# 개발자 가이드

Workhub은 외부 시스템 연동 및 자동화를 위한 **MCP 서버**, **Bot SDK**, **Webhook**, **REST API**를 제공합니다.

## 구성 요소

| 구성 요소 | 설명 | 패키지 |
|-----------|------|--------|
| [MCP 서버](./mcp-server) | Model Context Protocol 기반 도구 서버 (JSON-RPC 2.0) | - |
| [TypeScript SDK](./sdk-typescript) | Node.js 봇 개발용 SDK | `npm install @workhub/bot-sdk` |
| [Python SDK](./sdk-python) | Python 봇 개발용 SDK | [`pip install workhub-bot-sdk`](https://pypi.org/project/workhub-bot-sdk/) |
| [API 레퍼런스](./api-reference) | MCP 도구 및 REST API 전체 명세 | - |
| [Webhook](./webhook) | 이벤트 수신 및 실시간 연동 | - |

## 아키텍처 개요

```
외부 봇/서비스
     │
     ├── MCP (JSON-RPC 2.0) ──▶ POST /api/mcp
     ├── REST API ────────────▶ POST /api/bots/auth, /api/bots/{id}/dm-messages, ...
     └── Webhook 수신 ◀────────  Workhub 이벤트 전송
           │
     ┌─────▼──────────────────────────────────────────┐
     │               Workhub Server                    │
     │  ┌──────────┐  ┌───────────┐  ┌─────────────┐  │
     │  │ MCP 서버 │  │ Bot API   │  │ System Bots │  │
     │  └────┬─────┘  └─────┬─────┘  └──────┬──────┘  │
     │       └───────┬──────┘               │          │
     │         ┌─────▼─────┐          ┌─────▼─────┐   │
     │         │ PostgreSQL│          │ EventBus  │   │
     │         │           │          │ (NATS)    │   │
     │         └───────────┘          └───────────┘   │
     └─────────────────────────────────────────────────┘
```

## 봇 유형

Workhub에는 세 가지 봇 유형이 있습니다:

| 유형 | 설명 | 관리 권한 |
|------|------|-----------|
| **시스템 봇** | 내장 봇 (검색, 태스크, 알림) — 코드 레벨에서 등록 | 시스템 관리자만 |
| **플랫폼 봇** | 전체 기관에 공개되는 봇 (스탠드업, 투표/설문, 취합, 태스크 알림) | 시스템 관리자만 |
| **커스텀 봇** | 사용자/기관이 등록한 외부 봇 | 등록한 사용자/기관 관리자 |

## 빠른 시작

### 1. 봇 등록 및 API 키 발급

관리자 화면에서 봇을 등록하고 API 키를 발급받습니다. 자세한 내용은 [봇 관리](/04-org-admin-guide/bots)를 참고하세요.

### 2. SDK 설치

::: code-group

```bash [TypeScript]
npm install @workhub/bot-sdk
```

```bash [Python]
pip install workhub-bot-sdk
```

:::

### 3. 첫 번째 봇 만들기

::: code-group

```typescript [TypeScript]
import { WorkhubBot } from "@workhub/bot-sdk";

const bot = new WorkhubBot({
  baseUrl: "https://workhub.example.com",
  apiKey: "whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx",
});

const info = await bot.authenticate();
console.log(`연결 완료: ${info.bot_id}`);

await bot.sendMessage({
  channel_id: "채널-UUID",
  content: "안녕하세요! 봇이 연결되었습니다.",
});
```

```python [Python]
from workhub_bot_sdk import WorkhubBot

bot = WorkhubBot(
    base_url="https://workhub.example.com",
    api_key="whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx",
)

info = bot.authenticate()
print(f"연결 완료: {info.bot_id}")

bot.send_message(
    channel_id="채널-UUID",
    content="안녕하세요! 봇이 연결되었습니다.",
)
```

:::

## 인증

### API 키 형식

봇 API 키는 다음 형식입니다:

```
whb_{봇ID축약}_{키타입}_{랜덤문자열}
```

- `whb_` — Workhub Bot 접두사
- 봇 ID 앞 8자리
- 키 타입: `live` (운영용) 또는 `test` (테스트용)
- 랜덤 hex 문자열

예시: `whb_12345678_live_abcdef1234567890abcdef1234567890`

### 인증 방법

모든 API 요청에는 `Authorization` 헤더가 필요합니다:

```
Authorization: Bearer whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx
```

### 봇 인증 엔드포인트

```
POST /api/bots/auth
Authorization: Bearer {API_KEY}
```

API 키를 검증하고 봇 정보를 반환합니다. SDK의 `authenticate()` 메서드가 내부적으로 호출합니다.

### API 키 관리

| 기능 | 설명 |
|------|------|
| 키별 Scope | 키마다 접근 범위를 제한할 수 있습니다 |
| 만료일 설정 | 키 발급 시 유효 기간(일)을 설정할 수 있습니다 |
| 사용 추적 | 마지막 사용 시각, 사용 횟수가 기록됩니다 |
| 즉시 폐기 | 발급된 키를 즉시 무효화할 수 있습니다 |

### 사용 가능한 Scope

| Scope | 설명 |
|-------|------|
| `messages:read` | 메시지 조회, 검색 |
| `messages:write` | 메시지 전송 |
| `channels:read` | 채널/프로젝트/토픽 목록 조회 |
| `tasks:read` | 태스크 목록 조회 |
| `tasks:write` | 태스크 생성/수정 |
| `users:read` | 사용자 정보 조회 |
| `files:read` | 파일 조회/다운로드 |
| `files:write` | 파일 업로드 |
| `webhooks:write` | 웹훅 설정 관리 |

> Scope를 지정하지 않으면 모든 도구에 접근할 수 있습니다.

## 실시간 이벤트

Workhub은 내부 EventBus(NATS 기반)를 통해 이벤트를 발행합니다. 외부 봇은 Webhook을 통해 이벤트를 수신합니다.

### 주요 이벤트

| 이벤트 | 설명 |
|--------|------|
| `message.created` | 새 메시지 생성 |
| `message.updated` | 메시지 수정 |
| `message.deleted` | 메시지 삭제 |
| `task.created` | 태스크 생성 |
| `task.status_changed` | 태스크 상태 변경 |
| `task.assigned` | 태스크 담당자 변경 |

자세한 내용은 [Webhook](./webhook) 문서를 참고하세요.
