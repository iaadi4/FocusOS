# FocusOS

A beautiful Chrome extension that tracks your time spent across all websites. Built with React, TypeScript, and Tailwind CSS.

<img width="1855" height="958" alt="Screenshot from 2026-01-10 02-12-49" src="https://github.com/user-attachments/assets/6432300c-7972-4585-81dd-10be1720803c" />
<img width="1855" height="958" alt="Screenshot from 2026-01-10 02-13-05" src="https://github.com/user-attachments/assets/bfa7cb23-7853-4949-a1f2-6fafe4a6b2fa" />

## Features

- **Real-time Tracking** - Automatically tracks time spent on every website
- **Smart Delay** - Tracking starts only after staying on a site for a set duration (apply once per day per site)
- **Pomodoro Timer** - Integrated focus timer with customizable templates, work/break intervals, and session history
- **Daily Limits** - Set max browsing limits for specific sites to stay productive
- **Whitelist** - Exclude specific domains from being tracked
- **Visual Analytics** - Beautiful charts and site-specific analysis
- **Time Ranges** - View data for Today, Week, Month, Year, or All Time
- **Dark Theme** - Sleek dark interface with customizable accent colors
- **Privacy First** - All data stored locally, never sent to any server

## Installation

### From Source (Development)

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/time-tracker-extension.git
   cd time-tracker-extension
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Usage

- **Popup Widget** - View daily stats, start Pomodoro timer, or check active session
- **Full Dashboard** - Detailed analytics, site analysis, and limit management
- **Pomodoro** - Dedicated focus mode with presets and custom timers
- **Daily Limits** - Configure usage caps for distracting sites
- **Whitelist** - Manage domains that should be ignored by the tracker

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Project Structure

```
src/
├── background/          # Service worker for tracking & timer logic
├── dashboard/
│   ├── index.tsx        # Main dashboard component
│   └── components/      # Reusable UI components
│       ├── StatCard.tsx
│       ├── ActivityList.tsx
│       ├── DistributionChart.tsx
│       ├── PomodoroView.tsx  # Pomodoro stats & history
│       ├── DailyLimitsView.tsx
│       ├── SiteAnalysisView.tsx
│       ├── WhitelistView.tsx
│       └── SettingsView.tsx
├── popup/               # Toolbar popup widget
│   ├── index.tsx
│   └── PomodoroTab.tsx  # Popup timer interface
├── newtab/              # New tab page
└── utils/
    ├── storage.ts       # Chrome storage utilities
    ├── pomodoro-storage.ts # Pomodoro specific storage
    ├── types.ts         # TypeScript interfaces
    └── format.ts        # Time formatting utilities
```

## Development

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Privacy

- All data is stored locally using `chrome.storage.local`
- No data is ever sent to external servers
- No analytics or tracking

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.
