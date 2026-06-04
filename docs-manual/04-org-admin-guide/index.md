# 기관 관리자 가이드

기관(조직) 관리자를 위한 시스템 관리 가이드입니다.

## 기관 관리자란?

기관 관리자는 Workhub 조직 전체를 관리하는 최상위 관리 역할입니다. 사용자 계정 관리, 부서 구조 설정, 보안 정책, 외부 연동 등을 담당합니다.

## 목차

### 조직 / 사용자

1. [사용자 관리](./users.md) — 사용자 등록, 비활성화, 역할 부여
2. [부서 관리](./departments.md) — 조직도 구성, 부서 일괄 등록
3. [보안 설정](./security.md) — 인증, 세션, 접근 제어
4. [봇 관리](./bots.md) — 봇 등록, API 키 관리
5. [감사 로그](./audit.md) — 활동 로그 조회
6. [시스템 설정](./settings.md) — SMTP, LDAP, DLP 등 시스템 연동
7. [SSO 연동 설정](./sso.md) — 외부 서비스 SSO 연동 (하이웍스 등)
8. [외부 링크 관리](./external-links.md) — 사이드바 외부 서비스 링크 설정
9. [보관함](./archives.md) — 보관/삭제된 프로젝트, 토픽, 채널 관리
10. [태스크 관리](./tasks.md) — 기관 전체 태스크 현황 및 업무 부하 확인

### 모듈 설정

11. [구글 드라이브/메일 연동](./google-integration.md) — GCP OAuth 발급, 기관 계정 연결 (Gmail / Drive 의 사전 조건)
12. [Gmail 모듈](./modules-gmail.md) — 모듈 활성화 / OAuth scope / Watch 자동 갱신 / 본문 캐시 TTL
13. [Drive 모듈](./modules-gdrive.md) — 모듈 활성화 / Picker API Key / 공유 드라이브 / 자동 권한 부여
14. [CRM 모듈](./modules-crm.md) — 고객사 / 명함 / 미팅 / 견적 + Drive 인박스 / AI 키 의존
15. [재무 모듈](./modules-finance.md) — 매출 / 청구 / 세금계산서 / 경비 + 메뉴 노출 정책
16. [MCP (Claude / 외부 클라이언트)](./modules-mcp.md) — 사용자 PAT / OAuth 클라이언트 / 도구 일람 / 권한 모델

### 외부 연동 / 자격증명

17. [AI API 키 설정](./ai-api-keys.md) — Gemini API 키 발급 + 워크허브 등록 (명함 OCR · 미팅 요약 · AI 명령)
18. [팝빌 연동 (세금계산서 + 입금내역)](./finance-popbill.md) — 매출 자동화 외부 연동 자가 등록
