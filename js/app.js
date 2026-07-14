/* ============================================================
   PERSONAL DASHBOARD — app.js
   Features:
     - Greeting (time-based, custom name)
     - Live clock & date
     - Focus Timer (start/stop/reset + custom duration)
     - To-Do List (add/edit/delete/done + LocalStorage)
     - Quick Links (add/delete + LocalStorage)
   Challenges implemented:
     1. Light / Dark mode
     2. Custom name in greeting
     3. Prevent duplicate tasks
     4. Sort tasks (all / active / done)
     5. Change Pomodoro time
============================================================ */

// ─── DOM HELPERS ────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── STORAGE KEYS ───────────────────────────────────────────
const KEYS = {
  theme: "dashboard_theme",
  name: "dashboard_name",
  todos: "dashboard_todos",
  links: "dashboard_links",
  pomoDuration: "dashboard_pomo_duration",
};

// ─── STORAGE HELPERS ────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// ─── TOAST ──────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

// ============================================================
// 1. THEME — Light / Dark Mode  (Challenge #1)
// ============================================================
let currentTheme = load(KEYS.theme, "light");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = $("#themeToggle");
  if (theme === "dark") {
    btn.innerHTML = "&#9728;&#65039; Light Mode";
  } else {
    btn.innerHTML = "&#127769; Dark Mode";
  }
  save(KEYS.theme, theme);
  currentTheme = theme;
}

function toggleTheme() {
  applyTheme(currentTheme === "dark" ? "light" : "dark");
}

// ============================================================
// 2. GREETING — Time-based + Custom Name  (Challenge #2)
// ============================================================
function getGreeting(hour) {
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

function updateGreeting() {
  const name = load(KEYS.name, "");
  const hour = new Date().getHours();
  const greeting = getGreeting(hour);
  const displayName = name.trim() ? name.trim() : "there";

  $("#greetingText").innerHTML = `${greeting}, <span>${displayName}</span> 👋`;

  const msgs = {
    "Good Morning": "Rise and shine! Let's make today count.",
    "Good Afternoon": "Hope your day is going great!",
    "Good Evening": "Winding down? Review what you've done today.",
    "Good Night": "Rest well. Tomorrow is a new chance.",
  };
  $("#greetingSubtext").textContent = msgs[greeting];
}

function saveName() {
  const input = $("#nameInput");
  const name = input.value.trim();
  save(KEYS.name, name);
  updateGreeting();
  showToast(name ? `Name set to "${name}"!` : "Name cleared.");
}

function loadNameInput() {
  const name = load(KEYS.name, "");
  $("#nameInput").value = name;
}

// ============================================================
// 3. LIVE CLOCK & DATE
// ============================================================
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  $("#clockTime").textContent = `${hh}:${mm}:${ss}`;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  $("#clockDate").textContent = `${day}, ${date} ${month} ${year}`;
}

// ============================================================
// 4. FOCUS TIMER  (Challenge: Change Pomodoro Time)
// ============================================================
const DEFAULT_DURATION = 25; // minutes

let timerDuration = load(KEYS.pomoDuration, DEFAULT_DURATION); // in minutes
let timerTotal = timerDuration * 60;   // in seconds
let timerRemaining = timerTotal;
let timerInterval = null;
let timerRunning = false;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function renderTimer() {
  $("#timerDisplay").textContent = formatTime(timerRemaining);
  const pct = timerTotal > 0 ? (timerRemaining / timerTotal) * 100 : 100;
  $("#timerBar").style.width = pct + "%";

  if (timerRunning) {
    $("#timerLabel").textContent = "Focus session in progress…";
  } else if (timerRemaining === 0) {
    $("#timerLabel").textContent = "Session complete! Great work 🎉";
  } else if (timerRemaining < timerTotal) {
    $("#timerLabel").textContent = "Paused";
  } else {
    $("#timerLabel").textContent = `${timerDuration}-minute focus session`;
  }
}

function startTimer() {
  if (timerRunning) return;
  if (timerRemaining === 0) resetTimer();
  timerRunning = true;
  renderTimer();
  timerInterval = setInterval(() => {
    timerRemaining--;
    renderTimer();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerRemaining = 0;
      renderTimer();
      showToast("⏰ Focus session complete!");
    }
  }, 1000);
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  renderTimer();
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerRemaining = timerTotal;
  renderTimer();
}

function applyCustomDuration() {
  const val = parseInt($("#pomoDurationInput").value, 10);
  if (isNaN(val) || val < 1 || val > 120) {
    showToast("Enter a duration between 1 and 120 minutes.");
    return;
  }
  timerDuration = val;
  timerTotal = val * 60;
  timerRemaining = timerTotal;
  timerRunning = false;
  clearInterval(timerInterval);
  save(KEYS.pomoDuration, val);
  renderTimer();
  showToast(`Timer set to ${val} minutes.`);
}

// ============================================================
// 5. TO-DO LIST
//    Challenges: Prevent duplicate tasks, Sort tasks
// ============================================================
let todos = load(KEYS.todos, []);   // [{id, text, done}]
let sortMode = "all";               // "all" | "active" | "done"

function saveTodos() {
  save(KEYS.todos, todos);
}

function getVisibleTodos() {
  if (sortMode === "active") return todos.filter((t) => !t.done);
  if (sortMode === "done") return todos.filter((t) => t.done);
  return [...todos];
}

function renderTodos() {
  const list = $("#todoList");
  const visible = getVisibleTodos();

  if (visible.length === 0) {
    const label = sortMode === "active" ? "No active tasks." : sortMode === "done" ? "No completed tasks." : "No tasks yet. Add one above!";
    list.innerHTML = `<li class="todo-empty">${label}</li>`;
    return;
  }

  list.innerHTML = "";
  visible.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item${todo.done ? " done" : ""}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <input type="checkbox" ${todo.done ? "checked" : ""} aria-label="Mark done" />
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <div class="todo-item-actions">
        <button class="btn-edit-todo" title="Edit">✏️</button>
        <button class="btn-delete-todo" title="Delete">🗑️</button>
      </div>`;

    // Toggle done
    li.querySelector("input[type='checkbox']").addEventListener("change", () => {
      toggleTodoDone(todo.id);
    });

    // Edit
    li.querySelector(".btn-edit-todo").addEventListener("click", () => {
      startEditTodo(li, todo);
    });

    // Delete
    li.querySelector(".btn-delete-todo").addEventListener("click", () => {
      deleteTodo(todo.id);
    });

    list.appendChild(li);
  });

  // Update sort button styles
  $$(".todo-sort button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.sort === sortMode);
  });
}

function addTodo() {
  const input = $("#todoInput");
  const text = input.value.trim();
  if (!text) return;

  // Challenge: prevent duplicate tasks (case-insensitive)
  const duplicate = todos.some((t) => t.text.toLowerCase() === text.toLowerCase());
  if (duplicate) {
    showToast("⚠️ Task already exists!");
    input.select();
    return;
  }

  todos.push({ id: Date.now(), text, done: false });
  saveTodos();
  input.value = "";
  renderTodos();
}

function toggleTodoDone(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

function startEditTodo(li, todo) {
  const textSpan = li.querySelector(".todo-text");
  const actionsDiv = li.querySelector(".todo-item-actions");

  // Replace span with input
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "todo-edit-input";
  editInput.value = todo.text;
  li.replaceChild(editInput, textSpan);
  editInput.focus();

  // Replace edit button with save button
  actionsDiv.innerHTML = `
    <button class="btn-save-todo" title="Save">✅</button>
    <button class="btn-delete-todo" title="Delete">🗑️</button>`;

  const saveEdit = () => {
    const newText = editInput.value.trim();
    if (!newText) {
      showToast("Task cannot be empty.");
      return;
    }
    // Prevent duplicate on edit (exclude current task)
    const duplicate = todos.some(
      (t) => t.id !== todo.id && t.text.toLowerCase() === newText.toLowerCase()
    );
    if (duplicate) {
      showToast("⚠️ Another task with that name already exists!");
      return;
    }
    todos = todos.map((t) => (t.id === todo.id ? { ...t, text: newText } : t));
    saveTodos();
    renderTodos();
  };

  actionsDiv.querySelector(".btn-save-todo").addEventListener("click", saveEdit);
  actionsDiv.querySelector(".btn-delete-todo").addEventListener("click", () => deleteTodo(todo.id));
  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") renderTodos();
  });
}

function setSortMode(mode) {
  sortMode = mode;
  renderTodos();
}

// ============================================================
// 6. QUICK LINKS
// ============================================================
let links = load(KEYS.links, [
  { id: 1, label: "Google", url: "https://google.com", icon: "🔍" },
  { id: 2, label: "YouTube", url: "https://youtube.com", icon: "▶️" },
  { id: 3, label: "GitHub", url: "https://github.com", icon: "🐙" },
]);

function saveLinks() {
  save(KEYS.links, links);
}

function renderLinks() {
  const grid = $("#quickLinksGrid");
  grid.innerHTML = "";

  if (links.length === 0) {
    grid.innerHTML = `<span style="font-size:0.8rem;color:var(--text-muted)">No links yet.</span>`;
    return;
  }

  links.forEach((link) => {
    const a = document.createElement("a");
    a.className = "quick-link-item";
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = `
      <span class="link-icon">${link.icon || "🔗"}</span>
      <span>${escapeHtml(link.label)}</span>
      <button class="link-delete" title="Remove" data-id="${link.id}">✕</button>`;

    a.querySelector(".link-delete").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteLink(link.id);
    });

    grid.appendChild(a);
  });
}

function addLink() {
  const label = $("#linkLabel").value.trim();
  const url = $("#linkUrl").value.trim();
  const icon = $("#linkIcon").value.trim() || "🔗";

  if (!label || !url) {
    showToast("Please fill in the name and URL.");
    return;
  }

  // Auto-add https if missing
  const fullUrl = /^https?:\/\//i.test(url) ? url : "https://" + url;

  links.push({ id: Date.now(), label, url: fullUrl, icon });
  saveLinks();
  renderLinks();

  $("#linkLabel").value = "";
  $("#linkUrl").value = "";
  $("#linkIcon").value = "";
  showToast(`"${label}" added!`);
}

function deleteLink(id) {
  links = links.filter((l) => l.id !== id);
  saveLinks();
  renderLinks();
}

// ============================================================
// UTILITY
// ============================================================
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ============================================================
// INIT — Wire up all events and kick everything off
// ============================================================
function init() {
  // Theme
  applyTheme(load(KEYS.theme, "light"));
  $("#themeToggle").addEventListener("click", toggleTheme);

  // Clock — update immediately then every second
  updateClock();
  setInterval(updateClock, 1000);

  // Greeting — update immediately then every minute
  updateGreeting();
  loadNameInput();
  setInterval(updateGreeting, 60_000);

  // Name save
  $("#btnSaveName").addEventListener("click", saveName);
  $("#nameInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveName();
  });

  // Timer
  timerDuration = load(KEYS.pomoDuration, DEFAULT_DURATION);
  timerTotal = timerDuration * 60;
  timerRemaining = timerTotal;
  $("#pomoDurationInput").value = timerDuration;
  renderTimer();

  $("#btnStart").addEventListener("click", startTimer);
  $("#btnStop").addEventListener("click", stopTimer);
  $("#btnReset").addEventListener("click", resetTimer);
  $("#btnApplyDuration").addEventListener("click", applyCustomDuration);
  $("#pomoDurationInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyCustomDuration();
  });

  // Todos
  renderTodos();
  $("#btnAddTodo").addEventListener("click", addTodo);
  $("#todoInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodo();
  });
  $$(".todo-sort button").forEach((btn) => {
    btn.addEventListener("click", () => setSortMode(btn.dataset.sort));
  });

  // Quick links
  renderLinks();
  $("#btnAddLink").addEventListener("click", addLink);
}

document.addEventListener("DOMContentLoaded", init);
