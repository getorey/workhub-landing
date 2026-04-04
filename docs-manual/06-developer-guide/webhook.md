# Webhook

Webhook을 사용하면 Workhub에서 발생하는 이벤트를 실시간으로 수신할 수 있습니다. 봇이 메시지 생성, 태스크 변경 등의 이벤트에 반응하도록 구현할 때 사용합니다.

## 동작 방식

```
Workhub 서버 ──── HTTP POST ────▶ 봇 Webhook 서버
                                   (이벤트 수신 및 처리)
```

1. 봇 등록 시 Webhook URL을 설정합니다
2. Workhub에서 이벤트 발생 시 해당 URL로 HTTP POST 요청을 전송합니다
3. 봇의 Webhook 서버가 이벤트를 수신하고 처리합니다

## 이벤트 형식

```json
{
  "event_type": "message.created",
  "timestamp": "2026-03-31T12:00:00Z",
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

## 이벤트 유형

| 이벤트 | 설명 |
|--------|------|
| `message.created` | 새 메시지 생성 |
| `message.updated` | 메시지 수정 |
| `message.deleted` | 메시지 삭제 |
| `task.created` | 태스크 생성 |
| `task.updated` | 태스크 상태/내용 변경 |
| `channel.updated` | 채널 정보 변경 |
| `member.joined` | 채널에 멤버 참여 |
| `member.left` | 채널에서 멤버 나감 |

## 서명 검증

Webhook 요청의 무결성을 확인하려면 `signature` 필드를 검증합니다. 봇 등록 시 설정한 시크릿 키로 HMAC-SHA256 해시를 계산하고 비교합니다.

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
  port: 9000,       // 수신 포트 (기본: 8000)
  secret: "시크릿",  // HMAC 서명 검증용
  path: "/webhook",  // 수신 경로 (기본: /webhook)
});

// 특정 이벤트 핸들러
webhook.on("message.created", async (event: WebhookEvent) => {
  console.log(`새 메시지: ${event.data.content}`);
});

webhook.on("task.updated", async (event: WebhookEvent) => {
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

@webhook.on("task.updated")
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

## 배포 시 고려사항

- Webhook URL은 외부에서 접근 가능한 공개 URL이어야 합니다
- HTTPS 사용을 권장합니다
- 서명 검증을 반드시 활성화하세요
- 이벤트 처리에 실패하면 Workhub이 재시도합니다 (최대 3회)
- 5초 이내에 응답하지 않으면 타임아웃 처리됩니다
