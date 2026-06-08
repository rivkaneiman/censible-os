import React, { useState, useMemo, useRef, useEffect } from "react";
import { Calendar, X, Info, AlertCircle, Clock, Check, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronDown, Flag, Plus } from "lucide-react";

// ============================================================
// CENSIBLE OS — PTO Request Form (Employee View)
// Mock prototype for visual review. No backend wired up.
// Following censible-os-design-guide.md
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

  /* ----- Orbs (load-bearing for glass refraction) ----- */
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

  /* ----- Glass surface utility ----- */
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

  /* ----- Top nav (floating glass pill) ----- */
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
    color: #231F20;
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
  nav.top .nav-link:hover { color: #231F20; }
  nav.top .nav-link.active {
    background: rgba(230, 240, 244, 0.7);
    color: #2E6E84;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  }

  /* ----- Buttons ----- */
  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 9999px;
    font-weight: 500; font-size: 0.95rem;
    padding: 0.7rem 1.5rem;
    background: linear-gradient(180deg, #2E6E84 0%, #245A6D 100%);
    color: #FAF8F5;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(35, 31, 32, 0.12),
      0 4px 16px rgba(46, 110, 132, 0.2);
    transition: transform 200ms ease, box-shadow 200ms ease;
    cursor: pointer;
    font-family: inherit;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      0 2px 4px rgba(35, 31, 32, 0.15),
      0 8px 24px rgba(46, 110, 132, 0.28);
  }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

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
    cursor: pointer;
    font-family: inherit;
  }
  .btn-ghost:hover { background: rgba(255, 255, 255, 0.75); color: #231F20; }

  /* ----- Modal ----- */
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(35, 31, 32, 0.35);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex; align-items: flex-start; justify-content: center;
    z-index: 1000;
    padding: 4rem 1.5rem 2rem;
    overflow-y: auto;
    animation: modalFadeIn 200ms ease-out;
  }
  @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-panel {
    background: rgba(255, 253, 250, 0.96);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
      0 24px 60px rgba(35, 31, 32, 0.25);
    padding: 1.75rem;
    width: 100%;
    max-width: 600px;
    animation: modalSlideUp 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes modalSlideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .modal-context-tile {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.7rem 0.95rem;
    background: rgba(230, 240, 244, 0.55);
    border: 1px solid rgba(90, 166, 187, 0.2);
    border-radius: 12px;
    margin-bottom: 1.25rem;
  }

  /* ----- Inputs (underlined, editorial) ----- */
  .input-field {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(229, 225, 218, 0.7);
    padding: 0.65rem 0;
    font-size: 1rem;
    color: #231F20;
    font-family: inherit;
    outline: none;
    transition: border-color 200ms;
  }
  .input-field::placeholder { color: #B0ABAC; }
  .input-field:focus { border-bottom-color: #2E6E84; }
  .input-field::-webkit-calendar-picker-indicator {
    opacity: 0.5;
    cursor: pointer;
  }

  .field-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #807A7B;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.15rem;
  }

  /* ----- Progressive disclosure animation ----- */
  /* Animate opacity only - transform creates a stacking context that traps popups */
  .reveal {
    animation: revealIn 280ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes revealIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ----- Misc ----- */
  .chip {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.3rem 0.7rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 500;
    background: rgba(230, 240, 244, 0.85);
    color: #2E6E84;
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.7);
  }

  .toggle-switch {
    position: relative;
    width: 40px; height: 22px;
    background: rgba(176, 171, 172, 0.4);
    border-radius: 9999px;
    cursor: pointer;
    transition: background 200ms;
    flex-shrink: 0;
  }
  .toggle-switch.on { background: #2E6E84; }
  .toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px; left: 2px;
    width: 18px; height: 18px;
    background: white;
    border-radius: 50%;
    transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 1px 2px rgba(0,0,0,0.15);
  }
  .toggle-switch.on::after { transform: translateX(18px); }

  /* Time inputs (native, styled to match) */
  input[type="time"].input-field {
    color: #231F20;
    font-family: inherit;
  }
  input[type="time"].input-field::-webkit-calendar-picker-indicator {
    opacity: 0.5;
    cursor: pointer;
  }

  /* ----- Custom time picker (combobox) ----- */
  .time-picker-wrap { position: relative; width: 140px; }
  .time-picker-wrap .input-field { padding-right: 1.4rem; }
  .time-picker-wrap .chev {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #807A7B;
    pointer-events: none;
  }
  .time-popup-wrap {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    width: 100%;
    z-index: 9999;
    isolation: isolate;
    transform: translateZ(0);
    will-change: transform;
  }
  .time-popup {
    width: 100%;
    min-width: 140px;
    max-height: 200px;
    overflow-y: auto;
    padding: 0.4rem;
    background-color: #FFFFFF;
    border: 1px solid #D5D1CA;
    border-radius: 14px;
    box-shadow:
      0 2px 4px rgba(35, 31, 32, 0.1),
      0 20px 44px rgba(35, 31, 32, 0.22);
    opacity: 1;
  }
  .time-option {
    width: 100%;
    text-align: left;
    padding: 0.4rem 0.6rem;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #231F20;
    cursor: pointer;
    font-family: inherit;
    transition: background 120ms;
  }
  .time-option:hover { background: #E6F0F4; }
  .time-option.selected {
    background: #2E6E84;
    color: #FFFFFF;
    font-weight: 500;
  }

  .date-trigger {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(229, 225, 218, 0.7);
    padding: 0.65rem 0;
    font-size: 1rem;
    color: #231F20;
    font-family: inherit;
    outline: none;
    cursor: pointer;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: border-color 200ms;
  }
  .date-trigger:hover:not(:disabled) { border-bottom-color: #B0ABAC; }
  .date-trigger.open { border-bottom-color: #2E6E84; }
  .date-trigger:disabled { cursor: not-allowed; opacity: 0.5; }
  .date-trigger .placeholder { color: #B0ABAC; }
  .date-trigger .cal-icon { color: #807A7B; flex-shrink: 0; margin-left: 0.5rem; }

  .date-popup {
    position: absolute;
    z-index: 100;
    margin-top: 0.5rem;
    padding: 1rem;
    width: 280px;
    background: #FDFBF7;
    border: 1px solid rgba(229, 225, 218, 0.9);
    border-radius: 20px;
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.9),
      0 1px 2px rgba(35, 31, 32, 0.06),
      0 20px 48px rgba(35, 31, 32, 0.18);
    animation: revealIn 200ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .date-popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.85rem;
  }
  .date-popup-month {
    font-family: 'Fraunces', serif;
    font-size: 1.05rem;
    color: #231F20;
    letter-spacing: -0.01em;
  }
  .date-popup-nav {
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 9999px;
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #4A4546;
    transition: background 200ms;
  }
  .date-popup-nav:hover { background: rgba(255, 255, 255, 0.85); }
  .date-popup-nav:disabled { opacity: 0.3; cursor: not-allowed; }

  .date-popup-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }
  .date-popup-dow {
    font-size: 0.65rem;
    font-weight: 500;
    color: #807A7B;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
    padding: 0.35rem 0;
  }
  .date-popup-day {
    aspect-ratio: 1;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
    font-size: 0.85rem;
    color: #231F20;
    cursor: pointer;
    border: none;
    background: transparent;
    transition: background 150ms, color 150ms;
    font-family: inherit;
  }
  .date-popup-day:hover:not(:disabled):not(.selected) {
    background: rgba(230, 240, 244, 0.7);
  }
  .date-popup-day.today {
    box-shadow: inset 0 0 0 1px rgba(90, 166, 187, 0.55);
  }
  .date-popup-day.selected {
    background: linear-gradient(180deg, #2E6E84 0%, #245A6D 100%);
    color: #FAF8F5;
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      0 2px 6px rgba(46, 110, 132, 0.3);
  }
  .date-popup-day.holiday:not(.selected) {
    color: #2E6E84;
    font-weight: 500;
  }
  .date-popup-day:disabled {
    color: #D5D1CA;
    cursor: not-allowed;
  }
  .date-popup-day.empty { cursor: default; }
`;

// ============================================================
// MOCK DATA
// ============================================================
const TODAY = new Date(2026, 4, 29); // May 29, 2026 — fixed for stable demo

const USER = {
  name: "Sarah Chen",
  firstName: "Sarah",
  pod: "North Pod",
  role: "AD",
};

const BALANCES = [
  { key: "vacation",     label: "Vacation",     remaining: 7, total: 10, pending: 1 },
  { key: "personal",     label: "Personal",     remaining: 5, total: 7,  pending: 0 },
  { key: "holiday",      label: "Holiday",      remaining: 4, total: 4,  pending: 0 },
  { key: "holidayComp",  label: "Holiday comp", remaining: 2, total: 2,  pending: 0 },
];

const NEXT_COVERAGE = {
  workDate: "2026-06-13", // Saturday
  workDay:  "Sat",
  compDate: "2026-06-15", // Following Monday
  compDay:  "Mon",
};

// All of Sarah's weekend coverage assignments (Sat or Sun) and their comp days
// These are read from the Weekend Rotation tool in production.
const MY_WEEKEND_COVERAGE = [
  { workDate: "2026-06-13", workDay: "Sat", compDate: "2026-06-15", compDay: "Mon" },
  { workDate: "2026-08-01", workDay: "Sat", compDate: "2026-08-03", compDay: "Mon" },
  { workDate: "2026-09-05", workDay: "Sat", compDate: "2026-09-07", compDay: "Mon" },
  { workDate: "2026-10-10", workDay: "Sat", compDate: "2026-10-12", compDay: "Mon" },
  { workDate: "2026-11-14", workDay: "Sat", compDate: "2026-11-16", compDay: "Mon" },
];

const PENDING_REQUESTS = [
  { id: "r1", from: "2026-06-25", to: "2026-06-26", days: 2, category: "Vacation", submitted: "2026-05-28" },
  { id: "r2", from: "2026-06-30", to: "2026-06-30", days: 1, category: "Vacation", submitted: "2026-05-29" },
];

// Approved upcoming requests (yours)
const APPROVED_UPCOMING = [
  { id: "a1", from: "2026-06-13", to: "2026-06-15", days: 3, category: "Vacation", decidedBy: "Priya Singh" },
  { id: "a2", from: "2026-06-22", to: "2026-06-22", days: 1, category: "Personal", decidedBy: "Priya Singh" },
];

// Recent decisions - shown as a banner for 48h after decided timestamp
// `decidedAt` is an ISO timestamp; banner shows if (now - decidedAt) < 48h
const RECENT_DECISIONS = [
  { id: "d1", from: "2026-06-22", to: "2026-06-22", days: 1, category: "Personal", status: "approved", decidedBy: "Priya Singh", decidedAt: "2026-05-28T14:23:00" },
  { id: "d2", from: "2026-07-15", to: "2026-07-15", days: 1, category: "Personal", status: "denied", decidedBy: "Priya Singh", decidedAt: "2026-05-29T09:10:00", denyReason: "Pod is short-staffed that week — try the following week" },
];

// Other pod members' approved absences
const POD_ABSENCES = [
  { name: "Mike",  from: "2026-06-10", to: "2026-06-10", type: "Personal" },
  { name: "Jen",   from: "2026-06-15", to: "2026-06-17", type: "Vacation" },
  { name: "Alex",  from: "2026-06-01", to: "2026-06-01", type: "Comp day" },
];

const HOLIDAY_DATES_2026 = [
  "2026-01-01", // New Year's Day
  "2026-05-25", // Memorial Day
  "2026-07-04", // Independence Day
  "2026-09-07", // Labor Day
  "2026-11-26", // Thanksgiving
  "2026-12-25", // Christmas
];

// ============================================================
// HELPERS
// ============================================================
const fmtDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const fmtDateLong = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const daysBetween = (a, b) => {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  const da = new Date(y1, m1 - 1, d1);
  const db = new Date(y2, m2 - 1, d2);
  return Math.round((db - da) / 86400000) + 1;
};

const daysFromToday = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return Math.round((dt - TODAY) / 86400000);
};

const inferCategory = (startIso) => {
  if (!startIso) return null;
  if (HOLIDAY_DATES_2026.includes(startIso)) return "Holiday";
  const diff = daysFromToday(startIso);
  return diff > 21 ? "Vacation" : "Personal";
};

const overlap = (a1, a2, b1, b2) => {
  // Returns true if ranges [a1,a2] and [b1,b2] overlap
  return a1 <= b2 && b1 <= a2;
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

function DatePicker({ value, onChange, min, disabled, placeholder = "Select date" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
  });
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen]);

  const formatDisplay = (iso) => {
    if (!iso) return placeholder;
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const monthsLong = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const lastDay  = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const toIso = (day) => {
    const y = viewMonth.getFullYear();
    const m = viewMonth.getMonth() + 1;
    return `${y}-${String(m).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  };

  const todayIso = `${TODAY.getFullYear()}-${String(TODAY.getMonth()+1).padStart(2,"0")}-${String(TODAY.getDate()).padStart(2,"0")}`;

  const handleDayClick = (day) => {
    const iso = toIso(day);
    if (min && iso < min) return;
    onChange(iso);
    setIsOpen(false);
  };

  // Disable prev nav if we'd go before min's month
  const prevDisabled = useMemo(() => {
    if (!min) return false;
    const [my, mm] = min.split("-").map(Number);
    const minMonth = new Date(my, mm - 1, 1);
    const prev = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
    return prev < minMonth;
  }, [min, viewMonth]);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button
        type="button"
        className={`date-trigger ${isOpen ? "open" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={value ? "" : "placeholder"}>{formatDisplay(value)}</span>
        <Calendar size={16} className="cal-icon" />
      </button>

      {isOpen && (
        <div className="date-popup">
          <div className="date-popup-header">
            <button
              type="button"
              className="date-popup-nav"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              disabled={prevDisabled}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="date-popup-month">
              {monthsLong[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </div>
            <button
              type="button"
              className="date-popup-nav"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="date-popup-grid">
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <div key={i} className="date-popup-dow">{d}</div>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <div key={i} className="date-popup-day empty" />;
              const iso = toIso(day);
              const isMin = min && iso < min;
              const isSelected = value === iso;
              const isToday = iso === todayIso;
              const isHoliday = HOLIDAY_DATES_2026.includes(iso);
              const cls = ["date-popup-day"];
              if (isSelected) cls.push("selected");
              if (isToday && !isSelected) cls.push("today");
              if (isHoliday && !isSelected) cls.push("holiday");
              return (
                <button
                  key={i}
                  type="button"
                  className={cls.join(" ")}
                  disabled={isMin}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TimePicker({ value, onChange, placeholder = "Pick a time" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const wrapperRef = useRef(null);

  // Time options: 6 AM through 8 PM in 30-min increments
  const options = useMemo(() => {
    const opts = [];
    for (let h = 6; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        const value24 = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const period = h >= 12 ? "PM" : "AM";
        const displayH = h === 12 ? 12 : h > 12 ? h - 12 : h;
        const label = `${displayH}:${String(m).padStart(2, "0")} ${period}`;
        opts.push({ value: value24, label });
      }
    }
    return opts;
  }, []);

  const formatLabel = (val) => {
    if (!val) return "";
    const match = options.find(o => o.value === val);
    if (match) return match.label;
    const [hh, mm] = val.split(":").map(Number);
    if (isNaN(hh) || isNaN(mm)) return val;
    const period = hh >= 12 ? "PM" : "AM";
    const displayH = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
    return `${displayH}:${String(mm).padStart(2, "0")} ${period}`;
  };

  const parseTime = (text) => {
    if (!text || !text.trim()) return null;
    const t = text.trim().toUpperCase();
    let m = t.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)?$/);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    let mins = m[2] ? parseInt(m[2], 10) : 0;
    const period = m[3];
    if (isNaN(h) || isNaN(mins) || h < 0 || h > 23 || mins < 0 || mins > 59) return null;
    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  useEffect(() => {
    setInputText(formatLabel(value));
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        const parsed = parseTime(inputText);
        if (parsed) onChange(parsed);
        else setInputText(formatLabel(value));
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen, inputText, value, onChange]);

  const handleSelect = (opt) => {
    onChange(opt.value);
    setInputText(opt.label);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const parsed = parseTime(inputText);
      if (parsed) onChange(parsed);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setInputText(formatLabel(value));
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="time-picker-wrap">
      <input
        type="text"
        className="input-field"
        value={inputText}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onChange={e => { setInputText(e.target.value); setIsOpen(true); }}
        onKeyDown={handleKeyDown}
      />
      <ChevronDown size={14} className="chev" />
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          width: "100%",
          zIndex: 9999,
          isolation: "isolate",
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #D5D1CA",
            borderRadius: "14px",
            boxShadow: "0 2px 4px rgba(35, 31, 32, 0.1), 0 20px 44px rgba(35, 31, 32, 0.22)",
            overflow: "hidden",
          }}>
            <div style={{
              backgroundColor: "#FFFFFF",
              maxHeight: "200px",
              overflowY: "auto",
              padding: "6px",
            }}>
              {options.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => handleSelect(opt)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "6px 10px",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      backgroundColor: isSelected ? "#2E6E84" : "#FFFFFF",
                      color: isSelected ? "#FFFFFF" : "#231F20",
                      fontWeight: isSelected ? 500 : 400,
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#E6F0F4";
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#FFFFFF";
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BalanceTile({ label, remaining, total, pending }) {
  return (
    <div className="glass" style={{
      padding: "1rem 1.1rem",
      flex: "1 1 140px",
      minWidth: "130px",
    }}>
      <div style={{
        fontSize: "0.7rem",
        fontWeight: 500,
        color: "#807A7B",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        marginBottom: "0.5rem",
      }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.2rem" }}>
        <span className="display-heading" style={{ fontSize: "1.8rem", color: "#231F20", lineHeight: 1 }}>
          {remaining}
        </span>
        <span style={{ fontSize: "0.85rem", color: "#807A7B", fontWeight: 400, marginRight: "0.2rem" }}>
          /{total}
        </span>
        <span style={{ fontSize: "0.95rem", color: "#231F20", fontWeight: 400 }}>available</span>
      </div>
      <div style={{
        fontSize: "0.72rem",
        color: "#2E6E84",
        marginTop: "0.35rem",
        minHeight: "0.9rem",
      }}>
        {pending > 0 ? `${pending} pending` : "\u00A0"}
      </div>
    </div>
  );
}

function CoverageTile({ workDate, workDay, compDate, compDay }) {
  const [y, m, d] = workDate.split("-").map(Number);
  const [, cm, cd] = compDate.split("-").map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Weeks from today, rounded to nearest week
  const workDt = new Date(y, m - 1, d);
  const diffDays = Math.round((workDt - TODAY) / 86400000);
  const weeks = Math.max(0, Math.round(diffDays / 7));
  const weekLabel = weeks === 0 ? "this week"
                  : weeks === 1 ? "in 1 week"
                  : `in ${weeks} weeks`;

  return (
    <div className="glass" style={{
      padding: "1rem 1.1rem",
      flex: "1 1 140px",
      minWidth: "130px",
    }}>
      <div style={{
        fontSize: "0.7rem",
        fontWeight: 500,
        color: "#807A7B",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        marginBottom: "0.5rem",
      }}>Upcoming weekend coverage</div>
      <div className="display-heading" style={{ fontSize: "1.35rem", color: "#231F20", lineHeight: 1.1 }}>
        {workDay} {months[m-1]} {d}
        <span style={{
          fontFamily: "'Geist', system-ui, sans-serif",
          fontSize: "0.78rem",
          fontWeight: 400,
          color: "#807A7B",
          marginLeft: "0.4rem",
          letterSpacing: 0,
        }}>({weekLabel})</span>
      </div>
      <div style={{
        fontSize: "0.72rem",
        color: "#2E6E84",
        marginTop: "0.35rem",
      }}>
        comp: {compDay} {months[cm-1]} {cd}
      </div>
    </div>
  );
}

function CategoryBadge({ category, explainer }) {
  return (
    <div className="reveal" style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
      <span className="chip">{category}</span>
      <span style={{ fontSize: "0.8rem", color: "#807A7B" }}>{explainer}</span>
    </div>
  );
}

function InfoLine({ icon: Icon, text, tone = "neutral" }) {
  const colors = {
    neutral: "#4A4546",
    info:    "#2E6E84",
    warn:    "#B91C1C",
  };
  const bg = {
    neutral: "transparent",
    info:    "rgba(230, 240, 244, 0.55)",
    warn:    "rgba(185, 28, 28, 0.06)",
  };
  return (
    <div className="reveal" style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "0.6rem",
      padding: tone === "neutral" ? "0" : "0.7rem 0.9rem",
      background: bg[tone],
      borderRadius: "12px",
      color: colors[tone],
      fontSize: "0.875rem",
      lineHeight: 1.45,
    }}>
      <Icon size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
      <span>{text}</span>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function PTORequestForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayStart, setHalfDayStart] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(PENDING_REQUESTS);

  // Use endDate or startDate as the effective end
  const effectiveEnd = endDate || startDate;

  const datesValid = startDate && (!endDate || endDate >= startDate);

  const daysRequested = useMemo(() => {
    if (!datesValid) return 0;
    const base = daysBetween(startDate, effectiveEnd);
    return isHalfDay && base === 1 ? 0.5 : base;
  }, [startDate, effectiveEnd, isHalfDay, datesValid]);

  const category = useMemo(() => inferCategory(startDate), [startDate]);

  const daysOutFromToday = startDate ? daysFromToday(startDate) : null;

  // Half-day eligibility: vacation or personal, single day
  const halfDayEligible = useMemo(() => {
    if (!startDate) return false;
    if (category !== "Vacation" && category !== "Personal") return false;
    if (endDate && endDate !== startDate) return false;
    return true;
  }, [startDate, endDate, category]);

  // Reset half-day if it becomes ineligible
  React.useEffect(() => {
    if (!halfDayEligible && isHalfDay) setIsHalfDay(false);
  }, [halfDayEligible, isHalfDay]);

  // Clear time field when half-day is toggled off
  React.useEffect(() => {
    if (!isHalfDay) {
      setHalfDayStart("");
    }
  }, [isHalfDay]);

  // Compute implied end time (start + 4 hours)
  const halfDayEndDisplay = useMemo(() => {
    if (!halfDayStart) return "";
    const [hh, mm] = halfDayStart.split(":").map(Number);
    const totalMins = hh * 60 + mm + 240;
    const endH = Math.floor(totalMins / 60) % 24;
    const endM = totalMins % 60;
    const period = endH >= 12 ? "PM" : "AM";
    const displayH = endH === 0 ? 12 : endH > 12 ? endH - 12 : endH;
    return `${displayH}:${String(endM).padStart(2, "0")} ${period}`;
  }, [halfDayStart]);

  // Balance check
  const balanceForCategory = useMemo(() => {
    if (!category) return null;
    const key = category === "Vacation" ? "vacation"
              : category === "Personal" ? "personal"
              : category === "Holiday"  ? "holiday"
              : null;
    return BALANCES.find(b => b.key === key);
  }, [category]);

  const remainingAfter = balanceForCategory
    ? balanceForCategory.remaining - balanceForCategory.pending - daysRequested
    : null;

  const insufficient = remainingAfter !== null && remainingAfter < 0;

  // Pod conflicts
  const podConflicts = useMemo(() => {
    if (!datesValid) return [];
    return POD_ABSENCES.filter(a =>
      overlap(startDate, effectiveEnd, a.from, a.to)
    );
  }, [startDate, effectiveEnd, datesValid]);

  // Weekend coverage conflicts — overlap with Sarah's own scheduled weekends or comp days
  const coverageConflicts = useMemo(() => {
    if (!datesValid) return [];
    return MY_WEEKEND_COVERAGE.filter(c =>
      overlap(startDate, effectiveEnd, c.workDate, c.workDate) ||
      overlap(startDate, effectiveEnd, c.compDate, c.compDate)
    ).map(c => {
      // Determine which kind of conflict it is
      const workHit = overlap(startDate, effectiveEnd, c.workDate, c.workDate);
      const compHit = overlap(startDate, effectiveEnd, c.compDate, c.compDate);
      return { ...c, workHit, compHit };
    });
  }, [startDate, effectiveEnd, datesValid]);

  // Boundary-span check (multi-day request where first is personal but it spans the 3-week line)
  const boundarySpan = useMemo(() => {
    if (!datesValid || category !== "Personal") return false;
    if (effectiveEnd === startDate) return false;
    const endDaysOut = daysFromToday(effectiveEnd);
    return endDaysOut > 21;
  }, [startDate, effectiveEnd, category, datesValid]);

  // Greeting
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Recent decisions: show only those within 48h, minus any dismissed
  const [dismissedDecisions, setDismissedDecisions] = useState(new Set());
  const visibleDecisions = useMemo(() => {
    const cutoffMs = TODAY.getTime() - 48 * 60 * 60 * 1000;
    return RECENT_DECISIONS.filter(d => {
      if (dismissedDecisions.has(d.id)) return false;
      const decidedMs = new Date(d.decidedAt).getTime();
      return decidedMs >= cutoffMs;
    });
  }, [dismissedDecisions]);
  const dismissDecision = (id) => {
    setDismissedDecisions(new Set([...dismissedDecisions, id]));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Close modal after a brief moment so user sees the success state
    setTimeout(() => {
      setShowRequestModal(false);
      setSubmitted(false);
      resetForm();
    }, 1400);
  };

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setIsHalfDay(false);
    setHalfDayStart("");
    setReason("");
  };

  const openRequestModal = () => {
    resetForm();
    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setSubmitted(false);
  };

  return (
    <div className="censible-root">
      <style>{STYLES}</style>

      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Top nav (platform shell context) */}
      <nav className="top">
        <div className="brand">Censible OS</div>
        <div className="nav-links">
          <div className="nav-link active">Time off</div>
          <div className="nav-link">Calendar</div>
        </div>
      </nav>

      {/* Page content */}
      <main style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "640px",
        margin: "0 auto",
        padding: "2rem 1.5rem 4rem",
      }}>
        {/* Greeting */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}>
          <h1 className="display-heading" style={{ fontSize: "2.5rem", margin: 0 }}>
            {greeting}, {USER.firstName}
          </h1>
          <button className="btn-primary" onClick={openRequestModal} style={{ gap: "0.4rem", flexShrink: 0 }}>
            <Plus size={16} />
            Request time off
          </button>
        </div>

        {/* Recent decisions banner */}
        {visibleDecisions.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {visibleDecisions.map(d => (
              <DecisionBanner key={d.id} decision={d} onDismiss={() => dismissDecision(d.id)} />
            ))}
          </div>
        )}

        {/* Balance strip */}
        <div style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}>
          {BALANCES.map(b => (
            <BalanceTile key={b.key} {...b} />
          ))}
          <CoverageTile {...NEXT_COVERAGE} />
        </div>

        {/* Request modal */}
        {showRequestModal && (
          <div className="modal-backdrop" onClick={closeRequestModal}>
            <div className="modal-panel" style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
              {/* Close button */}
              <button
                onClick={closeRequestModal}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: "1.1rem",
                  right: "1.1rem",
                  background: "transparent",
                  border: "none",
                  padding: "0.4rem",
                  borderRadius: "50%",
                  cursor: "pointer",
                  color: "#807A7B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 150ms, color 150ms",
                  zIndex: 5,
                }}
                onMouseOver={e => { e.currentTarget.style.background = "rgba(229, 225, 218, 0.6)"; e.currentTarget.style.color = "#231F20"; }}
                onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#807A7B"; }}
              >
                <X size={18} />
              </button>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
                gap: "0.75rem",
                minHeight: "2rem",
                paddingRight: "2rem",
              }}>
                <h2 className="display-heading" style={{ fontSize: "1.5rem", margin: 0 }}>
                  Request time off
                </h2>
                {datesValid && (
                  <div className="reveal" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="chip">{category}</span>
                    <span style={{ fontSize: "0.95rem", color: "#231F20" }}>
                      · {daysRequested} day{daysRequested === 1 ? "" : "s"}
                    </span>
                  </div>
                )}
              </div>

              {/* Balance context tile - appears when category is known */}
              {datesValid && balanceForCategory && (
                <div className="modal-context-tile reveal">
                  <span className="display-heading" style={{ fontSize: "1.4rem", color: "#231F20", lineHeight: 1 }}>
                    {balanceForCategory.remaining}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#807A7B" }}>
                    of {balanceForCategory.total} {balanceForCategory.label.toLowerCase()} days available
                  </span>
                  {balanceForCategory.pending > 0 && (
                    <span style={{ fontSize: "0.72rem", color: "#2E6E84", marginLeft: "auto" }}>
                      {balanceForCategory.pending} pending
                    </span>
                  )}
                </div>
              )}

          {/* Date inputs */}
          <div style={{
            display: "flex",
            gap: "1.5rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 200,
          }}>
            <div style={{ flex: "1 1 180px" }}>
              <label className="field-label">From</label>
              <DatePicker
                value={startDate}
                min="2026-05-29"
                onChange={(iso) => {
                  setStartDate(iso);
                  if (endDate && endDate < iso) setEndDate("");
                }}
                placeholder="Pick a date"
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label className="field-label">To</label>
              <DatePicker
                value={endDate}
                min={startDate || "2026-05-29"}
                disabled={!startDate}
                onChange={setEndDate}
                placeholder={startDate ? "Same day" : "Pick start first"}
              />
            </div>
          </div>

          {/* Progressive disclosure */}
          {datesValid && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Insufficient balance warning (only when over) */}
              {balanceForCategory && insufficient && (
                <InfoLine
                  icon={AlertCircle}
                  tone="warn"
                  text={`Over by ${Math.abs(remainingAfter)} — admin will review.`}
                />
              )}

              {/* Weekend coverage conflict (requires swap) */}
              {coverageConflicts.length > 0 && (
                <div className="reveal" style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                  padding: "0.8rem 1rem",
                  background: "rgba(194, 135, 108, 0.1)",
                  border: "1px solid rgba(194, 135, 108, 0.35)",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  color: "#8C5A45",
                  lineHeight: 1.5,
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontWeight: 500, color: "#231F20", marginBottom: "0.2rem" }}>
                      You're scheduled to cover a weekend during this time
                    </div>
                    <div style={{ color: "#4A4546" }}>
                      {coverageConflicts.map((c, i) => (
                        <span key={i}>
                          {c.workHit && (
                            <>You're covering <strong style={{ fontWeight: 500, color: "#231F20" }}>{c.workDay} {fmtDate(c.workDate)}</strong></>
                          )}
                          {c.workHit && c.compHit && " and have "}
                          {!c.workHit && c.compHit && "Your "}
                          {c.compHit && (
                            <>comp day <strong style={{ fontWeight: 500, color: "#231F20" }}>{c.compDay} {fmtDate(c.compDate)}</strong>{!c.workHit && " is during this time"}</>
                          )}
                          {i < coverageConflicts.length - 1 ? "; " : ""}
                        </span>
                      ))}
                      . Coordinate a swap with your admin before submitting.
                    </div>
                  </div>
                </div>
              )}

              {/* Pod conflicts (flagged) */}
              {podConflicts.length > 0 && (
                <div className="reveal" style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                  padding: "0.7rem 0.9rem",
                  background: "rgba(230, 240, 244, 0.7)",
                  border: "1px solid rgba(90, 166, 187, 0.25)",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  color: "#2E6E84",
                  lineHeight: 1.5,
                }}>
                  <Flag size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <span style={{ fontWeight: 500 }}>Also off in your pod: </span>
                    {podConflicts.map((c, i) => (
                      <span key={i}>
                        <strong style={{ fontWeight: 500, color: "#231F20" }}>{c.name}</strong>{" "}
                        <span style={{ color: "#4A4546" }}>
                          {c.from === c.to ? fmtDate(c.from) : `${fmtDate(c.from)}–${fmtDate(c.to)}`}
                        </span>
                        {i < podConflicts.length - 1 ? <span style={{ color: "#807A7B" }}> · </span> : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Half-day toggle + time picker (conditional) */}
              {halfDayEligible && (
                <div className="reveal" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                  padding: "0.75rem 0",
                  borderTop: "1px solid rgba(229, 225, 218, 0.5)",
                  borderBottom: "1px solid rgba(229, 225, 218, 0.5)",
                  position: "relative",
                  zIndex: 100,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                    <div style={{ fontSize: "0.95rem", color: "#231F20" }}>Half day?</div>
                    <div
                      className={`toggle-switch ${isHalfDay ? "on" : ""}`}
                      onClick={() => setIsHalfDay(!isHalfDay)}
                      role="switch"
                      aria-checked={isHalfDay}
                    />
                  </div>
                  {isHalfDay && (
                    <div className="reveal" style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}>
                      <span style={{ fontSize: "0.8rem", color: "#807A7B" }}>starts</span>
                      <TimePicker value={halfDayStart} onChange={setHalfDayStart} placeholder="Start time" />
                      {halfDayEndDisplay && (
                        <span style={{ fontSize: "0.8rem", color: "#807A7B" }}>
                          ends {halfDayEndDisplay}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Reason (no label, hint in placeholder) */}
              <div className="reveal">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Reason — e.g., family wedding"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>

              {/* Submit row */}
              <div className="reveal" style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button className="btn-ghost" onClick={closeRequestModal}>Cancel</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={submitted}>
                  {submitted ? (<><Check size={16} style={{ marginRight: "0.4rem" }} />Submitted</>) : "Submit request"}
                </button>
              </div>
            </div>
          )}
            </div>
          </div>
        )}

        {/* Your time off */}
        {(pendingRequests.length > 0 || APPROVED_UPCOMING.length > 0) && (
          <div className="glass" style={{ padding: "1.5rem 1.75rem", position: "relative", zIndex: 10 }}>
            <h2 className="display-heading" style={{ fontSize: "1.35rem", margin: "0 0 1.25rem" }}>
              Your time off
            </h2>

            {pendingRequests.length > 0 && (
              <div style={{ marginBottom: APPROVED_UPCOMING.length > 0 ? "1.5rem" : 0 }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "0.5rem",
                }}>
                  <Clock size={13} color="#807A7B" />
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    color: "#807A7B",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}>
                    Pending
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {pendingRequests.map((r, i) => (
                    <div key={r.id} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.7rem 0",
                      borderTop: i === 0 ? "none" : "1px solid rgba(229, 225, 218, 0.5)",
                    }}>
                      <div>
                        <div style={{ fontSize: "0.95rem", color: "#231F20" }}>
                          {r.from === r.to ? fmtDateLong(r.from) : `${fmtDate(r.from)} – ${fmtDate(r.to)}`}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#807A7B", marginTop: "2px" }}>
                          {r.days} day{r.days > 1 ? "s" : ""} · {r.category}
                        </div>
                      </div>
                      <button
                        onClick={() => setPendingCancelId(r.id)}
                        style={{
                        background: "none",
                        border: "none",
                        color: "#807A7B",
                        cursor: "pointer",
                        padding: "0.4rem",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 200ms, color 200ms",
                        fontFamily: "inherit",
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = "rgba(185, 28, 28, 0.08)"; e.currentTarget.style.color = "#B91C1C"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#807A7B"; }}
                      title="Cancel request"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {APPROVED_UPCOMING.length > 0 && (
              <div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "0.5rem",
                }}>
                  <CheckCircle2 size={13} color="#2E7D32" />
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    color: "#807A7B",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}>
                    Approved · coming up
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {APPROVED_UPCOMING.map((r, i) => (
                    <div key={r.id} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.7rem 0",
                      borderTop: i === 0 ? "none" : "1px solid rgba(229, 225, 218, 0.5)",
                    }}>
                      <div>
                        <div style={{ fontSize: "0.95rem", color: "#231F20" }}>
                          {r.from === r.to ? fmtDateLong(r.from) : `${fmtDate(r.from)} – ${fmtDate(r.to)}`}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#807A7B", marginTop: "2px" }}>
                          {r.days} day{r.days > 1 ? "s" : ""} · {r.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View request history link inside card */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(229, 225, 218, 0.5)",
            }}>
              <button style={{
                background: "transparent",
                border: "none",
                color: "#2E6E84",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontFamily: "inherit",
                padding: "0.3rem 0.5rem",
                borderRadius: "8px",
                transition: "background 150ms",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(230, 240, 244, 0.6)"}
              onMouseOut={e => e.currentTarget.style.background = "transparent"}
              >
                View request history
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Cancel confirmation modal */}
      {pendingCancelId && (() => {
        const r = pendingRequests.find(x => x.id === pendingCancelId);
        if (!r) return null;
        const dateLabel = r.from === r.to ? fmtDateLong(r.from) : `${fmtDate(r.from)} – ${fmtDate(r.to)}`;
        return (
          <div className="modal-backdrop" onClick={() => setPendingCancelId(null)}>
            <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px" }}>
              <h2 className="display-heading" style={{ fontSize: "1.4rem", margin: "0 0 0.5rem" }}>
                Cancel this request?
              </h2>
              <p style={{ color: "#4A4546", fontSize: "0.92rem", margin: "0 0 0.4rem", lineHeight: 1.5 }}>
                <strong style={{ color: "#231F20", fontWeight: 500 }}>{dateLabel}</strong>
                <span style={{ color: "#807A7B" }}>
                  {" — "}{r.days} day{r.days === 1 ? "" : "s"} · {r.category}
                </span>
              </p>
              <p style={{ color: "#807A7B", fontSize: "0.88rem", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
                This will withdraw the request. You'll need to submit a new one if you change your mind.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
                <button className="btn-ghost" onClick={() => setPendingCancelId(null)}>Keep request</button>
                <button
                  onClick={() => {
                    setPendingRequests(pendingRequests.filter(x => x.id !== pendingCancelId));
                    setPendingCancelId(null);
                  }}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "9999px",
                    fontWeight: 500, fontSize: "0.9rem",
                    padding: "0.55rem 1.2rem",
                    background: "linear-gradient(180deg, #B91C1C 0%, #991B1B 100%)",
                    color: "#FAF8F5",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.3), 0 1px 2px rgba(35, 31, 32, 0.12), 0 4px 16px rgba(185, 28, 28, 0.2)",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Cancel request
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ============================================================
// RECENT DECISION BANNER
// ============================================================
function DecisionBanner({ decision, onDismiss }) {
  const isApproved = decision.status === "approved";
  const accent = isApproved ? "#2E7D32" : "#B91C1C";
  const accentBg = isApproved ? "rgba(46, 125, 50, 0.08)" : "rgba(185, 28, 28, 0.06)";
  const accentBorder = isApproved ? "rgba(46, 125, 50, 0.25)" : "rgba(185, 28, 28, 0.22)";

  const dateLabel = decision.from === decision.to
    ? fmtDateLong(decision.from)
    : `${fmtDate(decision.from)} – ${fmtDate(decision.to)}`;

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "0.85rem",
      padding: "0.85rem 1.1rem",
      background: accentBg,
      border: `1px solid ${accentBorder}`,
      borderRadius: "14px",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "1px", flexShrink: 0 }}>
        {isApproved
          ? <CheckCircle2 size={18} color={accent} />
          : <XCircle size={18} color={accent} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.92rem", color: "#231F20", lineHeight: 1.4 }}>
          <span style={{ fontWeight: 500, color: accent }}>
            {isApproved ? "Approved" : "Denied"}
          </span>
          {" — "}
          {dateLabel}
          <span style={{ color: "#807A7B" }}>
            {" · "}{decision.days} day{decision.days > 1 ? "s" : ""} · {decision.category}
          </span>
        </div>
        {!isApproved && decision.denyReason && (
          <div style={{ fontSize: "0.82rem", color: "#4A4546", marginTop: "0.35rem", lineHeight: 1.45 }}>
            {decision.denyReason}
          </div>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: "transparent",
          border: "none",
          padding: "0.3rem",
          cursor: "pointer",
          color: "#807A7B",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 150ms, color 150ms",
        }}
        onMouseOver={e => { e.currentTarget.style.background = "rgba(35, 31, 32, 0.06)"; e.currentTarget.style.color = "#231F20"; }}
        onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#807A7B"; }}
      >
        <X size={14} />
      </button>
    </div>
  );
}