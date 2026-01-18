# ⏱️ Time Tracker

A beautiful, modern time tracking application built with React and TypeScript. Track your work sessions with custom timers, audio notifications, and tagging functionality.

## ✨ Features

- **Custom Timer Duration**: Set any duration (in minutes) for your work sessions
- **Timer Controls**: Start, pause, resume, and reset functionality
- **Audio Notifications**: Plays a beep sound when the timer completes
- **Tagging System**: Add free-form tags to categorize your work sessions
- **Session History**: View all past work sessions with timestamps and durations
- **Local Storage**: All data is saved locally in your browser
- **Dark Mode UI**: Beautiful dark theme with Inter font
- **Modern Design**: 16px border radius, clean and intuitive interface
- **Responsive**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd TIMES
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🎯 Usage

### Starting a Timer

1. Set your desired duration in minutes (default: 25 minutes)
2. Click "Start" to begin the timer
3. The circular progress ring shows your progress

### Managing the Timer

- **Pause**: Click "Pause" to temporarily stop the timer
- **Resume**: Click "Resume" to continue from where you paused
- **Reset**: Click "Reset" to start over with a fresh timer

### Adding Tags

1. When the timer completes, you'll be prompted to add tags
2. Type a tag and press Enter to add it
3. Add multiple tags to categorize your work
4. Click "Save Session" to save with tags, or "Skip" to save without tags

### Viewing History

1. Click the "History" tab in the navigation
2. View all your past sessions with:
   - Date and time range
   - Total duration
   - Associated tags
3. Delete entries by hovering over them and clicking the trash icon
4. See your total tracked time at the top

## 🏗️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom properties
- **Web Audio API** - Audio notifications
- **LocalStorage API** - Data persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── Timer.tsx          # Main timer component
│   ├── Timer.css
│   ├── TagInput.tsx       # Tag input for completed sessions
│   ├── TagInput.css
│   ├── History.tsx        # Session history view
│   └── History.css
├── hooks/
│   ├── useTimer.ts        # Custom hook for timer logic
│   └── useLocalStorage.ts # Custom hook for localStorage
├── types.ts               # TypeScript type definitions
├── App.tsx                # Main app component
├── App.css
├── index.css              # Global styles
└── main.tsx               # Entry point
```

## 🎨 Design System

- **Font**: Inter
- **Border Radius**: 16px
- **Color Scheme**: Dark mode
  - Background Primary: `#0a0a0a`
  - Background Secondary: `#1a1a1a`
  - Background Tertiary: `#2a2a2a`
  - Accent: `#3b82f6` (blue)
  - Success: `#10b981` (green)
  - Warning: `#f59e0b` (orange)
  - Danger: `#ef4444` (red)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📝 Future Enhancements

- Analytics dashboard with charts and graphs
- Export/import functionality
- Multiple timer presets
- Break timer integration (Pomodoro technique)
- Browser notifications
- Sound customization
- Cloud sync with backend
- Team collaboration features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies
