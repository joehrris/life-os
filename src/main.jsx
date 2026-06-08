import { useState, useEffect, useRef, useCallback } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const STYLE = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a;
    --bg2: #111111;
    --bg3: #181818;
    --bg4: #1f1f1f;
    --line: #2a2a2a;
    --line2: #333;
    --text: #e8e4dc;
    --text2: #888880;
    --text3: #555;
    --accent: #c8f064;
    --accent2: #6bf0b8;
    --accent3: #f06464;
    --accent4: #f0c864;
    --mono: 'DM Mono', monospace;
    --sans: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--sans); min-height: 100vh; }
  .os-shell { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; height: 42px; border-bottom: 1px solid var(--line);
    background: var(--bg); flex-shrink: 0;
  }
  .topbar-left { display: flex; align-items: center; gap: 20px; }
  .os-logo { font-family: var(--mono); font-size: 13px; color: var(--accent); letter-spacing: 0.08em; }
  .topbar-time { font-family: var(--mono); font-size: 12px; color: var(--text2); }
  .topbar-date { font-family: var(--mono); font-size: 11px; color: var(--text3); }
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    grid-template-rows: 1fr 1fr;
    gap: 1px; flex: 1; overflow: hidden;
    background: var(--line);
  }
  .module {
    background: var(--bg); overflow: hidden; display: flex; flex-direction: column;
  }
  .module-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px 10px; border-bottom: 1px solid var(--line);
    flex-shrink: 0;
  }
  .module-title {
    font-family: var(--mono); font-size: 11px; color: var(--text3);
    letter-spacing: 0.12em; text-transform: uppercase;
  }
  .module-actions { display: flex; gap: 6px; }
  .icon-btn {
    background: none; border: none; cursor: pointer;
    color: var(--text3); font-size: 16px; padding: 2px 4px;
    border-radius: 4px; transition: color 0.15s, background 0.15s;
    display: flex; align-items: center;
  }
  .icon-btn:hover { color: var(--text); background: var(--bg3); }
  .module-body { flex: 1; overflow-y: auto; padding: 12px 16px; }
  .module-body::-webkit-scrollbar { width: 4px; }
  .module-body::-webkit-scrollbar-track { background: transparent; }
  .module-body::-webkit-scrollbar-thumb { background: var(--line2); border-radius: 2px; }
  .module-footer { border-top: 1px solid var(--line); padding: 10px 16px; flex-shrink: 0; }

  /* TASKS */
  .task-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 8px 0; border-bottom: 1px solid var(--line);
    cursor: pointer; transition: background 0.1s;
  }
  .task-item:last-child { border-bottom: none; }
  .task-item.done .task-text { text-decoration: line-through; color: var(--text3); }
  .task-check {
    width: 16px; height: 16px; border: 1px solid var(--line2);
    border-radius: 3px; flex-shrink: 0; margin-top: 2px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; background: none; cursor: pointer;
  }
  .task-item.done .task-check { border-color: var(--accent); background: var(--accent); }
  .task-text { font-size: 13px; line-height: 1.5; flex: 1; }
  .task-meta { display: flex; gap: 6px; align-items: center; margin-top: 2px; }
  .tag {
    font-family: var(--mono); font-size: 10px; padding: 1px 6px;
    border-radius: 3px; letter-spacing: 0.04em;
  }
  .tag-work { background: #1a2a1a; color: var(--accent); }
  .tag-personal { background: #1a1a2a; color: var(--accent2); }
  .tag-health { background: #2a1a1a; color: var(--accent3); }
  .tag-finance { background: #2a2a1a; color: var(--accent4); }
  .due-date { font-family: var(--mono); font-size: 10px; color: var(--text3); }
  .due-date.overdue { color: var(--accent3); }
  .task-input-row { display: flex; gap: 8px; }
  .os-input {
    background: var(--bg2); border: 1px solid var(--line2);
    color: var(--text); font-family: var(--sans); font-size: 13px;
    padding: 7px 10px; border-radius: 5px; outline: none;
    transition: border-color 0.15s;
  }
  .os-input:focus { border-color: var(--accent); }
  .os-input::placeholder { color: var(--text3); }
  .os-select {
    background: var(--bg2); border: 1px solid var(--line2);
    color: var(--text2); font-family: var(--mono); font-size: 11px;
    padding: 7px 8px; border-radius: 5px; outline: none; cursor: pointer;
  }
  .os-btn {
    background: var(--accent); color: #0a0a0a; border: none;
    font-family: var(--mono); font-size: 11px; font-weight: 500;
    padding: 7px 12px; border-radius: 5px; cursor: pointer;
    letter-spacing: 0.06em; transition: opacity 0.15s;
  }
  .os-btn:hover { opacity: 0.85; }
  .os-btn.secondary {
    background: var(--bg3); color: var(--text2); border: 1px solid var(--line2);
  }
  .os-btn.secondary:hover { border-color: var(--text3); color: var(--text); }
  .os-btn.danger { background: var(--accent3); }
  .empty-state { font-family: var(--mono); font-size: 11px; color: var(--text3); padding: 20px 0; text-align: center; }

  /* CALENDAR */
  .cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .cal-month { font-family: var(--mono); font-size: 13px; color: var(--text); }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .cal-day-label { font-family: var(--mono); font-size: 9px; color: var(--text3); text-align: center; padding: 4px 0; letter-spacing: 0.08em; }
  .cal-day {
    aspect-ratio: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: flex-start; padding-top: 3px;
    font-family: var(--mono); font-size: 11px; color: var(--text2);
    border-radius: 4px; cursor: pointer; transition: background 0.1s, color 0.1s;
    position: relative; overflow: hidden;
  }
  .cal-day:hover { background: var(--bg3); color: var(--text); }
  .cal-day.today { color: var(--accent); }
  .cal-day.today::after { content: ''; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: var(--accent); border-radius: 50%; }
  .cal-day.selected { background: var(--bg4); color: var(--text); }
  .cal-day.other-month { color: var(--text3); opacity: 0.4; }
  .cal-day.has-event::before { content: ''; position: absolute; top: 3px; right: 3px; width: 4px; height: 4px; background: var(--accent2); border-radius: 50%; }
  .cal-events { margin-top: 12px; border-top: 1px solid var(--line); padding-top: 10px; }
  .cal-event-item { display: flex; gap: 8px; align-items: flex-start; padding: 6px 0; border-bottom: 1px solid var(--line); }
  .cal-event-item:last-child { border-bottom: none; }
  .cal-event-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .cal-event-info { flex: 1; }
  .cal-event-title { font-size: 12px; color: var(--text); }
  .cal-event-time { font-family: var(--mono); font-size: 10px; color: var(--text3); margin-top: 1px; }
  .event-dot-work { background: var(--accent); }
  .event-dot-personal { background: var(--accent2); }
  .event-dot-health { background: var(--accent3); }
  .event-dot-finance { background: var(--accent4); }

  /* CALORIES / AI CHAT */
  .chat-messages { display: flex; flex-direction: column; gap: 8px; padding-bottom: 4px; }
  .chat-msg { display: flex; flex-direction: column; max-width: 85%; }
  .chat-msg.user { align-self: flex-end; align-items: flex-end; }
  .chat-msg.ai { align-self: flex-start; }
  .chat-bubble {
    padding: 8px 12px; border-radius: 10px; font-size: 13px; line-height: 1.5;
  }
  .chat-msg.user .chat-bubble { background: var(--bg4); color: var(--text); border-bottom-right-radius: 3px; }
  .chat-msg.ai .chat-bubble { background: var(--bg3); color: var(--text); border-bottom-left-radius: 3px; border: 1px solid var(--line2); }
  .chat-msg.ai.loading .chat-bubble { color: var(--text3); font-family: var(--mono); font-size: 11px; }
  .chat-time { font-family: var(--mono); font-size: 10px; color: var(--text3); margin-top: 3px; padding: 0 4px; }
  .cal-summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .cal-macro { text-align: center; }
  .cal-macro-num { font-family: var(--mono); font-size: 18px; color: var(--text); }
  .cal-macro-num.primary { color: var(--accent); font-size: 22px; }
  .cal-macro-label { font-family: var(--mono); font-size: 9px; color: var(--text3); letter-spacing: 0.1em; margin-top: 2px; }
  .cal-progress-bar { height: 3px; background: var(--bg3); border-radius: 2px; margin-bottom: 12px; overflow: hidden; }
  .cal-progress-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.5s ease; }
  .chat-input-row { display: flex; gap: 8px; }
  .chat-input { flex: 1; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center; z-index: 100;
  }
  .modal {
    background: var(--bg2); border: 1px solid var(--line2); border-radius: 10px;
    padding: 20px; width: 380px; max-height: 80vh; overflow-y: auto;
  }
  .modal-title { font-family: var(--mono); font-size: 12px; color: var(--text2); letter-spacing: 0.1em; margin-bottom: 16px; }
  .form-group { margin-bottom: 12px; }
  .form-label { font-family: var(--mono); font-size: 10px; color: var(--text3); letter-spacing: 0.08em; margin-bottom: 5px; display: block; }
  .form-row { display: flex; gap: 8px; }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
  .full-width { width: 100%; }

  /* SPANS */
  .cal-span { grid-column: 2; grid-row: 1 / span 2; }

  /* SCROLLBARS */
  .cal-scrollable { overflow-y: auto; }
  .cal-scrollable::-webkit-scrollbar { width: 3px; }
  .cal-scrollable::-webkit-scrollbar-thumb { background: var(--line2); }

  /* status bar */
  .statusbar {
    height: 26px; border-top: 1px solid var(--line); background: var(--bg);
    display: flex; align-items: center; padding: 0 16px; gap: 20px; flex-shrink: 0;
  }
  .status-item { font-family: var(--mono); font-size: 10px; color: var(--text3); display: flex; align-items: center; gap: 5px; }
  .status-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
`;

const CATEGORIES = ["work", "personal", "health", "finance"];
const EVENT_COLORS = { work: "event-dot-work", personal: "event-dot-personal", health: "event-dot-health", finance: "event-dot-finance" };
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function fmt(d) { return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`; }

function usePersisted(key, def) {
  const [val, setVal] = useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch { return def; }
  });
  const set = useCallback(v => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [val, set];
}

// ─── TASK MODULE ────────────────────────────────────────────────────────────────
function TaskModule({ tasks, setTasks }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ text: "", category: "personal", due: "" });
  const [filter, setFilter] = useState("all");

  const openAdd = () => { setForm({ text: "", category: "personal", due: "" }); setEditingId(null); setAdding(true); };
  const openEdit = (t) => { setForm({ text: t.text, category: t.category, due: t.due }); setEditingId(t.id); setAdding(true); };
  const closeModal = () => { setAdding(false); setEditingId(null); };

  const save = () => {
    if (!form.text.trim()) return;
    if (editingId) {
      setTasks(tasks.map(t => t.id === editingId ? { ...t, ...form } : t));
    } else {
      setTasks([...tasks, { id: Date.now(), ...form, done: false, created: Date.now() }]);
    }
    closeModal();
  };

  const toggle = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const del = (id) => { setTasks(tasks.filter(t => t.id !== id)); closeModal(); };

  const visible = tasks.filter(t => filter === "all" ? true : filter === "done" ? t.done : t.category === filter);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="module" style={{ gridColumn: 1, gridRow: 1 }}>
      <div className="module-header">
        <span className="module-title">tasks</span>
        <div className="module-actions" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select className="os-select" value={filter} onChange={e => setFilter(e.target.value)} style={{ fontSize: 10, padding: "3px 6px" }}>
            <option value="all">all</option>
            <option value="done">done</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="icon-btn" onClick={openAdd} aria-label="Add task">
            <i className="ti ti-plus" />
          </button>
        </div>
      </div>
      <div className="module-body">
        {visible.length === 0 && <div className="empty-state">no tasks here</div>}
        {visible.map(t => (
          <div key={t.id} className={`task-item${t.done ? " done" : ""}`}>
            <button className="task-check" onClick={() => toggle(t.id)} aria-label="toggle">
              {t.done && <i className="ti ti-check" style={{ fontSize: 10, color: "#0a0a0a" }} />}
            </button>
            <div style={{ flex: 1 }}>
              <div className="task-text">{t.text}</div>
              <div className="task-meta">
                <span className={`tag tag-${t.category}`}>{t.category}</span>
                {t.due && <span className={`due-date${t.due < today ? " overdue" : ""}`}>{t.due}</span>}
              </div>
            </div>
            <button className="icon-btn" onClick={() => openEdit(t)}>
              <i className="ti ti-edit" style={{ fontSize: 13 }} />
            </button>
          </div>
        ))}
      </div>
      <div className="module-footer">
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
          {tasks.filter(t => !t.done).length} remaining · {tasks.filter(t => t.done).length} done
        </span>
      </div>
      {adding && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-title">{editingId ? "EDIT TASK" : "NEW TASK"}</div>
            <div className="form-group">
              <label className="form-label">description</label>
              <input className="os-input full-width" placeholder="what needs to be done?" value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
                onKeyDown={e => e.key === "Enter" && save()} autoFocus />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">category</label>
                <select className="os-select full-width" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">due date</label>
                <input className="os-input full-width" type="date" value={form.due}
                  onChange={e => setForm({ ...form, due: e.target.value })}
                  style={{ colorScheme: "dark" }} />
              </div>
            </div>
            <div className="modal-actions">
              {editingId && <button className="os-btn danger" onClick={() => del(editingId)}>delete</button>}
              <button className="os-btn secondary" onClick={closeModal}>cancel</button>
              <button className="os-btn" onClick={save}>save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CALORIE / AI MODULE ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a friendly nutrition assistant embedded in a minimal life OS dashboard. 
When users describe meals or food they've eaten, estimate the calories and macros (protein, carbs, fat).
Always respond in this exact JSON format (no markdown, no extra text):
{
  "message": "your friendly response here",
  "calories": number_or_null,
  "protein": number_or_null,
  "carbs": number_or_null,
  "fat": number_or_null,
  "addToLog": true_or_false
}
If the user is not logging food, set calories/protein/carbs/fat to null and addToLog to false.
Keep responses very brief and casual. If adding to log, confirm what was logged. Be supportive and minimal.`;

function CalorieModule({ calorieData, setCalorieData }) {
  const [messages, setMessages] = useState([
    { id: 1, role: "ai", text: "hey! tell me what you've eaten and i'll track the calories and macros for you.", time: fmt(new Date()) }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  const todayData = calorieData[today] || { calories: 0, protein: 0, carbs: 0, fat: 0, goal: 2000 };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: Date.now(), role: "user", text: input.trim(), time: fmt(new Date()) };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = messages.filter(m => m.role !== "system").map(m => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text
    }));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [...history, { role: "user", content: input.trim() }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(c => c.text || "").join("");
      let parsed;
      try { parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()); }
      catch { parsed = { message: raw, calories: null, addToLog: false }; }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", text: parsed.message, time: fmt(new Date()) }]);

      if (parsed.addToLog && parsed.calories) {
        setCalorieData(prev => ({
          ...prev,
          [today]: {
            calories: (prev[today]?.calories || 0) + (parsed.calories || 0),
            protein: (prev[today]?.protein || 0) + (parsed.protein || 0),
            carbs: (prev[today]?.carbs || 0) + (parsed.carbs || 0),
            fat: (prev[today]?.fat || 0) + (parsed.fat || 0),
            goal: prev[today]?.goal || 2000
          }
        }));
      }
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", text: "connection error — try again", time: fmt(new Date()) }]);
    }
    setLoading(false);
  };

  const pct = Math.min(100, Math.round((todayData.calories / todayData.goal) * 100));

  return (
    <div className="module" style={{ gridColumn: 1, gridRow: 2 }}>
      <div className="module-header">
        <span className="module-title">nutrition · ai</span>
        <button className="icon-btn" onClick={() => setCalorieData(prev => ({ ...prev, [today]: { calories: 0, protein: 0, carbs: 0, fat: 0, goal: prev[today]?.goal || 2000 } }))} title="Reset today">
          <i className="ti ti-refresh" style={{ fontSize: 13 }} />
        </button>
      </div>
      <div className="module-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="cal-summary-row">
          <div className="cal-macro">
            <div className="cal-macro-num primary">{todayData.calories}</div>
            <div className="cal-macro-label">kcal</div>
          </div>
          <div className="cal-macro">
            <div className="cal-macro-num">{Math.round(todayData.protein)}g</div>
            <div className="cal-macro-label">protein</div>
          </div>
          <div className="cal-macro">
            <div className="cal-macro-num">{Math.round(todayData.carbs)}g</div>
            <div className="cal-macro-label">carbs</div>
          </div>
          <div className="cal-macro">
            <div className="cal-macro-num">{Math.round(todayData.fat)}g</div>
            <div className="cal-macro-label">fat</div>
          </div>
        </div>
        <div>
          <div className="cal-progress-bar">
            <div className="cal-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            {pct}% of {todayData.goal} kcal goal
          </span>
        </div>
        <div className="chat-messages" style={{ flex: 1 }}>
          {messages.map(m => (
            <div key={m.id} className={`chat-msg ${m.role}${loading && m.id === messages[messages.length - 1].id && m.role === "ai" ? " loading" : ""}`}>
              <div className="chat-bubble">{m.text}</div>
              <div className="chat-time">{m.time}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-msg ai loading">
              <div className="chat-bubble">thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="module-footer">
        <div className="chat-input-row">
          <input className="os-input chat-input" placeholder="i had a chicken salad..." value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()} />
          <button className="os-btn" onClick={send} disabled={loading}>
            <i className="ti ti-send" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CALENDAR MODULE ──────────────────────────────────────────────────────────
function CalendarModule({ events, setEvents }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", time: "", category: "personal", date: selectedDate });
  const [editId, setEditId] = useState(null);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const getDateStr = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d.toISOString().split("T")[0];
  };

  const daysFromPrev = firstDay;
  const prevMonthDays = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();

  const openAdd = (date) => {
    setForm({ title: "", time: "09:00", category: "personal", date: date || selectedDate });
    setEditId(null);
    setAdding(true);
  };
  const openEdit = (ev) => {
    setForm({ title: ev.title, time: ev.time || "", category: ev.category, date: ev.date });
    setEditId(ev.id);
    setAdding(true);
  };
  const save = () => {
    if (!form.title.trim()) return;
    if (editId) {
      setEvents(events.map(e => e.id === editId ? { ...e, ...form } : e));
    } else {
      setEvents([...events, { id: Date.now(), ...form }]);
    }
    setAdding(false);
  };
  const del = (id) => { setEvents(events.filter(e => e.id !== id)); setAdding(false); };

  const selectedEvents = events.filter(e => e.date === selectedDate).sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  return (
    <div className="module cal-span">
      <div className="module-header">
        <span className="module-title">calendar</span>
        <button className="icon-btn" onClick={() => openAdd(selectedDate)}><i className="ti ti-plus" /></button>
      </div>
      <div className="module-body cal-scrollable">
        <div className="cal-nav">
          <button className="icon-btn" onClick={prevMonth}><i className="ti ti-chevron-left" /></button>
          <span className="cal-month">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
          <button className="icon-btn" onClick={nextMonth}><i className="ti ti-chevron-right" /></button>
        </div>
        <div className="cal-grid">
          {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
          {Array.from({ length: daysFromPrev }, (_, i) => (
            <div key={`prev-${i}`} className="cal-day other-month">
              {prevMonthDays - daysFromPrev + i + 1}
            </div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const ds = getDateStr(day);
            const isToday = ds === today.toISOString().split("T")[0];
            const isSel = ds === selectedDate;
            const hasEv = events.some(e => e.date === ds);
            return (
              <div key={day} className={`cal-day${isToday ? " today" : ""}${isSel ? " selected" : ""}${hasEv ? " has-event" : ""}`}
                onClick={() => setSelectedDate(ds)}>
                {day}
              </div>
            );
          })}
        </div>
        <div className="cal-events">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
              {selectedDate === today.toISOString().split("T")[0] ? "TODAY" : selectedDate}
            </span>
            <button className="icon-btn" onClick={() => openAdd(selectedDate)} style={{ fontSize: 12 }}>
              <i className="ti ti-plus" />
            </button>
          </div>
          {selectedEvents.length === 0 && <div className="empty-state" style={{ padding: "12px 0" }}>nothing scheduled</div>}
          {selectedEvents.map(ev => (
            <div key={ev.id} className="cal-event-item" onClick={() => openEdit(ev)} style={{ cursor: "pointer" }}>
              <div className={`cal-event-dot ${EVENT_COLORS[ev.category] || "event-dot-personal"}`} />
              <div className="cal-event-info">
                <div className="cal-event-title">{ev.title}</div>
                {ev.time && <div className="cal-event-time">{ev.time}</div>}
              </div>
              <span className={`tag tag-${ev.category}`} style={{ fontSize: 9 }}>{ev.category}</span>
            </div>
          ))}
        </div>
      </div>
      {adding && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setAdding(false)}>
          <div className="modal">
            <div className="modal-title">{editId ? "EDIT EVENT" : "NEW EVENT"}</div>
            <div className="form-group">
              <label className="form-label">title</label>
              <input className="os-input full-width" placeholder="meeting, workout, etc." value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                onKeyDown={e => e.key === "Enter" && save()} autoFocus />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">date</label>
                <input className="os-input full-width" type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  style={{ colorScheme: "dark" }} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">time</label>
                <input className="os-input full-width" type="time" value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  style={{ colorScheme: "dark" }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">category</label>
              <select className="os-select full-width" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              {editId && <button className="os-btn danger" onClick={() => del(editId)}>delete</button>}
              <button className="os-btn secondary" onClick={() => setAdding(false)}>cancel</button>
              <button className="os-btn" onClick={save}>save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CLOCK ───────────────────────────────────────────────────────────────────
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <span className="topbar-time">{fmt(now)}</span>
      <span className="topbar-date">{days[now.getDay()]} · {now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function LifeOS() {
  const [tasks, setTasks] = usePersisted("lifeos_tasks", []);
  const [events, setEvents] = usePersisted("lifeos_events", []);
  const [calorieData, setCalorieData] = usePersisted("lifeos_calories", {});

  const today = new Date().toISOString().split("T")[0];
  const todayEvents = events.filter(e => e.date === today).length;
  const pendingTasks = tasks.filter(t => !t.done).length;

  return (
    <>
      <style>{FONTS + STYLE}</style>
      <div className="os-shell">
        <div className="topbar">
          <div className="topbar-left">
            <span className="os-logo">LIFE·OS</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: "0.06em" }}>v1.0</span>
          </div>
          <LiveClock />
        </div>
        <div className="main-grid">
          <TaskModule tasks={tasks} setTasks={setTasks} />
          <CalorieModule calorieData={calorieData} setCalorieData={setCalorieData} />
          <CalendarModule events={events} setEvents={setEvents} />
        </div>
        <div className="statusbar">
          <div className="status-item"><div className="status-dot" /><span>ready</span></div>
          <div className="status-item"><i className="ti ti-checkbox" style={{ fontSize: 12, color: "var(--accent)" }} /><span>{pendingTasks} tasks pending</span></div>
          <div className="status-item"><i className="ti ti-calendar" style={{ fontSize: 12, color: "var(--accent2)" }} /><span>{todayEvents} events today</span></div>
        </div>
      </div>
    </>
  );
}
