# Contributing to SyncMind

First off, thank you for considering contributing to SyncMind! We welcome community contributions to help improve our ecosystem. 

Since SyncMind operates on a multi-part architecture (Web Dashboard, AWS Pipeline, and Electron Desktop Client), please take a moment to review this guide to ensure your changes align with our setup and coding standards.

## 🚀 How to Contribute

### 1. Claiming an Issue
Before you start working or open a Pull Request, please ensure you are officially assigned to an issue:
- **Check if the issue is assigned**: Look at the "Assignees" section on the GitHub issue.
- **If it is NOT assigned**: Drop a comment asking to be assigned. Wait for a maintainer to assign it to you before starting work.
- **If it IS assigned**: Check if there is already an open PR for it. If there is no open PR (or it's been inactive), you can drop a comment asking if you can be assigned to it instead.
> **⚠️ Note:** We will close Pull Requests from contributors who were not assigned to the related issue.

### 2. Setup Your Local Environment
Follow the instructions in the `README.md` to set up the Web Dashboard or the Desktop Client.

### 3. Branch Naming Conventions
Create a new branch from `main` (for web) or `electron-recorder` (for desktop) before making any changes. Use descriptive prefixes:
- `feat/add-authentication`
- `fix/navbar-responsive-bug`
- `docs/update-readme`
- `refactor/improve-api-handling`

### 4. Coding Standards
- **UI Components**: Keep them modular and reuse existing Tailwind utility classes where possible.
- **Responsiveness**: Ensure mobile responsiveness for all web dashboard tasks.
- **Architecture Integrity**: Do not bypass the AWS pipeline or hardcode mock data in production builds. The frontend dashboard must only read from the secure API Gateway.
- **Clean Code**: Remove unnecessary `console.log`s, keep formatting clean, and use meaningful variable names.

### 5. Pull Request Process
1. Fork the repository and create your feature branch.
2. Commit your changes with meaningful messages (e.g., `feat: Add some AmazingFeature`).
3. Push your branch to your fork.
4. Open a Pull Request! 
   - **PR Template**: GitHub will automatically populate your PR description using our template (located at `.github/pull_request_template.md`). Please fill it out completely, and remember to link the issue you were assigned to.

---

## 🏷️ Issue Labels
We use standard labels to track issues. Look out for these when finding a task:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `frontend` - Web dashboard (React/Tailwind)
- `electron` - Desktop client
- `aws` - Backend pipeline and database
- `good first issue` - Great for newcomers!

---

## 🎯 Roadmap & Open Tasks
Looking for something to work on? Here are some tasks we need help with. **All tasks listed below have been verified against the existing codebase and are confirmed NOT yet implemented.**

### 🟢 Easy (Good First Issues)
- **UI Polishing:** Fix alignments, padding, and ensure all React components render flawlessly on all mobile screen sizes.
- **Loading States:** The dashboard currently has no loading feedback. Add animated skeleton loaders while meetings are being fetched from the API to prevent layout shifts.
- **Empty State UI:** When no meetings exist in the list, show a well-designed empty state placeholder (illustration + message) instead of a blank panel.
- **Standardize Icons:** Audit and standardize the use of `lucide-react` icons across all dashboard components for consistency.
- **Meeting Duration Display:** Parse and display the total duration of each meeting in the `MeetingList` sidebar card (e.g., `45 min`).

### 🟡 Medium
- **Date Filtering:** Add a date range picker or filter buttons (Today, Last 7 Days, Last 30 Days) above the meeting list to quickly narrow down past meetings.
- **Speaker Name Mapping:** Allow users to rename "Speaker 1", "Speaker 2", etc. to actual participant names within the `TranscriptChat` component, which should persist locally.
- **Export as Markdown:** Enhance the existing "Export as PDF" button (currently uses `window.print()`) to also offer a proper Markdown `.md` file export of the full transcript and action items.
- **Transcript Word-level Timestamps:** Display a timestamp badge (e.g., `[00:03:12]`) for each speaker block in `TranscriptChat` using timestamp data from the AWS pipeline.
- **Action Item Persistence:** Action item checkboxes currently reset on every page load. Wire the checked state to `localStorage` or, ideally, back to DynamoDB via an API PATCH call so the state persists across sessions.
- **Notification System:** The Settings page has notification checkboxes (Meeting Processed, Action Items Reminder) that do nothing. Implement browser push notifications using the Notifications API and wire them up to the existing Settings UI toggles.

### 🔴 Hard
- **Google OAuth Multi-Tenant Architecture:** Bridge the existing frontend Google Auth flow (PR #26) to the AWS Lambda backend to scope meeting data per user. This requires adding a `userId` field to the DynamoDB schema and updating all Lambda functions to filter by the authenticated user.
- **Transcript Sentiment Analysis:** Run per-speaker sentiment scoring across transcript blocks and display a visual "mood timeline" on the Meeting Details page, giving a bird's-eye view of how meeting energy changed over time.
- **Electron UI Overlay Widget:** Build a transparent, always-on-top, click-through floating widget for the desktop app (using Electron's `setIgnoreMouseEvents` + frameless window) that hovers over any meeting call to show live recording status and action item count without interrupting the call.
- **Live Audio Playback Sync:** Add an embedded audio player to the `MeetingDetails` view that streams the S3 audio file and highlights the corresponding transcript speaker block in real time as playback progresses.
- **PWA (Progressive Web App) Support:** Convert the web dashboard into a Progressive Web App so it is installable on desktop/mobile and caches the latest meeting data for offline viewing using a Service Worker.
- **Slack / Notion Auto-Push:** Implement the backend for the Slack integration stub in `Settings.jsx` so that after a meeting is processed, a formatted summary and action items are automatically pushed to a configured Slack channel or Notion page.
