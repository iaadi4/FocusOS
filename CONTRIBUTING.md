# Contributing to Time Tracker

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/time-tracker-extension.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development

```bash
npm run build    # Production build
npm run dev      # Development server
npm run lint     # Run ESLint
```

### Testing Changes

1. Run `npm run build`
2. Open `chrome://extensions`
3. Click the refresh icon on the extension card
4. Test your changes

## Project Architecture

```
src/
├── background/index.ts      # Service worker (tracking logic, timer, notifications)
├── dashboard/
│   ├── index.tsx            # Main dashboard (routing & layout)
│   └── components/          # UI views (Pomodoro, Limits, Analysis, etc.)
├── popup/
│   ├── index.tsx            # Toolbar popup entry
│   └── PomodoroTab.tsx      # Pomodoro timer UI
├── utils/
│   ├── storage.ts           # Core storage API
│   ├── pomodoro-storage.ts  # Pomodoro storage & stats
│   ├── types.ts             # Shared TypeScript definitions
│   └── format.ts            # Formatting utilities
```

### Key Files

- **background/index.ts** - Core logic: tracking, limits, and pomodoro timer state
- **utils/storage.ts** - Browsing data management (`saveTime`, `getAggregatedData`)
- **utils/pomodoro-storage.ts** - Specific storage logic for Pomodoro sessions and templates
- **dashboard/components/** - Modular views (`PomodoroView`, `DailyLimitsView`, `SiteAnalysisView`)

## Code Style

- Use TypeScript for all new code
- Follow existing patterns
- Keep components small and focused
- Use meaningful names

## Pull Request Process

1. Ensure `npm run lint` passes
2. Update documentation if needed
3. Write a clear PR description

## Reporting Issues

Include:

- Chrome version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

## Questions?

Open an issue with the "question" label.
