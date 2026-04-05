# 매뉴얼 배포

Workhub 사용자 매뉴얼의 관리 및 배포 방법을 안내합니다.

## 구조 개요

매뉴얼은 두 개의 레포지토리에 걸쳐 관리됩니다.

| 레포지토리 | 경로 | 역할 |
|-----------|------|------|
| `workhub-saas` | `docs/manual/` | 매뉴얼 원본 (작성/수정) |
| `workhub-landing` | `docs-manual/` | 배포용 (GitHub Pages) |

```
workhub-saas/docs/manual/     ← 원본 작성
       ↓ 수동 동기화
workhub-landing/docs-manual/  ← 배포용 복사본
       ↓ GitHub Actions (자동)
https://getorey.github.io/workhub-landing/docs/
```

## 매뉴얼 수정

### 1. 원본 수정

`workhub-saas/docs/manual/` 에서 마크다운 파일을 수정합니다.

```bash
# 로컬 미리보기 (VitePress)
cd docs/manual
npx vitepress dev
# → http://localhost:5174 에서 확인
```

### 2. 폴더 구조

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

## 배포 (동기화)

### 수동 동기화

workhub-saas에서 매뉴얼을 수정한 후, workhub-landing 레포에 동기화합니다.

```bash
# 1. workhub-landing 클론 (최초 1회)
git clone https://github.com/getorey/workhub-landing.git
cd workhub-landing

# 2. 변경된 매뉴얼 파일 복사
#    .md 파일과 .vitepress/config 만 복사 (node_modules 제외)
rsync -av --exclude='node_modules' --exclude='.vitepress/dist' --exclude='.vitepress/cache' \
  ../workhub-saas/docs/manual/ ./docs-manual/

# 3. 커밋 & 푸시
git add docs-manual/
git commit -m "docs: 매뉴얼 동기화"
git push origin main
```

푸시하면 GitHub Actions가 자동으로 실행됩니다:
1. Landing (Next.js) 빌드 → `out/`
2. VitePress 매뉴얼 빌드 → `out/docs/`
3. 두 결과를 합쳐 GitHub Pages에 배포

### GitHub Actions 워크플로우

`workhub-landing/.github/workflows/deploy-landing.yml` 에서 관리됩니다.

- **트리거**: `main` 브랜치 푸시 또는 수동 실행 (`workflow_dispatch`)
- **배포 대상**: GitHub Pages (`getorey.github.io/workhub-landing/`)

## 배포 확인

배포 후 아래 URL에서 매뉴얼을 확인합니다:

- **매뉴얼 홈**: `https://getorey.github.io/workhub-landing/docs/`
- **GitHub Actions**: `https://github.com/getorey/workhub-landing/actions`

::: tip
GitHub Actions 실행에 보통 1~2분이 소요됩니다. 배포 상태는 Actions 탭에서 확인할 수 있습니다.
:::
