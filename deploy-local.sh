#!/usr/bin/env bash
# #684 — 로컬에서 랜딩 + 매뉴얼을 빌드해 workhub-landing 의 gh-pages 브랜치로 직접 배포.
#
# GitHub Actions 무료 한도 소진/결제 문제로 sync-landing·deploy-landing 워크플로우가
# 막혔을 때, Actions 를 전혀 쓰지 않고 라이브(https://getorey.github.io/workhub-landing/)
# 를 갱신하는 경로. Pages 소스가 "gh-pages 브랜치(legacy)" 로 설정돼 있어야 동작한다.
#
# 사용법:
#   cd landing && ./deploy-local.sh
#
# 전제:
#   - workhub-landing 에 push 권한 (gh auth 또는 git credential)
#   - deploy-landing.yml(Actions) 과 동일한 조립: out/ 루트 + out/docs/
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LANDING_DIR="$REPO_ROOT/landing"
MANUAL_DIR="$REPO_ROOT/docs/manual"
TARGET_REPO="https://github.com/getorey/workhub-landing.git"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "▸ 1/4 Next.js 랜딩 빌드 (static export)"
cd "$LANDING_DIR"
NODE_ENV=production npx next build >/dev/null
test -d out || { echo "✗ landing/out 생성 실패"; exit 1; }

echo "▸ 2/4 VitePress 매뉴얼 빌드"
cd "$MANUAL_DIR"
npx vitepress build >/dev/null
test -d .vitepress/dist || { echo "✗ 매뉴얼 dist 생성 실패"; exit 1; }

echo "▸ 3/4 조립 (out/ + out/docs/ + .nojekyll + CNAME)"
cd "$LANDING_DIR"
rm -rf out/docs
mkdir -p out/docs
cp -r "$MANUAL_DIR/.vitepress/dist/"* out/docs/
touch out/.nojekyll # Pages Jekyll 이 _next 폴더를 무시하지 않도록
echo "workhub-landing.koavio.com" > out/CNAME # 커스텀 도메인 — 매 배포 시 유지

echo "▸ 4/4 gh-pages 브랜치로 push"
cd "$TMP_DIR"
git clone --depth 1 --branch gh-pages "$TARGET_REPO" target 2>/dev/null \
  || { git clone --depth 1 "$TARGET_REPO" target && cd target && git checkout --orphan gh-pages && git rm -rf . >/dev/null 2>&1 || true; cd "$TMP_DIR"; }
cd target
# 기존 파일 비우고 새 빌드로 교체 (.git 보존)
find . -maxdepth 1 -not -name '.git' -not -name '.' -exec rm -rf {} +
cp -r "$LANDING_DIR/out/." .
git add -A
if git diff --staged --quiet; then
  echo "✓ 변경 없음 — 배포 skip"
  exit 0
fi
SRC_SHA="$(cd "$REPO_ROOT" && git rev-parse --short HEAD)"
git -c user.name="landing-deploy" -c user.email="deploy@workhub.koavio.com" \
  commit -m "deploy: landing + docs (local build from workhub-saas@${SRC_SHA})" >/dev/null
git push origin gh-pages
echo "✓ 배포 완료 → http://workhub-landing.koavio.com/"
