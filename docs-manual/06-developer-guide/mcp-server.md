# MCP 서버

Workhub MCP 서버는 [Model Context Protocol](https://modelcontextprotocol.io/) 표준을 따르는 도구 서버입니다. AI 에이전트나 외부 시스템이 JSON-RPC 2.0 프로토콜을 통해 Workhub의 기능에 접근할 수 있습니다.

## 엔드포인트

```
POST /api/mcp
Content-Type: application/json
Authorization: Bearer {API_KEY}
```

::: tip
MCP 엔드포인트는 사용자 인증이 아닌 **봇 API 키**로 인증합니다. 봇 등록 후 발급받은 API 키를 사용하세요.
:::

## 프로토콜

MCP 서버는 **JSON-RPC 2.0** 프로토콜을 사용하며, MCP 버전 `2025-03-26`을 준수합니다. HTTP POST 및 SSE(Server-Sent Events) 전송��� 지원합니다.

### 요청 형식

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "method": "tools/call",
  "params": {
    "name": "send_message",
    "arguments": {
      "channel_id": "채널-UUID",
      "content": "안녕하세요!"
    }
  }
}
```

### 응답 형식

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Message sent successfully (id: msg-uuid)"
      }
    ]
  }
}
```

### 에러 응답

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "error": {
    "code": -32602,
    "message": "invalid params: content is required"
  }
}
```

## 표준 메서드

| 메서드 | 설명 |
|--------|------|
| `initialize` | MCP 세션 초기화 |
| `ping` | 연결 상태 확인 |
| `tools/list` | 사용 가능한 도구 목록 조회 |
| `tools/call` | 도구 실행 |
| `resources/list` | 리소스 목록 조회 |

## 제공 도구 (Tools)

MCP 서버에서 제공하는 9개 도구입니다:

| 도구 | Scope | 설명 |
|------|-------|------|
| `send_message` | `messages:write` | 채널/토픽/DM에 메시지 전송 |
| `read_messages` | `messages:read` | 최근 메시지 조회 |
| `list_channels` | `channels:read` | 채널/프로젝트/토픽 목록 |
| `create_task` | `tasks:write` | 태스크 생성 |
| `update_task` | `tasks:write` | 태스크 수정 |
| `list_tasks` | `tasks:read` | 태스크 목록 조회 |
| `search` | any | 통합 검색 |
| `get_user_info` | `users:read` | 사용자 정보 조회 |
| `list_users` | `users:read` | 사용자 목록 조회 |

각 도구의 상세 파라미터는 [API 레퍼런스](./api-reference)를 참고하세요.

## 세션 초기화

MCP 세션을 시작하려면 먼저 `initialize`를 호출합니다:

```json
{
  "jsonrpc": "2.0",
  "id": "init-001",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-03-26",
    "capabilities": {},
    "clientInfo": {
      "name": "my-bot",
      "version": "1.0.0"
    }
  }
}
```

응답에 서버의 기능(capabilities)과 사용 가능한 도구 정보가 포함됩니다.

## 에러 코드

| 코드 | 의미 |
|------|------|
| `-32700` | 파싱 오류 (잘못된 JSON) |
| `-32600` | ��못된 요청 |
| `-32601` | 존재��지 않는 메서드 |
| `-32602` | 잘못된 파라미터 |
| `-32603` | 내부 서버 오류 |

## Scope 검증

API 키에 Scope가 설정된 경우, 도구 호출 시 해당 Scope를 충족하는지 검증합니다.

예시: `messages:read` Scope만 가진 키로 `send_message`(messages:write) 호출 시 권한 오류가 발생합니다.

## AI 에이전트 연동

MCP 서버는 Claude, GPT 등 AI 에이전트에서 직접 연동할 수 있��니다.

### Claude Desktop 설정 예시

`claude_desktop_config.json`에 다음을 추가합��다:

```json
{
  "mcpServers": {
    "workhub": {
      "url": "https://workhub.example.com/api/mcp",
      "headers": {
        "Authorization": "Bearer whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

설정 후 Claude에서 자연어로 Workhub을 제어할 수 있습니다:
- "채널 목록을 보여줘"
- "개발팀 채널에 배포 완료 메시지 보내줘"
- "마감 임박한 태스크 목록 알려줘"
