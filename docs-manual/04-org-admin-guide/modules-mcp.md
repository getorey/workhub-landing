# MCP (Claude / 외부 클라이언트 연결)

워크허브는 **Model Context Protocol (MCP)** 서버를 내장 노출하여 Claude Desktop / Claude Code /
기타 MCP 호환 클라이언트가 본인 워크허브 계정의 채널 / 태스크 / Gmail / Drive / 재무 등을
직접 조작할 수 있게 해줍니다.

> **MCP 는 항상 노출되는 시스템 기능**: 별도 모듈 토글이 없습니다. 워크허브 백엔드가
> 떠 있는 한 `/api/mcp` 엔드포인트는 항상 활성. 단, **사용자가 MCP 토큰을 발급하기 전까지는
> 누구도 접속할 수 없으므로** 사실상 사용자 단위로 opt-in 됩니다.

---

## 1. MCP 가 무엇인가

Model Context Protocol — Anthropic 이 공개한 표준 (https://modelcontextprotocol.io). LLM
클라이언트가 외부 시스템의 데이터·도구를 호출할 수 있도록 JSON-RPC 2.0 + SSE 기반의
인터페이스를 정의합니다.

워크허브 MCP 서버는 **본인 권한 한도 안에서** 다음을 노출:

- 채널 / 메시지 / 태스크 조회 / 작성
- Gmail 메일 분류 / 발신 (Gmail 모듈 활성 + 본인 OAuth 동의 시)
- Drive 파일 첨부 / 권한 부여 (Drive 모듈 활성 + 본인 OAuth 동의 시)
- 재무 (경비 / 청구 / 계약) 조회 / 작성
- CRM 명함 / 미팅 / 고객 조회

---

## 2. 사용자 PAT (Personal Access Token) 정책

### 2.1 누가 발급할 수 있나

**모든 사용자** — 본인 프로필 화면에서 직접 발급 가능. 기관관리자 승인 불필요.

- 위치: 워크허브 → 프로필 (`/app/profile`) → 화면 하단 **"MCP 토큰"** 섹션
- 토큰은 발급 시 1회만 표시 (재조회 불가)
- 만료 옵션: 30 / 90 / 365일 또는 무기한
- 본인이 언제든 [폐기] 가능

자세한 사용자 가이드: [Claude / MCP 클라이언트 연결](../02-user-guide/claude-mcp-integration.md)

### 2.2 OAuth 클라이언트 등록 (Claude Desktop OAuth)

Claude Desktop 은 `mcp-remote` 를 통해 OAuth 2.1 + PKCE 흐름으로 워크허브에 접속합니다.

| 항목 | 값 / 위치 |
|---|---|
| OAuth Discovery | `https://<워크허브 도메인>/.well-known/oauth-authorization-server` (자동) |
| Authorization endpoint | `/oauth/authorize` (워크허브 자동 제공) |
| Token endpoint | `/oauth/token` (워크허브 자동 제공) |
| Client Registration | Dynamic Client Registration (RFC 7591) — Claude Desktop 이 자동 등록 |
| 발급된 토큰 | 본인 프로필 → MCP 토큰 화면에 `OAuth: wh-...` 이름으로 표시 |

→ Claude Desktop / Claude Code 모두 워크허브 측 별도 설정 불필요. 사용자가 클라이언트 측에서
`mcp-remote` 로 URL 만 지정하면 OAuth 흐름이 자동 진행됩니다.

---

## 3. MCP 도구 (Tools) 일람

연결된 클라이언트가 자동 인식하는 도구 목록 (사용자 권한 / 모듈 활성 상태에 따라 가시성 결정):

### 워크허브 코어 (항상)

| 분류 | Tool |
|---|---|
| 채널 / 메시지 | `list_channels`, `list_thread`, `read_messages`, `send_message`, `add_reaction`, `remove_reaction`, `pin_message`, `unpin_message` |
| 태스크 | `list_tasks`, `create_task`, `update_task` |
| 사용자 | `get_user_info`, `list_users`, `get_dm_room` |
| 검색 | `search` |

### Google 연동 (Gmail / Drive 모듈 활성 + 본인 OAuth 시)

| Tool | 의존 모듈 |
|---|---|
| `list_modules`, `list_shared_drives`, `attach_drive_file` | Drive |
| `gmail_list_threads`, `gmail_get_message`, `gmail_get_thread`, `gmail_modify_labels`, `gmail_send`, `gmail_list_message_attachments`, `gmail_import_attachment` | Gmail (+ Drive for import) |
| `tag_email`, `mark_email_processed` | Gmail |
| `create_task_from_email`, `create_expense_from_email` | Gmail (+ Finance for expense) |

### 재무 연동 (재무 모듈 활성 시)

| Tool | 용도 |
|---|---|
| `list_finance_clients`, `list_finance_contracts`, `list_finance_expenses`, `list_finance_billing_items`, `list_finance_receivables`, `list_finance_sales_ledger`, `get_finance_summary` | 조회 |
| `create_finance_client`, `create_finance_contract`, `create_finance_expense`, `update_finance_expense`, `record_billing_payment`, `attach_invoice_to_billing`, `attach_receipt_to_expense` | 작성 |

→ Gmail / Drive / Finance / CRM 등 모듈 비활성 시 해당 도구는 호출 시 403 (모듈 비활성).

자세한 사용자 가이드: [Gmail 모듈 — 5. MCP + Claude 스킬](../02-user-guide/gmail-module.md#5-mcp--claude-스킬로-메일-자동-분류-)

---

## 4. 권한 모델 (중요)

- 발급된 토큰은 **본인 계정의 모든 권한** 을 그대로 가집니다 (role, 소속 채널, OAuth scope 등)
- 본인이 워크허브 UI 에서 못 하는 작업은 MCP 도 못 함 (RBAC 동일 적용)
- **org_admin 토큰은 특히 주의** — Claude 가 모듈 활성화 / 사용자 추가까지 호출 가능
- 한 토큰은 한 사용자의 한 기관 컨텍스트 — 다른 기관 데이터에 접근 불가

---

## 5. 보안 / 운영 권장사항

### 토큰 보관 (사용자 책임)

- 토큰은 **암호와 동일한 보안 수준** 으로 다룰 것 (Keychain / 1Password 등)
- 평문으로 채팅 / 이메일 / 문서 / Git 에 노출 금지

### 폐기 경로

| 경로 | 누가 |
|---|---|
| 워크허브 → 프로필 → MCP 토큰 → [폐기] | 본인 |
| 사용자 비활성화 (퇴사) | 기관관리자 — 사용자 계정 비활성 시 토큰 자동 무효화 |
| 시스템 장애 시 일괄 폐기 | 시스템관리자 (별도 운영 작업) |

### 활동 모니터링

- 각 토큰의 **마지막 사용 시각** 이 화면에 표시
- 본인이 사용 안 한 시각에 활동이 보이면 → 즉시 폐기 + 비밀번호 변경
- (Future) 토큰별 호출 audit log — 현재는 시스템 audit 에만 기록

### 폐기 권장 시점

- 사용 기기 분실 / 도난
- 노트북 양도 / 폐기 전
- 정기 보안 점검 (3~6개월)

---

## 6. 모듈 / 시스템 비활성화 시 영향

MCP 자체는 모듈 토글이 없으므로 끌 수 없습니다. 단:

| 작업 | 효과 |
|---|---|
| 사용자가 본인 토큰 전부 [폐기] | 본인 측 MCP 호출만 즉시 불가 |
| 기관관리자가 Gmail 모듈 OFF | 모든 사용자의 `gmail_*` 도구가 403 (다른 도구는 정상) |
| 기관관리자가 Drive 모듈 OFF | 모든 사용자의 `attach_drive_file` 등이 403 |
| 기관관리자가 재무 모듈 OFF | 모든 사용자의 `finance_*` 도구가 403 |
| 시스템관리자가 MCP 엔드포인트 비활성 | 운영 환경변수 조정 — 전체 기관 영향 (시스템관리자 영역) |

---

## 7. 트러블슈팅

### 사용자가 "401 Unauthorized" / "404 Not Found"

- URL 의 `/api/mcp` 누락 (자주 발생)
- 토큰 폐기됨 / 만료됨 — 새로 발급
- 자세히: [사용자 가이드 — 자주 막히는 곳](../02-user-guide/claude-mcp-integration.md#자주-막히는-곳)

### Claude Desktop OAuth 가 "동의 화면이 안 보이고 로그인 화면"

- 사용자가 워크허브에 미리 로그인 → 자동으로 동의 화면 redirect
- 본인이 시도하는 사용자가 다른 계정으로 워크허브에 로그인돼 있으면 의도와 다른 계정의 토큰이 발급될 수 있음

### Tool 호출 시 권한 부족

- 본인이 그 작업을 워크허브 UI 에서 못 하면 MCP 도 동일하게 거부 (RBAC 정상 동작)

---

## 관련 가이드

- [Claude / MCP 클라이언트 연결 (사용자 가이드)](../02-user-guide/claude-mcp-integration.md) — 사용자 토큰 발급 / Claude Desktop / Code 설정
- [Gmail 모듈 (사용자 가이드) — 5. MCP 스킬](../02-user-guide/gmail-module.md#5-mcp--claude-스킬로-메일-자동-분류-) — 메일 트리아지 스킬 예시
- [Gmail 모듈 (관리자)](./modules-gmail.md) — 모듈 활성화 (MCP `gmail_*` 도구 의존)
- [Drive 모듈 (관리자)](./modules-gdrive.md) — 모듈 활성화 (MCP `attach_drive_file` 등 의존)
