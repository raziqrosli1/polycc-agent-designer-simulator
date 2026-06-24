# Agent Designer Simulator
## Product Requirements Document (PRD) — v1.0

---

# Part I: Product Vision & Strategy

## 1.1 The Problem We Are Solving

Most AI Agent competitions fail students not because they lack technical skills, but because they lack **structured thinking**. They learn to write prompts. They do not learn to design decision systems.

The gap is not knowledge — it is judgment. Students can describe what an AI agent should do. They cannot engineer *how* it should decide.

The Agent Designer Simulator closes this gap by training the one skill that separates good prompt writers from genuine agent designers: **the ability to construct goal-driven, priority-ordered, rule-bounded, logic-verified decision systems** — before a single line of code is written.

## 1.2 The Core Insight

Designing an AI agent is a structured design problem, not a creative writing problem. Every professional agent designer — regardless of domain — works through the same five layers:

```
GOAL       →  What is this agent trying to achieve?
PRIORITY   →  When goals conflict, which matters most?
RULES      →  What boundaries must never be crossed?
IF-THEN    →  How does the agent reason from situation to action?
DECISION   →  What specific action does the agent choose?
```

This is the **GPRID Framework**. It is the intellectual backbone of the entire simulator. Every challenge, every evaluation, every feedback loop reinforces it.

## 1.3 Design Philosophy

**This is not an educational app. It is a practice arena.**

The difference is critical. An educational app teaches. A practice arena creates *repeated reps* under *varying conditions* so that skill becomes instinct. A student does not get better at agent design by reading about it. They get better by designing — badly at first, then less badly, then well.

The simulator must be:

- **Replayable** — the same student should want to return 50 times, not 5
- **Consequential** — every design decision should have a visible effect
- **Progressive** — difficulty must stay just above the student's current level
- **Honest** — evaluation must be specific, not generic praise

---

# Part II: User Research & Personas

## 2.1 Primary Persona: The Competition Entrant

**Name:** Haziq  
**Background:** Diploma student, Year 2, Electrical Engineering  
**Goal:** Win or place in the POLYCC Agentic AI League  
**Fears:** Looking foolish, not knowing where to start, memorising without understanding  
**Mental Model:** "AI Agent design is about writing good instructions to a chatbot"  
**Success Looks Like:** Can design a 5-layer GPRID framework for any scenario in under 20 minutes with a score above 75/100

## 2.2 Secondary Persona: The Curious Beginner

**Name:** Siti  
**Background:** Fresh college student, non-technical, interested in AI  
**Goal:** Understand what AI agents actually are and how to design them  
**Fears:** Technical jargon, getting it wrong, feeling dumb  
**Mental Model:** "AI is magic — I don't understand how decisions get made"  
**Success Looks Like:** Completes Level 1–3 independently, explains GPRID confidently to a friend

## 2.3 Secondary Persona: The Facilitator

**Name:** Puan Rohani  
**Background:** TVET lecturer preparing students for competitions  
**Goal:** A structured, independent practice tool that doesn't require her supervision  
**Fears:** Students wasting time, tool being too complex to explain  
**Mental Model:** "I want students practicing at home, not just in class"  
**Success Looks Like:** Can assign a weekly challenge; students come to class having genuinely practiced

---

# Part III: User Journey

## 3.1 First Visit Journey (0–15 minutes)

```
LAND ON PLATFORM
    ↓
See 3-second intro animation: "Design. Decide. Improve."
    ↓
See a sample scenario card (Education domain, Level 1)
    ↓
See the GPRID workspace — empty, labelled, inviting
    ↓
A "Try this challenge" button is the only prominent CTA
    ↓
User attempts their first design
    ↓
Receives first evaluation — even a low score feels informative
    ↓
Sees their XP, sees the next challenge unlocked
    ↓
Prompted: "Try the Level 2 version of this scenario?"
    ↓
User continues, or returns tomorrow
```

## 3.2 Returning Visit Journey

```
RETURN TO DASHBOARD
    ↓
See "Daily Challenge" — one new scenario every 24 hours
    ↓
See their progress ring — XP, level, streak
    ↓
See "Resume" — returns to in-progress challenge
    ↓
See "My Performance" — weak spots highlighted
    ↓
Jump to any domain or difficulty to practice specifically
```

## 3.3 Pre-Competition Journey (1–2 weeks out)

```
ENTER CHAMPIONSHIP MODE
    ↓
Randomised high-difficulty scenarios (Level 7–10)
    ↓
Timed: 45 minutes per challenge
    ↓
Compared against personal best (no multiplayer needed)
    ↓
Detailed breakdown: which GPRID layer was weakest
    ↓
Targeted drill: practice only Rule Design or only If-Then Logic
    ↓
Return and retest
```

---

# Part IV: Information Architecture

## 4.1 Top-Level Navigation

```
Agent Designer Simulator
├── Dashboard
│   ├── Daily Challenge
│   ├── Continue Last Challenge
│   ├── My Progress
│   └── Quick Stats
│
├── Challenges
│   ├── By Level (1–10)
│   ├── By Domain (20 domains)
│   ├── By GPRID Layer (targeted practice)
│   └── Championship Mode
│
├── GPRID Workspace (active during challenge)
│   ├── Scenario Brief
│   ├── Goal Designer
│   ├── Priority Designer
│   ├── Rules Designer
│   ├── If-Then Logic Builder
│   └── Decision Output
│
├── Evaluation Screen
│   ├── Scores by Layer
│   ├── Strengths
│   ├── Weaknesses
│   ├── Blind Spots
│   ├── Expert Recommendation
│   └── Retry / Next Challenge
│
├── Analytics
│   ├── Performance Over Time
│   ├── Score by GPRID Layer
│   ├── Domain Strengths & Gaps
│   └── Streak & Consistency
│
├── Achievements
│   ├── Badges
│   ├── Rank Progress
│   └── Milestones
│
└── Settings
    ├── Appearance (Dark / Light)
    ├── Difficulty Default
    ├── Timer Preferences
    └── Notifications
```

## 4.2 Data Flow Architecture

```
Scenario Generator
    ↓
Scenario Object (domain + objective + constraints + risks + difficulty)
    ↓
GPRID Workspace (user input: 5 layers)
    ↓
User Design Object (goal + priorities + rules + logic + decision)
    ↓
Evaluation Engine (AI-powered scoring via Claude API)
    ↓
Evaluation Object (5 scores + qualitative feedback)
    ↓
XP Engine (points, badges, rank updates)
    ↓
Local Storage (progress, designs, history)
    ↓
Dashboard (analytics, streaks, leaderboard)
```

---

# Part V: Scenario Generation Architecture

## 5.1 The Scenario Object

Every scenario is a structured object with these fields:

```json
{
  "id": "unique-uuid",
  "difficulty": 1,
  "domain": "Healthcare",
  "title": "Hospital Triage Support Agent",
  "context": "A medium-sized urban hospital receives 200 patients per day...",
  "agent_role": "You are designing an AI Triage Support Agent...",
  "objective": "Maximize patient safety while minimising wait times",
  "constraints": ["Limited staff: 4 triage nurses per shift", "Incomplete patient history in 30% of cases"],
  "risks": ["Wrong priority assignment", "Safety problems", "User dissatisfaction"],
  "stakeholders": ["Patients", "Triage nurses", "Hospital management"],
  "time_pressure": false,
  "information_completeness": "full",
  "competing_objectives": false,
  "sample_situation": "A 65-year-old arrives with chest pain. A 7-year-old arrives with a fever. The triage bay has 1 slot available."
}
```

## 5.2 Combinatorial Engine

The engine draws from pools across 5 axes, producing thousands of valid combinations:

**Axis 1: Domain** (20 domains)
Education, Career Development, Internship Placement, Student Success, Healthcare, Emergency Response, Customer Service, Finance, Smart City, Government Services, Logistics, Manufacturing, Agriculture, Environmental Management, Business Operations, Human Resources, Project Management, AI Systems, Cybersecurity, Research

**Axis 2: Objective Type** (10 types)
Maximize Performance, Reduce Cost, Improve Accuracy, Increase Satisfaction, Reduce Risk, Optimize Resources, Improve Safety, Increase Productivity, Improve Learning Outcomes, Improve Decision Quality

**Axis 3: Constraint Stack** (10 types, mixed by difficulty)
- Level 1: 1 constraint
- Level 5: 3 constraints
- Level 10: 5+ constraints, some contradictory

**Axis 4: Risk Profile** (3–5 active risks per scenario)
Wrong Decisions, Poor Recommendations, System Failure, User Dissatisfaction, Safety Problems, Time Overruns, Resource Waste, Missed Opportunities, Compliance Issues, Reputation Damage

**Axis 5: Difficulty Modifier** (determines active complexity dimensions)
- Time Pressure: ON/OFF
- Information Completeness: Full / Partial / Minimal
- Competing Objectives: None / Soft conflict / Hard conflict
- Agent Count: Single / Multi-agent
- Environmental Stability: Static / Dynamic / Chaotic

**Total unique combinations (approximate):**
20 × 10 × C(10,3) × C(10,4) × 32 ≈ **40,000+ meaningfully distinct scenarios**

With sentence-level variation in context descriptions, this scales to effectively unlimited.

## 5.3 Difficulty Tuning

Each level activates specific complexity dimensions:

| Level | Name | Active Dimensions |
|-------|------|-------------------|
| 1 | Foundation | Single objective, full info, no time pressure, 1 constraint |
| 2 | Multi-objective | 2 objectives, full info, 2 constraints |
| 3 | Resource Pressure | 2 objectives, partial info, 3 constraints including budget |
| 4 | Conflict | 2 conflicting objectives, 3 constraints |
| 5 | Time Pressure | 2 objectives, time limit active, 3 constraints |
| 6 | Fog of War | Incomplete information, 3–4 constraints |
| 7 | Dynamic | Situation changes mid-design, 4 constraints |
| 8 | Multi-Agent | Agent must coordinate with another agent, 4 constraints |
| 9 | Strategic | Long-horizon consequences, 5 constraints, competing stakeholders |
| 10 | Championship | All dimensions active, adversarial environment |

---

# Part VI: GPRID Workspace Design

## 6.1 The Five-Panel Layout

The workspace is the heart of the simulator. It is a single, focused screen divided into five sequential panels, each representing one layer of the GPRID framework.

**Design Principle:** Each panel gates the next. A student cannot skip Goal to jump to Rules. The sequence enforces the discipline.

### Panel 1: Goal Designer

**What the student must do:**
Define the primary goal of the agent in a single, clear, measurable statement.

**Input:**
- One primary goal field (text, max 150 characters)
- Optional: One secondary goal (unlocked at Level 2+)

**Helper prompts (contextual, shown on first 3 attempts):**
- "A good goal answers: What should the agent achieve, for whom, and how will success be measured?"
- "Avoid vague goals like 'improve things'. Be specific: 'Reduce patient wait time by 20% while maintaining safety standards.'"

**Quality signals (real-time, before submission):**
- ✓ Specific: Does the goal name a measurable outcome?
- ✓ Bounded: Does it specify scope or beneficiary?
- ✓ Achievable: Is it realistic for an AI agent?

### Panel 2: Priority Designer

**What the student must do:**
Rank a set of 4–6 competing values from most important to least important. At higher levels, they must also add their own priorities.

**Input:**
- Drag-and-drop priority ranking (1 = most critical)
- At Level 4+: a "priority conflict note" field — what happens when #1 and #2 conflict directly?

**Pre-populated values (drawn from scenario):**
Examples: Safety, Speed, Cost, Accuracy, User Satisfaction, Compliance, Privacy, Fairness

**Design Rationale:** Forcing students to rank values makes implicit assumptions explicit. Most beginners skip this step. The simulator refuses to.

### Panel 3: Rules Designer

**What the student must do:**
Define 3–5 hard rules the agent must always follow, regardless of circumstances.

**Input:**
- Rule cards (add/remove). Each rule has:
  - Rule statement (text)
  - Rule type: MUST / MUST NOT / ALWAYS / NEVER
  - Reasoning field (why this rule?)

**Validation rules:**
- Rules must be unambiguous (system flags weasel words: "usually", "sometimes", "try to")
- Rules must be testable (can a human verify if this rule was followed?)
- Rules must not contradict each other (system checks for logical conflicts at Level 6+)

### Panel 4: If-Then Logic Builder

**What the student must do:**
Create 3–7 if-then decision rules that cover the core decision branches the agent will face.

**Input:**
- Visual if-then cards:
  ```
  IF [condition]
  THEN [agent action]
  BECAUSE [reasoning]
  ```
- At Level 5+: ELSE branches become required
- At Level 8+: must include agent-to-agent communication conditions

**Condition builder:**
Students select from scenario-relevant condition types:
- Threshold conditions: "IF patient wait time > 30 minutes"
- State conditions: "IF bed availability < 3"
- Priority conditions: "IF incoming case severity > current queue severity"
- Uncertainty conditions: "IF information completeness < 50%"

**Coverage indicator:**
Shows which of the scenario's stated risks are addressed by at least one if-then rule. Motivates completeness.

### Panel 5: Decision Output

**What the student must do:**
Apply their entire framework to the scenario's sample situation (provided at the start) and write the specific decision the agent should make.

**Input:**
- Decision statement (text, max 200 characters)
- Decision reasoning (text, max 400 characters — connects decision back to Goal, Priority, and relevant Rules)
- Confidence level (slider: Low / Medium / High) + brief justification

**Design Rationale:** This is where all the thinking gets tested. If the Goal is vague, the Decision will be indefensible. If the Rules contradict, the Decision will be impossible. The panel forces everything to cohere.

---

# Part VII: Evaluation Architecture

## 7.1 Evaluation Philosophy

Evaluation is the most important part of the product. Bad evaluation destroys the learning loop. Good evaluation makes each attempt feel like a coaching session.

**The evaluation must never:**
- Give only a number
- Use generic praise ("Good job!")
- Be vague about what was wrong
- Be harsh without constructive direction

**The evaluation must always:**
- Explain *why* a score was given
- Name the specific weakness (not just "your rules need work" — "Rule 3 is untestable because it uses the word 'adequate'")
- Show what an expert would have done differently
- End with one concrete improvement for the next attempt

## 7.2 Evaluation Rubric: The 5-Layer Scoring System

Each layer is scored 0–10. Total score is 0–100.

### Layer 1: Goal Quality (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Goal is specific, measurable, bounded, and appropriate for the scenario |
| 7–8 | Goal is clear but lacks one quality dimension (e.g., specific but not measurable) |
| 5–6 | Goal addresses the right domain but is vague or overly broad |
| 3–4 | Goal is tangential to the scenario or generic |
| 0–2 | Goal is absent, circular, or meaningless |

### Layer 2: Priority Design (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Priorities are ranked, justified, and conflict resolution is addressed |
| 7–8 | Priorities are ranked correctly but conflict resolution is missing |
| 5–6 | Priorities are listed but not ranked, or ranking conflicts with stated goal |
| 3–4 | Only 1–2 priorities defined; critical values missing |
| 0–2 | No priorities defined or priorities are internally contradictory |

### Layer 3: Rules Quality (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | 4–5 rules, all unambiguous, testable, non-contradictory, and well-reasoned |
| 7–8 | Rules are mostly clear; 1 rule uses vague language or lacks reasoning |
| 5–6 | Rules are present but 2+ are untestable or contradictory |
| 3–4 | Rules are too generic to constrain agent behaviour meaningfully |
| 0–2 | No meaningful rules, or rules directly contradict priorities |

### Layer 4: Logic Coverage (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | If-then rules cover all major scenario risks; conditions are specific; ELSE branches present (Level 5+) |
| 7–8 | 80%+ risk coverage; conditions mostly specific |
| 5–6 | Core cases covered but 1–2 major risks unaddressed |
| 3–4 | Only obvious cases covered; rare but critical situations ignored |
| 0–2 | Logic is absent, circular, or does not connect to stated rules |

### Layer 5: Decision Quality (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Decision follows directly from Goal, Priority, and Rules; reasoning is traceable; confidence is calibrated |
| 7–8 | Decision is correct but reasoning has a gap or doesn't reference all relevant layers |
| 5–6 | Decision is plausible but not clearly derived from the framework |
| 3–4 | Decision contradicts stated rules or priority ranking |
| 0–2 | Decision is absent or incoherent |

## 7.3 Feedback Structure

The evaluation screen shows four feedback modules:

**1. Strengths** (2–3 bullet points)
Specific things the student did well, naming the exact layer and element.

**2. Weaknesses** (2–3 bullet points)
Specific failures, naming the exact element that caused the issue.

**3. Blind Spots** (1–2 bullet points)
Risks in the scenario the student didn't address — things they didn't even think to think about. This is the most educational module.

**4. Expert Recommendation** (1 paragraph)
A brief example of what a high-scoring response to this layer would look like. Not a full solution — just enough to show the direction.

## 7.4 AI Evaluation Engine (Claude API)

The evaluation is powered by Claude, called with a structured prompt that includes:
- The scenario object (domain, objective, constraints, risks)
- The user's full GPRID design object
- The evaluation rubric (injected into system prompt)
- An instruction to return structured JSON with scores + text feedback

**API Call Architecture:**
```javascript
const evaluationPrompt = {
  model: "claude-sonnet-4-6",
  max_tokens: 1000,
  system: EVALUATION_SYSTEM_PROMPT, // includes rubric + output format spec
  messages: [{
    role: "user",
    content: JSON.stringify({ scenario, userDesign })
  }]
};
```

**Response Format:**
```json
{
  "scores": {
    "goal": 7,
    "priority": 6,
    "rules": 8,
    "logic": 5,
    "decision": 7
  },
  "total": 66,
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "blind_spots": ["..."],
  "expert_recommendation": "..."
}
```

---

# Part VIII: Progression System Design

## 8.1 XP Economy

XP is earned through every meaningful action. The economy is calibrated so a student practicing 30 minutes per day reaches Level 5 rank in approximately 3 weeks.

| Action | XP |
|--------|-----|
| Complete a challenge (any score) | 50 |
| Score above 60/100 | +25 |
| Score above 75/100 | +50 |
| Score above 90/100 | +100 |
| Daily challenge completed | +30 |
| 3-day streak | +75 |
| 7-day streak | +200 |
| Retry and improve by 10+ points | +40 |
| First attempt in a new domain | +20 |
| Complete all 10 difficulty levels in a domain | +500 |

## 8.2 Rank Progression

| Rank | XP Required | Unlock |
|------|-------------|--------|
| Beginner Agent | 0 | Levels 1–2, 5 domains |
| Junior Agent | 500 | Levels 1–3, 10 domains |
| Agent Designer | 1,500 | Levels 1–5, all domains |
| Senior Agent Designer | 3,500 | Levels 1–7, targeted practice mode |
| Agent Architect | 7,000 | Levels 1–9, multi-agent challenges |
| Strategic Architect | 12,000 | All levels, design comparison mode |
| League Finalist | 20,000 | Championship Mode access |
| Master Agent Designer | 35,000 | Design portfolio export |
| Champion Agent Designer | 50,000 | Hall of Fame entry |

## 8.3 Achievement Badge System

Badges are earned through specific behaviours, not just time-in-product. They reward quality, breadth, and consistency.

**Category 1: Domain Mastery**
- "Healthcare Navigator" — score 75+ in 5 Healthcare challenges
- "Smart City Planner" — complete all 10 levels in Smart City domain
- "Cross-Domain Thinker" — score 70+ across 8 different domains

**Category 2: GPRID Layer Excellence**
- "Goal Architect" — achieve 9+/10 in Goal layer 5 times
- "Logic Builder" — design 10+ if-then rules without a coverage gap
- "Rule Enforcer" — write 3 challenges' worth of rules with zero vague language flags

**Category 3: Improvement Badges**
- "Comeback" — retry a challenge and improve by 20+ points
- "Perfectionist" — score 95+ on any challenge
- "Consistent Climber" — improve score on 5 consecutive retries

**Category 4: Challenge Completion**
- "Completionist" — finish all 10 difficulty levels of any domain
- "Speed Thinker" — complete a Level 5+ challenge within 25 minutes with 70+ score
- "Streak of Excellence" — 7-day daily challenge streak

## 8.4 Daily & Weekly Challenges

**Daily Challenge:** One randomised scenario (difficulty scales to user's current rank). Available for 24 hours. Earns bonus XP and maintains streak. Resets at midnight.

**Weekly Challenge:** A curated, harder scenario (always 2 levels above user's rank) released every Monday. Full week to complete. Earns a special badge if scored 80+.

**Championship Challenge:** Monthly. Simulates competition conditions. 45-minute timer. 3 attempts. Score goes on personal record. Users see their own historical best (no public leaderboard required in v1).

---

# Part IX: UI/UX Design System

## 9.1 Design Identity

The simulator looks and feels like a professional decision-intelligence tool, not an educational game. The closest analogues are Linear's focus and restraint, Stripe's data clarity, and Anthropic's philosophical seriousness.

**Design character:** Calm confidence. Every element communicates: "This is a serious tool for serious thinkers."

**The one aesthetic risk:** The GPRID Workspace uses a vertical progress spine — a thin vertical line running the full height of the left edge of the workspace, with five nodes (one per layer). Each node illuminates as the user completes that layer. This is not a progress bar. It is a visual representation of building a system layer by layer — a deliberate metaphor for the construction of a decision architecture. This element is the signature visual of the product.

## 9.2 Colour System

```
Background     #0A0A0F   (near-black, not pure black)
Surface        #13131A   (card backgrounds)
Surface Raised #1C1C26   (elevated elements)
Border         rgba(255,255,255,0.08)
Border Hover   rgba(255,255,255,0.14)

Accent Primary    #5B7BF5   (electric blue — CTA, active states)
Accent Secondary  #8B5CF6   (violet — achievements, rank)
Accent Success    #34D399   (emerald — high scores, completion)
Accent Warning    #F59E0B   (amber — medium scores, alerts)
Accent Danger     #F87171   (coral — low scores, critical flags)

Text Primary      #F2F2F5
Text Secondary    #9090A8
Text Muted        #5A5A72
```

**Light Mode:**
```
Background     #FAFAFA
Surface        #FFFFFF
Surface Raised #F4F4F8
Border         rgba(0,0,0,0.07)
Text Primary   #0F0F14
Text Secondary #5A5A72
```

## 9.3 Typography

**Display / Headings:** Inter, weights 400 and 500 only. Large tracking for small labels.
**Body:** Inter, 15px/1.65 line height. Clean and readable.
**Code / Logic:** JetBrains Mono, 13px. Used for if-then rule syntax.
**Data:** Tabular numerals enabled on all score displays.

**Type Scale:**
```
Display    32px / 500
H1         24px / 500
H2         19px / 500
H3         16px / 500
Body       15px / 400
Small      13px / 400
Label      11px / 500 / 0.08em tracking / UPPERCASE
```

## 9.4 Component Library

**Scenario Card**
- 8px border radius, Surface background
- Domain tag (pill, accent colour per domain)
- Difficulty indicator: five small squares, filled count = level
- Two-line title + one-line context summary
- Time estimate + XP reward shown bottom-right

**GPRID Layer Card**
- Full-width within workspace
- Layer number (Label type), layer name (H3)
- Input area below, full width
- Real-time quality indicator (three small circular icons: Specific / Bounded / Testable)
- Completion state: subtle left border turns accent blue when filled

**Score Ring**
- 96px diameter SVG ring
- Ring fill = total score ÷ 100 × 360°
- Score number centred, 24px/500
- Ring colour: Danger (<40), Warning (40–69), Success (70+)

**Feedback Module**
- Section header (Label type)
- Each item as a left-bordered card (3px left border, matching colour per type)
- Strengths: emerald border
- Weaknesses: amber border
- Blind Spots: violet border
- Expert: blue border

**XP Bar**
- Full-width horizontal bar below navigation
- Current XP / Next rank XP shown as fraction right-aligned
- Bar fills left to right, smooth transition on XP gain

**Achievement Badge**
- 56px circle, domain-specific icon
- Locked state: desaturated + opacity 40%
- Earned state: full colour, subtle pulsing glow (1×, on unlock)
- Label below, 11px

## 9.5 Motion Principles

Motion is used in exactly three places:

1. **Evaluation reveal** — the five score rings fill one by one, left to right, 200ms delay between each. This is the most satisfying moment in the product.

2. **GPRID spine activation** — when a layer is completed, the spine node illuminates with a 300ms ease-out fill.

3. **XP gain** — a brief counter animation (300ms) when XP is added to the bar. No particles, no explosions.

All other transitions are instant (0ms) or a simple 150ms opacity fade. No bouncing. No spring physics. No parallax.

---

# Part X: Screen-by-Screen Specification

## 10.1 Dashboard

**Layout:** Two-column on desktop (content 60%, sidebar 40%)

**Left Column:**
- Daily Challenge card (prominent, always first)
- Recent Challenges list (last 5, with scores)
- Recommended: "Strengthen your weakest layer" (dynamically targets lowest average layer score)

**Right Column:**
- Rank card (current rank, XP ring, next rank label)
- Streak indicator (flame icon + count)
- Quick stats: Total challenges, Average score, Best score, Challenges this week

## 10.2 Challenge Screen

**Layout:** Grid of scenario cards

**Filters:**
- Difficulty (1–10 slider or chip select)
- Domain (20-chip select, horizontal scroll)
- GPRID Focus (show only challenges that heavily test a specific layer)

**Sort:** Latest, Hardest, Recommended, Quick (estimated <20 min)

## 10.3 GPRID Workspace

**Layout:** Single column, constrained to 720px max width, centred

**Left edge:** Vertical progress spine (fixed position, spans full page height)

**Top:** Scenario Brief — collapsible after first read. Always accessible via "View Scenario" button.

**Five panels** stack vertically. Each panel:
- Clear header: "Layer 1 — Goal Design"
- Brief instruction (1–2 sentences, collapses after first challenge)
- Input area
- Quality indicators
- "Mark Complete" to confirm and move to next panel (does not disable editing)

**Bottom:** Submit button (disabled until all 5 layers are completed). Timer visible (if active).

## 10.4 Evaluation Screen

**Layout:** Single column

**Top:** Overall score display — large score ring, total score number, grade label

**Middle:** Five mini-rings (one per layer) in a row — shows breakdown at a glance

**Bottom:** Four feedback modules (Strengths, Weaknesses, Blind Spots, Expert)

**Actions:** "Retry this challenge" / "Next challenge" / "View my design"

## 10.5 Analytics Screen

**Layout:** Dashboard-style, card grid

**Charts:**
- Score over time (line chart, last 20 challenges)
- GPRID layer radar chart (shows which layers average highest/lowest)
- Domain coverage map (shows which domains attempted and average score)
- Weekly activity heatmap (GitHub-style)

## 10.6 Championship Mode

**Layout:** Immersive — hides navigation, shows only timer and challenge

**Entry:** Confirmation screen — "Championship mode is timed. You cannot pause. Ready?"

**In-challenge:** Timer in top-right corner. Red when < 10 minutes remain.

**End:** Full evaluation as normal, plus "Championship Record" stamped on the evaluation

---

# Part XI: Technical Architecture

## 11.1 Tech Stack (v1)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React (Vite) | Component model fits the panel-based workspace; fast iteration |
| Styling | Tailwind CSS + CSS custom properties | Utility-first + design token support |
| State | Zustand | Lightweight, no boilerplate, fits a single-player local app |
| Storage | localStorage (JSON) | No backend required; stores progress, designs, history |
| AI | Anthropic Claude API (claude-sonnet-4-6) | Powers evaluation engine |
| Charts | Recharts | Declarative, React-native |
| Drag & Drop | dnd-kit | Priority panel drag-and-drop |
| Hosting | Static (Vercel / GitHub Pages) | No backend, no cost |

## 11.2 Local Storage Schema

```json
{
  "profile": {
    "xp": 1250,
    "rank": "Agent Designer",
    "streak": 4,
    "lastActive": "2026-06-24"
  },
  "designs": [
    {
      "scenarioId": "uuid",
      "timestamp": "ISO8601",
      "gprid": { "goal": "...", "priorities": [...], "rules": [...], "logic": [...], "decision": "..." },
      "scores": { "goal": 7, "priority": 6, "rules": 8, "logic": 5, "decision": 7, "total": 66 }
    }
  ],
  "achievements": ["healthcare-navigator", "comeback"],
  "settings": { "theme": "dark", "defaultDifficulty": 3 }
}
```

## 11.3 Scenario Generation Logic

Scenarios are generated client-side by combining:
- Randomly selected domain, objective, constraints (weighted by difficulty level)
- A narrative template (30+ templates per domain category, parameterised)
- A sample situation (drawn from a curated library of 200+ realistic decision moments)

No API call is needed for scenario generation. The system runs offline.

---

# Part XII: Development Roadmap

## Phase 1 — Foundation (Weeks 1–4)

**Goal:** A working GPRID Workspace and Evaluation Engine

Deliverables:
- Scenario object definition and static library (50 hand-crafted scenarios across 5 domains, Levels 1–5)
- GPRID Workspace: all 5 panels, functional input, quality indicators
- Claude API integration for evaluation
- Evaluation Screen with scores + feedback
- Basic localStorage persistence (current design + score history)

**Success Criteria:** A student can complete one challenge and receive meaningful evaluation feedback.

## Phase 2 — Progression (Weeks 5–8)

**Goal:** A reason to return tomorrow

Deliverables:
- XP system and rank progression
- Achievement badge system (20 badges)
- Daily Challenge engine (randomised scenario generation)
- Dashboard with progress summary
- Streak tracking

**Success Criteria:** A student logs in for 5 consecutive days.

## Phase 3 — Scale (Weeks 9–12)

**Goal:** Hundreds of scenarios across all domains

Deliverables:
- Dynamic scenario generation engine (combinatorial)
- All 20 domains, all 10 difficulty levels
- Levels 6–10 mechanics: time pressure, incomplete information, multi-agent
- Targeted practice mode (drill by GPRID layer)
- Analytics screen

**Success Criteria:** No two students report seeing the same scenario in the same week.

## Phase 4 — Competition (Weeks 13–16)

**Goal:** Pre-competition preparation mode

Deliverables:
- Championship Mode (timed, 3-attempt, score record)
- Performance analytics with AI-generated study plan
- Design portfolio export (PDF of best 5 designs)
- Weekly Challenge system
- Settings and customisation

**Success Criteria:** Students using Championship Mode improve their average score by 15+ points over 2 weeks.

## Phase 5 — Future (Post-launch)

Potential expansions (not in scope for v1):
- Multiplayer / Class Mode (teacher dashboard)
- Collaborative design (two students on one scenario)
- External leaderboard (opt-in)
- Mobile app (React Native)
- Offline mode (service worker)
- Integration with POLYCC competition registration

---

# Appendix A: GPRID Framework Reference Card

This is the core intellectual framework of the simulator. It should appear in the onboarding flow, the help panel, and the evaluation feedback.

```
G — GOAL
    What is the agent trying to achieve?
    Must be: Specific | Measurable | Bounded | Achievable

P — PRIORITY
    When goals or values conflict, which wins?
    Must be: Ranked | Justified | Conflict-aware

R — RULES
    What must the agent always or never do?
    Must be: Unambiguous | Testable | Non-contradictory

I — IF-THEN LOGIC
    Given a situation, what does the agent do?
    Must be: Condition-specific | Risk-covering | Complete

D — DECISION
    Given this specific situation, what is the agent's choice?
    Must be: Traceable | Coherent | Calibrated
```

---

# Appendix B: Evaluation System Prompt (Skeleton)

```
You are an expert AI Agent Design evaluator and competition coach.
You will evaluate a student's GPRID framework design against the provided scenario.
Score each of the five layers from 0 to 10 using the provided rubric.
Be specific, honest, and constructive. Never generic.

Scenario: {{scenario_object}}
Student Design: {{user_design_object}}

Return ONLY valid JSON in this exact format:
{
  "scores": { "goal": int, "priority": int, "rules": int, "logic": int, "decision": int },
  "total": int,
  "strengths": [string, string],
  "weaknesses": [string, string],
  "blind_spots": [string],
  "expert_recommendation": string
}
```

---

*Document version 1.0 — Agent Designer Simulator — Prepared for development handoff*
*Framework: GPRID © Agent Designer Simulator*
