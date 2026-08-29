# 매뉴얼 · 랜딩 배포

Workhub 랜딩 페이지와 사용자 매뉴얼의 관리 및 배포 방법을 안내합니다.

## 구조 개요

원본은 `workhub-saas` 에서 관리하고, 빌드 결과물을 `workhub-landing` 의 `gh-pages`
브랜치로 배포합니다. GitHub Pages 가 그 브랜치를 그대로 서빙합니다.

| 레포지토리 | 경로 | 역할 |
|-----------|------|------|
| `workhub-saas` | `landing/` | 랜딩(Next.js) 원본 |
| `workhub-saas` | `docs/manual/` | 매뉴얼(VitePress) 원본 |
| `workhub-landing` | `gh-pages` 브랜치 | 빌드 결과물 (GitHub Pages 서빙) |

```
workhub-saas/landing/        ← 랜딩 원본
workhub-saas/docs/manual/    ← 매뉴얼 원본
       ↓ 로컬 빌드 + 조립 (deploy-local.sh)
workhub-landing/gh-pages     ← out/ (루트) + out/docs/ (매뉴얼)
       ↓ GitHub Pages (브랜치 서빙)
https://getorey.github.io/workhub-landing/
```

## 매뉴얼 수정

`workhub-saas/docs/manual/` 에서 마크다운을 수정합니다. 새 문서를 추가하면
`.vitepress/config.ts` 의 사이드바에도 링크를 등록해야 메뉴에 노출됩니다.

```bash
# 로컬 미리보기 (VitePress)
cd docs/manual
npx vitepress dev      # → http://localhost:5174
```

폴더 구조:

```
docs/manual/
├── 01-getting-started/   # 시작하기
├── 02-user-guide/        # 사용자 가이드
├── 03-dept-admin-guide/  # 부서 관리자 가이드
├── 04-org-admin-guide/   # 기관 관리자 가이드
├── 05-deployment-guide/  # 시스템 구축 가이드
├── 06-developer-guide/   # 개발자 가이드
└── index.md              # 매뉴얼 홈
```

## 배포 — 로컬 빌드 (현재 방식)

GitHub Actions 무료 한도 소진/결제 문제로 자동 배포 워크플로우가 막혀 있어, 현재는
**로컬에서 빌드해 `gh-pages` 브랜치로 직접 푸시**합니다. Actions 를 전혀 사용하지
않으므로 결제 상태와 무관하게 배포됩니다.

```bash
cd landing
./deploy-local.sh
```

스크립트(`landing/deploy-local.sh`)가 수행하는 작업:

1. Next.js 랜딩 빌드 (`out/`)
2. VitePress 매뉴얼 빌드 (`docs/manual/.vitepress/dist/`)
3. 조립: `out/` 루트 + `out/docs/` + `.nojekyll`
4. `workhub-landing` 의 `gh-pages` 브랜치로 푸시

GitHub Pages 가 `gh-pages` 브랜치를 자동 감지해 1~2분 내 반영합니다.

::: warning Pages 소스 설정
이 방식은 `workhub-landing` 의 Pages 소스가 **"Deploy from a branch: gh-pages"**
(`build_type: legacy`) 로 설정돼 있어야 동작합니다. Settings → Pages 에서 확인.
:::

## 배포 — GitHub Actions (결제 정상화 후)

Actions 한도가 복구되면 자동 배포로 되돌릴 수 있습니다.

```bash
# 1) Pages 소스를 다시 Actions 빌드로 전환
gh api -X PUT repos/getorey/workhub-landing/pages -f build_type=workflow

# 2) workhub-saas 에서 소스 동기화 워크플로우 수동 실행
#    GitHub → Actions → "Sync landing source to workhub-landing" → Run workflow
```

- `workhub-saas/.github/workflows/sync-landing-source.yml` — 소스 동기화 (수동 전용)
- `workhub-landing/.github/workflows/deploy-landing.yml` — 빌드 + Pages 배포

## 배포 확인

- **랜딩**: `https://getorey.github.io/workhub-landing/`
- **매뉴얼 홈**: `https://getorey.github.io/workhub-landing/docs/`

```bash
# 라이브 반영 확인 (예: 가격 섹션)
curl -s https://getorey.github.io/workhub-landing/ | grep -o 'Standard'
```
