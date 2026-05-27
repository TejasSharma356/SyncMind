# Contributing to SyncMind

First off, thank you for considering contributing to SyncMind! We welcome community contributions to help improve our ecosystem. 

Since SyncMind operates on a multi-part architecture (Web Dashboard, AWS Pipeline, and Electron Desktop Client), please take a moment to review this guide to ensure your changes align with our setup and coding standards.

## 🚀 How to Contribute

### 1. Setup Your Local Environment
Follow the instructions in the `README.md` to set up the Web Dashboard or the Desktop Client.

### 2. Branch Naming Conventions
Create a new branch from `main` (for web) or `electron-recorder` (for desktop) before making any changes. Use descriptive prefixes:
- `feat/add-authentication`
- `fix/navbar-responsive-bug`
- `docs/update-readme`
- `refactor/improve-api-handling`

### 3. Coding Standards
- **UI Components**: Keep them modular and reuse existing Tailwind utility classes where possible.
- **Responsiveness**: Ensure mobile responsiveness for all web dashboard tasks.
- **Architecture Integrity**: Do not bypass the AWS pipeline or hardcode mock data in production builds. The frontend dashboard must only read from the secure API Gateway.
- **Clean Code**: Remove unnecessary `console.log`s, keep formatting clean, and use meaningful variable names.

### 4. Pull Request Process
1. Fork the repository and create your feature branch.
2. Commit your changes with meaningful messages (e.g., `feat: Add some AmazingFeature`).
3. Push your branch to your fork.
4. Open a Pull Request! Please specify in the PR description if your changes target the `frontend`, `electron`, or `aws` architecture.

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
Looking for something to work on? Here are some tasks we need help with:

### 🟢 Easy (Good First Issues)
- **UI Polishing:** Fix alignments, padding, and mobile responsiveness.
- **Loading States:** Add animated skeleton loaders for data fetching.
- **Dashboard Cards:** Improve the layout of the meeting summary cards.
- **Icons:** Standardize and upgrade the `lucide-react` icons across the app.

### 🟡 Medium
- **Dashboard Analytics:** Add charts or stats for meeting duration and frequency.
- **Theme Support:** Perfect the Dark/Light mode toggle and ensure contrast ratios.

### 🔴 Hard
- **Electron UI Overlay Widget:** Build a seamless, hovering, or transparent widget for the desktop app that stays on top of other windows while recording, providing a minimal and unobtrusive footprint.
- **Backend Refactoring:** Optimize the AWS Lambda functions for faster processing and lower memory usage.
