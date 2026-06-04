# Gmail 모듈 (기관관리자)

기관 구성원 각자가 본인의 Gmail 을 워크허브 화면에서 다루고, Claude MCP 스킬로 메일을 자동
분류할 수 있도록 Gmail 모듈을 활성화합니다.

> **사용자 흐름은 본인 단위**: Gmail 모듈은 기관 단위로 활성화되지만, 실제 OAuth 동의와
> 메일 접근은 **각 사용자가 본인 Google 계정 단위로** 진행합니다. 기관관리자는 모듈을 켜고
> 운영을 모니터링하며, 본인이 다른 사용자의 메일함은 절대 볼 수 없습니다.

---

## 1. 사전 조건

| 항목 | 확인 위치 |
|---|---|
| Google 모듈 활성화 (Workspace OAuth Client 등록) | [구글 드라이브/메일 연동](./google-integration.md) 참고 |
| GCP 프로젝트에서 **Gmail API** 활성화 | Google Cloud Console → API 라이브러리 |
| OAuth 동의 화면 scope 에 Gmail scope 추가 | 아래 2번 참고 |

Google 모듈이 등록돼 있지 않으면 Gmail 모듈 토글은 disabled 상태로 표시됩니다.

---

## 2. OAuth Scope (Gmail)

Gmail 모듈은 다음 scope 를 요구합니다 — Google Cloud Console 의 OAuth 동의 화면에 모두 추가:

| Scope | 용도 | 분류 |
|---|---|---|
| `gmail.readonly` | 받은편지함 / 본문 조회 | **restricted** |
| `gmail.modify` | Gmail 라벨 추가/제거, 읽음 표시 | restricted |
| `gmail.send` | 답장 / 새 메일 발신 | sensitive |
| `gmail.labels` | 라벨 트리 조회 | sensitive |

> `gmail.readonly` 는 Google 의 **restricted scope** 분류 — External 프로덕션으로 게시하려면
> **연간 보안평가(Annual Security Assessment, 유료)** 가 필요합니다. 자세히는
> [구글 연동 — 운영 모드 결정](./google-integration.md#_5-운영-모드-결정-internal-vs-external) 참고.

---

## 3. 모듈 활성화

### 3.1 화면 이동

좌측 사이드바 → **관리자 → 모듈 관리** (`/app/admin/modules`)

### 3.2 "구글 메일" 카드 토글 ON

- 사전조건 체크 — Google 모듈 활성 + GCP Gmail API 활성 모두 ✓ 표시되어야 토글 가능
- 토글 ON 즉시 좌측 사이드바에 **"메일"** 메뉴가 추가됨

### 3.3 사용자 OAuth 흐름

각 사용자가 본인 화면에서 직접 진행:

```
사용자 → 좌측 메뉴 [메일] → 상단 배너 [Google 계정 연결]
       → 본인 Gmail 동의 화면 → "허용" → 본인 계정으로 OAuth 토큰 발급
       → 2~5분 내 최근 200통 동기화 완료
```

기관관리자는 이 흐름에 개입하지 않으며, 사용자 본인 계정의 메일만 본인 화면에 표시됩니다.

자세한 사용자 가이드: [Gmail 모듈 (사용자 가이드)](../02-user-guide/gmail-module.md)

---

## 4. Watch / Push 구독 자동 갱신

새 메일 도착 시 실시간 동기화를 위해 워크허브는 Gmail Watch API 로 push 구독을 등록합니다.

| 항목 | 동작 |
|---|---|
| Watch 등록 | 사용자 첫 OAuth 동의 시 자동 등록 (Pub/Sub 토픽 경유) |
| Watch 만료 | Gmail 측 정책: 7일마다 만료 |
| 자동 갱신 | 워크허브 시스템 cron 이 매일 새벽 갱신 — **기관관리자 조치 불필요** |
| Pub/Sub 토픽 환경변수 | 시스템 환경변수 `GMAIL_PUSH_TOPIC` (시스템관리자 영역) |

push 가 일시 끊겨도 매일 새벽 history sync 가 누락분을 채워줍니다.

---

## 5. 데이터 최소화 — 30일 본문 캐시 TTL

| 데이터 | 보관 정책 |
|---|---|
| **메일 본문** (`body_cached`) | 워크허브 DB 에 30일만 캐시. 매일 새벽 cron 이 30일 초과분 자동 삭제 |
| 메일 메타 (제목·보낸이·라벨) | 영구 보관 — 검색/필터에 사용 |
| 워크허브 태그 / 처리완료 상태 | 영구 보관 — 본인 부가 정보 |
| OAuth refresh token | AES-256-GCM 으로 암호화 후 보관 |

본문은 다시 보면 Gmail API 에서 즉시 재인출해서 캐시 — 사용자 입장에서는 차이를 느끼지 않습니다.

---

## 6. 모듈 비활성화 시 영향

기관관리자가 Gmail 모듈 토글 OFF 시:

| 항목 | 영향 |
|---|---|
| 좌측 사이드바 "메일" 메뉴 | 즉시 사라짐 |
| 기존 메일 동기화 (push / cron) | 즉시 중단 |
| 사용자 OAuth 토큰 | DB 에 보관됨 (재활성 시 즉시 복구) |
| 메일 메타 / 태그 / 처리완료 상태 | 보관됨 (재활성 시 복구) |
| 메일 본문 캐시 | TTL 정책대로 자연 만료 |
| MCP 도구 `gmail_*` | 모듈 비활성으로 호출 시 403 |

완전 삭제를 원하면 별도 데이터 정리 운영이 필요 — 시스템관리자에게 문의.

---

## 7. 트러블슈팅

### 사용자 화면에서 "메일" 메뉴가 안 보임

체크:
1. Google 모듈 활성 + Gmail 모듈 활성 모두 ON
2. (구버전 권한 정책) 메일 모듈에 PolicyAllowlist 가 설정돼 있으면 명시적으로 추가된 사용자만 접근

### 새 메일이 push 로 안 들어옴

- Pub/Sub 토픽 환경변수 (`GMAIL_PUSH_TOPIC`) 미설정 — 시스템관리자 문의
- watch 만료 — 매일 새벽 cron 이 자동 갱신하지만, 즉시 복구 원하면 사용자가 메일 화면 [새로고침]
- 사용자 Gmail 필터가 INBOX 라벨을 제거하는 경우 — 해당 메일은 push 대상에서 빠짐 (cron 사후 보충)

### 사용자 토큰 만료 / 권한 회수

- 사용자 화면에 "Google 연결 만료" 배너 표시 → 사용자 본인이 재연결
- 기관관리자는 이 흐름에 개입 불필요

### 발신 (`gmail.send`) 시 "412 Precondition Required"

- OAuth 동의 시점에 `gmail.send` scope 가 빠진 경우
- 사용자가 https://myaccount.google.com/permissions 에서 워크허브 권한 회수 후 재연결

---

## 8. 보안 권장사항

- **OAuth refresh token** 은 AES-256-GCM 으로 암호화 저장 — DB 덤프 유출 시에도 토큰 보호
- **본문 캐시 30일 TTL** — 장기 보관 데이터 최소화 원칙 준수
- 기관관리자는 다른 사용자의 메일 내용을 볼 수 없음 (DB 접근 권한이 있어도 평문 본문은 cron 으로 삭제 + scope 무관)
- 본인이 회사 퇴사 시 본인이 직접 권한 회수 권장 (`myaccount.google.com/permissions`)

---

## 관련 가이드

- [구글 드라이브/메일 연동](./google-integration.md) — Google OAuth Client 등록 (사전 조건)
- [Gmail 모듈 (사용자 가이드)](../02-user-guide/gmail-module.md) — 사용자 화면 / Claude MCP 트리아지 스킬
- [Drive 모듈 (관리자)](./modules-gdrive.md) — Gmail 첨부 → Drive 저장 흐름
- [MCP 모듈 (관리자)](./modules-mcp.md) — Gmail MCP 도구 노출 정책
