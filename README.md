# Personal Dashboard

A personal productivity dashboard built with HTML, CSS, and Vanilla JavaScript — no frameworks, no backend.

## Live Demo
> Deploy via GitHub Pages, then update this link:  
> `https://<your-username>.github.io/revouCoding/`

---

## Features
- **Greeting** — time-based greeting (Morning/Afternoon/Evening/Night) with live clock and date
- **Focus Timer** — Pomodoro-style timer with start, pause, reset, and custom duration
- **To-Do List** — add, edit, mark done, and delete tasks — persisted in LocalStorage
- **Quick Links** — save favorite websites with emoji icons — persisted in LocalStorage

## Challenges Implemented
1. Light / Dark mode toggle
2. Custom name in greeting
3. Prevent duplicate tasks (case-insensitive)
4. Sort tasks — All / Active / Done
5. Change Pomodoro duration

---

## Folder Structure
```
revouCoding/
├── index.html              # Main entry point
├── css/
│   └── style.css           # All styling + light/dark theme variables
├── js/
│   └── app.js              # All JavaScript logic (vanilla JS only)
├── .kiro/
│   ├── steering/
│   │   └── project.md      # Kiro AI project context & coding standards
│   └── hooks/
│       └── lint-on-save.json  # Kiro agent hook — checks standards on file save
└── README.md
```

---

## Tech Stack
| Layer | Technology |
|-------|------------|
| Structure | HTML5 |
| Styling | CSS3 (custom properties) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | Browser LocalStorage API |

## How to Run
1. Clone or download the repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. No build step or server required

## About `.kiro`
This project was built using [Kiro](https://kiro.dev), an AI-powered IDE. The `.kiro` folder contains:
- `steering/project.md` — project context and coding standards fed to the AI agent
- `hooks/lint-on-save.json` — an agent hook that checks coding standards whenever a file is saved
