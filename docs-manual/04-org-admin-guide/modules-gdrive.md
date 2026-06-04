# Google Drive 모듈 (기관관리자)

기관 구성원이 워크허브 안에서 Google Drive 파일을 첨부 / 권한 자동 부여 / Picker UI 로
선택할 수 있도록 Drive 모듈을 활성화합니다.

> **파일 본체 복사 없음**: 워크허브는 Drive 파일을 자기 스토리지로 복사하지 않습니다.
> Drive ID + 미리보기 메타만 보관하고, "열기" 시 Drive `webViewLink` 로 302 redirect.

---

## 1. 사전 조건

| 항목 | 확인 위치 |
|---|---|
| Google 모듈 활성화 (Workspace OAuth Client 등록) | [구글 드라이브/메일 연동](./google-integration.md) 참고 |
| GCP 프로젝트에서 **Google Drive API** 활성화 | Google Cloud Console → API 라이브러리 |
| GCP 프로젝트에서 **Google Picker API** 활성화 | 동상 |
| OAuth 동의 화면 scope 에 `drive.file` 또는 `drive` 추가 | 동상 |

Google 모듈 미등록 시 Drive 모듈 토글은 disabled 상태로 표시됩니다.

---

## 2. 모듈 활성화

### 2.1 화면 이동

좌측 사이드바 → **관리자 → 모듈 관리** (`/app/admin/modules`) → **"구글 드라이브"** 카드 토글 ON

### 2.2 설정 패널

토글 ON 후 카드의 **[설정]** 버튼:

| 항목 | 필수 | 설명 |
|---|---|---|
| **공유 드라이브 ID** | 선택 | 기관 공유 드라이브를 기본 첨부 대상으로 사용. 비워두면 사용자 마이드라이브 사용 |
| **Google Picker API Key** | **필수** | Picker UI 가 브라우저에서 사용 — 미설정 시 첨부 버튼 클릭해도 Picker 안 뜸 |
| **자동 권한 부여** (`grant_on_send`) | 권장 ON | 첨부 메시지 수신자에게 자동 reader 권한 부여 — Drive 콘솔에서 별도 공유 불필요 |

> **공유 드라이브 권장**: 마이드라이브 모드는 사용자 퇴사 시 자료가 사라집니다. 회사 자료
> 영속성을 위해 공유 드라이브 ID 지정 권장.

---

## 3. Google Picker API Key 발급

Picker 는 별도의 API Key 가 필요합니다. OAuth Client ID 와는 별개.

### 3.1 GCP Console → 사용자 인증 정보 → API 키

1. 좌측 **"클라이언트"** (또는 **"API 및 서비스 → 사용자 인증 정보"**)
2. 상단 **"+ 사용자 인증 정보 만들기" → "API 키"**
3. 키 자동 생성 → 복사

### 3.2 키 제한 (필수 권장)

생성된 키 옆 **[키 제한]** 클릭:

| 제한 | 값 |
|---|---|
| **애플리케이션 제한 → HTTP 리퍼러** | `https://<워크허브 도메인>/*` (예: `https://workhub.koavio.com/*`) |
| **API 제한 → 선택한 API** | Google Picker API + Google Drive API 만 체크 |

### 3.3 워크허브에 입력

Drive 모듈 설정 패널의 **Google Picker API Key** 필드에 입력 후 [저장].

> 이 키는 frontend 번들에 포함돼 클라이언트로 나갑니다 (Picker 가 브라우저에서 사용). HTTP
> 리퍼러 제한이 보안 경계가 되므로 반드시 위 제한 설정 필요.

---

## 4. CRM Drive 폴더 (선택)

CRM 모듈을 함께 운영 중이면 명함 이미지 Drive 인박스 폴더를 지정할 수 있습니다.

- 위치: **CRM 모듈 설정** (Drive 모듈이 아님)
- lazy create: 폴더가 없으면 첫 사용 시 자동 생성
- 자세히: [CRM 모듈 (관리자)](./modules-crm.md) 참고

---

## 5. 모듈 비활성화 시 영향

기관관리자가 Drive 모듈 토글 OFF 시:

| 항목 | 영향 |
|---|---|
| 메시지 첨부의 **Drive 버튼** | 즉시 비활성 (로컬 업로드만 가능) |
| CRM 명함 Drive 인박스 | 비활성 — 수동 입력 / 사진 직접 업로드로 fallback |
| 미팅 트랜스크립트 [Drive 에서 가져오기] | [파일에서 가져오기] (로컬 업로드) 로 자동 전환 |
| **기존 Drive 첨부의 칩** | 그대로 유지 — "구글에서 열기" 클릭 시 정상 동작 |
| **기존 `gdrive_grants` 권한** | 그대로 유지 — 회수 작업 안 함 |
| 사용자 OAuth 토큰 | 보관됨 (재활성 시 복구) |
| MCP 도구 `attach_drive_file` 등 | 모듈 비활성으로 호출 시 403 |

Drive 권한을 완전 회수하려면 별도 운영 작업 필요 — Drive 콘솔에서 수동 회수 또는
`gdrive_grants` 일괄 회수 스크립트 (시스템관리자 영역).

---

## 6. 트러블슈팅

### "Picker API Key 미설정"

- Drive 모듈 설정 패널의 Picker API Key 입력란 비어 있음 → 위 3번 절차로 발급 + 입력

### Picker 가 "No documents" / 빈 화면

- 사용자의 다중 Google 세션 충돌 — 사용자가 시크릿 창에서 재시도 권장
- API Key 의 HTTP 리퍼러 제한이 워크허브 도메인과 불일치

### Drive 첨부 후 칩이 빨갛게 표시됨 (`gdrive_grants.status = error`)

- 사용자가 첨부한 파일의 소유자가 아니라 권한 부여 실패 — 공유 드라이브 사용 권장
- Drive 측 quota 초과 / 파일 삭제됨

### 사용자 화면에서 Drive 버튼이 안 보임

체크:
1. Google 모듈 활성 + Drive 모듈 활성 모두 ON
2. Picker API Key 등록됨
3. 사용자가 본인 Drive OAuth 동의 완료

---

## 7. 보안 권장사항

- **OAuth refresh token** AES-256-GCM 암호화
- **자동 권한 부여 (`grant_on_send`)** — 외부 게스트가 포함된 채널에서는 OFF 권장. ON 인 경우 외부 게스트에게도 read 자동 부여
- Picker API Key 의 HTTP 리퍼러 제한 필수
- 모든 자동 권한 부여는 `gdrive_grants` 테이블에 audit (누가 / 언제 / 어떤 파일 / 누구에게)

---

## 관련 가이드

- [구글 드라이브/메일 연동](./google-integration.md) — Google OAuth Client 등록 (사전 조건)
- [Google Drive 모듈 (사용자 가이드)](../02-user-guide/gdrive-module.md) — 사용자 화면 / 첨부 흐름 / Drive 인박스
- [Gmail 모듈 (관리자)](./modules-gmail.md) — Gmail 첨부 → Drive 저장 흐름
- [CRM 모듈 (관리자)](./modules-crm.md) — 명함 Drive 폴더 설정
