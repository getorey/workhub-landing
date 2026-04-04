# 개발자 가이드

Workhub은 외부 시스템 연동 및 자동화를 위한 **MCP 서버**와 **Bot SDK**를 제공합니다.

## 구성 요소

| 구성 요소 | 설명 |
|-----------|------|
| [MCP 서버](./mcp-server) | Model Context Protocol 기반 도구 서버 (JSON-RPC 2.0) |
| [TypeScript SDK](./sdk-typescript) | Node.js 봇 개발용 SDK (`@workhub/bot-sdk`) |
| [Python SDK](./sdk-python) | Python 봇 개발용 SDK (`workhub_bot_sdk`) |
| [API 레퍼런스](./api-reference) | MCP 도구 전체 명세 및 파라미터 |
| [Webhook](./webhook) | 이벤트 수신 및 실시간 연동 |

## 아키텍처 개요

```
외부 봇/서비스
     │
     ▼
┌─────────────┐    JSON-RPC 2.0    ┌──────────────┐
│  Bot SDK    │  ───────────────▶  │  MCP Server  │
│ (TS/Python) │  ◀───────────────  │  /api/mcp    │
└─────────────┘                    └──────┬───────┘
                                          │
                                   ┌──────▼───────┐
                                   │  PostgreSQL   │
                                   │  NATS         │
                                   └──────────────┘
```

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

모든 API 요청에는 `Authorization` 헤더가 필요합니다:

```
Authorization: Bearer {API_KEY}
```

API 키는 봇 등록 시 발급되며, 키별로 접근 범위(scope)를 제한할 수 있습니다.

### 사용 가능한 Scope

| Scope | 설명 |
|-------|------|
| `messages:read` | 메시지 조회, 검색 |
| `messages:write` | 메시지 전송 |
| `channels:read` | 채널/프로젝트/토픽 목록 조회 |
| `tasks:read` | 태스크 목록 조회 |
| `tasks:write` | 태스크 생성/수정 |
| `users:read` | 사용자 정보 조회 |

> Scope를 지정하지 않으면 모든 도구에 접근할 수 있습니다.
