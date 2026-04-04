# 인프라 구성

Workhub의 핵심 인프라 컴포넌트 설정 가이드입니다.

## 아키텍처 개요

```
[Client Browser]
       │
   [Nginx / Reverse Proxy]
       │
   ┌───┴───┐
   │       │
[Frontend] [Backend API]
               │
         ┌─────┼─────┐
         │     │     │
    [PostgreSQL] [NATS] [Zitadel]
```

## PostgreSQL

### 설정 권장사항

| 설정 | 권장값 | 설명 |
|------|--------|------|
| `max_connections` | 100 | 최대 연결 수 |
| `shared_buffers` | RAM의 25% | 공유 메모리 버퍼 |
| `work_mem` | 4MB | 쿼리 작업 메모리 |
| `wal_level` | replica | WAL 복제 수준 |

### 데이터 디렉토리

Docker 볼륨으로 데이터를 영속화합니다:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

## NATS JetStream

Workhub는 실시간 메시지 전달을 위해 NATS JetStream을 사용합니다.

### 설정

```yaml
nats:
  image: nats:2.10
  command: ["--jetstream", "--store_dir", "/data"]
  volumes:
    - nats_data:/data
```

### 스트림 구성

백엔드 서버가 시작할 때 필요한 스트림을 자동으로 생성합니다.

## 리버스 프록시 (Nginx)

### SSL 설정 예시

```nginx
server {
    listen 443 ssl http2;
    server_name workhub.example.com;

    ssl_certificate /etc/ssl/certs/workhub.crt;
    ssl_certificate_key /etc/ssl/private/workhub.key;

    # Frontend
    location / {
        proxy_pass http://frontend:80;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket
    location /ws {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Zitadel (인증 서버)

Zitadel은 OIDC 인증 서버로, 별도의 인스턴스로 운영합니다.

### 초기 설정

1. Zitadel 관리 콘솔에 접속합니다.
2. 프로젝트를 생성합니다.
3. Application을 추가하고 OIDC 설정을 합니다.
4. Redirect URI에 Workhub의 콜백 URL을 등록합니다: `https://workhub.example.com/auth/callback`
