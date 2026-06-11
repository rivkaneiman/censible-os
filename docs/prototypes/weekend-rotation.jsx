import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, ChevronDown, X, Plus, GripVertical, AlertCircle, Check, Calendar as CalIcon
} from "lucide-react";

// ============================================================
// CENSIBLE OS — Weekend Rotation Setup & Management
// ============================================================

const TODAY = { year: 2026, month: 4, day: 29 }; // May 29, 2026

const POD_COLORS = {
  "North": { color: "#5AA6BB", deep: "#2E6E84", light: "rgba(90, 166, 187, 0.18)" },
  "South": { color: "#C2876C", deep: "#8C5A45", light: "rgba(194, 135, 108, 0.18)" },
  "East":  { color: "#9BAB85", deep: "#6B7E5B", light: "rgba(155, 171, 133, 0.18)" },
};

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
    position: fixed; border-radius: 50%; filter: blur(80px);
    z-index: 0; pointer-events: none;
  }
  .orb-1 { top: -10%; left: -5%;  width: 500px; height: 500px;
           background: rgba(90, 166, 187, 0.28); }
  .orb-2 { top: 30%;  right: -8%; width: 600px; height: 600px;
           background: rgba(46, 110, 132, 0.18); }
  .orb-3 { bottom: -15%; left: 25%; width: 550px; height: 550px;
           background: rgba(180, 200, 170, 0.22); }

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

  nav.top {
    position: sticky; top: 0; z-index: 50;
    margin: 1rem 1rem 0;
    padding: 0.75rem 1.5rem;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(250, 248, 245, 0.55);
    backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 9999px;
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
      0 4px 24px rgba(35, 31, 32, 0.05);
  }
  nav.top .brand { font-family: 'Fraunces', serif; font-size: 1.05rem; letter-spacing: -0.01em; }
  nav.top .nav-links { display: flex; gap: 0.5rem; align-items: center; }
  nav.top .nav-link {
    padding: 0.4rem 0.9rem; font-size: 0.875rem; color: #4A4546;
    border-radius: 9999px; cursor: pointer;
    transition: background 200ms, color 200ms;
  }
  nav.top .nav-link:hover { background: rgba(255, 255, 255, 0.4); color: #231F20; }
  nav.top .nav-link.active {
    background: rgba(230, 240, 244, 0.7); color: #2E6E84;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  }

  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 9999px; font-weight: 500; font-size: 0.9rem;
    padding: 0.55rem 1.2rem;
    background: linear-gradient(180deg, #2E6E84 0%, #245A6D 100%);
    color: #FAF8F5;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      0 1px 2px rgba(35, 31, 32, 0.12),
      0 4px 16px rgba(46, 110, 132, 0.2);
    transition: transform 200ms ease, box-shadow 200ms ease;
    cursor: pointer; font-family: inherit; gap: 0.35rem;
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
    border-radius: 9999px; font-weight: 500; font-size: 0.875rem;
    padding: 0.5rem 1.1rem;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    color: #4A4546;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
    transition: background 200ms, color 200ms;
    cursor: pointer; font-family: inherit; gap: 0.35rem;
  }
  .btn-ghost:hover { background: rgba(255, 255, 255, 0.85); color: #231F20; }

  .icon-btn {
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 9999px;
    width: 34px; height: 34px;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; color: #4A4546;
    transition: background 200ms;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  }
  .icon-btn:hover { background: rgba(255, 255, 255, 0.85); color: #231F20; }

  /* Roster cards */
  .roster-card {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.55rem 0.7rem 0.55rem 0.45rem;
    background: rgba(255, 253, 250, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    cursor: grab;
    user-select: none;
    transition: transform 150ms ease, box-shadow 150ms ease, opacity 150ms;
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.65),
      0 1px 2px rgba(35, 31, 32, 0.04);
  }
  .roster-card:hover {
    background: rgba(255, 253, 250, 0.9);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
      0 2px 4px rgba(35, 31, 32, 0.08);
  }
  .roster-card:active { cursor: grabbing; }
  .roster-card.dragging { opacity: 0.4; }
  .roster-card .grip { color: #B0ABAC; flex-shrink: 0; }
  .roster-card .pod-dot {
    width: 7px; height: 7px; border-radius: 50%;
    flex-shrink: 0;
  }
  .roster-card .name {
    font-size: 0.85rem; color: #231F20; flex: 1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .roster-card .order-num {
    font-family: 'Fraunces', serif;
    font-size: 0.85rem;
    color: #807A7B;
    width: 18px;
    text-align: right;
    flex-shrink: 0;
  }

  .drop-zone {
    border-radius: 14px;
    transition: background 150ms, border-color 150ms;
    border: 1.5px dashed transparent;
  }
  .drop-zone.over {
    background: rgba(90, 166, 187, 0.1);
    border-color: rgba(90, 166, 187, 0.4);
  }

  /* Calendar */
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
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    padding: 0.4rem 0.45rem;
    min-height: 95px;
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
  .cal-day.weekend {
    background: rgba(255, 253, 250, 0.6);
  }
  .cal-day.today { border-color: #5AA6BB; border-width: 1.5px; }
  .cal-day-num {
    color: #4A4546;
    font-size: 0.78rem;
    font-weight: 500;
    margin-bottom: 0.3rem;
  }
  .cal-day.today .cal-day-num { color: #2E6E84; font-weight: 600; }

  /* Weekend assignment chip (draggable) */
  .weekend-chip {
    display: block;
    padding: 4px 7px;
    border-radius: 7px;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: grab;
    user-select: none;
    transition: transform 150ms ease, box-shadow 150ms ease, opacity 150ms;
    border: 1.5px solid;
    color: #FFFFFF;
    line-height: 1.2;
  }
  .weekend-chip:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(35, 31, 32, 0.12);
  }
  .weekend-chip:active { cursor: grabbing; }
  .weekend-chip.dragging { opacity: 0.4; }
  .weekend-chip.drag-over {
    box-shadow: 0 0 0 2.5px #FAF8F5, 0 0 0 4px #2E6E84;
  }

  /* Comp day note */
  .comp-note {
    font-size: 0.65rem;
    color: #807A7B;
    font-style: italic;
    line-height: 1.25;
    margin-top: 2px;
  }
  .comp-day-cell .comp-tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 5px;
    font-size: 0.66rem;
    font-weight: 500;
    background: rgba(46, 125, 50, 0.1);
    color: #2E7D32;
    border: 1px solid rgba(46, 125, 50, 0.25);
  }

  /* Status badge for dirty roster */
  .preview-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.3rem 0.7rem;
    background: rgba(46, 110, 132, 0.1);
    color: #2E6E84;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(46, 110, 132, 0.25);
  }
`;

// ============================================================
// MOCK DATA
// ============================================================
const AD_EMPLOYEES = [
  { id: 1, name: "Alex Rivera",  pod: "North" },
  { id: 2, name: "Casey Wong",   pod: "North" },
  { id: 3, name: "Jen Liu",      pod: "North" },
  { id: 4, name: "Mike Park",    pod: "North" },
  { id: 5, name: "Sarah Chen",   pod: "North" },
  { id: 6, name: "Dev Patel",    pod: "South" },
  { id: 7, name: "Lena Park",    pod: "South" },
  { id: 8, name: "Marcus Hill",  pod: "South" },
  { id: 9, name: "Priya Singh",  pod: "South" },
  { id: 10, name: "Riley Brooks", pod: "South" },
  { id: 11, name: "Avery Lopez",  pod: "East" },
  { id: 12, name: "Jordan Kim",   pod: "East" },
  { id: 13, name: "Morgan Diaz",  pod: "East" },
  { id: 14, name: "Quinn Foster", pod: "East" },
  { id: 15, name: "Sam Walker",   pod: "East" },
];

// Initial roster — 10 of the 15 ADs, in order
const INITIAL_ROSTER_IDS = [5, 4, 3, 1, 9, 6, 8, 11, 15, 14];
// (Sarah, Mike, Jen, Alex, Priya, Dev, Marcus, Avery, Sam, Quinn)

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_NAMES_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ============================================================
// HELPERS
// ============================================================
const pad = (n) => String(n).padStart(2, "0");
const toIso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const sameDay = (a, b) => a.year === b.year && a.month === b.month && a.day === b.day;
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const firstDow = (y, m) => new Date(y, m, 1).getDay();

// Get all Saturdays and Sundays in 2026 in order
function getYearWeekends(year) {
  const weekends = [];
  for (let m = 0; m < 12; m++) {
    const days = daysInMonth(year, m);
    for (let d = 1; d <= days; d++) {
      const dow = new Date(year, m, d).getDay();
      if (dow === 0 || dow === 6) {
        weekends.push({ iso: toIso(year, m, d), isSat: dow === 6 });
      }
    }
  }
  return weekends;
}

// Generate assignments by cycling through the roster
function generateAssignments(rosterIds, year) {
  const weekends = getYearWeekends(year);
  const assignments = {};
  rosterIds.forEach((id, i) => {}); // no-op
  if (rosterIds.length === 0) return assignments;
  let cursor = 0;
  weekends.forEach(w => {
    assignments[w.iso] = rosterIds[cursor % rosterIds.length];
    cursor++;
  });
  return assignments;
}

// Comp day map: for each weekend assignment, derive comp day
// Sat → following Mon; Sun → prior Fri
function deriveCompDays(assignments) {
  const comp = {};
  Object.entries(assignments).forEach(([iso, empId]) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    const dow = dt.getDay();
    if (dow === 6) {
      // Saturday → Monday off
      const mon = new Date(dt);
      mon.setDate(dt.getDate() + 2);
      comp[toIso(mon.getFullYear(), mon.getMonth(), mon.getDate())] = empId;
    } else if (dow === 0) {
      // Sunday → Friday before off
      const fri = new Date(dt);
      fri.setDate(dt.getDate() - 2);
      comp[toIso(fri.getFullYear(), fri.getMonth(), fri.getDate())] = empId;
    }
  });
  return comp;
}

// First initials for compact display
const firstName = (full) => full.split(" ")[0];

// ============================================================
// MAIN
// ============================================================
export default function WeekendRotation() {
  // Roster state
  const allIds = new Set(AD_EMPLOYEES.map(e => e.id));
  const initialActive = INITIAL_ROSTER_IDS;
  const initialEligible = [...allIds].filter(id => !INITIAL_ROSTER_IDS.includes(id));

  const [rosterActive, setRosterActive] = useState(initialActive);
  const [rosterEligible, setRosterEligible] = useState(initialEligible);
  const [savedRoster, setSavedRoster] = useState(initialActive);

  // Assignments — generated from the SAVED roster
  const [assignments, setAssignments] = useState(() => generateAssignments(initialActive, 2026));

  // Live preview assignments — what would generate from the CURRENT (possibly dirty) roster
  const previewAssignments = useMemo(
    () => generateAssignments(rosterActive, 2026),
    [rosterActive]
  );

  // Display assignments: live preview if roster dirty, else saved
  const isRosterDirty = useMemo(() => {
    if (rosterActive.length !== savedRoster.length) return true;
    return rosterActive.some((id, i) => id !== savedRoster[i]);
  }, [rosterActive, savedRoster]);

  const displayedAssignments = isRosterDirty ? previewAssignments : assignments;
  const compDays = useMemo(() => deriveCompDays(displayedAssignments), [displayedAssignments]);

  // Calendar nav
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5); // June default — has lots of weekend data near demo TODAY

  // Drag state
  const [draggingRosterId, setDraggingRosterId] = useState(null);
  const [draggingRosterFrom, setDraggingRosterFrom] = useState(null); // "active" | "eligible"
  const [dropTargetSection, setDropTargetSection] = useState(null);

  const [draggingDate, setDraggingDate] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  const employeeById = useMemo(() => {
    const map = {};
    AD_EMPLOYEES.forEach(e => { map[e.id] = e; });
    return map;
  }, []);

  // ===== Roster panel drag handlers =====
  const handleRosterDragStart = (e, id, from) => {
    setDraggingRosterId(id);
    setDraggingRosterFrom(from);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  };
  const handleRosterDragEnd = () => {
    setDraggingRosterId(null);
    setDraggingRosterFrom(null);
    setDropTargetSection(null);
  };
  const handleSectionDragOver = (e, section) => {
    if (draggingRosterId == null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropTargetSection !== section) setDropTargetSection(section);
  };

  // Drop onto a section (eligible or active) — appends or moves between
  const handleSectionDrop = (e, targetSection) => {
    e.preventDefault();
    if (draggingRosterId == null) return;
    const id = draggingRosterId;

    if (targetSection === "active") {
      // Add to end if not in active
      if (!rosterActive.includes(id)) {
        setRosterActive([...rosterActive, id]);
        setRosterEligible(rosterEligible.filter(x => x !== id));
      }
    } else {
      // Move to eligible
      if (!rosterEligible.includes(id)) {
        setRosterEligible([...rosterEligible, id]);
        setRosterActive(rosterActive.filter(x => x !== id));
      }
    }
    handleRosterDragEnd();
  };

  // Drop onto a specific card in active = insert before that card (reorder)
  const handleCardDrop = (e, beforeId) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggingRosterId == null) return;
    const id = draggingRosterId;
    if (id === beforeId) { handleRosterDragEnd(); return; }

    // Build new active array
    let withoutDragged = rosterActive.filter(x => x !== id);
    const idx = withoutDragged.indexOf(beforeId);
    if (idx === -1) {
      // beforeId not in active (e.g. dragging into eligible's card) — treat as section drop
      handleRosterDragEnd();
      return;
    }
    withoutDragged.splice(idx, 0, id);
    setRosterActive(withoutDragged);

    // If was in eligible, remove
    if (rosterEligible.includes(id)) {
      setRosterEligible(rosterEligible.filter(x => x !== id));
    }
    handleRosterDragEnd();
  };

  // ===== Save / commit =====
  const saveRoster = () => {
    setSavedRoster(rosterActive);
    setAssignments(previewAssignments);
  };
  const discardChanges = () => {
    // Restore from saved
    setRosterActive(savedRoster);
    setRosterEligible(initialEligible.length ? initialEligible : [...allIds].filter(id => !savedRoster.includes(id)));
  };

  // ===== Calendar drag-swap =====
  const handleWeekendDragStart = (e, dateIso) => {
    if (isRosterDirty) {
      // Don't allow drag swap during preview
      e.preventDefault();
      return;
    }
    setDraggingDate(dateIso);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", dateIso);
  };
  const handleWeekendDragEnd = () => {
    setDraggingDate(null);
    setDragOverDate(null);
  };
  const handleWeekendDragOver = (e, targetIso) => {
    if (draggingDate == null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverDate !== targetIso) setDragOverDate(targetIso);
  };
  const handleWeekendDrop = (e, targetIso) => {
    e.preventDefault();
    if (!draggingDate || draggingDate === targetIso) {
      handleWeekendDragEnd();
      return;
    }
    // Swap the two assignments (comp days auto-follow since they're derived)
    const a = assignments[draggingDate];
    const b = assignments[targetIso];
    if (a && b) {
      setAssignments({
        ...assignments,
        [draggingDate]: b,
        [targetIso]: a,
      });
    }
    handleWeekendDragEnd();
  };

  // Calendar nav
  const goPrev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const goNext = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

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
          <div className="nav-link">Calendar</div>
          <div className="nav-link active">Weekend rotation</div>
          <div className="nav-link">Employees</div>
        </div>
      </nav>

      <main style={{
        position: "relative", zIndex: 1,
        maxWidth: "1280px", margin: "0 auto",
        padding: "2rem 1.5rem 4rem",
      }}>
        {/* Heading row */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
        }}>
          <div>
            <h1 className="display-heading" style={{ fontSize: "2.5rem", margin: 0 }}>
              Weekend rotation
            </h1>
            <div style={{ fontSize: "0.92rem", color: "#807A7B", marginTop: "0.5rem" }}>
              Set the roster order. Drag chips on the calendar to swap weekends.
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            {isRosterDirty && (
              <div className="preview-badge">
                <AlertCircle size={13} />
                Preview — not yet saved
              </div>
            )}
            <button className="btn-ghost" onClick={discardChanges} disabled={!isRosterDirty} style={{ opacity: isRosterDirty ? 1 : 0.45, cursor: isRosterDirty ? "pointer" : "not-allowed" }}>
              Discard
            </button>
            <button className="btn-primary" onClick={saveRoster} disabled={!isRosterDirty}>
              <Check size={15} />
              Save & generate
            </button>
          </div>
        </div>

        {/* Two-column layout: roster panel left, calendar right */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}>
          {/* LEFT: Roster panel */}
          <RosterPanel
            eligible={rosterEligible}
            active={rosterActive}
            employeeById={employeeById}
            draggingId={draggingRosterId}
            dropTargetSection={dropTargetSection}
            onDragStart={handleRosterDragStart}
            onDragEnd={handleRosterDragEnd}
            onSectionDragOver={handleSectionDragOver}
            onSectionDrop={handleSectionDrop}
            onCardDrop={handleCardDrop}
          />

          {/* RIGHT: Calendar */}
          <div className="glass" style={{ padding: "1.25rem" }}>
            {/* Calendar header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <button className="icon-btn" onClick={goPrev} aria-label="Previous month">
                  <ChevronLeft size={18} />
                </button>
                <button className="icon-btn" onClick={goNext} aria-label="Next month">
                  <ChevronRight size={18} />
                </button>
                <div className="display-heading" style={{ fontSize: "1.3rem", marginLeft: "0.4rem" }}>
                  {MONTH_NAMES[month]} {year}
                </div>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#807A7B", fontStyle: "italic" }}>
                {isRosterDirty ? "Save to enable drag-to-swap" : "Drag a weekend chip onto another to swap"}
              </div>
            </div>

            <RotationCalendarGrid
              year={year}
              month={month}
              assignments={displayedAssignments}
              compDays={compDays}
              employeeById={employeeById}
              today={TODAY}
              draggable={!isRosterDirty}
              draggingDate={draggingDate}
              dragOverDate={dragOverDate}
              onDragStart={handleWeekendDragStart}
              onDragEnd={handleWeekendDragEnd}
              onDragOver={handleWeekendDragOver}
              onDrop={handleWeekendDrop}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// ROSTER PANEL (left side)
// ============================================================
function RosterPanel({
  eligible, active, employeeById,
  draggingId, dropTargetSection,
  onDragStart, onDragEnd,
  onSectionDragOver, onSectionDrop, onCardDrop,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "sticky", top: "5.5rem" }}>
      {/* Active rotation (bottom-half — ordered) */}
      <div className="glass" style={{ padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div className="display-heading" style={{ fontSize: "1.1rem" }}>
            Rotation order
          </div>
          <span style={{ fontSize: "0.78rem", color: "#807A7B" }}>{active.length}</span>
        </div>
        <div
          className={`drop-zone ${dropTargetSection === "active" && draggingId != null ? "over" : ""}`}
          onDragOver={(e) => onSectionDragOver(e, "active")}
          onDrop={(e) => onSectionDrop(e, "active")}
          style={{ padding: "4px", display: "flex", flexDirection: "column", gap: "5px", minHeight: "60px" }}
        >
          {active.length === 0 ? (
            <div style={{
              padding: "1.5rem 0.5rem",
              textAlign: "center",
              fontSize: "0.82rem",
              color: "#B0ABAC",
              fontStyle: "italic",
            }}>
              Drag people here to add them to rotation
            </div>
          ) : (
            active.map((id, i) => {
              const emp = employeeById[id];
              const podColor = POD_COLORS[emp.pod];
              return (
                <div
                  key={id}
                  className={`roster-card ${draggingId === id ? "dragging" : ""}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, id, "active")}
                  onDragEnd={onDragEnd}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => onCardDrop(e, id)}
                >
                  <GripVertical size={13} className="grip" />
                  <span className="order-num">{i + 1}</span>
                  <span className="pod-dot" style={{ background: podColor.color }} />
                  <span className="name">{emp.name}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Eligible pool (top) */}
      <div className="glass" style={{ padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div className="display-heading" style={{ fontSize: "1.1rem" }}>
            Eligible
          </div>
          <span style={{ fontSize: "0.78rem", color: "#807A7B" }}>{eligible.length}</span>
        </div>
        <div
          className={`drop-zone ${dropTargetSection === "eligible" && draggingId != null ? "over" : ""}`}
          onDragOver={(e) => onSectionDragOver(e, "eligible")}
          onDrop={(e) => onSectionDrop(e, "eligible")}
          style={{ padding: "4px", display: "flex", flexDirection: "column", gap: "5px", minHeight: "60px" }}
        >
          {eligible.length === 0 ? (
            <div style={{
              padding: "1rem 0.5rem",
              textAlign: "center",
              fontSize: "0.78rem",
              color: "#B0ABAC",
              fontStyle: "italic",
            }}>
              Everyone's in rotation
            </div>
          ) : (
            eligible.map(id => {
              const emp = employeeById[id];
              const podColor = POD_COLORS[emp.pod];
              return (
                <div
                  key={id}
                  className={`roster-card ${draggingId === id ? "dragging" : ""}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, id, "eligible")}
                  onDragEnd={onDragEnd}
                >
                  <GripVertical size={13} className="grip" />
                  <span className="pod-dot" style={{ background: podColor.color }} />
                  <span className="name">{emp.name}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ROTATION CALENDAR GRID
// ============================================================
function RotationCalendarGrid({
  year, month, assignments, compDays, employeeById, today,
  draggable, draggingDate, dragOverDate,
  onDragStart, onDragEnd, onDragOver, onDrop,
}) {
  const startDow = firstDow(year, month);
  const totalDays = daysInMonth(year, month);
  const prevMonth = month - 1 < 0 ? 11 : month - 1;
  const prevYear = month - 1 < 0 ? year - 1 : year;
  const nextMonth = month + 1 > 11 ? 0 : month + 1;
  const nextYear = month + 1 > 11 ? year + 1 : year;
  const prevMonthDays = daysInMonth(prevYear, prevMonth);
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
          <DayCell
            key={i}
            cell={c}
            today={today}
            assignments={assignments}
            compDays={compDays}
            employeeById={employeeById}
            draggable={draggable}
            draggingDate={draggingDate}
            dragOverDate={dragOverDate}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
}

function DayCell({
  cell, today, assignments, compDays, employeeById,
  draggable, draggingDate, dragOverDate,
  onDragStart, onDragEnd, onDragOver, onDrop,
}) {
  const iso = toIso(cell.year, cell.month, cell.day);
  const isToday = sameDay(cell, today);
  const dow = new Date(cell.year, cell.month, cell.day).getDay();
  const isWeekend = dow === 0 || dow === 6;
  const assignedId = !cell.outside ? assignments[iso] : null;
  const compId = !cell.outside ? compDays[iso] : null;

  const cls = ["cal-day"];
  if (cell.outside) cls.push("outside");
  if (isWeekend && !cell.outside) cls.push("weekend");
  if (isToday) cls.push("today");
  if (compId) cls.push("comp-day-cell");

  const emp = assignedId ? employeeById[assignedId] : null;
  const compEmp = compId ? employeeById[compId] : null;
  const podColor = emp ? POD_COLORS[emp.pod] : null;

  const isBeingDragged = draggingDate === iso;
  const isDragTarget = dragOverDate === iso && draggingDate && draggingDate !== iso;

  return (
    <div className={cls.join(" ")}>
      <div className="cal-day-num">{cell.day}</div>

      {/* Weekend assignment chip */}
      {emp && (
        <div
          className={`weekend-chip ${isBeingDragged ? "dragging" : ""} ${isDragTarget ? "drag-over" : ""}`}
          style={{
            background: podColor.color,
            borderColor: podColor.deep,
            cursor: draggable ? "grab" : "default",
            opacity: draggable ? 1 : 0.92,
          }}
          draggable={draggable}
          onDragStart={(e) => onDragStart(e, iso)}
          onDragEnd={onDragEnd}
          onDragOver={(e) => onDragOver(e, iso)}
          onDrop={(e) => onDrop(e, iso)}
          title={draggable ? `Drag to swap • ${emp.name}` : emp.name}
        >
          {firstName(emp.name)}
          <div style={{ fontSize: "0.62rem", fontWeight: 400, opacity: 0.92, marginTop: "1px" }}>
            covering
          </div>
        </div>
      )}

      {/* Comp day note (for Mon following a Sat, Fri before a Sun) */}
      {compEmp && (
        <div style={{ marginTop: emp ? "4px" : 0 }}>
          <span className="comp-tag">
            {firstName(compEmp.name)} off
          </span>
        </div>
      )}
    </div>
  );
} 