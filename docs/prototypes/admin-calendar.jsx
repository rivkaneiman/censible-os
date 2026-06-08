import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, ChevronDown, Calendar as CalIcon,
  X
} from "lucide-react";

// ============================================================
// CENSIBLE OS — Admin All-Pod Calendar
// ============================================================

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Geist:wght@300;400;500;600&display=swap');

  .censible-root {
    font-family: 'Geist', system-ui, sans-serif;
    color: #231F20;
    background: #FAF8F5;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }
  .censible-root * { box-sizing: border-box; }

  .display-heading {
    font-family: 'Fraunces', serif;
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  /* Orbs */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    pointer-events: none;
  }
  .orb-1 { top: -10%; left: -5%;  width: 500px; height: 500px;
           background: rgba(90, 166, 187, 0.28); }
  .orb-2 { top: 30%;  right: -8%; width: 600px; height: 600px;
           background: rgba(46, 110, 132, 0.18); }
  .orb-3 { bottom: -15%; left: 25%; width: 550px; height: 550px;
           background: rgba(180, 200, 170, 0.22); }

  /* Glass */
  .glass {
    background: rgba(255, 253, 250, 0.55);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.65),
      inset 0 -1px 0 0 rgba(35, 31, 32, 0.04),
      0 1px 2px rgba(35, 31, 32, 0.04),
      0 12px 32px rgba(35, 31, 32, 0.06);
  }

  /* Top nav */
  nav.top {
    position: sticky; top: 0; z-index: 50;
    margin: 1rem 1rem 0;
    padding: 0.75rem 1.5rem;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(250, 248, 245, 0.55);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 9999px;
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
      0 4px 24px rgba(35, 31, 32, 0.05);
  }
  nav.top .brand {
    font-family: 'Fraunces', serif;
    font-size: 1.05rem;
    letter-spacing: -0.01em;
  }
  nav.top .nav-links { display: flex; gap: 0.5rem; align-items: center; }
  nav.top .nav-link {
    padding: 0.4rem 0.9rem;
    font-size: 0.875rem;
    color: #4A4546;
    border-radius: 9999px;
    cursor: pointer;
    transition: background 200ms, color 200ms;
  }
  nav.top .nav-link:hover { background: rgba(255, 255, 255, 0.4); color: #231F20; }
  nav.top .nav-link.active {
    background: rgba(230, 240, 244, 0.7);
    color: #2E6E84;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  }

  /* Ghost button */
  .btn-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 9999px;
    font-weight: 500; font-size: 0.875rem;
    padding: 0.5rem 1.1rem;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: #4A4546;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
    transition: background 200ms, color 200ms;
    cursor: pointer; font-family: inherit;
    gap: 0.35rem;
  }
  .btn-ghost:hover { background: rgba(255, 255, 255, 0.85); color: #231F20; }

  /* Icon button */
  .icon-btn {
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 9999px;
    width: 34px; height: 34px;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #4A4546;
    transition: background 200ms;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  }
  .icon-btn:hover { background: rgba(255, 255, 255, 0.85); color: #231F20; }

  /* Segmented control */
  .segmented {
    display: inline-flex;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 9999px;
    padding: 3px;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  }
  .segmented button {
    background: transparent;
    border: none;
    padding: 0.35rem 0.95rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: #4A4546;
    cursor: pointer;
    border-radius: 9999px;
    transition: background 200ms, color 200ms;
    font-family: inherit;
  }
  .segmented button.active {
    background: #FFFFFF;
    color: #2E6E84;
    box-shadow: 0 1px 3px rgba(35, 31, 32, 0.08);
  }

  /* Pod filter chip */
  .pod-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.85rem;
    border-radius: 9999px;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 200ms;
    border: 1.5px solid;
    background: transparent;
    font-family: inherit;
  }
  .pod-chip:hover { filter: brightness(0.95); }
  .pod-chip .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
  }

  /* Month picker popover */
  .month-picker {
    position: absolute;
    z-index: 9999;
    margin-top: 0.5rem;
    padding: 0.85rem;
    background: #FFFFFF;
    border: 1px solid #D5D1CA;
    border-radius: 14px;
    box-shadow:
      0 2px 4px rgba(35, 31, 32, 0.1),
      0 20px 44px rgba(35, 31, 32, 0.22);
    width: 260px;
  }
  .month-picker-year-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.85rem;
  }
  .month-picker-year {
    font-family: 'Fraunces', serif;
    font-size: 1.05rem;
  }
  .month-picker-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
  }
  .month-picker-btn {
    padding: 0.5rem 0.4rem;
    background: transparent;
    border: none;
    border-radius: 8px;
    font-size: 0.82rem;
    color: #231F20;
    cursor: pointer;
    transition: background 150ms;
    font-family: inherit;
  }
  .month-picker-btn:hover { background: rgba(230, 240, 244, 0.95); }
  .month-picker-btn.current {
    background: #2E6E84;
    color: #FFFFFF;
    font-weight: 500;
  }

  /* Calendar grid */
  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
  }
  .cal-dow {
    text-align: left;
    color: #807A7B;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.3rem 0.5rem;
  }
  .cal-day {
    border: 1px solid rgba(229, 225, 218, 0.6);
    background: rgba(255, 255, 255, 0.35);
    border-radius: 10px;
    padding: 0.4rem 0.45rem 0.45rem;
    min-height: 100px;
    text-align: left;
    font-size: 0.78rem;
    position: relative;
    cursor: pointer;
    transition: background 150ms, border-color 150ms;
    overflow: hidden;
  }
  .cal-day:hover:not(.outside) { background: rgba(255, 255, 255, 0.75); }
  .cal-day.outside {
    background: transparent;
    border-color: rgba(229, 225, 218, 0.3);
    cursor: default;
  }
  .cal-day.outside .cal-day-num { color: #C5C0BC; }
  .cal-day.holiday {
    background: rgba(230, 240, 244, 0.5);
    border-color: rgba(90, 166, 187, 0.35);
  }
  .cal-day.today { border-color: #5AA6BB; border-width: 1.5px; }
  .cal-day.selected {
    border-color: #2E6E84;
    border-width: 1.5px;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 0 0 3px rgba(46, 110, 132, 0.12);
  }

  .cal-day-num {
    color: #4A4546;
    font-size: 0.78rem;
    font-weight: 500;
  }
  .cal-day.today .cal-day-num,
  .cal-day.selected .cal-day-num { color: #2E6E84; font-weight: 600; }

  .cal-day-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.35rem;
  }
  .cal-day-holiday-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #2E6E84;
    font-weight: 500;
  }

  /* Chips inside calendar cells */
  .day-chip {
    display: block;
    font-size: 0.66rem;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    cursor: pointer;
    border: 1.5px solid;
  }
  .day-chip.pto {
    color: #FFFFFF;
  }
  .day-chip.coverage {
    background: transparent;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
  .day-chip-overflow {
    font-size: 0.62rem;
    color: #807A7B;
    padding: 1px 4px;
    margin-top: 1px;
  }

  /* Right sidebar */
  .sidebar-section {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(229, 225, 218, 0.5);
  }
  .sidebar-section:last-child { border-bottom: none; }

  .pod-group-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: #807A7B;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .pod-group-label .dot {
    width: 8px; height: 8px; border-radius: 50%;
  }

  .sidebar-person-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.45rem 0.55rem;
    cursor: pointer;
    border-radius: 8px;
    margin: 0 -0.5rem;
    transition: background 150ms;
  }
  .sidebar-person-row:hover {
    background: rgba(255, 255, 255, 0.8);
  }
  .sidebar-person-row .name { font-size: 0.9rem; color: #231F20; }
  .sidebar-person-row .meta { font-size: 0.72rem; color: #807A7B; text-transform: capitalize; }

  .holiday-banner {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.6rem 0.85rem;
    background: rgba(230, 240, 244, 0.85);
    border: 1px solid rgba(90, 166, 187, 0.3);
    border-radius: 10px;
    font-size: 0.82rem;
    color: #2E6E84;
    font-weight: 500;
    margin-bottom: 1rem;
  }
`;

// ============================================================
// CONSTANTS & DATA
// ============================================================

const TODAY = { year: 2026, month: 5, day: 2 }; // June 2, 2026 (month is 0-indexed)
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_NAMES_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const PODS = {
  "North": { color: "#5AA6BB", deep: "#2E6E84", light: "rgba(90, 166, 187, 0.15)" },
  "South": { color: "#C2876C", deep: "#8C5A45", light: "rgba(194, 135, 108, 0.15)" },
  "East":  { color: "#9BAB85", deep: "#6B7E5B", light: "rgba(155, 171, 133, 0.15)" },
};

// 2026 holiday dates (YYYY-MM-DD)
const HOLIDAYS_2026 = {
  "2026-01-01": "New Year's Day",
  "2026-05-25": "Memorial Day",
  "2026-07-04": "Independence Day",
  "2026-09-07": "Labor Day",
  "2026-11-26": "Thanksgiving",
  "2026-12-25": "Christmas",
};

// Approved absences (each entry covers specific dates)
const ABSENCES = [
  { id: "a1", name: "Sarah", pod: "North", dates: ["2026-06-13", "2026-06-14", "2026-06-15"], category: "vacation" },
  { id: "a2", name: "Sarah", pod: "North", dates: ["2026-06-22"], category: "personal" },
  { id: "a3", name: "Mike",  pod: "North", dates: ["2026-06-19"], category: "personal" },
  { id: "a4", name: "Alex",  pod: "North", dates: ["2026-06-04"], category: "personal" },
  { id: "a5", name: "Alex",  pod: "North", dates: ["2026-06-15"], category: "comp" },
  { id: "a6", name: "Casey", pod: "North", dates: ["2026-06-12"], category: "comp" },
  { id: "a7", name: "Jen",   pod: "North", dates: ["2026-06-30"], category: "vacation" },

  { id: "a8",  name: "Priya",   pod: "South", dates: ["2026-06-09", "2026-06-10"], category: "vacation" },
  { id: "a9",  name: "Marcus",  pod: "South", dates: ["2026-06-17"], category: "personal" },
  { id: "a10", name: "Dev",     pod: "South", dates: ["2026-06-24", "2026-06-25"], category: "vacation" },
  { id: "a11", name: "Lena",    pod: "South", dates: ["2026-06-26"], category: "comp" },

  { id: "a12", name: "Jordan", pod: "East", dates: ["2026-06-16"], category: "vacation" },
  { id: "a13", name: "Sam",    pod: "East", dates: ["2026-06-11"], category: "vacation" },
  { id: "a14", name: "Avery",  pod: "East", dates: ["2026-06-30"], category: "personal" },
  { id: "a15", name: "Morgan", pod: "East", dates: ["2026-06-18", "2026-06-19", "2026-06-20"], category: "vacation" },

  // For July nav demo
  { id: "a20", name: "Jen", pod: "North", dates: ["2026-07-06","2026-07-07","2026-07-08","2026-07-09","2026-07-10"], category: "vacation" },
  { id: "a21", name: "Jordan", pod: "East", dates: ["2026-07-04"], category: "holiday" },
];

// Weekend coverage assignments
const WEEKEND_COVERAGE = [
  { name: "Mike",   pod: "North", date: "2026-06-06" },
  { name: "Jen",    pod: "North", date: "2026-06-07" },
  { name: "Alex",   pod: "North", date: "2026-06-13" },
  { name: "Casey",  pod: "North", date: "2026-06-14" },
  { name: "Priya",  pod: "South", date: "2026-06-20" },
  { name: "Marcus", pod: "South", date: "2026-06-21" },
  { name: "Dev",    pod: "South", date: "2026-06-27" },
  { name: "Lena",   pod: "South", date: "2026-06-28" },
];

// ============================================================
// HELPERS
// ============================================================
const pad = (n) => String(n).padStart(2, "0");
const toIso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const sameDay = (a, b) => a.year === b.year && a.month === b.month && a.day === b.day;

const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const firstDow = (y, m) => new Date(y, m, 1).getDay();

// Get all events on a date (PTO + weekend coverage)
const eventsForDate = (iso) => {
  const pto = [];
  ABSENCES.forEach(a => {
    if (a.dates.includes(iso)) {
      pto.push({ kind: "pto", name: a.name, pod: a.pod, category: a.category, id: a.id });
    }
  });
  const coverage = WEEKEND_COVERAGE
    .filter(c => c.date === iso)
    .map(c => ({ kind: "coverage", name: c.name, pod: c.pod, category: "weekend coverage" }));
  return [...pto, ...coverage];
};

const formatDateLong = (y, m, d) => {
  const dt = new Date(y, m, d);
  return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
};

// ============================================================
// COMPONENT
// ============================================================
export default function AdminCalendar() {
  const [viewMode, setViewMode] = useState("month"); // 'month' | 'week'
  const [year, setYear] = useState(TODAY.year);
  const [month, setMonth] = useState(TODAY.month); // 0-indexed
  const [enabledPods, setEnabledPods] = useState(new Set(Object.keys(PODS)));
  const [selectedDay, setSelectedDay] = useState(null); // {year, month, day} or null = show today
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // For week view, track the week's reference date (anchor = first day of visible week)
  const [weekAnchor, setWeekAnchor] = useState(() => {
    const dow = firstDow(TODAY.year, TODAY.month);
    // anchor is the Sunday on/before today
    const todayDt = new Date(TODAY.year, TODAY.month, TODAY.day);
    const anchor = new Date(todayDt);
    anchor.setDate(todayDt.getDate() - todayDt.getDay());
    return { year: anchor.getFullYear(), month: anchor.getMonth(), day: anchor.getDate() };
  });

  const togglePod = (pod) => {
    const next = new Set(enabledPods);
    if (next.has(pod)) next.delete(pod);
    else next.add(pod);
    setEnabledPods(next);
  };

  const filterEvents = (events) => events.filter(e => enabledPods.has(e.pod));

  // Navigation
  const goPrev = () => {
    if (viewMode === "month") {
      if (month === 0) { setMonth(11); setYear(year - 1); }
      else setMonth(month - 1);
    } else {
      const dt = new Date(weekAnchor.year, weekAnchor.month, weekAnchor.day - 7);
      setWeekAnchor({ year: dt.getFullYear(), month: dt.getMonth(), day: dt.getDate() });
    }
  };
  const goNext = () => {
    if (viewMode === "month") {
      if (month === 11) { setMonth(0); setYear(year + 1); }
      else setMonth(month + 1);
    } else {
      const dt = new Date(weekAnchor.year, weekAnchor.month, weekAnchor.day + 7);
      setWeekAnchor({ year: dt.getFullYear(), month: dt.getMonth(), day: dt.getDate() });
    }
  };
  const goToday = () => {
    setYear(TODAY.year);
    setMonth(TODAY.month);
    const todayDt = new Date(TODAY.year, TODAY.month, TODAY.day);
    const anchor = new Date(todayDt);
    anchor.setDate(todayDt.getDate() - todayDt.getDay());
    setWeekAnchor({ year: anchor.getFullYear(), month: anchor.getMonth(), day: anchor.getDate() });
    setSelectedDay(null);
  };

  // Heading label
  const headingLabel = useMemo(() => {
    if (viewMode === "month") {
      return `${MONTH_NAMES[month]} ${year}`;
    }
    // Week view: show range
    const start = new Date(weekAnchor.year, weekAnchor.month, weekAnchor.day);
    const end = new Date(weekAnchor.year, weekAnchor.month, weekAnchor.day + 6);
    const sm = MONTH_NAMES_SHORT[start.getMonth()];
    const em = MONTH_NAMES_SHORT[end.getMonth()];
    if (start.getMonth() === end.getMonth()) {
      return `${sm} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${sm} ${start.getDate()} – ${em} ${end.getDate()}, ${end.getFullYear()}`;
  }, [viewMode, year, month, weekAnchor]);

  // The "selected" day to show in sidebar; defaults to today
  const sidebarDay = selectedDay || TODAY;

  return (
    <div className="censible-root">
      <style>{STYLES}</style>

      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <nav className="top">
        <div className="brand">Censible OS</div>
        <div className="nav-links">
          <div className="nav-link">Time off</div>
          <div className="nav-link">Requests</div>
          <div className="nav-link active">Calendar</div>
        </div>
      </nav>

      <main style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "2rem 1.5rem 4rem",
      }}>
        <h1 className="display-heading" style={{ fontSize: "2.5rem", margin: "0 0 1.75rem" }}>
          Calendar
        </h1>

        {/* Controls row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}>
          {/* Left: nav arrows + heading + view toggle + pod filters */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
            <button className="icon-btn" onClick={goPrev} aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button className="icon-btn" onClick={goNext} aria-label="Next">
              <ChevronRight size={18} />
            </button>
            <MonthHeadingButton
              label={headingLabel}
              showPicker={showMonthPicker}
              onTogglePicker={() => setShowMonthPicker(!showMonthPicker)}
              year={year}
              month={month}
              onPick={(y, m) => { setYear(y); setMonth(m); setShowMonthPicker(false); }}
            />
            <div className="segmented" style={{ marginLeft: "0.4rem" }}>
              <button
                className={viewMode === "month" ? "active" : ""}
                onClick={() => setViewMode("month")}
              >Month</button>
              <button
                className={viewMode === "week" ? "active" : ""}
                onClick={() => setViewMode("week")}
              >Week</button>
            </div>
            <div style={{
              width: "1px",
              height: "20px",
              background: "rgba(229, 225, 218, 0.8)",
              margin: "0 0.4rem",
            }} />
            {Object.entries(PODS).map(([name, conf]) => {
              const enabled = enabledPods.has(name);
              return (
                <button
                  key={name}
                  className="pod-chip"
                  onClick={() => togglePod(name)}
                  style={{
                    borderColor: conf.color,
                    background: enabled ? conf.color : "transparent",
                    color: enabled ? "#FFFFFF" : conf.deep,
                  }}
                >
                  <span className="dot" style={{ background: enabled ? "#FFFFFF" : conf.color }} />
                  {name} Pod
                </button>
              );
            })}
          </div>

          {/* Right: Jump to today button */}
          <button className="btn-ghost" onClick={goToday}>Jump to today</button>
        </div>

        {/* Calendar + Sidebar layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: "1.25rem", alignItems: "flex-start" }}>
          {/* Calendar */}
          <div className="glass" style={{ padding: "1.25rem", position: "relative", zIndex: 1 }}>
            {viewMode === "month" ? (
              <MonthGrid
                year={year}
                month={month}
                today={TODAY}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                filterEvents={filterEvents}
              />
            ) : (
              <WeekGrid
                anchor={weekAnchor}
                today={TODAY}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                filterEvents={filterEvents}
              />
            )}
          </div>

          {/* Right sidebar */}
          <div className="glass" style={{ overflow: "hidden", position: "sticky", top: "5rem" }}>
            <DaySidebar
              day={sidebarDay}
              isToday={sameDay(sidebarDay, TODAY)}
              filterEvents={filterEvents}
              onClose={selectedDay ? () => setSelectedDay(null) : null}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// MONTH HEADING + PICKER
// ============================================================
function MonthHeadingButton({ label, showPicker, onTogglePicker, year, month, onPick }) {
  const wrapperRef = useRef(null);
  const [pickerYear, setPickerYear] = useState(year);

  useEffect(() => { setPickerYear(year); }, [year]);

  useEffect(() => {
    if (!showPicker) return;
    const handle = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onTogglePicker();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showPicker, onTogglePicker]);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button
        onClick={onTogglePicker}
        style={{
          background: "transparent",
          border: "none",
          padding: "0.4rem 0.75rem",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          color: "#231F20",
          fontFamily: "'Fraunces', serif",
          fontSize: "1.3rem",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
        <ChevronDown size={16} style={{ marginTop: "2px", color: "#807A7B" }} />
      </button>
      {showPicker && (
        <div className="month-picker">
          <div className="month-picker-year-row">
            <button className="icon-btn" style={{ width: "28px", height: "28px" }} onClick={() => setPickerYear(pickerYear - 1)}>
              <ChevronLeft size={14} />
            </button>
            <span className="month-picker-year">{pickerYear}</span>
            <button className="icon-btn" style={{ width: "28px", height: "28px" }} onClick={() => setPickerYear(pickerYear + 1)}>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="month-picker-grid">
            {MONTH_NAMES_SHORT.map((m, i) => (
              <button
                key={i}
                className={`month-picker-btn ${pickerYear === year && i === month ? "current" : ""}`}
                onClick={() => onPick(pickerYear, i)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MONTH GRID
// ============================================================
function MonthGrid({ year, month, today, selectedDay, onSelectDay, filterEvents }) {
  // Build cells: empty for days before the 1st, then days of month, then padding
  const startDow = firstDow(year, month);
  const totalDays = daysInMonth(year, month);
  const prevMonthDays = daysInMonth(year, month - 1 < 0 ? 11 : month - 1);
  const prevMonth = month - 1 < 0 ? 11 : month - 1;
  const prevYear = month - 1 < 0 ? year - 1 : year;
  const nextMonth = month + 1 > 11 ? 0 : month + 1;
  const nextYear = month + 1 > 11 ? year + 1 : year;

  // Calculate exact rows needed - 5 for most months, 6 when month spans them
  const rowsNeeded = Math.ceil((startDow + totalDays) / 7);
  const targetCells = rowsNeeded * 7;

  const cells = [];

  // Padding from previous month (greyed)
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ year: prevYear, month: prevMonth, day: prevMonthDays - i, outside: true });
  }
  // Current month
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ year, month, day: d, outside: false });
  }
  // Padding to complete the last row only
  while (cells.length < targetCells) {
    const nextDay = cells.length - (startDow + totalDays) + 1;
    cells.push({ year: nextYear, month: nextMonth, day: nextDay, outside: true });
  }

  return (
    <div>
      <div className="cal-grid" style={{ marginBottom: "0.4rem" }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="cal-dow">{d}</div>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((c, i) => (
          <DayCell
            key={i}
            cell={c}
            today={today}
            selectedDay={selectedDay}
            onSelectDay={onSelectDay}
            filterEvents={filterEvents}
            maxChips={3}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// WEEK GRID
// ============================================================
function WeekGrid({ anchor, today, selectedDay, onSelectDay, filterEvents }) {
  const cells = [];
  const start = new Date(anchor.year, anchor.month, anchor.day);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), outside: false });
  }

  return (
    <div>
      <div className="cal-grid" style={{ marginBottom: "0.4rem" }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="cal-dow">{d}</div>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((c, i) => (
          <DayCell
            key={i}
            cell={c}
            today={today}
            selectedDay={selectedDay}
            onSelectDay={onSelectDay}
            filterEvents={filterEvents}
            maxChips={8}
            tall
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DAY CELL
// ============================================================
function DayCell({ cell, today, selectedDay, onSelectDay, filterEvents, maxChips, tall }) {
  const iso = toIso(cell.year, cell.month, cell.day);
  const isToday = sameDay(cell, today);
  const isSelected = selectedDay && sameDay(cell, selectedDay);
  const isHoliday = !!HOLIDAYS_2026[iso];
  const dow = new Date(cell.year, cell.month, cell.day).getDay();
  const isWeekend = dow === 0 || dow === 6;

  const allEvents = filterEvents(eventsForDate(iso));
  const coverageEvents = allEvents.filter(e => e.kind === "coverage");
  // No PTO shown on weekends — people aren't working those days anyway
  const ptoEvents = isWeekend ? [] : allEvents.filter(e => e.kind === "pto");

  const hasOverflow = ptoEvents.length > maxChips;
  const visiblePto = hasOverflow ? ptoEvents.slice(0, maxChips) : ptoEvents;
  const overflowCount = ptoEvents.length - maxChips;

  const cls = ["cal-day"];
  if (cell.outside) cls.push("outside");
  if (isHoliday && !cell.outside) cls.push("holiday");
  if (isToday) cls.push("today");
  if (isSelected) cls.push("selected");

  return (
    <div
      className={cls.join(" ")}
      onClick={() => !cell.outside && onSelectDay(cell)}
      style={tall ? { minHeight: "240px" } : undefined}
    >
      <div className="cal-day-header">
        <span className="cal-day-num">{cell.day}</span>
        {isHoliday && !cell.outside && (
          <span className="cal-day-holiday-label">Holiday</span>
        )}
      </div>
      {!cell.outside && coverageEvents.length > 0 && (
        <div style={{ marginTop: "1px", marginBottom: "5px" }}>
          {coverageEvents.map((c, i) => (
            <div key={i} style={{ color: PODS[c.pod].deep }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 500, lineHeight: 1.1 }}>
                {c.name}
              </div>
              <div style={{ fontSize: "0.65rem", opacity: 0.7, lineHeight: 1, marginTop: "2px" }}>
                covering
              </div>
            </div>
          ))}
        </div>
      )}
      {!cell.outside && visiblePto.map((e, i) => (
        <DayChip key={i} event={e} />
      ))}
      {hasOverflow && !cell.outside && (
        <div className="day-chip-overflow">+{overflowCount} more</div>
      )}
    </div>
  );
}

// ============================================================
// CHIPS
// ============================================================
function DayChip({ event }) {
  const podConf = PODS[event.pod];
  return (
    <span
      className="day-chip pto"
      style={{
        background: podConf.color,
        borderColor: podConf.color,
      }}
    >
      {event.name}
    </span>
  );
}

// ============================================================
// RIGHT SIDEBAR — TODAY OR SELECTED DAY
// ============================================================
function DaySidebar({ day, isToday, filterEvents, onClose }) {
  const iso = toIso(day.year, day.month, day.day);
  const holidayName = HOLIDAYS_2026[iso];
  const dow = new Date(day.year, day.month, day.day).getDay();
  const isWeekend = dow === 0 || dow === 6;
  const rawEvents = filterEvents(eventsForDate(iso));
  const events = isWeekend ? rawEvents.filter(e => e.kind === "coverage") : rawEvents;
  const totalCount = events.length;

  // Group by pod
  const byPod = useMemo(() => {
    const groups = {};
    events.forEach(e => {
      if (!groups[e.pod]) groups[e.pod] = [];
      groups[e.pod].push(e);
    });
    return groups;
  }, [events]);

  const podOrder = Object.keys(PODS).filter(p => byPod[p]);

  return (
    <div>
      {/* Header */}
      <div className="sidebar-section" style={{ paddingBottom: "0.9rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
          <div>
            <div style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#807A7B",
              fontWeight: 500,
              marginBottom: "0.25rem",
            }}>
              {isToday ? "Today" : "Selected"}
            </div>
            <div className="display-heading" style={{ fontSize: "1.2rem", lineHeight: 1.15 }}>
              {formatDateLong(day.year, day.month, day.day)}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Back to today"
              style={{
                background: "transparent",
                border: "none",
                padding: "0.3rem",
                borderRadius: "50%",
                cursor: "pointer",
                color: "#807A7B",
                display: "flex",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(229, 225, 218, 0.5)"; e.currentTarget.style.color = "#231F20"; }}
              onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#807A7B"; }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Holiday banner */}
      {holidayName && (
        <div className="sidebar-section">
          <div className="holiday-banner">
            <CalIcon size={14} />
            {holidayName}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="sidebar-section">
        {totalCount === 0 ? (
          <div style={{ color: "#807A7B", fontSize: "0.88rem", padding: "1rem 0", textAlign: "center" }}>
            {isWeekend ? "No coverage scheduled." : (holidayName ? "No one is off — full coverage." : "No one is off.")}
          </div>
        ) : isWeekend ? (
          // Simplified: just who's covering
          events.map((e, i) => (
            <div key={i} style={{ padding: "0.4rem 0", borderBottom: i < events.length - 1 ? "1px solid rgba(229, 225, 218, 0.5)" : "none" }}>
              <div style={{ fontSize: "1.05rem", fontWeight: 500, color: PODS[e.pod].deep }}>
                {e.name}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#807A7B", marginTop: "0.15rem" }}>
                covering · {e.pod} Pod
              </div>
            </div>
          ))
        ) : (
          podOrder.map(podName => {
            const podConf = PODS[podName];
            const podEvents = byPod[podName];
            return (
              <div
                key={podName}
                style={{
                  border: `1.5px solid ${podConf.color}`,
                  borderRadius: "12px",
                  background: podConf.light,
                  padding: "0.75rem 0.9rem 0.85rem",
                  marginBottom: "0.7rem",
                }}
              >
                <div style={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: podConf.deep,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}>
                  {podName} Pod
                </div>
                {podEvents.map((e, i) => (
                  <div key={i} className="sidebar-person-row">
                    <span className="name">{e.name}</span>
                    <span className="meta">{e.category}</span>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}