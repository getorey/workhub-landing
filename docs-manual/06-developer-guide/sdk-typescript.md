# TypeScript SDK

`@workhub/bot-sdk`는 Node.js 환경에서 Workhub 봇을 개발하기 위한 공식 SDK입니다.

## 설치

```bash
npm install @workhub/bot-sdk
```

> Node.js 18 이상이 필요합니다.

## 클라이언트 초기화

```typescript
import { WorkhubBot } from "@workhub/bot-sdk";

const bot = new WorkhubBot({
  baseUrl: "https://workhub.example.com",  // Workhub 서버 URL
  apiKey: "whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx",  // 봇 API 키
  timeout: 30000,  // 요청 타임아웃 (ms, 기본: 30000)
});
```

### 옵션

| 옵션 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `baseUrl` | string | O | - | Workhub 서버 URL |
| `apiKey` | string | O | - | 봇 API 키 |
| `timeout` | number | - | 30000 | 요청 타임아웃 (ms) |

## 연결 확인

```typescript
// API 키 검증 및 봇 정보 조회
const info = await bot.authenticate();
console.log(`봇 ID: ${info.bot_id}`);
console.log(`조직 ID: ${info.org_id}`);
console.log(`권한: ${info.scopes.join(", ")}`);

// MCP 세션 초기화
await bot.initialize();

// 연결 상태 확인
await bot.ping();
```

## 메시지

```typescript
// 채널에 메시지 전송
await bot.sendMessage({
  channel_id: "채널-UUID",
  content: "안녕하세요! **마크다운**도 지원합니다.",
});

// 토픽에 메시지 전송
await bot.sendMessage({
  topic_id: "토픽-UUID",
  content: "토픽 메시지입니다.",
});

// DM 전송
await bot.sendMessage({
  dm_room_id: "DM-UUID",
  content: "1:1 메시지입니다.",
});

// 메시지 조회
const messages = await bot.readMessages({
  channel_id: "채널-UUID",
  limit: 10,
});
```

## 채널 & 프로젝트

```typescript
// 전체 목록
const all = await bot.listChannels({ type: "all" });

// 채널만
const channels = await bot.listChannels({ type: "channels" });

// 프로젝트만
const projects = await bot.listChannels({ type: "projects" });

// 특정 프로젝트의 토픽
const topics = await bot.listChannels({
  type: "topics",
  project_id: "프로젝트-UUID",
});
```

## 태스크

```typescript
// 태스크 생성
const result = await bot.createTask({
  topic_id: "토픽-UUID",
  title: "API 문서 작성",
  priority: "high",
  assignee_id: "담당자-UUID",
  due_date: "2026-04-15",
  description: "MCP 및 SDK 문서를 작성합니다.",
});

// 태스크 수정
await bot.updateTask({
  task_id: "태스크-UUID",
  status: "in_progress",
  priority: "urgent",
});

// 태스크 목록 조회
const tasks = await bot.listTasks({
  topic_id: "토픽-UUID",
  status: "todo",
});
```

## 검색

```typescript
// 통합 검색
const result = await bot.search({
  query: "배포 일정",
  type: "all",
  limit: 20,
});
console.log(`총 ${result.total}건`);

// 태스크만 검색
const taskResult = await bot.search({
  query: "버그",
  type: "tasks",
});
```

## 사용자

```typescript
// ID로 사용자 조회
const user = await bot.getUser({ user_id: "사용자-UUID" });

// 이메일로 사용자 조회
const user2 = await bot.getUser({ email: "hong@example.com" });

// 사용자 목록 (부서 필터)
const devTeam = await bot.listUsers({
  department: "개발",
  limit: 100,
});
```

## 파일

```typescript
// 파일 업로드
const fileBuffer = fs.readFileSync("./report.pdf");
await bot.uploadFile(fileBuffer, "report.pdf", {
  message_id: "메시지-UUID",  // 선택
});

// 파일 다운로드
const data = await bot.downloadFile("파일-UUID");
```

## 봇 커스텀 명령

```typescript
// 봇 정보 조회
const info = await bot.authenticate();

// 커스텀 명령 등록
const cmd = await bot.createBotCommand(info.bot_id, {
  command: "deploy",
  description: "프로덕션 배포를 실행합니다",
  usage_hint: "/deploy [branch]",
});

// 등록된 명령 목록
const commands = await bot.listBotCommands(info.bot_id);

// 명령 삭제
await bot.deleteBotCommand(info.bot_id, "deploy");
```

## 채널 북마크

```typescript
// 메시지 북마크
await bot.createBookmark("채널-UUID", "메시지-UUID");

// 북마크 목록 조회 (필터 지원)
const bookmarks = await bot.listBookmarks("채널-UUID", {
  sort: "desc",
  limit: 20,
});

// 북마크 삭제
await bot.deleteBookmark("채널-UUID", "메시지-UUID");
```

## 채널 파일

```typescript
// 채널 파일 목록 (검색, 필터, 정렬)
const files = await bot.listChannelFiles("채널-UUID", {
  q: "보고서",
  type: "document",
  sort: "created_at",
  order: "desc",
  limit: 50,
});
console.log(`총 ${files.total}개 파일`);
```

## 멘션 검색

```typescript
// 멘션 대상 검색 (사용자, 부서, @all, @here)
const targets = await bot.searchMentions({
  q: "김",
  channel_id: "채널-UUID",  // 채널 멤버 우선 표시
});
```

## 해시태그

```typescript
// 해시태그 검색
const tags = await bot.searchHashtags("배포");

// 해시태그 프리뷰 (채널/태스크/프로젝트)
const preview = await bot.getHashtagPreview("project", "프로젝트-UUID");
```

## 슬래시 명령

```typescript
// 사용 가능한 슬래시 명령 목록
const slashCmds = await bot.listSlashCommands();

// 슬래시 명령 실행
const result = await bot.executeSlashCommand({
  text: "/status 회의 중",
  channel_id: "채널-UUID",
});
console.log(result.text);
```

## MCP 도구 직접 호출

SDK의 편의 메서드 외에 MCP 도구를 직접 호출할 수도 있습니다:

```typescript
// 사용 가능한 도구 목록
const tools = await bot.listTools();
for (const tool of tools) {
  console.log(`${tool.name}: ${tool.description}`);
}
```

## 에러 처리

```typescript
try {
  await bot.sendMessage({
    channel_id: "잘못된-UUID",
    content: "테스트",
  });
} catch (error) {
  if (error instanceof Error) {
    console.error(`오류: ${error.message}`);
  }
}
```

## 예제: Echo 봇

메시지를 수신하면 그대로 되돌려보내는 봇입니다.

```typescript
import { WorkhubBot, WebhookServer } from "@workhub/bot-sdk";
import type { WebhookEvent } from "@workhub/bot-sdk";

const bot = new WorkhubBot({
  baseUrl: "http://localhost:8080",
  apiKey: "whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx",
});

const webhook = new WebhookServer({
  port: 9000,
  secret: "your-webhook-secret",
});

webhook.on("message.created", async (event: WebhookEvent) => {
  const { content, channel_id, sender_type } = event.data as Record<string, string>;

  // 봇 자신의 메시지는 무시
  if (sender_type === "bot") return;

  if (channel_id && content) {
    await bot.sendMessage({
      channel_id,
      content: `Echo: ${content}`,
    });
  }
});

webhook.start();
```

실행:

```bash
npx tsx echo-bot.ts
```

## 예제: 태스크 관리 봇

```typescript
import { WorkhubBot } from "@workhub/bot-sdk";

const bot = new WorkhubBot({
  baseUrl: "http://localhost:8080",
  apiKey: "whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx",
});

async function main() {
  const info = await bot.authenticate();
  console.log(`연결: ${info.bot_id} (org: ${info.org_id})`);

  // 토픽 목록 조회
  const topics = await bot.listChannels({ type: "topics" });
  console.log(topics);

  // 태스크 검색
  const result = await bot.search({ query: "배포", type: "tasks" });
  console.log(`검색 결과: ${result.total}건`);
}

main().catch(console.error);
```
