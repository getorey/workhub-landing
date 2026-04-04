# 모니터링

Workhub 시스템의 상태를 모니터링하는 방법입니다.

## 헬스체크

### API 서버 헬스체크

```bash
curl https://workhub.example.com/api/health
```

정상 응답:

```json
{
  "status": "ok",
  "database": "connected",
  "nats": "connected"
}
```

### Docker 헬스체크

```bash
docker compose ps
```

모든 서비스가 `healthy` 상태인지 확인합니다.

## 로그

### 로그 위치

| 서비스 | 로그 경로 |
|--------|-----------|
| Backend | `docker compose logs backend` |
| Frontend (Nginx) | `docker compose logs frontend` |
| PostgreSQL | `docker compose logs postgres` |
| NATS | `docker compose logs nats` |

### 로그 레벨

환경 변수 `LOG_LEVEL`로 로그 레벨을 설정합니다:

| 레벨 | 설명 |
|------|------|
| `debug` | 디버그 정보 포함 |
| `info` | 일반 운영 정보 (기본값) |
| `warn` | 경고 메시지 |
| `error` | 오류만 출력 |

## 디스크 모니터링

정기적으로 다음 항목을 확인합니다:

- **PostgreSQL 데이터**: `docker compose exec postgres du -sh /var/lib/postgresql/data`
- **NATS 데이터**: `docker compose exec nats du -sh /data`
- **업로드 파일**: 파일 저장소 용량 확인

## 알림 설정

서버 장애 시 알림을 받을 수 있도록 외부 모니터링 도구를 연동합니다:

- **UptimeRobot / Uptime Kuma**: 헬스체크 엔드포인트 모니터링
- **Prometheus + Grafana**: 상세 메트릭 수집 및 시각화 (선택)
