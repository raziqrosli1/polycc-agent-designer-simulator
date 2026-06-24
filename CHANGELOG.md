# Changelog

## 2026-06-25

### Pre-release Audit And Repair Pass

- Audited the entire app for GitHub release readiness before public deployment.
- Hardened mobile responsiveness across the shell, dashboard, generator, workspace, evaluation, history, and modal flows.
- Improved small-screen navigation with a more adaptive header and mobile-safe nav layout.
- Standardized card spacing, shadow usage, border radius, text scaling, and button behavior across shared UI components.
- Added stronger beginner onboarding on the dashboard, including clearer explanations of POLYCC Agentic AI League, AI Agents, GPRID, and the simulator loop.
- Reused the How To Play component so the onboarding flow is clearer and the component is no longer abandoned.
- Updated Academy and Competition Journey content to stay aligned with the official POLYCC knowledge file.
- Added missing officially confirmed logistics details, including final-round food and beverage support.
- Reworded AWS tool guidance so SageMaker AI Studio and Bedrock AgentCore are presented as possible tools, not guaranteed tools.
- Replaced temporary Decision debugging language with a polished readiness checklist and clearer submission status messaging.
- Expanded workspace accessibility with additional form labels, live notices, and clearer validation guidance.
- Improved sticky behavior for the workspace side rail on larger screens.
- Improved recent attempt, history, and evaluation layouts to reduce clipping and wrapping issues on small devices.
- Added empty-state fallbacks for local and DeepSeek evaluation sections when arrays are empty.
- Hardened HTTP requests with timeout support, empty-response protection, and clearer network error messages.
- Updated DeepSeek judging to use request timeouts and safer fallback content when the model omits critique lists.
- Preserved score-consistency safeguards between layer scores and overall AI score.
- Reset stale DeepSeek status and errors when starting, previewing, retrying, or submitting new scenarios.
- Verified the project with a successful production build after the repair pass.
- Replaced the default template README with project-specific GitHub documentation.
- Added this changelog for release tracking.
