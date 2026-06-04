# Gmail 모듈 — 본인 메일을 워크허브 안에서

워크허브 Gmail 모듈은 **본인 Google 계정의 Gmail** 을 워크허브 화면에서 읽고/쓰고/분류하며,
필요할 때 메일을 **태스크/경비/세금계산서** 로 한 클릭에 전환할 수 있게 해줍니다.

> **본인 단위 연결**: 회사가 본인 메일을 들여다보는 게 아닙니다. 본인이 본인 구글 계정에
> OAuth 동의하면 본인 워크허브 화면에서만 본인 메일이 보입니다 — 동료는 본인 메일을 볼 수 없습니다.

가장 강력한 사용 방식은 **Claude (MCP) + 본인 메일 분류 스킬** 조합입니다 — 자세히는 5번 섹션.

---

## 1. 사전 준비

> 기관관리자가 먼저 **Google 모듈 + Gmail 모듈** 을 활성화해야 합니다 —
> [기관관리자 가이드 — Gmail 모듈](../04-org-admin-guide/modules-gmail.md) 참고.

활성화가 끝나면 좌측 사이드바에 **"메일"** 메뉴가 노출됩니다.

### 본인 Google 계정 연결 (사용자 1회)

좌측 사이드바 **메일** → 화면 상단의 **"Google 계정 연결"** 클릭:

```
┌──────────────────────────────────────────────────────────────┐
│ 📧 본인 Gmail 을 워크허브에서 다루려면 Google 계정을 연결하세요.  │
│                                       [Google 계정 연결]      │
└──────────────────────────────────────────────────────────────┘
```

Google 동의 화면에서:
- 본인이 평소 사용하는 Gmail 계정 선택
- 권한: **"이메일 보기/송신/라벨 수정"** 동의

연결 완료 후 **2~5분 내** 최근 메일 200통이 워크허브로 동기화됩니다 (이후는 푸시로 실시간).

---

## 2. 메일함 기본 사용

좌측 사이드바 **메일** → `/app/mail` 진입.

### 화면 구성

```
┌──────────────┬───────────────────────┬───────────────────────┐
│ 라벨 트리     │ 메일 목록              │ 본문 / 답장          │
│              │                       │                       │
│ ▾ 받은편지함  │ ☆ 이혁수 — 견적의뢰... │ 견적의뢰드립니다 ...   │
│   #견적        │   2026-06-04 14:23    │ [답장] [전달]         │
│   #internal   │ ○ admin — 시스템알림  │                       │
│   ...        │   2026-06-04 12:01    │                       │
└──────────────┴───────────────────────┴───────────────────────┘
```

### 답장 / 새 메일

- **답장**: 본문 우상단 [답장] → 본인 Gmail 보낸편지함에도 함께 저장
- **새 메일**: 화면 우상단 [새 메일] → 받는 사람 / 제목 / 본문 입력 후 [보내기]
- **첨부**: Drive 파일을 첨부로 (워크허브 내 다른 Drive 활용 흐름과 동일)

### 검색 / 필터

- 상단 검색 박스: 제목/본문/보낸이 통합 검색
- 라벨 트리 좌측: 분류별 필터 (Gmail 본가 라벨 + 워크허브 태그 동시 표시)

---

## 3. 메일 분류 기능 — 워크허브 태그 + Gmail 라벨

워크허브는 **두 가지 분류 체계** 를 병행합니다:

| 분류 | 저장 위치 | 용도 |
|---|---|---|
| **Gmail 본가 라벨** (INBOX / `^MyLabel` 등) | Google 측 | 본인 Gmail 앱에서도 동일하게 보임 |
| **워크허브 태그** (vendor / quotation_request 등) | 워크허브 측 | 업무 분류 — Gmail 에 누출되지 않음 |

워크허브 태그는 **"이건 견적 의뢰" / "이건 신규 거래처"** 같은 업무 색채를 메일에 입히는 용도라,
Gmail 라벨처럼 다른 사람의 메일함에 노출되지 않습니다.

### 권장 어휘 (workhub-email-triage 스킬과 통일)

| 카테고리 | 태그 |
|---|---|
| **업체** | `vendor` / `vendor_known` (기존계약) / `vendor_new` (신규) |
| **업체 문의** | `quotation_request` (견적) / `project_inquiry` (사업진행) / `inquiry` (일반) |
| **업무 보조** | `urgent` (긴급) / `pending_reply` (답장대기) / `follow_up` (후속) |
| **내부/광고/개인** | `internal` / `promotion` / `personal` / `system_notification` |
| **보안** | `credential` (OTP/로그인알림) / `phishing` (피싱 의심) |
| **영수증** | `receipt` (인보이스/세금계산서) |

위 외 임의 태그도 가능 (영숫자 + `_` `-` `:` 64자). 단 UI 색상은 권장 어휘만 매핑돼있고
임의 태그는 fallback(보라색) 으로 표시됩니다.

### 화면에서 태그 부여

메일 본문 상단의 **태그 배지** 옆 [+] 버튼:
- 권장 어휘 칩 중 선택 → 즉시 적용
- 자유 입력으로 임의 태그도 가능

태그를 부여한 후 **상단 필터** 에서 같은 태그의 메일만 모아보기 가능.

### 처리 완료 마킹

업무가 끝난 메일은 [✓ 처리완료] 클릭 → 받은편지함에서 분리 (Gmail 의 보관과 별개 — 워크허브 측 상태).

---

## 4. 메일에서 다른 워크허브 객체 생성

### 메일 → 태스크

본문 우상단 **[태스크 생성]** :
- 제목/본문/마감일 자동 채움
- 출처 메일 ID (`source_email_id`) 가 태스크에 기록 — 태스크에서 원본 메일 역참조 가능
- 채널/프로젝트 선택

### 메일 → 경비 (인보이스 첨부)

견적/세금계산서/영수증이 첨부된 메일:
1. 첨부 목록 표시 → [Drive 로 저장] 클릭 (워크허브 명시적 동의)
2. **[경비 생성]** 클릭 → 첨부가 receipt 로 자동 연결된 경비 행 생성

> 자격증명 메일 (`credential` 태그) 은 경비 생성 거부 — 실수로 OTP 메일을 경비화 방지.

### 메일 → 세금계산서 / 매출 자동화

`receipt` 태그 메일은 재무 모듈로 흘러가 매출/입금 매칭에 활용됩니다.

---

## 5. MCP + Claude 스킬로 메일 자동 분류 ⭐

가장 강력한 활용법입니다. Claude (Desktop / Code) 가 본인 워크허브 계정에 MCP 로 연결되면,
**본인 메일을 Claude 가 직접 읽고 분류하고 태스크화** 할 수 있습니다.

### 5.1 사전 준비

- ✅ Gmail 모듈 연결 완료 (위 1번)
- ✅ Claude 클라이언트가 워크허브 MCP 에 연결됨
  → 별도 가이드: [Claude / MCP 클라이언트 연결](./claude-mcp-integration.md)

### 5.2 사용 가능한 MCP 도구

| 도구 | 용도 |
|---|---|
| `gmail_list_threads` | 받은편지함 목록 (라벨 필터/검색 가능) |
| `gmail_get_message` | 메일 단건 본문 |
| `gmail_get_thread` | 쓰레드 전체 |
| `gmail_modify_labels` | Gmail 본가 라벨 추가/제거 |
| `gmail_send` | 메일 발송 (답장 포함) |
| `gmail_list_message_attachments` | 첨부 목록 |
| `gmail_import_attachment` | 첨부를 Drive 로 저장 (명시적 동의 필요) |
| `tag_email` | 워크허브 태그 부여/제거 (위 권장 어휘 사용) |
| `mark_email_processed` | 처리완료 마킹 |
| `create_task_from_email` | 메일에서 태스크 생성 |
| `create_expense_from_email` | 메일에서 경비 생성 + 첨부 영수증 연결 |

### 5.3 "메일관리 스킬" 작성하기 — `workhub-email-triage.skill.md`

Claude 에 **재사용 가능한 작업 흐름** 으로 등록해두면, 매일 아침 한 마디로
"오늘 메일 분류해줘" 가 자동 실행됩니다.

#### 스킬 파일 위치

- Claude Code: `~/.claude/skills/workhub-email-triage.skill.md`
- Claude Desktop: 본인 프로젝트 폴더 안 `.claude/skills/` 디렉토리 (프로젝트 단위 스킬)

#### 추천 스킬 파일 내용

````markdown
---
name: workhub-email-triage
description: 워크허브 Gmail 받은편지함을 권장 어휘로 자동 분류 + 액션 제안
when_to_use: |
  사용자가 "메일 분류해줘", "오늘 받은 메일 정리", "이번 주 메일 트리아지" 등
  메일 정리/분류를 요청할 때.
---

# 메일 트리아지 (분류 + 액션)

본인 워크허브 Gmail 받은편지함에서 처리되지 않은 (`mark_email_processed`
안 된) 메일을 권장 어휘로 분류하고, 필요한 액션을 제안한다.

## 입력

- (선택) 사용자가 기간 지정 — 미지정 시 "최근 24시간"

## 절차

### 1. 미분류 메일 수집

`gmail_list_threads` 호출:
- `limit: 50`
- 워크허브 태그 미부여 + 미처리 메일만 (응답의 `wh_tags` 가 빈 것)

### 2. 각 메일을 권장 어휘로 분류

`gmail_get_message` 로 본문/제목/보낸이를 보고 다음 어휘 중 적합한 것을 1~3개 선택:

- **업체**: `vendor` (+ `vendor_known` 또는 `vendor_new`)
- **업체 문의**: `quotation_request` / `project_inquiry` / `inquiry`
- **업무 보조**: `urgent` / `pending_reply` / `follow_up`
- **내부/광고/개인**: `internal` / `promotion` / `personal` / `system_notification`
- **보안**: `credential` / `phishing`
- **영수증**: `receipt`

판단 가이드:
- 광고/뉴스레터 패턴 (unsubscribe 푸터 등) → `promotion`
- OTP/로그인 알림 → `credential` (절대 답장/처리 권장 X)
- 견적 의뢰 키워드 ("견적", "단가", "RFQ") → `quotation_request`
- "긴급" / 마감 24시간 내 답장 요구 → `urgent`

각 분류 후 `tag_email` 로 태그 부여 — 한 메일에 여러 태그 가능.

### 3. 액션 제안 (사용자 승인 후 실행)

분류된 결과를 표로 보여주고, 다음 액션을 **사용자에게 확인받은 뒤** 실행:

| 태그 조합 | 제안 액션 |
|---|---|
| `quotation_request` + `vendor_new` | "신규 거래처 견적 — 영업 채널에 태스크 생성?" → `create_task_from_email` |
| `urgent` + `pending_reply` | "긴급 답장 필요 — 초안 작성?" → `gmail_send` (draft 모드) |
| `receipt` | "영수증 — 첨부를 Drive 로 저장하고 경비 등록?" → `gmail_import_attachment` + `create_expense_from_email` |
| `promotion` / `system_notification` | "처리완료 마킹?" → `mark_email_processed` |
| `phishing` | "**자동 처리 안 함** — 사용자가 직접 확인 권장" |

### 4. 요약

마지막에 "분류 N건 / 자동 처리 M건 / 사용자 확인 필요 K건" 형식으로 보고.

## 금지 사항

- **`credential` 태그 메일을 자동으로 답장/전달/태스크화 금지** — OTP 유출 위험
- **`phishing` 태그 메일은 어떤 자동 액션도 금지** — 사용자에게 시각적 경고만
- **첨부 자동 import 금지** — 사용자가 명시 동의한 경우에만 `gmail_import_attachment`
````

#### 사용 예시

Claude Desktop / Code 에서:

```
> /workhub-email-triage
또는 자연어:
> 오늘 받은 메일 분류해줘
```

Claude 가 자동으로:
1. 미분류 메일 50건 가져옴
2. 본문 읽고 권장 어휘로 분류 + `tag_email` 호출
3. 액션 제안 표 출력 → 사용자가 ✓ 하면 실행
4. 요약 보고

### 5.4 더 발전된 스킬 예시

다음 스킬도 같은 패턴으로 작성 가능:

- **`workhub-vendor-followup.skill.md`** — `pending_reply` 태그 메일 매일 아침 리마인드
- **`workhub-receipt-bulk.skill.md`** — `receipt` 태그 메일 일괄 경비 등록 (월말 정산)
- **`workhub-rfq-quote.skill.md`** — `quotation_request` 메일에 견적 초안 + 영업 태스크 자동 생성

---

## 6. FAQ

### Q. 회사가 내 Gmail 본문을 읽을 수 있나요?

본인이 OAuth 동의한 권한 한도에서, 워크허브 서버는 본인 메일을 가져와 본인 화면에 표시합니다.
**다른 사용자에게 본인 메일은 절대 보이지 않습니다** (조직관리자도 못 봄). 워크허브 운영자도
DB 접근으로는 본인 메일 본문에 평문으로 접근하지 못합니다 (30일 캐시 본문은 TTL 후 자동 삭제).

### Q. 받은편지함이 안 보여요. 연결은 했어요.

- 첫 동기화는 200통 기준 1~5분
- "메일" 메뉴 좌상단 새로고침 아이콘으로 강제 sync 가능
- 그래도 비어있으면: 프로필 → MCP 토큰 → Google 연결 상태 확인 → 만료면 재연결

### Q. 워크허브 태그가 Gmail 본가 라벨에 나타나나요?

**아니요.** 워크허브 태그는 워크허브 측에만 저장 — Gmail 에 누출 X. 본인 Gmail 앱에서는 안 보임.
반대로 본인이 Gmail 앱에서 만든 라벨은 워크허브에 보임 (Gmail 본가 라벨).

### Q. Claude 가 자동으로 메일을 발송할 수 있나요?

기술적으로 `gmail_send` 도구가 있어서 가능하지만, **스킬에서 항상 사용자 확인 후 발송** 으로
설계하는 게 좋습니다. 위 예시 스킬도 "draft 모드" 로 초안만 만들도록 가이드.

### Q. 일일 자동 분류를 cron 처럼 돌릴 수 있나요?

- 사용자가 Claude 에게 매일 자연어로 트리거 (예: 슬랙/캘린더 reminder 로 알림 → 본인이 Claude 에 명령)
- Claude Code 의 `--print` 모드 + cron 으로 완전 자동화도 가능 (고급)

### Q. 첨부가 너무 많은데 일괄 처리 도구가 있나요?

- `gmail_list_message_attachments` 로 첨부 목록 조회
- 본인 스킬에서 루프 돌려 `gmail_import_attachment` 호출 → Drive 로 일괄 저장
- 단, 워크허브 측 안전장치: 한 번에 너무 많은 import 는 rate-limit 됨

---

## 7. 트러블슈팅

### "Google 연결 만료" 메시지

본인이 https://myaccount.google.com/permissions 에서 워크허브 권한을 회수했거나 Google 측이
토큰을 만료한 경우. 메일 화면 상단의 "재연결" 클릭.

### 새 메일이 워크허브에 안 들어옴 (push 미동작)

- 본인 라벨에 `INBOX` 가 빠진 메일은 push 안됨 (Gmail 필터로 다른 라벨로만 가는 경우)
- 시스템 cron 이 매일 새벽 history sync 로 누락분 보충
- 즉시 보려면 메일 화면 새로고침 클릭

### Claude 가 `gmail_send` 호출 시 "no org context" 에러

- 본인 MCP 토큰의 기관 컨텍스트가 만료된 경우 → 토큰 재발급 후 Claude 측 config 갱신

---

## 8. 보안 / 개인정보

- OAuth refresh token 은 AES-GCM 으로 암호화돼 DB 저장
- 본인이 언제든 https://myaccount.google.com/permissions 에서 워크허브 권한 회수 가능 — 즉시 sync 중단
- 메일 본문은 30일 후 자동 캐시 삭제 (TTL) — 다시 보면 Gmail 에서 재인출
- 워크허브 태그 / 처리완료 상태 등 본인 부가 정보만 영구 보관
- 본인 Gmail 비밀번호는 워크허브가 절대 모릅니다 (OAuth 토큰만 보관)

---

## 관련 가이드

- [Claude / MCP 클라이언트 연결](./claude-mcp-integration.md) — Claude Desktop / Code 설정
- [AI 명령어](./ai-commands.md) — 워크허브 슬래시 명령
- [Google Drive 모듈](./gdrive-module.md) — 메일 첨부를 Drive 로 저장
- [태스크](./tasks.md) — 메일에서 생성된 태스크 관리
- [기관관리자 가이드 — Gmail 모듈](../04-org-admin-guide/modules-gmail.md) — 모듈 활성화 / OAuth scope / 운영
