# MCP 서버

Workhub MCP 서버는 [Model Context Protocol](https://modelcontextprotocol.io/) 표준을 따르는 도구 서버입니다. AI 에이전트나 외부 시스템이 JSON-RPC 2.0 프로토콜을 통해 Workhub의 기능에 접근할 수 있습니다.

## 엔드포인트

```
POST /api/mcp
Content-Type: application/json
Authorization: Bearer {API_KEY}
```

## 프로토콜

MCP 서버는 **JSON-RPC 2.0** 프로토콜을 사용하며, MCP 버전 `2025-03-26`을 준수합니다.

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
| `-32600` | 잘못된 요청 |
| `-32601` | 존재하지 않는 메서드 |
| `-32602` | 잘못된 파라미터 |
| `-32603` | 내부 서버 오류 |

## AI 에이전트 연동

MCP 서버는 Claude, GPT 등 AI 에이전트에서 직접 연동할 수 있습니다.

### Claude Desktop 설정 예시

`claude_desktop_config.json`에 다음을 추가합니다:

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

설정 후 Claude에서 "채널 목록을 보여줘", "태스크를 만들어줘" 등 자연어로 Workhub을 제어할 수 있습니다.
