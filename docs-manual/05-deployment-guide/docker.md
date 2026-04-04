# Docker 배포

Docker Compose를 사용하여 Workhub를 배포합니다.

## 사전 준비

1. Docker 및 Docker Compose 설치
2. 서버 도메인 및 SSL 인증서 준비
3. 환경 변수 설정 파일 준비

## 배포 절차

### 1. 소스 다운로드

```bash
git clone https://github.com/your-org/workhub.git
cd workhub
```

### 2. 환경 변수 설정

`.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

주요 환경 변수:

| 변수 | 설명 | 예시 |
|------|------|------|
| `APP_ENV` | 실행 환경 | `production` |
| `DATABASE_URL` | PostgreSQL 접속 URL | `postgres://user:pass@db:5432/workhub` |
| `NATS_URL` | NATS 서버 URL | `nats://nats:4222` |
| `OIDC_ISSUER` | Zitadel OIDC Issuer URL | `https://auth.example.com` |
| `OIDC_CLIENT_ID` | OIDC Client ID | `workhub-client` |
| `OIDC_CLIENT_SECRET` | OIDC Client Secret | (비공개) |
| `CORS_ORIGIN` | 프론트엔드 URL | `https://workhub.example.com` |

### 3. Docker Compose 실행

```bash
docker compose up -d
```

### 4. 마이그레이션

```bash
docker compose exec backend ./migrate up
```

### 5. 상태 확인

```bash
docker compose ps
```

모든 서비스가 `running` 상태인지 확인합니다.

## 서비스 구성

Docker Compose에 포함된 서비스:

| 서비스        | 설명                   |
| ---------- | -------------------- |
| `backend`  | Go API 서버            |
| `frontend` | React 프론트엔드 (Nginx)  |
| `postgres` | PostgreSQL 데이터베이스    |
| `nats`     | NATS JetStream 메시지 큐 |
| `zitadel`  | OIDC 인증 서버           |

## 업데이트

```bash
git pull
docker compose pull
docker compose up -d
docker compose exec backend ./migrate up
```

## 로그 확인

```bash
# 전체 로그
docker compose logs -f

# 특정 서비스 로그
docker compose logs -f backend
```
