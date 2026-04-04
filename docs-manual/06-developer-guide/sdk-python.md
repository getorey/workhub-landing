# Python SDK

`workhub_bot_sdk`는 Python 환경에서 Workhub 봇을 개발하기 위한 공식 SDK입니다.

## 설치

```bash
pip install workhub-bot-sdk
```

> Python 3.9 이상이 필요합니다.

## 클라이언트 초기화

```python
from workhub_bot_sdk import WorkhubBot

bot = WorkhubBot(
    base_url="https://workhub.example.com",  # Workhub 서버 URL
    api_key="whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx",  # 봇 API 키
    timeout=30,  # 요청 타임아웃 (초, 기본: 30)
)
```

### 옵션

| 옵션 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `base_url` | str | O | - | Workhub 서버 URL |
| `api_key` | str | O | - | 봇 API 키 |
| `timeout` | int | - | 30 | 요청 타임아웃 (초) |

## 연결 확인

```python
# API 키 검증 및 봇 정보 조회
info = bot.authenticate()
print(f"봇 ID: {info.bot_id}")
print(f"조직 ID: {info.org_id}")
print(f"권한: {info.scopes}")

# MCP 세션 초기화
bot.initialize()

# 연결 상태 확인
bot.ping()
```

## 메시지

```python
# 채널에 메시지 전송
bot.send_message(
    channel_id="채널-UUID",
    content="안녕하세요! **마크다운**도 지원합니다.",
)

# 토픽에 메시지 전송
bot.send_message(
    topic_id="토픽-UUID",
    content="토픽 메시지입니다.",
)

# DM 전송
bot.send_message(
    dm_room_id="DM-UUID",
    content="1:1 메시지입니다.",
)

# 메시지 조회
messages = bot.read_messages(channel_id="채널-UUID", limit=10)
```

## 채널 & 프로젝트

```python
# 전체 목록
all_items = bot.list_channels(type="all")

# 채널만
channels = bot.list_channels(type="channels")

# 프로젝트만
projects = bot.list_channels(type="projects")

# 특정 프로젝트의 토픽
topics = bot.list_channels(type="topics", project_id="프로젝트-UUID")
```

## 태스크

```python
# 태스크 생성
result = bot.create_task(
    topic_id="토픽-UUID",
    title="API 문서 작성",
    priority="high",
    assignee_id="담당자-UUID",
    due_date="2026-04-15",
    description="MCP 및 SDK 문서를 작성합니다.",
)

# 태스크 수정
bot.update_task(
    task_id="태스크-UUID",
    status="in_progress",
    priority="urgent",
)

# 태스크 목록 조회
tasks = bot.list_tasks(topic_id="토픽-UUID", status="todo")
```

## 검색

```python
# 통합 검색
result = bot.search("배포 일정", type="all", limit=20)
print(f"총 {result.total}건")

# 태스크만 검색
task_result = bot.search("버그", type="tasks")
```

## 사용자

```python
# ID로 사용자 조회
user = bot.get_user(user_id="사용자-UUID")

# 이메일로 사용자 조회
user2 = bot.get_user(email="hong@example.com")

# 사용자 목록 (부서 필터)
dev_team = bot.list_users(department="개발", limit=100)
```

## 파일

```python
# 파일 업로드
bot.upload_file("./report.pdf", message_id="메시지-UUID")

# 파일 다운로드
bot.download_file("파일-UUID", dest_path="./downloaded.pdf")
```

## 봇 커스텀 명령

```python
# 봇 정보 조회
info = bot.authenticate()

# 커스텀 명령 등록
cmd = bot.create_bot_command(
    info.bot_id,
    command="deploy",
    description="프로덕션 배포를 실행합니다",
    usage_hint="/deploy [branch]",
)

# 등록된 명령 목록
commands = bot.list_bot_commands(info.bot_id)

# 명령 삭제
bot.delete_bot_command(info.bot_id, "deploy")
```

## 채널 북마크

```python
# 메시지 북마크
bot.create_bookmark("채널-UUID", "메시지-UUID")

# 북마크 목록 조회 (필터 지원)
bookmarks = bot.list_bookmarks("채널-UUID", sort="desc", limit=20)

# 북마크 삭제
bot.delete_bookmark("채널-UUID", "메시지-UUID")
```

## 채널 파일

```python
# 채널 파일 목록 (검색, 필터, 정렬)
result = bot.list_channel_files(
    "채널-UUID",
    q="보고서",
    type="document",
    sort="created_at",
    order="desc",
    limit=50,
)
print(f"총 {result.total}개 파일")
```

## 멘션 검색

```python
# 멘션 대상 검색 (사용자, 부서, @all, @here)
targets = bot.search_mentions("김", channel_id="채널-UUID")
```

## 해시태그

```python
# 해시태그 검색
tags = bot.search_hashtags("배포")

# 해시태그 프리뷰 (채널/태스크/프로젝트)
preview = bot.get_hashtag_preview("project", "프로젝트-UUID")
```

## 슬래시 명령

```python
# 사용 가능한 슬래시 명령 목록
slash_cmds = bot.list_slash_commands()

# 슬래시 명령 실행
result = bot.execute_slash_command(
    "/status 회의 중",
    channel_id="채널-UUID",
)
print(result.text)
```

## MCP 도구 직접 호출

```python
# 사용 가능한 도구 목록
tools = bot.list_tools()
for tool in tools:
    print(f"{tool['name']}: {tool.get('description', '')}")
```

## 에러 처리

```python
try:
    bot.send_message(
        channel_id="잘못된-UUID",
        content="테스트",
    )
except Exception as e:
    print(f"오류: {e}")
```

## 예제: Echo 봇

```python
from workhub_bot_sdk import WorkhubBot, WebhookServer, WebhookEvent

bot = WorkhubBot(
    base_url="http://localhost:8080",
    api_key="whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx",
)

webhook = WebhookServer(port=9000, secret="your-webhook-secret")


@webhook.on("message.created")
def on_message(event: WebhookEvent):
    data = event.data
    content = data.get("content", "")
    channel_id = data.get("channel_id")

    # 봇 자신의 메시지는 무시
    if data.get("sender_type") == "bot":
        return

    if channel_id and content:
        bot.send_message(
            channel_id=channel_id,
            content=f"Echo: {content}",
        )


if __name__ == "__main__":
    webhook.start()
```

실행:

```bash
python echo_bot.py
```

## 예제: 태스크 관리 봇

```python
from workhub_bot_sdk import WorkhubBot

bot = WorkhubBot(
    base_url="http://localhost:8080",
    api_key="whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx",
)

info = bot.authenticate()
print(f"연결: {info.bot_id} (org: {info.org_id})")

# 토픽 목록 조회
topics = bot.list_channels(type="topics")
print(topics)

# 태스크 검색
result = bot.search("배포", type="tasks")
print(f"검색 결과: {result.total}건")
```
