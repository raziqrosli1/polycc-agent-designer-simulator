# Agent Designer Simulator

Agent Designer Simulator is a mobile-friendly training app for students preparing for the **POLYCC Agentic AI League 2026**. It helps beginners practice agent design using the **GPRID** framework: **Goal -> Priority -> Rules -> If-Then Logic -> Decision**.

The app is intentionally local-first. Students can generate reproducible scenarios, build complete GPRID drafts, evaluate their reasoning with the built-in rubric, and optionally run an advanced **DeepSeek AI Judge** pass for competition-style critique.

## Project Overview

This project is designed to make early agent-design practice:

- beginner-friendly
- reproducible through human-readable seeds
- usable on mobile and desktop
- bilingual in English and Bahasa Melayu
- aligned with the official `POLYCC-AGENTIC-AI-LEAGUE-2026-KNOWLEDGE.md` file

## Features

- Mobile-responsive dashboard, generator, workspace, evaluation, and history views
- First-time onboarding tutorial and beginner guidance
- Official POLYCC Academy and Competition Journey guidance
- Deterministic scenario generation across 10 launch domains
- Difficulty levels 1 to 10 with reproducible seed support
- Structured GPRID workspace with completion tracking and validation
- Local scoring engine with strengths, weaknesses, blind spots, and expert recommendation
- Optional DeepSeek AI Judge with error handling, timeout handling, retry flow, and debug mode
- Local history for replaying seeds and comparing attempts
- Light and dark themes
- English and Bahasa Melayu UI

## Screenshots

Add repository screenshots here before public promotion.

- `docs/screenshots/dashboard.png` - Dashboard and onboarding
- `docs/screenshots/workspace-mobile.png` - Mobile GPRID workspace
- `docs/screenshots/evaluation.png` - Local evaluation and DeepSeek judge
- `docs/screenshots/history.png` - Replayable attempt history

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Zustand
- LocalStorage persistence

## Installation

```bash
npm install
```

Create a local environment file by copying `.env.example` to `.env.local`.

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Environment Variables

The app supports a local-only DeepSeek configuration:

```env
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com
VITE_DEEPSEEK_MODEL=deepseek-v4-flash
```

## DeepSeek Setup

- `VITE_DEEPSEEK_API_KEY` is required only if you want to use the optional AI Judge
- Keep `.env.local` private and never commit real API keys
- The app sends the scenario plus the completed GPRID submission to DeepSeek
- DeepSeek responses are normalized before display to reduce layer-score and overall-score inconsistencies
- The client includes timeout handling, empty-response handling, retry support, and a debug view for parser consistency checks

## Usage Flow

1. Open the dashboard and read the onboarding guidance.
2. Generate a scenario by domain, difficulty, and optional seed.
3. Complete the five GPRID layers in order.
4. Mark each layer complete and submit for evaluation.
5. Review the local rubric feedback.
6. Optionally run DeepSeek AI Judge.
7. Replay the same seed to improve your design quality.

## Official Knowledge Source

Official competition guidance in this repository is based on:

- `POLYCC-AGENTIC-AI-LEAGUE-2026-KNOWLEDGE.md`

Where information is not officially confirmed, the UI explicitly labels it as unknown instead of presenting assumptions as facts.

## Future Roadmap

- Add curated screenshot assets for GitHub and presentation use
- Add focused automated tests around validation and DeepSeek parsing
- Add printable or exportable practice summaries
- Expand bilingual onboarding content and coaching examples
- Add richer analytics for repeated seed improvement over time

## Repository Notes

- This is a local-first app with no backend, login, or database
- User progress is stored in browser LocalStorage
- DeepSeek evaluation is optional and does not replace the built-in local rubric
