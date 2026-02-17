# 🔥 Developer Health & Burnout Radar — Full Build Blueprint

> **Working Name:** DevPulse (can be swapped once you pick)
> **Stack:** Next.js 14+ (App Router), TypeScript, PostgreSQL, Prisma, Tailwind CSS, Recharts
> **Target:** SaaS for dev teams (5-200 engineers)

---

## 📁 Project Structure

```
devpulse/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Team overview
│   │   │   ├── member/[id]/page.tsx        # Individual view
│   │   │   ├── alerts/page.tsx             # Alert config
│   │   │   ├── settings/page.tsx           # General settings
│   │   │   ├── integrations/page.tsx       # Connect providers
│   │   │   └── reports/page.tsx            # Weekly/monthly reports
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── github/route.ts
│   │   │   │   ├── gitlab/route.ts
│   │   │   │   └── bitbucket/route.ts
│   │   │   ├── cron/
│   │   │   │   ├── ingest/route.ts
│   │   │   │   └── score/route.ts
│   │   │   ├── teams/route.ts
│   │   │   ├── members/route.ts
│   │   │   └── alerts/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx                        # Landing page
│   ├── components/
│   │   ├── ui/                             # Shared UI (buttons, cards, etc.)
│   │   ├── charts/                         # Chart components
│   │   ├── dashboard/                      # Dashboard-specific components
│   │   └── layout/                         # Nav, sidebar, etc.
│   ├── lib/
│   │   ├── db.ts                           # Prisma client
│   │   ├── auth.ts                         # NextAuth config
│   │   ├── scoring/
│   │   │   ├── engine.ts                   # Burnout score calculator
│   │   │   ├── signals.ts                  # Signal extractors
│   │   │   └── thresholds.ts               # Risk level definitions
│   │   ├── integrations/
│   │   │   ├── github.ts                   # GitHub API client
│   │   │   ├── gitlab.ts                   # GitLab API client
│   │   │   ├── bitbucket.ts                # Bitbucket API client
│   │   │   ├── jira.ts                     # Jira API client
│   │   │   └── linear.ts                   # Linear API client
│   │   ├── ingestion/
│   │   │   ├── commits.ts                  # Commit data processor
│   │   │   ├── pull-requests.ts            # PR data processor
│   │   │   ├── issues.ts                   # Issue data processor
│   │   │   └── sprints.ts                  # Sprint data processor
│   │   └── utils/
│   │       ├── timezone.ts                 # Timezone-aware time helpers
│   │       ├── privacy.ts                  # Data anonymization helpers
│   │       └── notifications.ts            # Slack/email notification sender
│   ├── hooks/                              # Custom React hooks
│   └── types/                              # TypeScript types
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

---

## 🧩 MODULE 1: Project Setup & Auth

### What to build
- Next.js 14+ project with App Router, TypeScript, Tailwind
- NextAuth.js with GitHub OAuth (primary), GitLab OAuth, email/password
- PostgreSQL database with Prisma ORM
- Basic layout: sidebar nav, top bar, responsive

### Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String    @id @default(cuid())
  name            String?
  email           String    @unique
  image           String?
  timezone        String    @default("UTC")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  accounts        Account[]
  memberships     TeamMember[]
  metrics         DeveloperMetrics[]
  scores          BurnoutScore[]
  alertPrefs      AlertPreference[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  access_token      String?
  refresh_token     String?
  expires_at        Int?
  token_type        String?
  scope             String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Team {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members     TeamMember[]
  integrations Integration[]
  alertRules  AlertRule[]
}

model TeamMember {
  id        String   @id @default(cuid())
  role      String   @default("member") // "owner", "admin", "member"
  userId    String
  teamId    String
  isVisible Boolean  @default(true)  // opt-in visibility to team
  joinedAt  DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  team Team @relation(fields: [teamId], references: [id])

  @@unique([userId, teamId])
}

model Integration {
  id           String   @id @default(cuid())
  teamId       String
  provider     String   // "github", "gitlab", "bitbucket", "jira", "linear"
  accessToken  String   // encrypted
  refreshToken String?  // encrypted
  orgName      String?
  repoNames    String[] // tracked repos
  webhookId    String?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  team Team @relation(fields: [teamId], references: [id])
}

model DeveloperMetrics {
  id                  String   @id @default(cuid())
  userId              String
  teamId              String
  date                DateTime @db.Date  // one record per day
  
  // Commit signals
  totalCommits        Int      @default(0)
  lateNightCommits    Int      @default(0)   // after 10pm local
  earlyMorningCommits Int      @default(0)   // before 6am local
  weekendCommits      Int      @default(0)
  
  // PR signals
  prsOpened           Int      @default(0)
  prsReviewed         Int      @default(0)
  prsMerged           Int      @default(0)
  avgPrReviewTime     Float?   // hours
  
  // Issue signals
  issuesAssigned      Int      @default(0)
  issuesClosed        Int      @default(0)
  issuesOverdue       Int      @default(0)
  
  // Work pattern signals
  activeDaysThisWeek  Int      @default(0)
  firstActivityHour   Int?     // 0-23
  lastActivityHour    Int?     // 0-23
  workingHoursSpread  Float?   // std deviation of activity hours
  
  // Context
  sprintId            String?
  
  createdAt           DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, teamId, date])
  @@index([userId, date])
  @@index([teamId, date])
}

model BurnoutScore {
  id              String   @id @default(cuid())
  userId          String
  teamId          String
  date            DateTime @db.Date
  
  overallScore    Float    // 0-100 (0 = healthy, 100 = critical)
  riskLevel       String   // "low", "moderate", "elevated", "high", "critical"
  
  // Signal breakdown
  afterHoursScore Float    // 0-100
  weekendScore    Float    // 0-100
  reviewDropScore Float    // 0-100
  overloadScore   Float    // 0-100
  velocityScore   Float    // 0-100
  patternScore    Float    // 0-100
  
  // Trend
  weekOverWeekDelta Float? // change from last week
  
  createdAt       DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, teamId, date])
  @@index([userId, date])
  @@index([teamId, date])
}

model AlertRule {
  id            String   @id @default(cuid())
  teamId        String
  name          String
  riskLevel     String   // trigger when score reaches this level
  channel       String   // "slack", "email"
  targetWebhook String?  // Slack webhook URL
  targetEmail   String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())

  team Team @relation(fields: [teamId], references: [id])
}

model AlertPreference {
  id               String  @id @default(cuid())
  userId           String
  receiveOwnAlerts Boolean @default(true)
  shareWithTeam    Boolean @default(false)  // opt-in to share score
  
  user User @relation(fields: [userId], references: [id])
}

model WebhookEvent {
  id          String   @id @default(cuid())
  provider    String
  eventType   String
  payload     Json
  processed   Boolean  @default(false)
  processedAt DateTime?
  createdAt   DateTime @default(now())

  @@index([processed, createdAt])
}
```

### Key files to create
1. `src/lib/db.ts` — Prisma singleton client
2. `src/lib/auth.ts` — NextAuth config with GitHub/GitLab providers
3. `src/app/api/auth/[...nextauth]/route.ts` — Auth route
4. `src/app/(auth)/login/page.tsx` — Login page with OAuth buttons
5. `src/app/(dashboard)/layout.tsx` — Dashboard shell with sidebar
6. `src/middleware.ts` — Protect dashboard routes

### Commands to get started
```bash
npx create-next-app@latest devpulse --typescript --tailwind --app --src-dir
cd devpulse
npm install prisma @prisma/client next-auth @auth/prisma-adapter
npm install recharts lucide-react clsx tailwind-merge
npm install -D @types/node
npx prisma init
```

---

## 🧩 MODULE 2: Integration Management

### What to build
- UI page to connect/disconnect GitHub, GitLab, Bitbucket
- OAuth flow for each provider to get access tokens
- Repo selection UI (pick which repos to track)
- Webhook registration on connected repos
- Encrypted token storage

### GitHub Integration (`src/lib/integrations/github.ts`)

```typescript
// Key functions to implement:

interface GitHubClient {
  // Auth
  exchangeCodeForToken(code: string): Promise<TokenPair>;
  refreshToken(refreshToken: string): Promise<TokenPair>;
  
  // Repos
  listOrganizations(token: string): Promise<Organization[]>;
  listRepositories(token: string, org: string): Promise<Repository[]>;
  
  // Webhooks
  createWebhook(token: string, owner: string, repo: string, webhookUrl: string): Promise<string>;
  deleteWebhook(token: string, owner: string, repo: string, webhookId: string): Promise<void>;
  
  // Data fetching (for cron-based polling)
  getCommits(token: string, owner: string, repo: string, since: Date): Promise<Commit[]>;
  getPullRequests(token: string, owner: string, repo: string, since: Date): Promise<PullRequest[]>;
  getIssues(token: string, owner: string, repo: string, since: Date): Promise<Issue[]>;
}

// GitHub API endpoints you'll need:
// GET  /user/orgs
// GET  /orgs/{org}/repos
// POST /repos/{owner}/{repo}/hooks
// GET  /repos/{owner}/{repo}/commits?since={date}
// GET  /repos/{owner}/{repo}/pulls?state=all&sort=updated&since={date}
// GET  /repos/{owner}/{repo}/issues?state=all&sort=updated&since={date}
```

### Webhook Handler (`src/app/api/webhooks/github/route.ts`)

```typescript
// Events to handle:
// "push"           → extract commits with timestamps and authors
// "pull_request"   → track PR opens, reviews, merges
// "issues"         → track assignment and completion
// "pull_request_review" → track review activity

// Verification: validate X-Hub-Signature-256 header
// Processing: store raw event in WebhookEvent table, then process async
```

### Integration Settings Page (`src/app/(dashboard)/integrations/page.tsx`)

```
┌──────────────────────────────────────────────────┐
│  Integrations                                     │
│                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │  ⬡ GitHub   │  │  🦊 GitLab  │  │  🪣 Bitbk │ │
│  │  Connected  │  │  Connect    │  │  Connect  │ │
│  │  3 repos    │  │             │  │           │ │
│  └─────────────┘  └─────────────┘  └───────────┘ │
│                                                   │
│  ┌─────────────┐  ┌─────────────┐                 │
│  │  📋 Jira    │  │  ▬ Linear   │                 │
│  │  Connect    │  │  Connect    │                 │
│  └─────────────┘  └─────────────┘                 │
│                                                   │
│  Connected Repositories                           │
│  ☑ org/frontend-app                              │
│  ☑ org/backend-api                               │
│  ☑ org/shared-lib                                │
│  ☐ org/docs  (unchecked = not tracked)           │
└──────────────────────────────────────────────────┘
```

---

## 🧩 MODULE 3: Data Ingestion Pipeline

### What to build
- Cron job that runs every 4 hours to pull data from all integrations
- Webhook event processor that runs on incoming events
- Data normalization layer (GitHub/GitLab/Bitbucket → unified format)
- Timezone-aware timestamp processing
- Write processed data to `DeveloperMetrics` table

### Unified Data Types (`src/types/ingestion.ts`)

```typescript
interface NormalizedCommit {
  hash: string;
  authorEmail: string;
  authorName: string;
  timestamp: Date;          // UTC
  localHour: number;        // converted to developer's timezone
  isWeekend: boolean;
  isLateNight: boolean;     // after 10pm local
  isEarlyMorning: boolean;  // before 6am local
  repoName: string;
  provider: string;
}

interface NormalizedPullRequest {
  externalId: string;
  authorEmail: string;
  state: "open" | "merged" | "closed";
  createdAt: Date;
  mergedAt?: Date;
  closedAt?: Date;
  reviewers: string[];
  reviewCount: number;
  timeToFirstReview?: number;  // hours
  timeToMerge?: number;        // hours
  repoName: string;
  provider: string;
}

interface NormalizedIssue {
  externalId: string;
  assigneeEmail: string;
  state: "open" | "closed";
  createdAt: Date;
  closedAt?: Date;
  dueDate?: Date;
  isOverdue: boolean;
  labels: string[];
  repoName: string;
  provider: string;
}
```

### Ingestion Cron (`src/app/api/cron/ingest/route.ts`)

```typescript
// Pseudo-code flow:
// 1. Get all active integrations
// 2. For each integration:
//    a. Fetch commits since last ingestion
//    b. Fetch PRs since last ingestion
//    c. Fetch issues since last ingestion
//    d. Normalize to unified types
//    e. Match author emails to team members
//    f. Convert timestamps to member's local timezone
//    g. Aggregate into daily DeveloperMetrics
//    h. Upsert into database
// 3. Trigger score recalculation

// Rate limiting: respect API limits (GitHub: 5000/hr, GitLab: 2000/min)
// Deduplication: use commit hash / PR ID to avoid double counting
// Error handling: log failures, retry with exponential backoff
```

### Key Implementation Details

```typescript
// Timezone handling is CRITICAL for accurate signals
// A commit at 2am UTC might be 6pm in San Francisco

import { utcToZonedTime } from "date-fns-tz";

function classifyCommitTime(
  utcTimestamp: Date, 
  timezone: string
): { isLateNight: boolean; isWeekend: boolean; localHour: number } {
  const local = utcToZonedTime(utcTimestamp, timezone);
  const hour = local.getHours();
  const day = local.getDay(); // 0 = Sunday
  
  return {
    localHour: hour,
    isLateNight: hour >= 22 || hour < 6,
    isWeekend: day === 0 || day === 6,
  };
}
```

---

## 🧩 MODULE 4: Burnout Score Engine

### What to build
- Score calculation engine with weighted signals
- Baseline establishment (first 2 weeks of data = personal baseline)
- Rolling window analysis (7-day and 30-day)
- Trend detection (improving, stable, declining)
- Risk level classification

### Score Engine (`src/lib/scoring/engine.ts`)

```typescript
interface SignalWeights {
  afterHours: number;     // 0.20 — Late night + early morning commits
  weekend: number;        // 0.20 — Weekend activity
  reviewDrop: number;     // 0.15 — Decline in PR review participation
  overload: number;       // 0.20 — Issues assigned vs closed ratio
  velocityChange: number; // 0.15 — Change in output velocity
  patternDisruption: number; // 0.10 — Irregular working hour patterns
}

const DEFAULT_WEIGHTS: SignalWeights = {
  afterHours: 0.20,
  weekend: 0.20,
  reviewDrop: 0.15,
  overload: 0.20,
  velocityChange: 0.15,
  patternDisruption: 0.10,
};

// Each signal scorer returns 0-100
interface SignalScorer {
  (current: DeveloperMetrics[], baseline: DeveloperMetrics[]): number;
}
```

### Signal Scorers (`src/lib/scoring/signals.ts`)

```typescript
// SIGNAL 1: After-Hours Work
// Compare last 7 days of late-night/early-morning commits against baseline
// Score 0 = no after-hours work
// Score 100 = significantly more after-hours work than baseline
function scoreAfterHours(current7d: Metrics[], baseline: Metrics[]): number {
  const currentRate = avg(current7d.map(d => 
    (d.lateNightCommits + d.earlyMorningCommits) / Math.max(d.totalCommits, 1)
  ));
  const baselineRate = avg(baseline.map(d => 
    (d.lateNightCommits + d.earlyMorningCommits) / Math.max(d.totalCommits, 1)
  ));
  // Normalize: 2x baseline = 50, 4x baseline = 100
  return clamp(((currentRate / Math.max(baselineRate, 0.01)) - 1) * 50, 0, 100);
}

// SIGNAL 2: Weekend Activity
// Any weekend work is a signal; frequent weekend work is a stronger signal
function scoreWeekend(current7d: Metrics[], baseline: Metrics[]): number {
  const weekendDays = current7d.filter(d => d.weekendCommits > 0).length;
  const baselineWeekendRate = avg(baseline.map(d => d.weekendCommits > 0 ? 1 : 0));
  // 0 weekend days = 0, both days every week = 100
  return clamp((weekendDays / 2) * 100 * (1 + (weekendDays - baselineWeekendRate * 7)), 0, 100);
}

// SIGNAL 3: PR Review Drop
// Compare review count against personal baseline
// A sharp drop suggests disengagement or overload
function scoreReviewDrop(current7d: Metrics[], baseline: Metrics[]): number {
  const currentReviews = sum(current7d.map(d => d.prsReviewed));
  const baselineAvgWeekly = sum(baseline.map(d => d.prsReviewed)) / (baseline.length / 7);
  if (baselineAvgWeekly === 0) return 0;
  const dropPercent = 1 - (currentReviews / baselineAvgWeekly);
  // 50% drop = score 50, 100% drop = score 100
  return clamp(dropPercent * 100, 0, 100);
}

// SIGNAL 4: Issue Overload
// Ratio of open/assigned issues to recently closed issues
function scoreOverload(current7d: Metrics[], baseline: Metrics[]): number {
  const latestDay = current7d[current7d.length - 1];
  const assigned = latestDay.issuesAssigned;
  const closedThisWeek = sum(current7d.map(d => d.issuesClosed));
  const overdue = latestDay.issuesOverdue;
  // High assigned + low closed + overdue = high score
  const ratio = assigned / Math.max(closedThisWeek, 1);
  return clamp((ratio * 25) + (overdue * 15), 0, 100);
}

// SIGNAL 5: Velocity Change
// Compare recent throughput to baseline
// Both sharp increases AND decreases are concerning
function scoreVelocityChange(current7d: Metrics[], baseline: Metrics[]): number {
  const currentVelocity = sum(current7d.map(d => d.totalCommits + d.prsMerged));
  const baselineWeeklyAvg = sum(baseline.map(d => d.totalCommits + d.prsMerged)) / (baseline.length / 7);
  const change = Math.abs(currentVelocity - baselineWeeklyAvg) / Math.max(baselineWeeklyAvg, 1);
  // 50% change in either direction = 50 score
  return clamp(change * 100, 0, 100);
}

// SIGNAL 6: Pattern Disruption
// How irregular are working hours compared to baseline?
function scorePatternDisruption(current7d: Metrics[], baseline: Metrics[]): number {
  const currentSpread = avg(current7d.map(d => d.workingHoursSpread ?? 0));
  const baselineSpread = avg(baseline.map(d => d.workingHoursSpread ?? 0));
  const disruption = currentSpread - baselineSpread;
  return clamp(disruption * 20, 0, 100);
}
```

### Risk Level Classification (`src/lib/scoring/thresholds.ts`)

```typescript
type RiskLevel = "low" | "moderate" | "elevated" | "high" | "critical";

function classifyRisk(score: number): RiskLevel {
  if (score < 20) return "low";
  if (score < 40) return "moderate";
  if (score < 60) return "elevated";
  if (score < 80) return "high";
  return "critical";
}

// Colors for UI
const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#22c55e",        // green
  moderate: "#eab308",   // yellow
  elevated: "#f97316",   // orange
  high: "#ef4444",       // red
  critical: "#dc2626",   // dark red
};

// Recommendations per level
const RISK_RECOMMENDATIONS: Record<RiskLevel, string[]> = {
  low: ["Looking healthy! Keep up sustainable habits."],
  moderate: [
    "Slightly elevated signals detected.",
    "Consider reviewing workload distribution.",
  ],
  elevated: [
    "Multiple burnout signals active.",
    "Recommend reducing after-hours work.",
    "Consider delegating some issue load.",
  ],
  high: [
    "Significant burnout risk detected.",
    "Strongly recommend a 1:1 check-in.",
    "Review sprint commitments.",
    "Encourage time off.",
  ],
  critical: [
    "Critical burnout risk. Immediate attention needed.",
    "Reduce workload immediately.",
    "Schedule wellness conversation.",
    "Consider mandatory time off.",
  ],
};
```

---

## 🧩 MODULE 5: Dashboard UI

### What to build
- Team Overview page (main dashboard)
- Individual Member page (detailed view)
- Charts: trend lines, heatmaps, signal breakdowns
- Privacy controls inline

### Team Overview (`src/app/(dashboard)/page.tsx`)

```
┌──────────────────────────────────────────────────────────────┐
│  DevPulse  │  Team: Acme Engineering  │  Settings  │  Alerts │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Team Health Summary                        Last 30 days ▼  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🟢 Low: 4    🟡 Moderate: 2    🟠 Elevated: 1      │   │
│  │  🔴 High: 1   ⚫ Critical: 0                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Team Trend (30 days)                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📈 Line chart: avg team score over time              │   │
│  │  With colored zones (green/yellow/orange/red)         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Team Members                                                │
│  ┌──────────┬────────┬─────────┬────────────┬────────────┐  │
│  │ Member   │ Score  │ Risk    │ Trend (7d) │ Top Signal │  │
│  ├──────────┼────────┼─────────┼────────────┼────────────┤  │
│  │ Alice K. │  23    │ 🟢 Low  │   ↗ +2     │ —          │  │
│  │ Bob M.   │  45    │ 🟡 Mod  │   ↘ -5     │ Weekend    │  │
│  │ Carol S. │  71    │ 🔴 High │   ↗ +12    │ Overload   │  │
│  │ Anonymous│  38    │ 🟡 Mod  │   → 0      │ After-hrs  │  │
│  └──────────┴────────┴─────────┴────────────┴────────────┘  │
│  * Anonymous members have opted out of name visibility       │
│                                                              │
│  Activity Heatmap (Team Aggregate)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Grid: hours (x) × days of week (y)                   │   │
│  │  Color intensity = commit activity                     │   │
│  │  Highlights after-hours and weekend hotspots           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Individual View (`src/app/(dashboard)/member/[id]/page.tsx`)

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Team  │  Carol S.  │  carol@acme.dev             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Current Score: 71/100              Risk Level: 🔴 HIGH      │
│  Trend: ↗ +12 this week                                     │
│                                                              │
│  Signal Breakdown (Radar Chart)                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        After-Hours (65)                               │   │
│  │       /            \                                  │   │
│  │  Patterns(30)    Weekend(55)                          │   │
│  │       \            /                                  │   │
│  │  Velocity(40)--Overload(85)                           │   │
│  │         \      /                                      │   │
│  │       ReviewDrop(50)                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Score History (90 days line chart)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Line chart with risk-level color bands               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Personal Activity Heatmap                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  GitHub-style contribution grid                       │   │
│  │  With time-of-day overlay showing late/early activity │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Weekly Metrics Table                                        │
│  ┌────────┬─────────┬────────┬──────────┬────────────────┐  │
│  │ Week   │ Commits │ PRs    │ Issues   │ After-hrs %    │  │
│  ├────────┼─────────┼────────┼──────────┼────────────────┤  │
│  │ Feb 10 │ 34      │ 5/3/7  │ 12/8/2↻  │ 35% ⚠️        │  │
│  │ Feb 3  │ 28      │ 4/6/5  │ 10/9/0↻  │ 18%           │  │
│  └────────┴─────────┴────────┴──────────┴────────────────┘  │
│                                                              │
│  Recommendations                                             │
│  • Significant burnout risk detected.                        │
│  • Issue overload is the #1 concern (12 open, 2 overdue)     │
│  • After-hours commits increased 3x this week                │
│  • Consider reassigning 3-4 issues to reduce load            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Chart Components to Build

| Component | Library | Description |
|-----------|---------|-------------|
| `TeamTrendChart` | Recharts `AreaChart` | 30-day avg score with colored risk zones |
| `SignalRadarChart` | Recharts `RadarChart` | 6-axis signal breakdown |
| `ActivityHeatmap` | Custom SVG or D3 | Hours × days grid, color intensity |
| `ScoreHistoryChart` | Recharts `LineChart` | Individual 90-day score line |
| `ContributionGrid` | Custom SVG | GitHub-style squares with time overlay |
| `RiskDistributionBar` | Recharts `BarChart` | Stacked bar of team risk levels |

---

## 🧩 MODULE 6: Alerts & Notifications

### What to build
- Alert rule configuration UI
- Slack webhook integration
- Email notifications (via Resend or SendGrid)
- Daily/weekly digest option
- Individual notification preferences

### Alert Rule Config (`src/app/(dashboard)/alerts/page.tsx`)

```
┌──────────────────────────────────────────────────────────────┐
│  Alert Rules                                                  │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Rule: "High Risk Alert"                                  │ │
│  │ Trigger: When any member reaches 🔴 High risk           │ │
│  │ Channel: #eng-health (Slack)                             │ │
│  │ Message: "[name] has reached high burnout risk (score)"  │ │
│  │ Privacy: Only if member opted in to sharing              │ │
│  │ [Edit] [Disable] [Delete]                                │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Rule: "Weekly Team Digest"                               │ │
│  │ Trigger: Every Monday 9am                                │ │
│  │ Channel: team-lead@acme.dev (Email)                      │ │
│  │ Content: Anonymized team summary                         │ │
│  │ [Edit] [Disable] [Delete]                                │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  [+ Add New Rule]                                            │
└──────────────────────────────────────────────────────────────┘
```

### Notification Templates

```typescript
// Slack message format
interface SlackBurnoutAlert {
  blocks: [
    {
      type: "header",
      text: { type: "plain_text", text: "⚠️ DevPulse Alert" }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*{name}* has reached *{riskLevel}* burnout risk\nScore: {score}/100 (↗ +{delta} this week)"
      }
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*Top Signal:* {topSignal}" },
        { type: "mrkdwn", text: "*Trend:* {trend}" }
      ]
    },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "View Dashboard" }, url: "{dashboardUrl}" }
      ]
    }
  ]
}
```

---

## 🧩 MODULE 7: Privacy & Security Layer

### What to build
- Data anonymization for team views
- Opt-in/opt-out controls per user
- Token encryption at rest
- Data retention policies (auto-delete after X days)
- GDPR compliance: export and delete user data

### Privacy Controls (`src/lib/utils/privacy.ts`)

```typescript
interface PrivacyConfig {
  // Individual level
  shareScoreWithTeam: boolean;      // default: false
  shareNameWithTeam: boolean;       // default: true
  shareDetailedMetrics: boolean;    // default: false
  
  // Team level (set by admin)
  individualScoresVisible: "self_only" | "opt_in" | "managers_only";
  metricsRetentionDays: number;     // default: 90
  allowDataExport: boolean;         // default: true
}

// What each role can see:
// Individual: Everything about themselves
// Team Member: Team aggregate, anonymized breakdown, opted-in peers
// Team Admin/Manager: Team aggregate, anonymized breakdown, opted-in individuals
// Nobody: Raw git diffs, commit messages, code content (NEVER ingested)
```

### Data the tool NEVER collects
- Code content or diffs
- Commit messages
- PR descriptions or comments
- Issue descriptions
- Slack messages
- Screen time or keystroke data

### Data Export/Delete (`src/app/api/members/[id]/data/route.ts`)
```typescript
// GET  /api/members/{id}/data  → export all personal data as JSON
// DELETE /api/members/{id}/data → delete all personal data
```

---

## 🧩 MODULE 8: Reports & Insights

### What to build
- Weekly team health report (auto-generated)
- Monthly trends report
- Exportable PDF reports
- Recommendations engine based on signal patterns

### Weekly Report Content

```
┌──────────────────────────────────────────────┐
│  Weekly Health Report — Feb 10-16, 2026       │
│  Team: Acme Engineering (8 members)           │
│                                               │
│  Summary                                      │
│  • Team avg score: 38 (Moderate) ↗ +4         │
│  • 1 member at High risk (up from 0)          │
│  • Most common signal: After-hours work        │
│  • Weekend activity: 25% of team (2 members)   │
│                                               │
│  Highlights                                   │
│  ✅ 3 members improved scores this week        │
│  ⚠️ After-hours commits up 40% team-wide       │
│  ⚠️ PR review participation down 20%           │
│                                               │
│  Recommendations                              │
│  1. Review sprint load — 2 members overloaded  │
│  2. Encourage "no commit after 8pm" practice   │
│  3. Redistribute PR reviews more evenly        │
└──────────────────────────────────────────────┘
```

---

## 🧩 MODULE 9: Landing Page & Onboarding

### What to build
- Public landing page explaining the product
- Signup flow
- Onboarding wizard: connect integration → select repos → invite team → see first data
- Empty states for when data hasn't been collected yet

### Onboarding Flow

```
Step 1: Create Team
  → Team name, your timezone

Step 2: Connect Integration
  → OAuth with GitHub (primary)
  → Select organization
  → Select repos to track

Step 3: Invite Team Members
  → Email invites or shareable link
  → Members connect their own GitHub accounts

Step 4: Waiting for Data
  → "We're collecting your first signals..."
  → Show progress bar (need ~5-7 days for baseline)
  → Preview dashboard with sample data

Step 5: Baseline Ready
  → "Your team's baseline is ready!"
  → Show first real dashboard
```

---

## 🛠️ Build Order (Recommended)

| Phase | Modules | Estimated Time |
|-------|---------|----------------|
| **Phase 1: Foundation** | Module 1 (Setup & Auth) + Module 2 (Integrations - GitHub only) | 1-2 weeks |
| **Phase 2: Core Engine** | Module 3 (Ingestion) + Module 4 (Score Engine) | 2 weeks |
| **Phase 3: Dashboard** | Module 5 (Dashboard UI) | 2 weeks |
| **Phase 4: Alerts** | Module 6 (Alerts & Notifications) | 1 week |
| **Phase 5: Privacy** | Module 7 (Privacy Layer) | 1 week |
| **Phase 6: Polish** | Module 8 (Reports) + Module 9 (Landing & Onboarding) | 2 weeks |
| **Phase 7: Expand** | GitLab + Bitbucket + Jira/Linear integrations | 2 weeks |

**Total MVP: ~10-12 weeks solo**

---

## 🔑 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/devpulse"

# Auth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth App
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# GitLab OAuth App (Phase 7)
GITLAB_CLIENT_ID=""
GITLAB_CLIENT_SECRET=""

# Notifications
SLACK_WEBHOOK_URL=""
RESEND_API_KEY=""

# Encryption
ENCRYPTION_KEY="32-byte-hex-key-for-token-encryption"
```

---

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^4.24.0",
    "@auth/prisma-adapter": "^1.0.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "date-fns": "^3.0.0",
    "date-fns-tz": "^2.0.0",
    "zod": "^3.22.0",
    "resend": "^2.0.0",
    "@slack/webhook": "^7.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 💡 Tips for Working with Claude Code

1. **Start each module by sharing this blueprint** — paste the relevant module section
2. **Work file by file** — ask Claude Code to build one file at a time and test
3. **Test the score engine independently** — write unit tests with mock data before connecting to real APIs
4. **GitHub webhook testing** — use [smee.io](https://smee.io) to proxy webhooks locally
5. **Privacy first** — implement the privacy layer BEFORE inviting any real users
6. **Seed data** — create a seed script with realistic mock data so you can build the UI without waiting for real integrations

---

*Built with ❤️ to keep developers healthy and sustainable.*
