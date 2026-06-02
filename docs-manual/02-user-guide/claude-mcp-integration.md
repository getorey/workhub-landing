# Claude / MCP 클라이언트 연결 (Personal Access Token)

Claude Desktop / Claude Code / 기타 MCP 호환 클라이언트에서 **본인 워크허브 계정** 으로 접속해 채널/메시지/태스크를 다룰 수 있습니다.

## 사전 준비

- 워크허브 로그인 가능한 본인 계정
- 워크허브 운영 도메인 (예: `https://workhub.example.com`) — 본 가이드에선 `<WORKHUB_HOST>` 로 표기

## 1. MCP 토큰 발급

1. 워크허브 좌측 사이드바 → **프로필** (`/app/profile`)
2. 화면 하단의 **MCP 토큰** 섹션
3. **"새 토큰 발급"** 버튼 클릭
4. 입력:
   - **이름**: 사용 환경 식별용 (예: `MacBook Claude Desktop`, `회사 노트북 Claude Code`)
   - **만료 기간**: 무기한 / 30일 / 90일 / 365일 중 선택
5. **"발급"** 클릭
6. **토큰이 화면에 1회만 표시**됩니다 (`eyJ...` 로 시작하는 긴 문자열). 안전한 곳에 복사:
   - 1Password / Bitwarden 등 비밀번호 관리자
   - 또는 OS 의 keychain
7. **"확인 — 닫기"** 클릭 후엔 다시 볼 수 없습니다. 잃어버리면 폐기 후 재발급.

발급된 토큰은 사용자 본인의 모든 권한 (role/orgID) 을 가집니다. 즉 워크허브에서 본인이 할 수 있는 모든 작업을 MCP 로 동일하게 수행 가능.

## 2. Claude Desktop 연결

### 설정 파일 위치

| OS | 경로 |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

### 설정 내용

```json
{
  "mcpServers": {
    "workhub": {
      "url": "https://<WORKHUB_HOST>/api/mcp",
      "transport": "sse",
      "headers": {
        "Authorization": "Bearer <발급받은_토큰>"
      }
    }
  }
}
```

- `<WORKHUB_HOST>` 는 워크허브 운영 도메인 (예: `workhub.example.com`)
- `<발급받은_토큰>` 는 1번 단계에서 복사한 `eyJ...` 문자열
- 파일 저장 후 Claude Desktop **재시작**

### 연결 검증

Claude Desktop 채팅 입력창 옆의 도구 아이콘에 `workhub` 가 표시되면 연결 성공. Claude 에게 다음을 요청해보면 됨:

```
workhub 의 list_channels tool 로 내가 참여한 채널 목록을 보여줘
```

## 3. Claude Code 연결

### 설정 파일

```
~/.claude/mcp.json
```

### 설정 내용

Claude Desktop 과 동일한 JSON 구조. 또는 슬래시 명령으로 등록:

```
/mcp add workhub --url https://<WORKHUB_HOST>/api/mcp --header "Authorization: Bearer <토큰>"
```

### 검증

```
/mcp list
```

`workhub` 가 연결됨으로 표시되어야 합니다.

## 4. 사용 가능한 Tool

연결 후 Claude 가 자동으로 다음 tool 을 인식합니다 (워크허브 본인 권한 범위 내):

| Tool | 동작 |
|------|------|
| `list_channels` | 참여 채널 목록 |
| `read_messages` | 채널/DM/토픽의 메시지 조회 |
| `send_message` | 채널/DM/토픽에 메시지 전송 |
| `list_tasks` | 본인 태스크 목록 |
| `create_task` | 새 태스크 생성 |
| `update_task` | 태스크 수정 |
| `search` | 통합 검색 (메시지/파일/태스크) |
| `get_user_info` | 사용자 정보 조회 |
| `list_users` | 조직 사용자 목록 |
| `get_dm_room` | DM 방 정보 |
| `add_reaction` / `remove_reaction` | 메시지 이모지 반응 |
| `pin_message` / `unpin_message` | 메시지 고정 |
| `list_thread` | 스레드 메시지 목록 |

## 5. 토큰 관리

### 목록 / 폐기

워크허브 → 프로필 → MCP 토큰 섹션에서 본인 토큰 목록을 볼 수 있습니다:

- **이름** / **생성 시각** / **마지막 사용** / **만료 일자**
- 사용하지 않는 토큰은 **폐기** 버튼으로 즉시 무효화
- 폐기된 토큰으로 시도하면 즉시 401 응답

### 만료된 토큰

- 만료 일자 도달 시 자동으로 사용 불가 (Claude 측은 인증 실패 → 재발급 필요)
- 만료 임박 알림은 후속 기능 — 현재는 본인이 만료일 관리

### 폐기 정책

다음 경우 토큰 폐기를 권장합니다:
- 사용 기기 분실/도난
- 노트북 양도/폐기 전
- Claude 설정 파일이 다른 사람과 공유될 수 있는 환경
- 정기 보안 점검 (3~6개월)

## 6. 보안 주의사항

### 토큰 보관

- 토큰은 **암호와 동일한 보안 수준** 으로 다루세요
- 평문으로 채팅/이메일/문서에 공유 금지
- Git 저장소에 commit 금지 (`.env` 파일 사용 + `.gitignore` 등록)

### 권한 범위

발급된 토큰은 **본인의 모든 권한** 을 가집니다 (role/department/소속 채널 등). 예:
- 관리자라면 관리자 권한도 그대로 사용 가능 → MCP 로 사용자 추가/모듈 활성화 등 가능
- 본인이 못 보는 채널은 MCP 에서도 못 봄
- 본인이 멤버인 채널은 MCP 에서 메시지 전송 가능 → 봇처럼 자동화 가능

### 외부 공격면

- 토큰 유출 시 → 워크허브 → 프로필 → MCP 토큰 → 해당 토큰 즉시 폐기
- 정기적으로 **마지막 사용** 시각 확인 — 본인이 사용 안 한 시각의 활동 발견 시 폐기 + 비밀번호 변경 권장

## 7. 트러블슈팅

### "401 Unauthorized"

- 토큰이 잘못됐거나 폐기됨
- 워크허브에서 토큰 상태 확인 → 폐기됐으면 새로 발급

### "404 Not Found" 또는 연결 안 됨

- `url` 의 도메인/경로 정확한지 확인 (`/api/mcp` 누락 자주)
- 도메인이 HTTPS 인지 (Claude Desktop 은 보통 HTTPS 요구)
- 워크허브 운영 가동 여부 확인

### Claude Desktop 에 workhub tool 이 안 보임

- `claude_desktop_config.json` 위치 정확한지 확인
- JSON 문법 오류 (콤마, 따옴표 등) — VS Code 등으로 미리 검증
- Claude Desktop **완전히 종료 후 재시작** (Dock 메뉴 quit 또는 cmd+Q)

### "Tool 호출 시 권한 부족"

- 본인이 워크허브에서 그 작업을 할 수 없으면 MCP 에서도 불가
- 예: 본인이 멤버 아닌 채널의 메시지 전송 시도 → 403
- 워크허브 RBAC 그대로 적용

### SSE 연결이 자주 끊김

- 네트워크 환경 (방화벽, 프록시) 가 long-lived SSE 를 차단할 수 있음
- 회사 네트워크면 IT 팀에 SSE 허용 요청
- 우회로: 폴링 모드 사용 (Claude 측 설정 — 클라이언트별로 다름)

## 8. FAQ

**Q. 토큰 발급 시 비밀번호 다시 묻나요?**
A. 현재 안 묻습니다. 워크허브 로그인 세션만 있으면 발급 가능. 보안 우려 시 시스템 관리자에게 추가 검증 옵션 요청 가능.

**Q. 한 번에 몇 개까지 토큰을 만들 수 있나요?**
A. 제한 없음. 단 사용하지 않는 토큰은 폐기 권장 (관리 부담 + 잠재적 유출 면적).

**Q. 만료된 토큰을 다시 활성화할 수 있나요?**
A. 불가. 새로 발급해야 합니다. 같은 이름으로 발급 가능.

**Q. 토큰을 다른 사람과 공유해도 되나요?**
A. 절대 금지. 토큰은 본인 권한과 동일하므로 공유 시 해당 사용자가 본인 계정으로 모든 작업을 할 수 있습니다.

**Q. 모바일에서도 사용 가능한가요?**
A. Claude 모바일 앱이 MCP 를 지원하면 가능 (2026-06 현재 한정적). 토큰 자체는 동일하게 동작.

**Q. 워크허브 비밀번호 변경 시 토큰은 어떻게 되나요?**
A. 영향 없음. 토큰은 비밀번호와 독립적입니다. 비밀번호 노출 우려 시 토큰도 별도 폐기 권장.

---

## 참고

- 워크허브 MCP server 자체 사양: `/api/mcp` (JSON-RPC 2.0 + SSE)
- MCP 표준: https://modelcontextprotocol.io
- Claude Desktop 다운로드: https://claude.ai/download
