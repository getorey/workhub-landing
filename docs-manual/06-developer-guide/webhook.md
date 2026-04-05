# Webhook

Webhook을 사용하면 Workhub에서 발생하는 이벤트를 실시간으로 수신할 수 있습니다. 봇이 메시지 생성, 태스크 변경 등의 이벤트에 반응하도록 구현할 때 사용합니다.

## 동작 방식

### Outgoing Webhook (이벤트 발신)

Workhub 서버가 봇의 Webhook URL로 이벤트를 전송합니다.

```
Workhub EventBus (NATS)
       │
       ▼
┌──────────────────┐    HTTP POST    ┌───────────────────┐
│  Bot Subscription│  ────────────▶  │  봇 Webhook 서버  │
│  Engine          │  ◀────────────  │  (이벤트 수신)     │
└──────────────────┘    200 OK       └───────────────────┘
```

1. 봇 등록 시 Webhook URL을 설정합니다
2. 봇이 구독한 이벤트 발생 시 해당 URL로 HTTP POST 요청을 전송합니다
3. 봇의 Webhook 서버가 이벤트를 수신하고 처리합니다

### Incoming Webhook (이벤트 수신)

외부 서비스가 Workhub으로 메시지를 전송합니다.

```
POST /api/webhooks/incoming/{bot_id}
Content-Type: application/json
```

## 이벤트 형식

```json
{
  "event_type": "message.created",
  "timestamp": "2026-04-05T12:00:00Z",
  "bot_id": "bot-uuid",
  "data": {
    "content": "안녕하세요",
    "channel_id": "channel-uuid",
    "sender_id": "user-uuid",
    "sender_type": "user"
  },
  "signature": "sha256=abcdef1234567890..."
}
```

### 이벤트 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `event_type` | string | 이벤트 유형 |
| `timestamp` | string | 발생 시각 (ISO 8601) |
| `bot_id` | string | 수신 봇 ID |
| `data` | object | 이벤트 데이터 |
| `signature` | string | HMAC-SHA256 서명 |

## 구독 가능한 이벤트

| 이벤트 | 설명 |
|--------|------|
| `message.created` | 새 메시지 생성 |
| `message.updated` | 메시지 수정 |
| `message.deleted` | 메시지 삭제 |
| `task.created` | 태스크 생성 |
| `task.status_changed` | 태스크 상태 변경 |
| `channel.updated` | 채널 정보 변경 |
| `member.joined` | 채널에 멤버 참여 |
| `member.left` | 채널에서 멤버 나감 |

## 서명 검증

Webhook 요청의 무결성을 확인하려면 `signature` 필드를 검증합니다. 봇 등록 시 생성된 **Webhook Secret**으로 HMAC-SHA256 해시를 계산하고 비교합니다.

### Webhook Secret 발급

관리자 화면에서 봇 상세 > **"Webhook Secret 생성"** 버튼을 클릭하여 발급합니다. 또는 API로 발급:

```
POST /api/bots/{botId}/webhook-secret
Authorization: Bearer {USER_TOKEN}
```

### 검증 코드

::: code-group

```typescript [TypeScript]
import crypto from "crypto";

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}
```

```python [Python]
import hmac
import hashlib

def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)
```

:::

## SDK Webhook 서버

SDK에 내장된 Webhook 서버를 사용하면 서명 검증이 자동으로 처리됩니다.

::: code-group

```typescript [TypeScript]
import { WebhookServer } from "@workhub/bot-sdk";
import type { WebhookEvent } from "@workhub/bot-sdk";

const webhook = new WebhookServer({
  port: 9000,
  secret: "시크릿",
  path: "/webhook",
});

// 특정 이벤트 핸들러
webhook.on("message.created", async (event: WebhookEvent) => {
  console.log(`새 메시지: ${event.data.content}`);
});

webhook.on("task.status_changed", async (event: WebhookEvent) => {
  console.log(`태스크 변경: ${event.data.task_id}`);
});

// 모든 이벤트 수신 (catch-all)
webhook.on(async (event: WebhookEvent) => {
  console.log(`이벤트: ${event.event_type}`);
});

webhook.start();
```

```python [Python]
from workhub_bot_sdk import WebhookServer, WebhookEvent

webhook = WebhookServer(
    port=9000,
    secret="시크릿",
    path="/webhook",
)

@webhook.on("message.created")
def on_message(event: WebhookEvent):
    print(f"새 메시지: {event.data.get('content')}")

@webhook.on("task.status_changed")
def on_task(event: WebhookEvent):
    print(f"태스크 변경: {event.data.get('task_id')}")

webhook.start()  # 블로킹
```

:::

### WebhookServer 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `port` | number | 8000 | 수신 포트 |
| `secret` | string | - | HMAC-SHA256 서명 검증용 시크릿 |
| `path` | string | `/webhook` | 수신 경로 |

## 재시도 정책

Webhook 전송 실패 시 지수 백오프(exponential backoff)로 재시도합니다:

| 시도 | 대기 시간 | 설명 |
|------|----------|------|
| 1차 | 즉시 | 최초 전송 |
| 2차 | 약 1분 | 1차 실패 후 |
| 3차 | 약 5분 | 2차 실패 후 |

- 최대 3회 재시도
- 5초 이내에 응답하지 않으면 타임아웃

## 배포 시 고려사항

- Webhook URL은 외부에서 접근 가능한 공개 URL이어야 합니다
- HTTPS 사용을 권장합니다
- 서명 검증을 반드시 활성화하세요
- 이벤트 처리는 5초 이내에 완료해야 합니다
- 긴 작업은 이벤트 수신 후 비동기로 처리하세요
