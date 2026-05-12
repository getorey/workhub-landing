# 데스크톱 앱 빌드 및 배포

Workhub 데스크톱 클라이언트는 [Tauri v2](https://v2.tauri.app/)를 사용하여 기존 React 프론트엔드를 Windows 네이티브 앱으로 패키징합니다.

## 기술 스택

| 항목 | 설명 |
|------|------|
| 프레임워크 | Tauri v2 (Rust + WebView2) |
| 프론트엔드 | 기존 React 코드 공유 (95~100% 재사용) |
| 빌드 결과물 | NSIS 설치파일 (.exe), MSI 패키지 |
| 빌드 크기 | 5~10MB |
| 런타임 메모리 | 50~100MB |

## 아키텍처

```
frontend/
├── src/                          # React (웹/데스크톱 공유)
│   ├── lib/tauri.ts              # 환경 감지 + 브릿지
│   ├── hooks/useTauriNotifications.ts
│   └── ...
├── src-tauri/                    # Tauri 전용 (웹 빌드와 무관)
│   ├── tauri.conf.json           # 앱 설정
│   ├── Cargo.toml                # Rust 의존성
│   ├── capabilities/default.json # 권한 설정
│   └── src/
│       ├── main.rs               # 진입점
│       ├── lib.rs                # 시스템 트레이 + 커맨드
│       └── notification_listener.rs  # SSE 알림 수신
├── .env                          # 웹용
└── .env.tauri                    # 데스크톱용 (서버 URL)
```

### 웹/데스크톱 코드 분리

- `src-tauri/` 디렉토리는 웹 빌드(`npm run build`)에 전혀 영향을 주지 않습니다.
- React 코드에서 `isTauri()` 함수로 환경을 감지하여, 웹에서는 Tauri 기능이 no-op으로 동작합니다.
- 하나의 코드베이스로 웹과 데스크톱 모두 빌드할 수 있습니다.

## 사전 준비

### 빌드 환경

- **Node.js** 18 이상
- **Rust** 최신 안정 버전 (`rustup update stable`)
- **Windows**: Visual Studio Build Tools (C++ 빌드 도구) + WebView2

::: tip
macOS/Linux에서 개발 및 테스트할 수 있지만, Windows 설치파일(.exe) 생성은 Windows 환경에서만 가능합니다.
:::

### 환경 변수

`.env.tauri` 파일에서 데스크톱 앱이 연결할 서버 URL을 설정합니다:

```bash
VITE_API_URL=https://workhub.example.com/api
```

## 빌드 명령

```bash
# 웹 빌드 (기존 그대로, src-tauri 무관)
npm run build

# 데스크톱 개발 모드 (핫 리로드)
npm run tauri:dev

# 데스크톱 설치파일 생성
npm run tauri:build
# → src-tauri/target/release/bundle/nsis/WorkHub_x.x.x_x64-setup.exe
# → src-tauri/target/release/bundle/msi/WorkHub_x.x.x_x64_en-US.msi
```

## 주요 구성 파일

### tauri.conf.json

앱의 기본 설정을 정의합니다:

- **창 크기**: 1200 x 800 (기본값)
- **시스템 트레이**: 아이콘 설정, 메뉴 구성
- **번들링**: NSIS(설치 마법사) + MSI 형식
- **플러그인**: notification, autostart, shell, store

### capabilities/default.json

앱이 사용할 수 있는 시스템 권한을 정의합니다:

- `core:default` — 기본 Tauri 기능
- `core:window:allow-*` — 창 제어
- `tray:default` — 시스템 트레이
- `notification:default` — 알림 표시
- `autostart:default` — OS 시작 시 자동 실행
- `shell:default` — 외부 프로그램 실행
- `store:default` — 로컬 데이터 저장

### Rust 주요 기능

| 파일 | 기능 |
|------|------|
| `lib.rs` | 시스템 트레이 메뉴 (열기/숨기기/종료), 창 닫기 시 트레이 숨김 처리, Tauri 커맨드 4개 |
| `notification_listener.rs` | SSE 스트림 수신, 자동 재연결 (5초 백오프), Windows 토스트 알림 |

## 앱 아이콘

아이콘 생성은 Tauri CLI를 사용합니다:

```bash
# 1024x1024 이상의 PNG 파일 준비
npx tauri icon logo.png
# → icons/ 디렉토리에 다양한 크기의 아이콘 자동 생성
```

생성되는 파일: `32x32.png`, `128x128.png`, `128x128@2x.png`, `icon.ico`, `icon.icns`

## 배포

### 수동 배포

1. Windows 환경에서 `npm run tauri:build` 실행
2. `src-tauri/target/release/bundle/nsis/` 에서 설치파일 확인
3. 사용자에게 설치파일 배포

### Windows 코드 서명

프로덕션 배포 시 코드 서명을 적용하면 SmartScreen 경고를 방지할 수 있습니다.

`tauri.conf.json`에 서명 설정을 추가합니다:

```json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_CERT_THUMBPRINT",
      "digestAlgorithm": "sha256",
      "timestampUrl": "http://timestamp.digicert.com"
    }
  }
}
```

### 자동 업데이트

`tauri-plugin-updater`를 사용하여 앱 내 자동 업데이트를 구성할 수 있습니다:

1. 업데이트 서버에 최신 버전 정보 JSON 호스팅
2. 앱 시작 시 업데이트 확인 → 다운로드 → 재시작

::: warning
자동 업데이트 기능은 현재 구현 예정 상태입니다. 초기에는 수동 배포를 권장합니다.
:::

## 남은 작업

- [ ] 앱 아이콘 디자인 및 생성
- [ ] Windows 환경 개발 테스트 (`npm run tauri:dev`)
- [ ] NSIS 설치파일 생성 확인 (`npm run tauri:build`)
- [ ] SSE 알림 엔드포인트 연동 검증
- [ ] 알림 클릭 → 딥링크 네비게이션 구현
- [ ] `tauri-plugin-updater` 자동 업데이트 연동
- [ ] Windows 코드 서명 인증서 설정
- [ ] CI/CD: GitHub Actions Windows 빌드 자동화
