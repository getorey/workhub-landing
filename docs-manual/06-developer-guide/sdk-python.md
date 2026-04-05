# Python SDK

`workhub_bot_sdk`는 Python 환경에서 Workhub 봇을 개발하기 위한 공식 SDK입니다.

- **PyPI**: [workhub-bot-sdk](https://pypi.org/project/workhub-bot-sdk/)
- **버전**: 0.1.0
- **라이선스**: MIT

## 설치

```bash
pip install workhub-bot-sdk
```

> Python 3.10 이상이 필요합니다.

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
# 멘션 대상 검색 (사용자, 부서, 봇, @all, @here)
targets = bot.search_mentions("김", channel_id="채널-UUID")
# 결과는 type별로 구분: "special", "user", "department", "bot"
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

채널에 메시지가 올라오면 그대로 되돌려보내는 봇입니다. Webhook 수신 → 메시지 전송의 기본 흐름을 익힐 수 있습니다.

### 프로젝트 구성

```bash
mkdir echo-bot && cd echo-bot
pip install workhub-bot-sdk
```

### echo_bot.py

```python
import os
from workhub_bot_sdk import WorkhubBot, WebhookServer, WebhookEvent

# 1. 봇 클라이언트 — Workhub API 호출용
bot = WorkhubBot(
    base_url=os.getenv("WORKHUB_URL", "http://localhost:8080"),
    api_key=os.getenv("BOT_API_KEY", "whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx"),
)

# 2. Webhook 서버 — 이벤트 수신용
webhook = WebhookServer(
    port=int(os.getenv("PORT", "9000")),
    secret=os.getenv("WEBHOOK_SECRET", "your-webhook-secret"),
)


# 3. 메시지 이벤트 핸들러
@webhook.on("message.created")
def on_message(event: WebhookEvent):
    data = event.data
    content = data.get("content", "")
    channel_id = data.get("channel_id")
    sender_type = data.get("sender_type")
    sender_id = data.get("sender_id")

    # 봇 자신의 메시지 → 무한 루프 방지
    if sender_type == "bot":
        return

    # 빈 메시지 무시
    if not channel_id or not content.strip():
        return

    try:
        bot.send_message(
            channel_id=channel_id,
            content=f"🔁 **Echo**: {content}",
        )
        print(f"↩️  [{sender_id}] {content}")
    except Exception as e:
        print(f"메시지 전송 실패: {e}")


# 4. 시작
if __name__ == "__main__":
    info = bot.authenticate()
    print(f"✅ Echo 봇 연결: {info.bot_id}")
    print(f"🚀 Webhook 서버 시작: http://localhost:9000/webhook")
    webhook.start()
```

### 실행

```bash
# 환경 변수 설정 후 실행
export WORKHUB_URL=http://localhost:8080
export BOT_API_KEY=whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx
export WEBHOOK_SECRET=your-webhook-secret

python echo_bot.py
```

### 동작 흐름

```
사용자: "안녕하세요"
       ↓ Workhub → Webhook POST
Echo 봇: Webhook 수신
       ↓ bot.send_message()
채널:   "🔁 Echo: 안녕하세요"
```

---

## 예제: 회의록 요약 봇

채널에서 `@요약봇 [기간]` 으로 호출하면, 최근 메시지를 읽어 요약 리포트를 작성하는 봇입니다. OpenAI API를 활용한 AI 요약과, AI 없이 통계 기반 요약 두 가지 모드를 지원합니다.

### 프로젝트 구성

```bash
mkdir summary-bot && cd summary-bot
pip install workhub-bot-sdk openai
```

### summary_bot.py

```python
import os
import re
from collections import Counter
from workhub_bot_sdk import WorkhubBot, WebhookServer, WebhookEvent

# ─── 설정 ───
bot = WorkhubBot(
    base_url=os.getenv("WORKHUB_URL", "http://localhost:8080"),
    api_key=os.getenv("BOT_API_KEY", ""),
)

webhook = WebhookServer(
    port=int(os.getenv("PORT", "9100")),
    secret=os.getenv("WEBHOOK_SECRET", ""),
)

# OpenAI (선택 — 없으면 통계 기반 요약)
openai_client = None
if os.getenv("OPENAI_API_KEY"):
    from openai import OpenAI
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

BOT_NAME = "요약봇"


# ─── 메시지 파싱 ───
def parse_mention(content: str, channel_id: str):
    """@요약봇 또는 @요약봇 50 형식 파싱"""
    pattern = rf"@{BOT_NAME}\s*(\d+)?"
    match = re.search(pattern, content)
    if not match:
        return None
    limit = int(match.group(1)) if match.group(1) else 30
    return {"channel_id": channel_id, "limit": min(limit, 100)}


# ─── AI 요약 (OpenAI) ───
def summarize_with_ai(messages: list[str]) -> str:
    if not openai_client:
        raise RuntimeError("OpenAI not configured")

    joined = "\n".join(messages)
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "당신은 회의록 요약 전문가입니다. 채널 대화 내용을 분석하여 "
                    "다음 형식으로 요약해주세요:\n"
                    "- **주요 논의 사항**: 핵심 주제 3~5개\n"
                    "- **결정 사항**: 합의된 내용\n"
                    "- **액션 아이템**: 후속 조치가 필요한 항목\n"
                    "- **참여자**: 대화에 참여한 사람 목록\n"
                    "간결하고 핵심만 포함하세요. 마크다운 형식을 사용하세요."
                ),
            },
            {
                "role": "user",
                "content": f"다음 채널 대화를 요약해주세요:\n\n{joined}",
            },
        ],
        max_tokens=1000,
        temperature=0.3,
    )
    return response.choices[0].message.content or "요약을 생성할 수 없습니다."


# ─── 통계 기반 요약 (AI 없이) ───
def summarize_with_stats(messages: list[dict]) -> str:
    # 참여자별 메시지 수
    participants = Counter(m["sender"] for m in messages)

    # 시간 범위
    first = messages[0].get("timestamp", "") if messages else ""
    last = messages[-1].get("timestamp", "") if messages else ""

    # 참여자 통계
    sorted_p = participants.most_common()
    participant_list = "\n".join(
        f"  - {name}: {count}건" for name, count in sorted_p
    )

    # 주요 발언 (길이 순 상위 5개)
    key_msgs = sorted(
        [m for m in messages if len(m["content"]) > 20],
        key=lambda m: len(m["content"]),
        reverse=True,
    )[:5]
    key_list = "\n".join(
        f"  - **{m['sender']}**: {m['content'][:80]}..."
        for m in key_msgs
    ) or "  - (주요 발언 없음)"

    return "\n".join([
        f"📋 **채널 대화 요약 리포트**",
        f"",
        f"📅 **기간**: {first} ~ {last}",
        f"💬 **총 메시지**: {len(messages)}건",
        f"👥 **참여자** ({len(participants)}명):",
        participant_list,
        f"",
        f"📌 **주요 발언**:",
        key_list,
        f"",
        f"---",
        f"> 💡 AI 요약을 활성화하려면 `OPENAI_API_KEY` 환경 변수를 설정하세요.",
    ])


# ─── 이벤트 핸들러 ───
@webhook.on("message.created")
def on_message(event: WebhookEvent):
    data = event.data

    if data.get("sender_type") == "bot":
        return

    request = parse_mention(data.get("content", ""), data.get("channel_id", ""))
    if not request:
        return

    channel_id = request["channel_id"]
    limit = request["limit"]
    print(f"📝 요약 요청: channel={channel_id}, limit={limit}")

    try:
        # 1. 최근 메시지 조회
        result = bot.read_messages(channel_id=channel_id, limit=limit)
        messages = result.get("messages", [])

        if not messages:
            bot.send_message(
                channel_id=channel_id,
                content="⚠️ 요약할 메시지가 없습니다.",
            )
            return

        # 2. 요약 생성
        if openai_client:
            text_lines = [
                f"[{m.get('sender_name', '?')}] {m.get('content', '')}"
                for m in messages
            ]
            summary = summarize_with_ai(text_lines)
            summary = f"🤖 **AI 회의록 요약** (최근 {len(messages)}건)\n\n{summary}"
        else:
            parsed = [
                {
                    "sender": m.get("sender_name", "알 수 없음"),
                    "content": m.get("content", ""),
                    "timestamp": m.get("created_at", ""),
                }
                for m in messages
            ]
            summary = summarize_with_stats(parsed)

        # 3. 요약 전송
        bot.send_message(channel_id=channel_id, content=summary)
        print("✅ 요약 전송 완료")

    except Exception as e:
        print(f"요약 실패: {e}")
        bot.send_message(
            channel_id=channel_id,
            content="❌ 요약 생성 중 오류가 발생했습니다.",
        )


# ─── 시작 ───
if __name__ == "__main__":
    info = bot.authenticate()
    ai_mode = "OpenAI" if openai_client else "통계 기반"
    print(f"✅ 요약 봇 연결: {info.bot_id}")
    print(f"🧠 AI 모드: {ai_mode}")
    print(f"🚀 Webhook 서버 시작: http://localhost:9100/webhook")
    webhook.start()
```

### 실행

```bash
# 기본 (통계 기반 요약)
export WORKHUB_URL=http://localhost:8080
export BOT_API_KEY=whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx
export WEBHOOK_SECRET=your-webhook-secret
python summary_bot.py

# AI 요약 모드 (OpenAI 키 추가)
export OPENAI_API_KEY=sk-xxxxxxxxxxxx
python summary_bot.py
```

### ���용 방법

채널에서 멘션으로 호출합니다:

```
@요약봇          → 최근 30건 요약
@요약봇 50       → 최근 50건 요약
@요약봇 100      → 최근 100건 요약 (최대)
```

### 출력 예시 (통계 기반)

```
📋 채널 대화 요약 리포트

📅 기간: 2026-04-05T09:00:00Z ~ 2026-04-05T11:30:00Z
💬 총 메시지: 30건
👥 참여자 (5명):
  - 김개발: 12건
  - 이기획: 8건
  - 박디자인: 5건
  - 최운영: 3건
  - 정보안: 2건

📌 주요 발언:
  - 김개발: API 응답 속도가 200ms 이하로 개선되어야 합니다. 현재 평균...
  - 이기획: 다음 스프린트에 사용자 프로필 페이지 리뉴얼을 포함하겠...
  - 박디자인: 모바일 반응형 디자인 시안을 금요일까지 공유드리겠습니...
```

### 출력 예시 (AI 요약)

```
🤖 AI 회의록 요약 (최근 30건)

📌 주요 논의 사항:
- API 성능 최적화 (응답 속도 200ms 목표)
- 사용자 프로필 페이지 리뉴얼 범위
- 모바일 반응형 디자인 일정

✅ 결정 사항:
- API 캐시 레이어 도입 확정
- 프로필 리뉴얼은 다음 스프린트에 포함

📋 액션 아이템:
- [ ] 김개발: Redis 캐시 POC (4/8까지)
- [ ] 박디자인: 모바일 시안 공유 (4/7까지)
- [ ] 이기획: 스프린트 백로그 업데이트

👥 참여자: 김개발, 이기획, 박디자인, 최운영, 정보안
```

---

## 예제: 태스크 관리 봇

MCP 도구를 활용한 간단한 스크립트 예제입니다.

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
