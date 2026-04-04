---
layout: home

hero:
  name: Workhub 도움말
  text: 업무협업 플랫폼 사용자 매뉴얼
  tagline: 프로젝트 관리, 메시징, 태스크 추적, 조직도 관리를 하나의 플랫폼에서
  actions:
    - theme: brand
      text: 시작하기
      link: /01-getting-started/
    - theme: alt
      text: 사용자 가이드
      link: /02-user-guide/
    - theme: alt
      text: ← 홈으로
      link: /workhub-landing/

features:
  - icon: "💬"
    title: 메시징 & DM
    details: 실시간 메시지, 스레드, 멘션, 리액션, 파일 공유
    link: /02-user-guide/messaging
  - icon: "📋"
    title: 프로젝트 & 태스크
    details: 칸반 보드, 간트 차트, 태스크 의존성 관리
    link: /02-user-guide/projects
  - icon: "🏢"
    title: 조직도 & 연락처
    details: 부서 구조, 구성원 검색, 빠른 연락
    link: /02-user-guide/org-tree
  - icon: "🔍"
    title: 통합 검색
    details: 메시지, 사용자, 채널, 프로젝트를 한 번에 검색
    link: /02-user-guide/search
  - icon: "🛡️"
    title: 관리자 도구
    details: 사용자/부서 관리, 보안 설정, 봇 관리, 감사 로그
    link: /04-org-admin-guide/
  - icon: "🤖"
    title: 개발자 가이드
    details: MCP 서버, Bot SDK (TypeScript/Python), Webhook, API 레퍼런스
    link: /06-developer-guide/
  - icon: "🐳"
    title: 시스템 구축
    details: Docker 배포, 인프라 구성, 모니터링, 백업
    link: /05-deployment-guide/
---

## 역할별 가이드

이 매뉴얼은 역할별로 구성되어 있습니다. 본인의 역할에 해당하는 섹션을 참고하세요.

| 섹션 | 대상 | 내용 |
|------|------|------|
| [시작하기](/01-getting-started/) | 모든 사용자 | 로그인, 화면 구성, 기본 사용법 |
| [사용자 가이드](/02-user-guide/) | 일반 사용자 | 메시지, 프로젝트, 태스크, DM, 검색 |
| [부서관리자 가이드](/03-dept-admin-guide/) | 부서 관리자 | 부서 구성원 관리, 채널 운영 |
| [기관관리자 가이드](/04-org-admin-guide/) | 기관(조직) 관리자 | 사용자/보안/봇/감사 등 전체 관리 |
| [개발자 가이드](/06-developer-guide/) | 봇 개발자 | MCP 서버, SDK, Webhook, API 연동 |
| [시스템 구축 가이드](/05-deployment-guide/) | 시스템 엔지니어 | 설치, 배포, 인프라 구성, 운영 |

## 역할 체계

```
시스템 엔지니어     서버 설치 · Docker 구성 · 초기 셋업
    └── 기관관리자   조직 설정 · 사용자 관리 · 보안 정책 · 감사 로그
         └── 부서관리자   부서 구성원 관리 · 부서 채널 운영
              └── 일반 사용자   메시지 · 프로젝트 · 태스크 · DM · 검색
봇 개발자           MCP 서버 · SDK · Webhook · API 연동
```

> 상위 역할은 하위 역할의 모든 기능을 사용할 수 있습니다.
