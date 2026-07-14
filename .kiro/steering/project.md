---
inclusion: always
---

# Project: Personal Dashboard

This is a personal productivity dashboard built as a web app using only HTML, CSS, and Vanilla JavaScript. No frameworks or backend required.

## Tech Stack
- HTML5 — structure
- CSS3 — styling (CSS custom properties for theming)
- Vanilla JavaScript — all interactivity
- Browser LocalStorage API — data persistence

## Features
- **Greeting** — time-based greeting with custom user name
- **Live Clock** — real-time date and time display
- **Focus Timer** — Pomodoro-style timer with configurable duration
- **To-Do List** — add, edit, delete, mark done, with LocalStorage persistence
- **Quick Links** — save and open favorite websites

## Challenges Implemented
1. Light / Dark mode toggle
2. Custom name in greeting (saved to LocalStorage)
3. Prevent duplicate tasks (case-insensitive)
4. Sort tasks — All / Active / Done filter
5. Change Pomodoro duration

## Folder Structure
```
revouCoding/
├── index.html          # Main entry point
├── css/
│   └── style.css       # All styling + theme variables
├── js/
│   └── app.js          # All JavaScript logic
├── .kiro/
│   ├── steering/       # Kiro AI context/steering files
│   └── hooks/          # Kiro agent hook definitions
└── README.md
```

## Coding Standards
- Use CSS custom properties (`--var`) for all colors and spacing
- Keep JS in a single `app.js` file, organized by feature section
- All data saved/loaded via `localStorage` using the `load()` / `save()` helpers
- No external libraries or CDN dependencies
