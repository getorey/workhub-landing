# Claude / MCP 클라이언트 연결

Claude Desktop / Claude Code / 기타 MCP 호환 클라이언트에서 **본인 워크허브 계정** 으로 접속해 채널 / DM / 토픽 / 태스크 / Gmail 등을 다룰 수 있습니다.

## 어떤 방식으로 연결하나?

두 가지 인증 경로가 있고 클라이언트 따라 자연스러운 쪽을 선택합니다.

| 클라이언트 | 권장 경로 | 이유 |
|---|---|---|
| **Claude Desktop** (macOS / Windows 데스크톱 앱) | OAuth (자동) | 동의 화면에서 클릭 한 번 |
| **Claude Code** (CLI) | PAT (수동) | 명령줄에서 토큰 직접 등록이 빠름 |
| **임의 MCP 클라이언트** | 둘 다 가능 | 클라이언트가 OAuth 지원하면 OAuth 권장 |

두 방식 모두 워크허브 내부에서는 동일한 JWT 토큰으로 동작하고, 동일한 화면 (프로필 → MCP 토큰) 에서 폐기 가능합니다.

---

## 방법 A — Claude Desktop (OAuth, 권장)

### 1. 워크허브에 로그인된 상태로 둠

Safari / Chrome 등으로 `https://workhub.koavio.com` 에 미리 로그인. 동의 화면이 바로 뜨도록.

### 2. `claude_desktop_config.json` 작성

**경로:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**내용 (이미 다른 MCP 서버가 있으면 `mcpServers` 안에 `"workhub"` 항목만 추가):**
```json
{
  "mcpServers": {
    "workhub": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://workhub.koavio.com/api/mcp"
      ]
    }
  }
}
```

⚠️ **`--header` / `Authorization Bearer` 줄을 넣지 마세요.** OAuth 흐름이 자동으로 토큰을 받습니다. 헤더를 직접 넣으면 OAuth 와 충돌해 401 루프에 빠질 수 있습니다.

### 3. Claude Desktop 완전 종료 후 재시작

macOS 는 `cmd+Q` (창 X 만으로는 부족). Activity Monitor 에서 Claude 프로세스가 정말 사라졌는지 확인 권장.

### 4. 자동으로 열리는 브라우저에서 "허용" 클릭

- 브라우저가 `https://workhub.koavio.com/oauth/authorize?...` 로 자동 이동
- 미로그인 상태면 로그인 화면 → 로그인하면 동의 화면으로 자동 redirect
- "허용" 클릭 → 잠시 후 mcp-remote 가 토큰 받아 연결 완료
- Claude Desktop 의 🔧 도구 아이콘에 `workhub` 표시

⏱ **1분 안에 동의 단계를 끝내야 합니다** (mcp-remote 의 timeout). 미리 로그인해두면 안전.

### OAuth 토큰 폐기

워크허브 → 프로필 → MCP 토큰 → 이름이 `OAuth: wh-...` 인 항목을 폐기.

---

## 방법 B — Claude Code / CLI (PAT, 수동)

PAT (Personal Access Token) 는 사용자가 손으로 발급해서 명령줄에 등록하는 토큰입니다.

### 1. 워크허브에서 토큰 발급

```
워크허브 → 좌측 사이드바 → 프로필 (/app/profile)
  ↓
화면 하단 "MCP 토큰" 섹션 → "새 토큰 발급"
  ↓
이름 (예: "MacBook Claude Code"), 만료 (30/90/365일 또는 무기한)
  ↓
"발급" → eyJ... 로 시작하는 긴 토큰이 1회만 표시
  ↓
1Password / Keychain 등 안전한 곳에 즉시 복사
```

⚠️ **닫으면 다시 볼 수 없습니다.** 잃어버리면 폐기 후 재발급.

### 2. Claude Code 에 등록

```bash
# Claude Code 내부에서 슬래시 명령
/mcp add workhub --url https://workhub.koavio.com/api/mcp \
  --header "Authorization: Bearer <발급받은_토큰>"

# 확인
/mcp list
```

또는 `~/.claude/mcp.json` 직접 편집:
```json
{
  "mcpServers": {
    "workhub": {
      "url": "https://workhub.koavio.com/api/mcp",
      "headers": {
        "Authorization": "Bearer eyJ..."
      }
    }
  }
}
```

### PAT 폐기

워크허브 → 프로필 → MCP 토큰 → 해당 토큰 "폐기".

---

## 사용 가능한 Tool (22개, 2026-06 기준)

연결 후 Claude 가 자동으로 다음 tool 을 인식합니다 (본인 권한 범위 안에서).

### 워크허브 코어 (15)
| 분류 | tool |
|---|---|
| 채널 / 메시지 | `list_channels`, `list_thread`, `read_messages`, `send_message`, `add_reaction`, `remove_reaction`, `pin_message`, `unpin_message` |
| 태스크 | `list_tasks`, `create_task`, `update_task` |
| 사용자 | `get_user_info`, `list_users`, `get_dm_room` |
| 검색 | `search` |

### Google 연동 (7)
| Tool | 동작 |
|---|---|
| `list_modules` | 활성 모듈 목록 |
| `list_shared_drives` | 본인 권한 가능한 공유 드라이브 |
| `attach_drive_file` | 메시지에 Drive 파일 첨부 |
| `gmail_list_threads` | 메일 스레드 목록 |
| `gmail_get_message` | 메일 본문 조회 |
| `gmail_send` | 메일 발신 (gmail.send scope 필요) |
| `create_task_from_email` | 메일 → 태스크 변환 |

→ Google 관련 tool 은 본인 기관이 Google OAuth Client 등록 + Gmail / Drive 모듈 활성 + 본인 OAuth 동의 완료 상태에서만 동작.

---

## 권한 모델 (중요)

- 발급된 토큰은 **본인 계정의 모든 권한** 을 그대로 가집니다 (role, 소속 채널, OAuth scope 등)
- 본인이 워크허브 UI 에서 못 하는 건 MCP 도 못 함
- 본인이 admin 이면 Claude 가 모듈 활성화 / 사용자 추가도 가능 → admin 토큰은 특히 주의

---

## 자주 막히는 곳

### OAuth 흐름 (Claude Desktop)
| 증상 | 원인 / 조치 |
|---|---|
| 브라우저가 안 열림 | 로그의 `Please authorize this client by visiting:` URL 을 직접 복사해 브라우저에 |
| 동의 화면 안 보이고 로그인 화면 | 워크허브에 로그인 → 자동으로 동의 화면으로 이동 |
| "InvalidGrantError: code already used" | 캐시 비우고 재시도: `rm -rf ~/.mcp-auth ~/.npm/_npx` |
| "1분 안에 끝내야 함" timeout | 미리 워크허브 로그인 + Claude Desktop 시작 후 즉시 "허용" 클릭 |
| 도구 아이콘에 workhub 없음 | JSON 문법 오류 — VS Code 등으로 미리 검증. Claude **완전 종료** (cmd+Q) 후 재시작 |

### PAT (Claude Code)
| 증상 | 원인 / 조치 |
|---|---|
| `401 Unauthorized` | 토큰 폐기 / 만료. 워크허브에서 새로 발급 |
| `404 Not Found` | URL 의 `/api/mcp` 누락 — 자주 발생 |
| Tool 호출 시 권한 부족 | 본인이 그 작업을 워크허브에서 못 하면 MCP 도 불가 (RBAC 그대로) |

---

## 보안 주의사항

### 토큰 보관
- 토큰은 **암호와 동일한 보안 수준** 으로 다루세요
- 평문으로 채팅 / 이메일 / 문서에 공유 금지
- Git 저장소에 commit 금지

### 외부 공격면
- 토큰 유출 시 → 워크허브 → 프로필 → MCP 토큰 → 해당 토큰 즉시 폐기
- 정기적으로 **마지막 사용** 시각 확인 — 본인이 사용 안 한 시각의 활동 발견 시 폐기 + 비밀번호 변경

### 폐기 권장 시점
- 사용 기기 분실 / 도난
- 노트북 양도 / 폐기 전
- Claude 설정 파일이 다른 사람과 공유될 수 있는 환경
- 정기 보안 점검 (3~6개월)

---

## FAQ

**Q. OAuth 와 PAT 둘 중 하나만 써야 하나요?**
A. 클라이언트별로 다르게 써도 OK. Claude Desktop 은 OAuth, Claude Code 는 PAT 자연스럽습니다. 두 방식 모두 동일한 토큰 관리 화면에서 보입니다.

**Q. 토큰 발급 시 비밀번호 다시 묻나요?**
A. 현재 안 묻습니다. 워크허브 로그인 세션만 있으면 발급 가능.

**Q. 한 번에 몇 개까지 토큰을 만들 수 있나요?**
A. 제한 없음. 단 사용하지 않는 토큰은 폐기 권장.

**Q. 만료된 토큰을 다시 활성화할 수 있나요?**
A. 불가. 새로 발급해야 합니다. 같은 이름으로 발급 가능.

**Q. 워크허브 비밀번호 변경 시 토큰은 어떻게 되나요?**
A. 영향 없음. 토큰은 비밀번호와 독립적입니다. 비밀번호 노출 우려 시 토큰도 별도 폐기 권장.

---

## 참고

- 워크허브 MCP server 사양: `/api/mcp` (JSON-RPC 2.0 + SSE)
- OAuth 2.1 + PKCE: `https://workhub.koavio.com/.well-known/oauth-authorization-server`
- MCP 표준: https://modelcontextprotocol.io
- Claude Desktop 다운로드: https://claude.ai/download
