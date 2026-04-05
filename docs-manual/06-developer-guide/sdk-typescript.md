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
// 멘션 대상 검색 (사용자, 부서, 봇, @all, @here)
const targets = await bot.searchMentions({
  q: "김",
  channel_id: "채널-UUID",  // 채널 멤버 우선 표시
});
// 결과는 type별로 구분: "special", "user", "department", "bot"
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

채널에 메시지가 올라오면 그대로 되돌려보내는 봇입니다. Webhook 수신 → 메시지 전송의 기본 흐름을 익힐 수 있습니다.

### 프로젝트 구성

```bash
mkdir echo-bot && cd echo-bot
npm init -y
npm install @workhub/bot-sdk
```

### echo-bot.ts

```typescript
import { WorkhubBot, WebhookServer } from "@workhub/bot-sdk";
import type { WebhookEvent } from "@workhub/bot-sdk";

// 1. 봇 클라이언트 — Workhub API 호출용
const bot = new WorkhubBot({
  baseUrl: process.env.WORKHUB_URL || "http://localhost:8080",
  apiKey: process.env.BOT_API_KEY || "whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx",
});

// 2. Webhook 서버 — 이벤트 수신용
const webhook = new WebhookServer({
  port: Number(process.env.PORT) || 9000,
  secret: process.env.WEBHOOK_SECRET || "your-webhook-secret",
});

// 3. 연결 확인
async function init() {
  const info = await bot.authenticate();
  console.log(`✅ Echo 봇 연결: ${info.bot_id}`);
}

// 4. 메시지 이벤트 핸들러
webhook.on("message.created", async (event: WebhookEvent) => {
  const { content, channel_id, sender_type, sender_id } =
    event.data as Record<string, string>;

  // 봇 자신의 메시지 → 무한 루프 방지
  if (sender_type === "bot") return;

  // 빈 메시지 무시
  if (!channel_id || !content?.trim()) return;

  try {
    await bot.sendMessage({
      channel_id,
      content: `🔁 **Echo**: ${content}`,
    });
    console.log(`↩️  [${sender_id}] ${content}`);
  } catch (err) {
    console.error("메시지 전송 실패:", err);
  }
});

// 5. 시작
init().then(() => {
  webhook.start();
  console.log(`🚀 Webhook 서버 시작: http://localhost:${9000}/webhook`);
});
```

### 실행

```bash
# 환경 변수 설정 후 실행
export WORKHUB_URL=http://localhost:8080
export BOT_API_KEY=whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx
export WEBHOOK_SECRET=your-webhook-secret

npx tsx echo-bot.ts
```

### 동작 흐름

```
사용자: "안녕하세요"
       ↓ Workhub → Webhook POST
Echo 봇: Webhook 수신
       ↓ bot.sendMessage()
채널:   "🔁 Echo: 안녕하세요"
```

---

## 예제: 회의록 요약 봇

채널에서 `@요약봇 [기간]` 으로 호출하면, 최근 메시지를 읽어 요약 리포트를 작성하는 봇입니다. OpenAI API를 활용한 AI 요약과, AI 없이 통계 기반 요약 두 가지 모드를 지원합니다.

### 프로젝트 구성

```bash
mkdir summary-bot && cd summary-bot
npm init -y
npm install @workhub/bot-sdk openai
```

### summary-bot.ts

```typescript
import { WorkhubBot, WebhookServer } from "@workhub/bot-sdk";
import type { WebhookEvent } from "@workhub/bot-sdk";
import OpenAI from "openai";

// ─── 설정 ───
const bot = new WorkhubBot({
  baseUrl: process.env.WORKHUB_URL || "http://localhost:8080",
  apiKey: process.env.BOT_API_KEY!,
});

const webhook = new WebhookServer({
  port: Number(process.env.PORT) || 9100,
  secret: process.env.WEBHOOK_SECRET!,
});

// OpenAI (선택 — 없으면 통계 기반 요약)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const BOT_NAME = "요약봇";

// ─── 메시지 파싱 ───
interface SummaryRequest {
  channelId: string;
  limit: number;
}

function parseMention(content: string, channelId: string): SummaryRequest | null {
  // "@요약봇" 또는 "@요약봇 50" 형식
  const pattern = new RegExp(`@${BOT_NAME}\\s*(\\d+)?`, "i");
  const match = content.match(pattern);
  if (!match) return null;

  return {
    channelId,
    limit: match[1] ? Math.min(parseInt(match[1]), 100) : 30,
  };
}

// ─── AI 요약 (OpenAI) ───
async function summarizeWithAI(messages: string[]): Promise<string> {
  if (!openai) throw new Error("OpenAI not configured");

  const joined = messages.join("\n");
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `당신은 회의록 요약 전문가입니다. 채널 대화 내용을 분석하여 다음 형식으로 요약해주세요:
- **주요 논의 사항**: 핵심 주제 3~5개
- **결정 사항**: 합의된 내용
- **액션 아이템**: 후속 조치가 필요한 항목
- **참여자**: 대화에 참여한 사람 목록
간결하고 핵심만 포함하세요. 마크다운 형식을 사용하세요.`,
      },
      {
        role: "user",
        content: `다음 채널 대화를 요약해주세요:\n\n${joined}`,
      },
    ],
    max_tokens: 1000,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || "요약을 생성할 수 없습니다.";
}

// ─── 통계 기반 요약 (AI 없이) ───
function summarizeWithStats(
  messages: Array<{ sender: string; content: string; timestamp: string }>
): string {
  // 참여자별 메시지 수
  const participants = new Map<string, number>();
  for (const msg of messages) {
    participants.set(msg.sender, (participants.get(msg.sender) || 0) + 1);
  }

  // 시간 범위
  const first = messages[0]?.timestamp || "";
  const last = messages[messages.length - 1]?.timestamp || "";

  // 참여자 통계
  const sorted = [...participants.entries()].sort((a, b) => b[1] - a[1]);
  const participantList = sorted
    .map(([name, count]) => `  - ${name}: ${count}건`)
    .join("\n");

  // 최근 주요 메시지 (길이 순 상위 5개 = 핵심 발언일 확률 높음)
  const keyMessages = [...messages]
    .filter((m) => m.content.length > 20)
    .sort((a, b) => b.content.length - a.content.length)
    .slice(0, 5)
    .map((m) => `  - **${m.sender}**: ${m.content.slice(0, 80)}...`)
    .join("\n");

  return [
    `📋 **채널 대화 요약 리포트**`,
    ``,
    `📅 **기간**: ${first} ~ ${last}`,
    `💬 **총 메시지**: ${messages.length}건`,
    `👥 **참여자** (${participants.size}명):`,
    participantList,
    ``,
    `📌 **주요 발언**:`,
    keyMessages || "  - (주요 발언 없음)",
    ``,
    `---`,
    `> 💡 AI 요약을 활성화하려면 \`OPENAI_API_KEY\` 환경 변수를 설정하세요.`,
  ].join("\n");
}

// ─── 이벤트 핸들러 ───
webhook.on("message.created", async (event: WebhookEvent) => {
  const data = event.data as Record<string, string>;

  if (data.sender_type === "bot") return;

  const request = parseMention(data.content, data.channel_id);
  if (!request) return;

  console.log(`📝 요약 요청: channel=${request.channelId}, limit=${request.limit}`);

  try {
    // 1. 최근 메시지 조회
    const result = await bot.readMessages({
      channel_id: request.channelId,
      limit: request.limit,
    });
    const messages = result.messages || [];

    if (messages.length === 0) {
      await bot.sendMessage({
        channel_id: request.channelId,
        content: "⚠️ 요약할 메시지가 없습니다.",
      });
      return;
    }

    // 2. 요약 생성
    let summary: string;

    if (openai) {
      // AI 요약
      const textLines = messages.map(
        (m: any) => `[${m.sender_name}] ${m.content}`
      );
      summary = await summarizeWithAI(textLines);
      summary = `🤖 **AI 회의록 요약** (최근 ${messages.length}건)\n\n${summary}`;
    } else {
      // 통계 기반 요약
      const parsed = messages.map((m: any) => ({
        sender: m.sender_name || "알 수 없음",
        content: m.content || "",
        timestamp: m.created_at || "",
      }));
      summary = summarizeWithStats(parsed);
    }

    // 3. 요약 전송
    await bot.sendMessage({
      channel_id: request.channelId,
      content: summary,
    });

    console.log(`✅ 요약 전송 완료`);
  } catch (err) {
    console.error("요약 실패:", err);
    await bot.sendMessage({
      channel_id: request.channelId,
      content: "❌ 요약 생성 중 오류가 발생했습니다.",
    });
  }
});

// ─── 시작 ───
async function main() {
  const info = await bot.authenticate();
  console.log(`✅ 요약 봇 연결: ${info.bot_id}`);
  console.log(`🧠 AI 모드: ${openai ? "OpenAI" : "통계 기반"}`);

  webhook.start();
  console.log(`🚀 Webhook 서버 시작: http://localhost:9100/webhook`);
}

main().catch(console.error);
```

### 실행

```bash
# 기본 (통계 기반 요약)
export WORKHUB_URL=http://localhost:8080
export BOT_API_KEY=whb_xxxxxxxx_live_xxxxxxxxxxxxxxxx
export WEBHOOK_SECRET=your-webhook-secret
npx tsx summary-bot.ts

# AI 요약 모드 (OpenAI 키 추가)
export OPENAI_API_KEY=sk-xxxxxxxxxxxx
npx tsx summary-bot.ts
```

### 사용 방법

채널에서 멘션으로 호출합니다:

```
@요약봇          → 최근 30건 요약
@요약봇 50       → 최근 50건 요약
@요약봇 100      → 최근 100건 요약 (최대)
```

### 동작 흐름

```
사용자: "@요약봇 50"
       ↓ Webhook 수신
요약 봇: 채널 메시지 50건 조회 (readMessages)
       ↓ OpenAI API 또는 통계 분석
       ↓ bot.sendMessage()
채널:   "🤖 AI 회의록 요약 (최근 50건)
        📌 주요 논의 사항: ..."
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
