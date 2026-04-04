# 백업 및 복구

Workhub 데이터의 백업과 복구 절차입니다.

## 백업 대상

| 대상 | 방법 | 주기 |
|------|------|------|
| PostgreSQL | pg_dump | 매일 |
| 업로드 파일 | 파일 복사 / rsync | 매일 |
| 환경 설정 | .env, docker-compose.yml | 변경 시 |

## PostgreSQL 백업

### 자동 백업 스크립트

```bash
#!/bin/bash
BACKUP_DIR=/backup/postgres
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="workhub_${DATE}.sql.gz"

docker compose exec -T postgres \
  pg_dump -U workhub workhub | gzip > "${BACKUP_DIR}/${FILENAME}"

# 30일 이상 된 백업 삭제
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +30 -delete
```

### cron 등록

```bash
# 매일 새벽 2시 백업
0 2 * * * /path/to/backup.sh
```

### 수동 백업

```bash
docker compose exec -T postgres \
  pg_dump -U workhub workhub > backup.sql
```

## 파일 백업

업로드 파일 디렉토리를 백업합니다:

```bash
rsync -av /data/workhub/uploads/ /backup/uploads/
```

## 복구

### PostgreSQL 복구

```bash
# 기존 데이터베이스 삭제 후 재생성
docker compose exec -T postgres \
  psql -U workhub -c "DROP DATABASE IF EXISTS workhub;"
docker compose exec -T postgres \
  psql -U workhub -c "CREATE DATABASE workhub;"

# 백업 복원
gunzip -c backup.sql.gz | docker compose exec -T postgres \
  psql -U workhub workhub
```

### 파일 복구

```bash
rsync -av /backup/uploads/ /data/workhub/uploads/
```

## 백업 검증

정기적으로 백업 데이터를 테스트 환경에서 복원하여 정상 여부를 확인합니다.

1. 테스트 서버에서 Docker Compose를 실행합니다.
2. 백업 데이터를 복원합니다.
3. 주요 기능(로그인, 메시지 조회, 태스크 조회)이 정상 동작하는지 확인합니다.
