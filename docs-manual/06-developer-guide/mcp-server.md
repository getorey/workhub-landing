# MCP 서버

Workhub MCP 서버는 [Model Context Protocol](https://modelcontextprotocol.io/) 표준을 따르는 도구 서버입니다. AI 에이전트나 외부 시스템이 JSON-RPC 2.0 프로토콜을 통해 Workhub의 기능에 접근할 수 있습니다.

## 엔드포인트

```
POST /api/mcp
Content-Type: application/json
Authorization: Bearer {API_KEY}
```

::: tip 인증 방식 (둘 중 하나)
- **개인 MCP 토큰 (권장)** — 내 프로필 → "Claude / MCP 연결"에서 발급한 Personal Access Token(JWT). 발급한 본인의 권한(RBAC)으로 동작합니다. Claude Desktop / Claude Code 등 개인 클라이언트 연동에 사용하세요.
- **봇 API 키** — 봇 등록 후 발급한 키. 봇 scope 범위 내에서 동작합니다.

`Authorization: Bearer <토큰>` 헤더로 전달합니다.
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

MCP 서버는 **45개 도구**를 7개 영역으로 제공합니다. `tools/list` 로 현재 활성 목록을 동적 조회할 수 있으며, 각 도구는 호출 시 아래 Scope(또는 발급자 RBAC 권한)를 검증합니다.

### 메시지 · 채널 · DM

| 도구 | Scope | 설명 |
|------|-------|------|
| `send_message` | `messages:write` | 채널/토픽/DM에 메시지 전송 |
| `read_messages` | `messages:read` | 최근 메시지 조회 (최대 100) |
| `list_channels` | `channels:read` | 채널/프로젝트/토픽 목록 |
| `list_thread` | `messages:read` | 부모 메시지의 스레드 답글 목록 |
| `add_reaction` | `reactions:write` | 메시지에 이모지 반응 추가 |
| `remove_reaction` | `reactions:write` | 이모지 반응 제거 |
| `pin_message` | `reactions:write` | 메시지 고정 |
| `unpin_message` | `reactions:write` | 메시지 고정 해제 |

### 태스크

| 도구 | Scope | 설명 |
|------|-------|------|
| `create_task` | `tasks:write` | 토픽에 태스크 생성 |
| `update_task` | `tasks:write` | 태스크 상태/정보 수정 |
| `list_tasks` | `tasks:read` | 토픽의 태스크 목록 |
| `create_task_from_email` | `tasks:write` | Gmail 메일을 소스로 태스크 생성 |

### 사용자 · 검색 · 모듈

| 도구 | Scope | 설명 |
|------|-------|------|
| `get_user_info` | `users:read` | 사용자 정보 조회 (ID/이메일) |
| `list_users` | `users:read` | 조직 사용자 목록 |
| `get_dm_room` | `messages:write` | 사용자와의 DM 룸 조회/생성 |
| `search` | any | 메시지/사용자/태스크 통합 검색 |
| `list_modules` | `modules:read` | 조직 모듈 목록 + 활성 상태 |

### Gmail

| 도구 | Scope | 설명 |
|------|-------|------|
| `gmail_list_threads` | `gmail:read` | 메일함 스레드 목록 (최근 30일 INBOX) |
| `gmail_get_message` | `gmail:read` | 메일 본문 조회 |
| `gmail_get_thread` | `gmail:read` | 스레드 전체 메시지 |
| `gmail_list_message_attachments` | `gmail:read` | 메일 첨부 메타 조회 |
| `gmail_modify_labels` | `gmail:write` | 라벨 추가/제거 (별표·읽음·중요·휴지통) |
| `gmail_send` | `gmail:write` | 메일 발신 (RFC822) |
| `gmail_create_draft` | `gmail:write` | 메일 초안 생성 (웹에서 검토 후 발송) |
| `gmail_import_attachment` | `gmail:write` | 첨부를 Drive 로 가져오기 |

### 메일 분류 · 처리 태그

| 도구 | Scope | 설명 |
|------|-------|------|
| `list_email_tags` | `gmail:read` | 워크허브 분류 정규 태그 목록 |
| `tag_email` | `gmail:write` | 메일에 분류 태그 추가/제거 |
| `tag_email_batch` | `gmail:write` | 여러 메일 일괄 태그 (최대 100) |
| `mark_email_processed` | `gmail:write` | MCP 처리 표시 기록 |

### Google Drive

| 도구 | Scope | 설명 |
|------|-------|------|
| `list_shared_drives` | `gdrive:read` | 연결된 공유 드라이브 목록 |
| `attach_drive_file` | `gdrive:write` | Drive 파일을 메시지/태스크에 첨부 |

### 재무 (Finance)

| 도구 | Scope | 설명 |
|------|-------|------|
| `list_finance_clients` | `finance:read` | 거래처(client/vendor) 목록 |
| `list_finance_contracts` | `finance:read` | 매출 계약 목록 |
| `list_finance_billing_items` | `finance:read` | 계약의 청구·기성 행 |
| `list_finance_expenses` | `finance:read` | 지출 목록 (기간 필터) |
| `list_finance_receivables` | `finance:read` | 미수금 현황 (거래처별 + 연체일) |
| `list_finance_sales_ledger` | `finance:read` | 매출대장 통합 보고서 |
| `get_finance_summary` | `finance:read` | 재정 KPI (YTD 매출/지출/잔액) |
| `create_finance_client` | `finance:write` | 거래처 등록 |
| `create_finance_contract` | `finance:write` | 매출 계약 등록 (1천만↑ `confirm:true`) |
| `create_finance_expense` | `finance:write` | 지출 등록 (1천만↑ `confirm:true`) |
| `update_finance_expense` | `finance:write` | 지출 수정 (paid 행 거부) |
| `record_billing_payment` | `finance:write` | 청구 행 입금 기록 (`confirm:true`) |
| `attach_receipt_to_expense` | `finance:write` | 지출에 영수증/세금계산서 연결 |
| `attach_invoice_to_billing` | `finance:write` | 청구에 인보이스/세금계산서 연결 |
| `create_expense_from_email` | `finance:write` | Gmail 인보이스 메일+PDF → 지출 등록 |

::: warning 쓰기 도구 가드
- 금액이 큰 재무 쓰기(`create_finance_contract`/`create_finance_expense` 공급가 1천만 원 초과, `record_billing_payment`)는 `confirm: true` 를 명시해야 실행됩니다.
- `update_finance_expense` 는 이미 `paid` 상태인 행을 수정하지 않습니다(회계 무결성).
- `create_finance_expense` 는 자격증명/OTP 의심 메일을 소스로 거부합니다.
:::

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
