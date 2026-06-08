import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, ChevronDown, Plus
} from "lucide-react";

// ============================================================
// CENSIBLE OS — Employee Pod Calendar
// Identity: Sarah Chen, North Pod
// ============================================================

const ME = { name: "Sarah", pod: "North" };

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

  /* Buttons */
  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 9999px;
    font-weight: 500; font-size: 0.9rem;
    padding: 0.55rem 1.2rem;
    background: linear-gradient(180deg, #2E6E84 0%, #245A6D 100%);
    color: #FAF8F5;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(35, 31, 32, 0.12),
      0 4px 16px rgba(46, 110, 132, 0.2);
    transition: transform 200ms ease, box-shadow 200ms ease;
    cursor: pointer; font-family: inherit;
    gap: 0.35rem;
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      0 2px 4px rgba(35, 31, 32, 0.15),
      0 8px 24px rgba(46, 110, 132, 0.28);
  }

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

  /* "Just me" toggle chip */
  .filter-chip {
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
  .filter-chip:hover { filter: brightness(0.95); }
  .filter-chip .dot {
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
    min-height: 110px;
    text-align: left;
    font-size: 0.78rem;
    position: relative;
    overflow: hidden;
  }
  .cal-day.outside {
    background: transparent;
    border-color: rgba(229, 225, 218, 0.3);
  }
  .cal-day.outside .cal-day-num { color: #C5C0BC; }
  .cal-day.holiday {
    background: rgba(230, 240, 244, 0.5);
    border-color: rgba(90, 166, 187, 0.35);
  }
  .cal-day.today { border-color: #5AA6BB; border-width: 1.5px; }

  .cal-day-num {
    color: #4A4546;
    font-size: 0.78rem;
    font-weight: 500;
  }
  .cal-day.today .cal-day-num { color: #2E6E84; font-weight: 600; }

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

  /* Day chips */
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
    border: 1.5px solid;
    color: #FFFFFF;
  }
  .day-chip.own {
    border-width: 2.5px;
    font-weight: 600;
    padding: 2px 6px;
  }
  .day-chip-overflow {
    font-size: 0.62rem;
    color: #807A7B;
    padding: 1px 4px;
    margin-top: 1px;
  }
`;

// ============================================================
// CONSTANTS & DATA
// ============================================================

const TODAY = { year: 2026, month: 5, day: 2 };
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_NAMES_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const PODS = {
  "North": { color: "#5AA6BB", deep: "#2E6E84", light: "rgba(90, 166, 187, 0.15)", borderOwn: "#FAF8F5" },
  "South": { color: "#C2876C", deep: "#8C5A45", light: "rgba(194, 135, 108, 0.15)", borderOwn: "#FAF8F5" },
  "East":  { color: "#9BAB85", deep: "#6B7E5B", light: "rgba(155, 171, 133, 0.15)", borderOwn: "#FAF8F5" },
};

const HOLIDAYS_2026 = {
  "2026-01-01": "New Year's Day",
  "2026-05-25": "Memorial Day",
  "2026-07-04": "Independence Day",
  "2026-09-07": "Labor Day",
  "2026-11-26": "Thanksgiving",
  "2026-12-25": "Christmas",
};

// All approved absences in the system
const ABSENCES = [
  // Sarah (ME)
  { name: "Sarah", pod: "North", dates: ["2026-06-08"], category: "comp" }, // from covering Sat Jun 6
  { name: "Sarah", pod: "North", dates: ["2026-06-13", "2026-06-14", "2026-06-15"], category: "vacation" },
  { name: "Sarah", pod: "North", dates: ["2026-06-22"], category: "personal" },

  // Other North Pod members
  { name: "Mike",  pod: "North", dates: ["2026-06-19"], category: "personal" },
  { name: "Alex",  pod: "North", dates: ["2026-06-04"], category: "personal" },
  { name: "Alex",  pod: "North", dates: ["2026-06-15"], category: "comp" },
  { name: "Casey", pod: "North", dates: ["2026-06-12"], category: "comp" },
  { name: "Jen",   pod: "North", dates: ["2026-06-30"], category: "vacation" },
  { name: "Jen",   pod: "North", dates: ["2026-07-06","2026-07-07","2026-07-08","2026-07-09","2026-07-10"], category: "vacation" },

  // Other pods (won't show for employee view)
  { name: "Priya", pod: "South", dates: ["2026-06-09"], category: "vacation" },
  { name: "Jordan",pod: "East",  dates: ["2026-06-16"], category: "vacation" },
];

const WEEKEND_COVERAGE = [
  { name: "Sarah",  pod: "North", date: "2026-06-06" }, // ME
  { name: "Jen",    pod: "North", date: "2026-06-07" },
  { name: "Alex",   pod: "North", date: "2026-06-13" },
  { name: "Casey",  pod: "North", date: "2026-06-14" },
  { name: "Sarah",  pod: "North", date: "2026-06-27" }, // ME
  { name: "Mike",   pod: "North", date: "2026-06-28" },
];

// ============================================================
// HELPERS
// ============================================================
const pad = (n) => String(n).padStart(2, "0");
const toIso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const sameDay = (a, b) => a.year === b.year && a.month === b.month && a.day === b.day;
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const firstDow = (y, m) => new Date(y, m, 1).getDay();

const eventsForDate = (iso) => {
  const pto = [];
  ABSENCES.forEach(a => {
    if (a.dates.includes(iso)) {
      pto.push({ kind: "pto", name: a.name, pod: a.pod, category: a.category });
    }
  });
  const coverage = WEEKEND_COVERAGE
    .filter(c => c.date === iso)
    .map(c => ({ kind: "coverage", name: c.name, pod: c.pod }));
  return [...pto, ...coverage];
};

// ============================================================
// COMPONENT
// ============================================================
export default function EmployeeCalendar() {
  const [viewMode, setViewMode] = useState("month");
  const [year, setYear] = useState(TODAY.year);
  const [month, setMonth] = useState(TODAY.month);
  const [justMe, setJustMe] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const [weekAnchor, setWeekAnchor] = useState(() => {
    const todayDt = new Date(TODAY.year, TODAY.month, TODAY.day);
    const anchor = new Date(todayDt);
    anchor.setDate(todayDt.getDate() - todayDt.getDay());
    return { year: anchor.getFullYear(), month: anchor.getMonth(), day: anchor.getDate() };
  });

  const podConf = PODS[ME.pod];

  // Filter: only show employee's pod; if justMe, only own events
  const filterEvents = (events) => events.filter(e => {
    if (e.pod !== ME.pod) return false;
    if (justMe && e.name !== ME.name) return false;
    return true;
  });

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
  };

  const headingLabel = useMemo(() => {
    if (viewMode === "month") {
      return `${MONTH_NAMES[month]} ${year}`;
    }
    const start = new Date(weekAnchor.year, weekAnchor.month, weekAnchor.day);
    const end = new Date(weekAnchor.year, weekAnchor.month, weekAnchor.day + 6);
    const sm = MONTH_NAMES_SHORT[start.getMonth()];
    const em = MONTH_NAMES_SHORT[end.getMonth()];
    if (start.getMonth() === end.getMonth()) {
      return `${sm} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${sm} ${start.getDate()} – ${em} ${end.getDate()}, ${end.getFullYear()}`;
  }, [viewMode, year, month, weekAnchor]);

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
          Pod calendar
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
          {/* Left: nav arrows + heading + view toggle + just-me toggle */}
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
            <button
              className="filter-chip"
              onClick={() => setJustMe(!justMe)}
              style={{
                borderColor: podConf.color,
                background: justMe ? podConf.color : "transparent",
                color: justMe ? "#FFFFFF" : podConf.deep,
              }}
            >
              <span className="dot" style={{ background: justMe ? "#FFFFFF" : podConf.color }} />
              Just me
            </button>
          </div>

          {/* Right: Jump to today + Request */}
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <button className="btn-ghost" onClick={goToday}>Jump to today</button>
            <button className="btn-primary">
              <Plus size={15} />
              Request time off
            </button>
          </div>
        </div>

        {/* Calendar (full width, no sidebar) */}
        <div className="glass" style={{ padding: "1.25rem" }}>
          {viewMode === "month" ? (
            <MonthGrid
              year={year}
              month={month}
              today={TODAY}
              filterEvents={filterEvents}
            />
          ) : (
            <WeekGrid
              anchor={weekAnchor}
              today={TODAY}
              filterEvents={filterEvents}
            />
          )}
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
function MonthGrid({ year, month, today, filterEvents }) {
  const startDow = firstDow(year, month);
  const totalDays = daysInMonth(year, month);
  const prevMonthDays = daysInMonth(year, month - 1 < 0 ? 11 : month - 1);
  const prevMonth = month - 1 < 0 ? 11 : month - 1;
  const prevYear = month - 1 < 0 ? year - 1 : year;
  const nextMonth = month + 1 > 11 ? 0 : month + 1;
  const nextYear = month + 1 > 11 ? year + 1 : year;

  const rowsNeeded = Math.ceil((startDow + totalDays) / 7);
  const targetCells = rowsNeeded * 7;

  const cells = [];
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ year: prevYear, month: prevMonth, day: prevMonthDays - i, outside: true });
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ year, month, day: d, outside: false });
  }
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
          <DayCell key={i} cell={c} today={today} filterEvents={filterEvents} maxChips={3} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// WEEK GRID
// ============================================================
function WeekGrid({ anchor, today, filterEvents }) {
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
          <DayCell key={i} cell={c} today={today} filterEvents={filterEvents} maxChips={8} tall />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DAY CELL
// ============================================================
function DayCell({ cell, today, filterEvents, maxChips, tall }) {
  const iso = toIso(cell.year, cell.month, cell.day);
  const isToday = sameDay(cell, today);
  const isHoliday = !!HOLIDAYS_2026[iso];
  const dow = new Date(cell.year, cell.month, cell.day).getDay();
  const isWeekend = dow === 0 || dow === 6;

  const allEvents = filterEvents(eventsForDate(iso));
  const coverageEvents = allEvents.filter(e => e.kind === "coverage");
  const ptoEvents = isWeekend ? [] : allEvents.filter(e => e.kind === "pto");

  const hasOverflow = ptoEvents.length > maxChips;
  const visiblePto = hasOverflow ? ptoEvents.slice(0, maxChips) : ptoEvents;
  const overflowCount = ptoEvents.length - maxChips;

  const cls = ["cal-day"];
  if (cell.outside) cls.push("outside");
  if (isHoliday && !cell.outside) cls.push("holiday");
  if (isToday) cls.push("today");

  return (
    <div
      className={cls.join(" ")}
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
          {coverageEvents.map((c, i) => {
            const isOwn = c.name === ME.name;
            return (
              <div key={i} style={{ color: PODS[c.pod].deep }}>
                <div style={{
                  fontSize: "0.85rem",
                  fontWeight: isOwn ? 600 : 500,
                  lineHeight: 1.1,
                  textDecoration: isOwn ? "underline" : "none",
                  textUnderlineOffset: "3px",
                  textDecorationThickness: "1.5px",
                }}>
                  {isOwn ? "You" : c.name}
                </div>
                <div style={{ fontSize: "0.65rem", opacity: 0.7, lineHeight: 1, marginTop: "2px" }}>
                  covering
                </div>
              </div>
            );
          })}
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
  const isOwn = event.name === ME.name;
  return (
    <span
      className={`day-chip ${isOwn ? "own" : ""}`}
      style={{
        background: podConf.color,
        borderColor: isOwn ? podConf.deep : podConf.color,
      }}
    >
      {isOwn ? "You" : event.name}
    </span>
  );
}