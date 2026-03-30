import { useState, useRef, useEffect } from "react";

const PINK = "#f3e6f0";
const ROSE = "#e8c5d8";
const MAUVE = "#c47fa0";
const DEEP = "#8b4a6b";
const SOFT = "#faf4f8";
const TEXT = "#3d1f2f";
const MUTED = "#9a7088";
const WHITE = "#ffffff";

const statusColors = { Applied: MAUVE, Interview: "#7ab87a", Researching: "#d4a853", Rejected: "#c47070", Offer: "#5b9bd4" };
const priorityColors = { high: "#c47070", med: "#d4a853", low: "#7ab87a" };
const tagColors = { Branding: MAUVE, Sales: "#7ab87a", Research: "#5b9bd4", Ops: "#d4a853" };

const AFFIRMATIONS = [
  "You are already qualified for the room you're walking into.",
  "Your leadership style is a gift — not everyone can do what you do.",
  "Rest is productive. You don't have to earn it.",
  "Precision Consulting Group is not a dream — it's a plan in motion.",
  "You left to level up. That took courage. Own it.",
  "Your next chapter is already written. Keep showing up.",
  "ADHD is not a flaw. It's a different kind of brilliance.",
  "You are the blueprint. Someone is watching you and finding their way.",
  "Director energy is already in you — the title is just catching up.",
  "Black excellence is not a hustle. It's your inheritance.",
];

const HABITS = [
  { id: 1, label: "Morning routine", icon: "☀️" },
  { id: 2, label: "No doom scrolling before 9am", icon: "📵" },
  { id: 3, label: "Move my body", icon: "🚶" },
  { id: 4, label: "1 job application", icon: "📋" },
  { id: 5, label: "Work on PCG", icon: "💼" },
  { id: 6, label: "Read / learn", icon: "📖" },
  { id: 7, label: "Gratitude moment", icon: "✨" },
];

const DAYS = ["M", "T", "W", "Th", "F", "Sa", "Su"];

const defaultTasks = [
  { id: 1, text: "Review job applications", done: false, priority: "high" },
  { id: 2, text: "Update LinkedIn headline", done: false, priority: "med" },
  { id: 3, text: "Schedule therapy with Dr. Trina", done: true, priority: "high" },
  { id: 4, text: "File LLC documents for Precision Consulting", done: false, priority: "high" },
  { id: 5, text: "30-min walk", done: false, priority: "low" },
];
const defaultJobs = [
  { id: 1, company: "TechCorp", role: "Director of HCM Operations", status: "Applied", date: "Mar 24" },
  { id: 2, company: "NovaPay", role: "Sr. Director, Payroll Strategy", status: "Interview", date: "Mar 26" },
  { id: 3, company: "WealthPath", role: "Director, Client Success", status: "Researching", date: "Mar 27" },
];
const defaultWellness = [
  { id: 1, label: "Water intake", value: 5, max: 8, unit: "glasses" },
  { id: 2, label: "Sleep", value: 6.5, max: 8, unit: "hrs" },
  { id: 3, label: "Movement", value: 2, max: 5, unit: "days" },
  { id: 4, label: "Mood", value: 4, max: 5, unit: "/5" },
];
const defaultBiz = [
  { id: 1, text: "Finalize Precision Consulting Group branding", done: false, tag: "Branding" },
  { id: 2, text: "Draft service offerings one-pager", done: false, tag: "Sales" },
  { id: 3, text: "Research small biz target clients in Atlanta", done: false, tag: "Research" },
  { id: 4, text: "Set up business email", done: true, tag: "Ops" },
];

// Local storage helper
function useLocalState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

const Section = ({ title, icon, color, children }) => (
  <div style={{ background: WHITE, border: `1.5px solid ${color}`, borderRadius: 16, padding: "1.25rem", marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: DEEP, letterSpacing: 0.3 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const Tag = ({ label, color }) => (
  <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: color + "33", color, border: `1px solid ${color}66` }}>{label}</span>
);

const ProgressBar = ({ value, max }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ flex: 1, height: 8, background: PINK, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${ROSE}, ${MAUVE})`, borderRadius: 99 }} />
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useLocalState("preicy_tasks", defaultTasks);
  const [jobs, setJobs] = useLocalState("preicy_jobs", defaultJobs);
  const [wellness, setWellness] = useLocalState("preicy_wellness", defaultWellness);
  const [biz, setBiz] = useLocalState("preicy_biz", defaultBiz);
  const [drops, setDrops] = useLocalState("preicy_drops", ["Call mom back this weekend", "Look into Atlanta BizLaunch networking event"]);
  const [habitLog, setHabitLog] = useLocalState("preicy_habits", () => { const i = {}; HABITS.forEach(h => { i[h.id] = []; }); return i; });
  const [reflection, setReflection] = useLocalState("preicy_reflection", { wins: "", challenges: "", focus: "", grateful: "" });
  const [affIdx, setAffIdx] = useLocalState("preicy_aff", Math.floor(Math.random() * AFFIRMATIONS.length));

  const [newTask, setNewTask] = useState("");
  const [newJob, setNewJob] = useState({ company: "", role: "", status: "Applied" });
  const [newBiz, setNewBiz] = useState("");
  const [dropZone, setDropZone] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useLocalState("preicy_ai", [{ role: "assistant", text: "Hi Preicy! I'm your dashboard assistant. Ask me to add tasks, update job statuses, log wellness, or anything else. ✨" }]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [aiMessages]);

  const toggleTask = id => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const toggleBiz = id => setBiz(b => b.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const addTask = () => { if (!newTask.trim()) return; setTasks(t => [...t, { id: Date.now(), text: newTask, done: false, priority: "med" }]); setNewTask(""); };
  const addJob = () => { if (!newJob.company.trim() || !newJob.role.trim()) return; setJobs(j => [...j, { ...newJob, id: Date.now(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }]); setNewJob({ company: "", role: "", status: "Applied" }); };
  const addBiz = () => { if (!newBiz.trim()) return; setBiz(b => [...b, { id: Date.now(), text: newBiz, done: false, tag: "Ops" }]); setNewBiz(""); };
  const updateWellness = (id, val) => setWellness(w => w.map(x => x.id === id ? { ...x, value: +val } : x));
  const updateJobStatus = (id, status) => setJobs(j => j.map(x => x.id === id ? { ...x, status } : x));
  const saveDrop = () => { if (!dropZone.trim()) return; setDrops(d => [dropZone.trim(), ...d]); setDropZone(""); };
  const removeDrop = i => setDrops(d => d.filter((_, idx) => idx !== i));
  const toggleHabit = (hid, day) => setHabitLog(log => { const curr = log[hid] || []; return { ...log, [hid]: curr.includes(day) ? curr.filter(d => d !== day) : [...curr, day] }; });
  const nextAff = () => setAffIdx(i => (i + 1) % AFFIRMATIONS.length);

  const sendAi = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    const newHistory = [...aiMessages, { role: "user", text: userMsg }];
    setAiMessages(newHistory);
    setAiLoading(true);
    const stateSnapshot = JSON.stringify({ tasks, jobs, wellness, biz, drops });
    const systemPrompt = `You are a warm, supportive dashboard assistant for Preicy — a high-achieving Black woman in a director-level job search while building Precision Consulting Group LLC in Atlanta. She has ADHD and values clear, actionable, empathetic communication.
Current dashboard state: ${stateSnapshot}
When the user asks to add/update items, respond with ACTION lines AND a friendly message.
ACTION:{"type":"add_task","text":"...","priority":"high|med|low"}
ACTION:{"type":"add_biz","text":"...","tag":"Branding|Sales|Research|Ops"}
ACTION:{"type":"update_job_status","company":"...","status":"Applied|Interview|Researching|Offer|Rejected"}
ACTION:{"type":"add_job","company":"...","role":"...","status":"Applied"}
ACTION:{"type":"update_wellness","label":"...","value":N}
ACTION:{"type":"add_drop","text":"..."}
Always include a warm, concise message. If no action needed, just respond helpfully.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages: [{ role: "user", content: userMsg }] })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "I couldn't process that!";
      const lines = raw.split("\n");
      const actions = lines.filter(l => l.startsWith("ACTION:")).map(l => { try { return JSON.parse(l.replace("ACTION:", "").trim()); } catch { return null; } }).filter(Boolean);
      const message = lines.filter(l => !l.startsWith("ACTION:")).join(" ").trim();
      actions.forEach(a => {
        if (a.type === "add_task") setTasks(t => [...t, { id: Date.now(), text: a.text, done: false, priority: a.priority || "med" }]);
        if (a.type === "add_biz") setBiz(b => [...b, { id: Date.now(), text: a.text, done: false, tag: a.tag || "Ops" }]);
        if (a.type === "add_job") setJobs(j => [...j, { id: Date.now(), company: a.company, role: a.role, status: a.status || "Applied", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }]);
        if (a.type === "update_job_status") setJobs(j => j.map(x => x.company.toLowerCase().includes(a.company.toLowerCase()) ? { ...x, status: a.status } : x));
        if (a.type === "update_wellness") setWellness(w => w.map(x => x.label.toLowerCase().includes(a.label.toLowerCase()) ? { ...x, value: a.value } : x));
        if (a.type === "add_drop") setDrops(d => [a.text, ...d]);
      });
      setAiMessages([...newHistory, { role: "assistant", text: message || "Done! Dashboard updated. ✨" }]);
    } catch { setAiMessages(h => [...h, { role: "assistant", text: "Something went wrong. Try again!" }]); }
    setAiLoading(false);
  };

  const week = (() => {
    const now = new Date(); const day = now.getDay();
    const mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    return `${mon.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${sun.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  })();

  const inputStyle = (borderColor) => ({ flex: 1, padding: "7px 10px", border: `1px solid ${borderColor}`, borderRadius: 8, fontSize: 13, color: TEXT, outline: "none", background: WHITE });

  return (
    <div style={{ background: SOFT, minHeight: "100vh", padding: "1.25rem", fontFamily: "system-ui, sans-serif", color: TEXT, maxWidth: 680, margin: "0 auto" }}>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: DEEP }}>Preicy's Dashboard</div>
        <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>Week of {week}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          {[{ label: `${tasks.filter(t=>t.done).length}/${tasks.length} tasks done`, c: MAUVE }, { label: `${jobs.length} roles tracked`, c: "#5b9bd4" }, { label: `${biz.filter(b=>b.done).length}/${biz.length} biz items`, c: "#7ab87a" }].map(b => (
            <span key={b.label} style={{ fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 20, background: b.c + "22", color: b.c, border: `1px solid ${b.c}55` }}>{b.label}</span>
          ))}
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${ROSE}55, ${PINK})`, border: `1.5px solid ${ROSE}`, borderRadius: 16, padding: "1.1rem 1.25rem", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: MAUVE, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>This week's affirmation</div>
        <div style={{ fontSize: 14, color: DEEP, lineHeight: 1.6, fontStyle: "italic" }}>"{AFFIRMATIONS[affIdx]}"</div>
        <button onClick={nextAff} style={{ marginTop: 10, fontSize: 11, color: MAUVE, background: "transparent", border: `1px solid ${ROSE}`, borderRadius: 20, padding: "3px 12px", cursor: "pointer" }}>New affirmation ↻</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setShowAi(v => !v)} style={{ width: "100%", padding: "10px 16px", background: `linear-gradient(135deg, ${ROSE}, ${MAUVE})`, color: WHITE, border: "none", borderRadius: 12, fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
          {showAi ? "Hide AI Assistant" : "Open AI Assistant ✨"}
        </button>
        {showAi && (
          <div style={{ background: WHITE, border: `1.5px solid ${ROSE}`, borderRadius: 12, marginTop: 8, overflow: "hidden" }}>
            <div ref={chatRef} style={{ maxHeight: 180, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
              {aiMessages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: m.role === "user" ? MAUVE : PINK, color: m.role === "user" ? WHITE : TEXT, borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "8px 12px", fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
              ))}
              {aiLoading && <div style={{ alignSelf: "flex-start", background: PINK, borderRadius: "12px 12px 12px 2px", padding: "8px 12px", fontSize: 13, color: MUTED }}>Thinking...</div>}
            </div>
            <div style={{ display: "flex", borderTop: `1px solid ${ROSE}`, padding: 8, gap: 8 }}>
              <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendAi()} placeholder='e.g. "Add task: prep for NovaPay interview"' style={inputStyle(ROSE)} />
              <button onClick={sendAi} disabled={aiLoading} style={{ padding: "8px 16px", background: MAUVE, color: WHITE, border: "none", borderRadius: 8, fontWeight: 500, fontSize: 13, cursor: "pointer" }}>Send</button>
            </div>
          </div>
        )}
      </div>

      <Section title="Drop Zone" icon="⬇" color={ROSE}>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>Brain dump anything here — ideas, reminders, random thoughts.</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <textarea value={dropZone} onChange={e => setDropZone(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), saveDrop())} placeholder="Type anything and press Enter..." rows={2} style={{ flex: 1, padding: "8px 10px", border: `1px solid ${ROSE}`, borderRadius: 8, fontSize: 13, color: TEXT, resize: "none", outline: "none", fontFamily: "system-ui, sans-serif", background: WHITE }} />
          <button onClick={saveDrop} style={{ padding: "8px 14px", background: MAUVE, color: WHITE, border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 500, alignSelf: "flex-end" }}>Drop</button>
        </div>
        {drops.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, background: PINK, borderRadius: 8, padding: "8px 10px", marginBottom: 6 }}>
            <span style={{ flex: 1, fontSize: 13, color: TEXT, lineHeight: 1.5 }}>{d}</span>
            <button onClick={() => removeDrop(i)} style={{ background: "transparent", border: "none", color: MUTED, cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
          </div>
        ))}
      </Section>

      <Section title="Tasks & To-Dos" icon="✓" color={ROSE}>
        {tasks.map(t => (
          <div key={t.id} onClick={() => toggleTask(t.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${PINK}`, cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${t.done ? MAUVE : ROSE}`, background: t.done ? MAUVE : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {t.done && <span style={{ color: WHITE, fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ flex: 1, fontSize: 13, textDecoration: t.done ? "line-through" : "none", color: t.done ? MUTED : TEXT }}>{t.text}</span>
            <Tag label={t.priority} color={priorityColors[t.priority]} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Add a task..." style={inputStyle(ROSE)} />
          <button onClick={addTask} style={{ padding: "7px 14px", background: MAUVE, color: WHITE, border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>+</button>
        </div>
      </Section>

      <Section title="Habit Tracker" icon="◉" color="#d4bfea">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr>
              <th style={{ textAlign: "left", padding: "4px 8px 8px 0", color: MUTED, fontWeight: 500 }}>Habit</th>
              {DAYS.map(d => <th key={d} style={{ textAlign: "center", padding: "4px 6px 8px", color: MUTED, fontWeight: 500, width: 32 }}>{d}</th>)}
            </tr></thead>
            <tbody>
              {HABITS.map(h => (
                <tr key={h.id}>
                  <td style={{ padding: "5px 8px 5px 0", color: TEXT, fontSize: 12, whiteSpace: "nowrap" }}>{h.icon} {h.label}</td>
                  {DAYS.map((d, di) => {
                    const checked = (habitLog[h.id] || []).includes(di);
                    return (
                      <td key={d} style={{ textAlign: "center", padding: "5px 4px" }}>
                        <div onClick={() => toggleHabit(h.id, di)} style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${checked ? "#9b6ec4" : "#d4bfea"}`, background: checked ? "#9b6ec4" : "transparent", margin: "0 auto", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {checked && <span style={{ color: WHITE, fontSize: 10, fontWeight: 700 }}>✓</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Job Search Tracker" icon="⌖" color="#b5cfed">
        {jobs.map(j => (
          <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: `1px solid ${PINK}`, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{j.role}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{j.company} · {j.date}</div>
            </div>
            <select value={j.status} onChange={e => updateJobStatus(j.id, e.target.value)} style={{ fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20, border: `1px solid ${(statusColors[j.status] || MAUVE)}55`, background: (statusColors[j.status] || MAUVE) + "22", color: statusColors[j.status] || MAUVE, cursor: "pointer", outline: "none" }}>
              {["Applied", "Researching", "Interview", "Offer", "Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <input value={newJob.company} onChange={e => setNewJob(n => ({ ...n, company: e.target.value }))} placeholder="Company" style={{ ...inputStyle("#b5cfed"), flex: 1, minWidth: 80 }} />
          <input value={newJob.role} onChange={e => setNewJob(n => ({ ...n, role: e.target.value }))} placeholder="Role title" style={{ ...inputStyle("#b5cfed"), flex: 2, minWidth: 100 }} />
          <button onClick={addJob} style={{ padding: "7px 14px", background: "#5b9bd4", color: WHITE, border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>+</button>
        </div>
      </Section>

      <Section title="Personal & Wellness" icon="◎" color="#c8e6c8">
        {wellness.map(w => (
          <div key={w.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: TEXT }}>{w.label}</span>
              <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{w.value}{w.unit}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ProgressBar value={w.value} max={w.max} />
              <input type="range" min={0} max={w.max} step={w.unit === "hrs" ? 0.5 : 1} value={w.value} onChange={e => updateWellness(w.id, e.target.value)} style={{ width: 70, accentColor: MAUVE }} />
            </div>
          </div>
        ))}
      </Section>

      <Section title="Precision Consulting Group" icon="◈" color="#e8d5c4">
        {biz.map(b => (
          <div key={b.id} onClick={() => toggleBiz(b.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${PINK}`, cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${b.done ? "#d4a853" : "#e8d5c4"}`, background: b.done ? "#d4a853" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {b.done && <span style={{ color: WHITE, fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ flex: 1, fontSize: 13, textDecoration: b.done ? "line-through" : "none", color: b.done ? MUTED : TEXT }}>{b.text}</span>
            <Tag label={b.tag} color={tagColors[b.tag] || MAUVE} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input value={newBiz} onChange={e => setNewBiz(e.target.value)} onKeyDown={e => e.key === "Enter" && addBiz()} placeholder="Add a business task..." style={inputStyle("#e8d5c4")} />
          <button onClick={addBiz} style={{ padding: "7px 14px", background: "#d4a853", color: WHITE, border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>+</button>
        </div>
      </Section>

      <Section title="Weekly Reflection" icon="✦" color={ROSE}>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Take a moment. You deserve it. 💕</div>
        {[
          { key: "wins", label: "This week's wins", placeholder: "What did you accomplish? (big or small)" },
          { key: "challenges", label: "Challenges I faced", placeholder: "What was hard? No judgment." },
          { key: "focus", label: "Next week I'll focus on", placeholder: "One or two intentions..." },
          { key: "grateful", label: "I'm grateful for", placeholder: "Something good, however small..." },
        ].map(({ key, label, placeholder }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: DEEP, marginBottom: 4 }}>{label}</div>
            <textarea value={reflection[key]} onChange={e => setReflection(r => ({ ...r, [key]: e.target.value }))} placeholder={placeholder} rows={2} style={{ width: "100%", padding: "8px 10px", border: `1px solid ${ROSE}`, borderRadius: 8, fontSize: 13, color: TEXT, resize: "vertical", outline: "none", fontFamily: "system-ui, sans-serif", background: WHITE, boxSizing: "border-box" }} />
          </div>
        ))}
      </Section>

    </div>
  );
}
