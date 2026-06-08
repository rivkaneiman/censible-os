import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, ChevronDown, Calendar as CalIcon, Download, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, X, FileText
} from "lucide-react";

// ============================================================
// CENSIBLE OS — Archive (Audit log + Year-end summaries)
// ============================================================

const TODAY = { year: 2026, month: 4, day: 29 }; // May 29, 2026

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

  /* Tabs (page-level) */
  .tabs {
    display: flex; gap: 1.75rem;
    border-bottom: 1px solid rgba(229, 225, 218, 0.7);
    margin-bottom: 1.75rem;
  }
  .tab {
    padding: 0.65rem 0;
    color: #807A7B;
    font-size: 0.95rem;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 200ms, border-color 200ms;
    cursor: pointer;
    background: none;
    border-top: none; border-left: none; border-right: none;
    font-family: inherit;
  }
  .tab.active { color: #2E6E84; border-bottom-color: #5AA6BB; }
  .tab:hover:not(.active) { color: #4A4546; }

  /* Search input */
  .search-wrap { position: relative; width: 100%; }
  .search-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 9999px;
    padding: 0.6rem 2.5rem 0.6rem 2.5rem;
    font-size: 0.92rem;
    color: #231F20;
    font-family: inherit;
    outline: none;
    transition: background 200ms, border-color 200ms;
  }
  .search-input::placeholder { color: #B0ABAC; }
  .search-input:focus {
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(90, 166, 187, 0.4);
  }
  .search-icon {
    position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
    color: #807A7B; pointer-events: none;
  }
  .search-clear {
    position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
    background: transparent; border: none; padding: 4px; border-radius: 50%;
    cursor: pointer; color: #807A7B;
    display: flex; align-items: center; justify-content: center;
    transition: background 150ms, color 150ms;
  }
  .search-clear:hover { background: rgba(35, 31, 32, 0.06); color: #231F20; }

  .filter-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: #807A7B;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.35rem;
  }

  /* Log rows */
  .log-row {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(229, 225, 218, 0.5);
    transition: background 150ms;
    font-size: 0.88rem;
    line-height: 1.45;
  }
  .log-row:last-child { border-bottom: none; }
  .log-row:hover { background: rgba(255, 255, 255, 0.45); }
  .log-row .ts {
    color: #807A7B;
    font-size: 0.78rem;
    flex-shrink: 0;
    min-width: 150px;
    font-variant-numeric: tabular-nums;
  }
  .log-row .sep { color: #C5C0BC; flex-shrink: 0; }
  .log-row .actor { color: #231F20; font-weight: 500; flex-shrink: 0; }
  .log-row.system .actor { color: #807A7B; font-style: italic; font-weight: 400; }
  .log-row .desc { color: #4A4546; flex: 1; min-width: 0; }

  /* Year-end summary cards */
  .summary-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.4rem 1.5rem;
    border-bottom: 1px solid rgba(229, 225, 218, 0.5);
    transition: background 150ms;
  }
  .summary-card:last-child { border-bottom: none; }
  .summary-card:hover { background: rgba(255, 255, 255, 0.4); }
  .summary-card .year {
    font-family: 'Fraunces', serif;
    font-size: 2.4rem;
    color: #2E6E84;
    line-height: 1;
    min-width: 90px;
    letter-spacing: -0.02em;
  }
  .summary-card .body { flex: 1; min-width: 0; }
  .summary-card .stats-row {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.45rem;
    flex-wrap: wrap;
  }
  .summary-card .stat .stat-value {
    font-size: 1.1rem;
    color: #231F20;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .summary-card .stat .stat-label {
    font-size: 0.72rem;
    color: #807A7B;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-top: 1px;
  }
  .summary-card .gen-meta {
    font-size: 0.82rem;
    color: #807A7B;
  }
  .summary-card .actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }
`;

// ============================================================
// MOCK DATA — Audit events
// ============================================================
const SEED_EVENTS = [
  { id: "e1",  timestamp: "2026-05-29T09:10:00", actor: "Priya Singh", subject: "Sarah Chen", description: "Denied Sarah Chen's Jul 15 personal day request", category: "request" },
  { id: "e2",  timestamp: "2026-05-29T08:42:00", actor: "Priya Singh", subject: null,         description: "Logged in", category: "login" },
  { id: "e3",  timestamp: "2026-05-28T14:34:00", actor: "Priya Singh", subject: "Sarah Chen", description: "Approved Sarah Chen's Jun 22 personal day request", category: "request" },
  { id: "e4",  timestamp: "2026-05-28T11:15:00", actor: "Sarah Chen",  subject: "Sarah Chen", description: "Submitted vacation request for Jun 25–26", category: "request" },
  { id: "e5",  timestamp: "2026-05-28T09:23:00", actor: "Sarah Chen",  subject: "Sarah Chen", description: "Submitted personal day request for Jul 15", category: "request" },
  { id: "e6",  timestamp: "2026-05-27T15:40:00", actor: "Priya Singh", subject: "Marcus Hill", description: "Changed Marcus Hill's vacation total: 10 → 12 days (reason: anniversary bonus)", category: "balance" },
  { id: "e7",  timestamp: "2026-05-27T10:08:00", actor: "Priya Singh", subject: "Riley Brooks", description: "Granted admin access to Riley Brooks", category: "employee" },
  { id: "e8",  timestamp: "2026-05-26T10:12:00", actor: "Priya Singh", subject: "Roster", description: "Swapped weekend coverage: Sarah Chen (Jun 6) ↔ Mike Park (Jul 11). Comp days auto-followed.", category: "rotation" },
  { id: "e9",  timestamp: "2026-05-22T16:55:00", actor: "Priya Singh", subject: "Casey Wong", description: "Added Casey Wong to weekend rotation", category: "rotation" },
  { id: "e10", timestamp: "2026-05-22T16:50:00", actor: "Priya Singh", subject: "Roster", description: "Saved weekend rotation — 10 employees. Regenerated all 2026 assignments from today forward.", category: "rotation" },
  { id: "e11", timestamp: "2026-05-21T11:24:00", actor: "Priya Singh", subject: "Sarah Chen", description: "Approved Sarah Chen's Jun 13–15 vacation request", category: "request" },
  { id: "e12", timestamp: "2026-05-15T14:10:00", actor: "Priya Singh", subject: "Robin Hayes", description: "Deactivated Robin Hayes", category: "employee" },
  { id: "e13", timestamp: "2026-05-10T09:05:00", actor: "Priya Singh", subject: "Reese Owens", description: "Created Reese Owens (Account Manager, no pod)", category: "employee" },
  { id: "e14", timestamp: "2026-05-08T13:20:00", actor: "Priya Singh", subject: "Allotments", description: "Updated default holiday comp allotment: 2 → 3 days. Apply: next rollover.", category: "allotment" },
  { id: "e15", timestamp: "2026-05-01T08:30:00", actor: "Priya Singh", subject: "Sarah Chen", description: "Granted admin access to Sarah Chen", category: "employee" },
  { id: "e16", timestamp: "2026-04-07T16:42:00", actor: "Priya Singh", subject: "Sarah Chen", description: "Approved Sarah Chen's Apr 8 personal day request", category: "request" },
  { id: "e17", timestamp: "2026-04-02T11:30:00", actor: "Priya Singh", subject: "Drew Nakamura", description: "Changed Drew Nakamura's vacation total: 10 → 9 days (reason: corrected from CSV import)", category: "balance" },
  { id: "e18", timestamp: "2026-03-12T11:00:00", actor: "Priya Singh", subject: "Morgan Diaz", description: "Changed Morgan Diaz's pod: East → North", category: "employee" },
  { id: "e19", timestamp: "2026-03-04T14:55:00", actor: "Priya Singh", subject: "Sarah Chen", description: "Approved Sarah Chen's request to cancel Mar 18 personal day", category: "request" },
  { id: "e20", timestamp: "2026-02-15T10:30:00", actor: "Priya Singh", subject: "Riley Brooks", description: "Created Riley Brooks (Admissions Director, South Pod)", category: "employee" },
  { id: "e21", timestamp: "2026-02-08T09:12:00", actor: "Sarah Chen",  subject: "Sarah Chen", description: "Cancelled vacation request for Feb 27", category: "request" },
  { id: "e22", timestamp: "2026-01-29T11:45:00", actor: "Priya Singh", subject: "Sarah Chen", description: "Approved Sarah Chen's Feb 20–21 vacation request", category: "request" },
  { id: "e23", timestamp: "2026-01-09T14:22:00", actor: "Priya Singh", subject: "Sarah Chen", description: "Denied Sarah Chen's Jan 10 personal day request", category: "request" },
  { id: "e24", timestamp: "2026-01-01T00:00:00", actor: "System",      subject: null,         description: "Year-end rollover: 2025 balances exported, 2026 allotments applied to all employees", category: "system" },
  { id: "e25", timestamp: "2025-12-30T16:00:00", actor: "Priya Singh", subject: "Sarah Chen", description: "Approved Sarah Chen's Dec 22–26 vacation request", category: "request" },
  { id: "e26", timestamp: "2025-11-20T10:15:00", actor: "Priya Singh", subject: "Sarah Chen", description: "Changed Sarah Chen's title: 'Senior Admissions Director' → 'Admissions Director'", category: "employee" },
];

// ============================================================
// MOCK DATA — Year-end summaries
// ============================================================
const YEAR_SUMMARIES = [
  {
    year: 2025,
    generatedAt: "2026-01-01T00:00:00",
    employees: 19,
    daysUsed: 142,
    daysForfeited: 51,
  },
  {
    year: 2024,
    generatedAt: "2025-01-01T00:00:00",
    employees: 17,
    daysUsed: 128,
    daysForfeited: 43,
  },
  {
    year: 2023,
    generatedAt: "2024-01-01T00:00:00",
    employees: 14,
    daysUsed: 96,
    daysForfeited: 32,
  },
];

// Sample per-employee summary data for CSV generation
const EMPLOYEES_BY_YEAR = {
  2025: [
    { name: "Sarah Chen", pod: "North", vacAllot: 10, vacUsed: 9, perAllot: 7, perUsed: 6, holUsed: 4, hcUsed: 2, datesOff: "Feb 20-21; Mar 15-16; Apr 3; Jul 21-25; Sep 4; Dec 22-26" },
    { name: "Mike Park", pod: "North", vacAllot: 10, vacUsed: 7, perAllot: 7, perUsed: 5, holUsed: 4, hcUsed: 2, datesOff: "Mar 7; Apr 22; Jun 10; Aug 4-8; Nov 25-26" },
    { name: "Jen Liu", pod: "North", vacAllot: 10, vacUsed: 8, perAllot: 7, perUsed: 7, holUsed: 4, hcUsed: 2, datesOff: "Jan 15; Apr 12; Jun 15-19; Oct 6; Dec 18-22" },
    { name: "Alex Rivera", pod: "North", vacAllot: 10, vacUsed: 6, perAllot: 7, perUsed: 4, holUsed: 4, hcUsed: 1, datesOff: "May 5; Jul 7-11; Oct 15; Dec 23" },
    { name: "Casey Wong", pod: "North", vacAllot: 10, vacUsed: 10, perAllot: 7, perUsed: 6, holUsed: 4, hcUsed: 2, datesOff: "Apr 6-10; Jun 5; Aug 18-22; Nov 24; Dec 22-26" },
    { name: "Priya Singh", pod: "South", vacAllot: 10, vacUsed: 8, perAllot: 7, perUsed: 5, holUsed: 4, hcUsed: 2, datesOff: "Mar 24-28; Jul 21-25; Nov 27-28" },
    { name: "Dev Patel", pod: "South", vacAllot: 10, vacUsed: 9, perAllot: 7, perUsed: 6, holUsed: 4, hcUsed: 2, datesOff: "Feb 12; Apr 7-11; Jul 1-3; Oct 6; Dec 23-26" },
    { name: "Marcus Hill", pod: "South", vacAllot: 10, vacUsed: 7, perAllot: 7, perUsed: 7, holUsed: 4, hcUsed: 1, datesOff: "May 22-26; Aug 11; Sep 22-24; Nov 27" },
    { name: "Lena Park", pod: "South", vacAllot: 10, vacUsed: 8, perAllot: 7, perUsed: 4, holUsed: 3, hcUsed: 2, datesOff: "Apr 14-18; Jul 28-30; Nov 27-28" },
    { name: "Riley Brooks", pod: "South", vacAllot: 10, vacUsed: 5, perAllot: 7, perUsed: 3, holUsed: 4, hcUsed: 0, datesOff: "Jun 9; Sep 8-12; Dec 22" },
    { name: "Avery Lopez", pod: "East", vacAllot: 10, vacUsed: 7, perAllot: 7, perUsed: 5, holUsed: 4, hcUsed: 2, datesOff: "Feb 17; May 5-9; Aug 25-26; Nov 27" },
    { name: "Jordan Kim", pod: "East", vacAllot: 10, vacUsed: 9, perAllot: 7, perUsed: 6, holUsed: 4, hcUsed: 2, datesOff: "Apr 21-25; Jul 7; Sep 15-19; Dec 22-26" },
    { name: "Morgan Diaz", pod: "East", vacAllot: 10, vacUsed: 8, perAllot: 7, perUsed: 6, holUsed: 4, hcUsed: 2, datesOff: "Mar 3-7; Jun 23; Oct 13-17; Dec 23-24" },
    { name: "Quinn Foster", pod: "East", vacAllot: 10, vacUsed: 6, perAllot: 7, perUsed: 5, holUsed: 4, hcUsed: 1, datesOff: "May 12; Aug 4-8; Nov 27-28" },
    { name: "Sam Walker", pod: "East", vacAllot: 10, vacUsed: 8, perAllot: 7, perUsed: 5, holUsed: 4, hcUsed: 2, datesOff: "Jan 27; Apr 28-30; Jul 14-18; Dec 22" },
    { name: "Drew Nakamura", pod: "—", vacAllot: 10, vacUsed: 7, perAllot: 7, perUsed: 6, holUsed: 0, hcUsed: 0, datesOff: "May 6-9; Aug 11-13; Oct 27" },
    { name: "Pat Taylor", pod: "—", vacAllot: 10, vacUsed: 6, perAllot: 7, perUsed: 5, holUsed: 0, hcUsed: 0, datesOff: "Mar 17; Jun 23-27; Nov 28" },
    { name: "Taylor Cruz", pod: "—", vacAllot: 10, vacUsed: 10, perAllot: 7, perUsed: 7, holUsed: 0, hcUsed: 0, datesOff: "Jan 6-10; May 19-23; Aug 25-29; Dec 22-26" },
    { name: "Robin Hayes", pod: "—", vacAllot: 10, vacUsed: 4, perAllot: 7, perUsed: 3, holUsed: 4, hcUsed: 1, datesOff: "Feb 24; Jul 7-9; Oct 13" },
  ],
};

// ============================================================
// HELPERS
// ============================================================
const pad = (n) => String(n).padStart(2, "0");
const isoToday = `${TODAY.year}-${pad(TODAY.month + 1)}-${pad(TODAY.day)}`;
const isoYearStart = `${TODAY.year}-01-01`;

function fmtEventTime(isoTimestamp) {
  const dt = new Date(isoTimestamp);
  const isThisYear = dt.getFullYear() === TODAY.year;
  const dateStr = dt.toLocaleDateString("en-US", {
    month: "short", day: "numeric",
    ...(isThisYear ? {} : { year: "numeric" }),
  });
  const timeStr = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${dateStr} · ${timeStr}`;
}

function fmtDateForCsv(isoTimestamp) {
  return new Date(isoTimestamp).toISOString().replace("T", " ").substring(0, 16);
}

function isoDateOnly(isoTimestamp) {
  return isoTimestamp.substring(0, 10);
}

function fmtFullDate(isoTimestamp) {
  return new Date(isoTimestamp).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadAuditCsv(events) {
  const headers = ["Timestamp", "Actor", "Subject", "Description"];
  const rows = events.map(e => [
    fmtDateForCsv(e.timestamp),
    e.actor,
    e.subject || "",
    e.description,
  ]);
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  triggerDownload(csv, `audit-log-${isoToday}.csv`, "text/csv;charset=utf-8;");
}

function downloadYearSummaryCsv(year) {
  const employees = EMPLOYEES_BY_YEAR[year] || [];
  const headers = [
    "Employee", "Pod",
    "Vacation Allotted", "Vacation Used", "Vacation Forfeited",
    "Personal Allotted", "Personal Used", "Personal Forfeited",
    "Holiday Used", "Holiday Comp Used",
    "Total Days Off", "Dates Off",
  ];
  const rows = employees.map(e => [
    e.name, e.pod,
    e.vacAllot, e.vacUsed, e.vacAllot - e.vacUsed,
    e.perAllot, e.perUsed, e.perAllot - e.perUsed,
    e.holUsed, e.hcUsed,
    e.vacUsed + e.perUsed + e.holUsed + e.hcUsed,
    e.datesOff,
  ]);
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  triggerDownload(csv, `year-end-summary-${year}.csv`, "text/csv;charset=utf-8;");
}

// ============================================================
// MAIN
// ============================================================
export default function Archive() {
  const [activeTab, setActiveTab] = useState("audit");

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
          <div className="nav-link">Employees</div>
          <div className="nav-link active">Archive</div>
        </div>
      </nav>

      <main style={{
        position: "relative", zIndex: 1,
        maxWidth: "1240px", margin: "0 auto",
        padding: "2rem 1.5rem 4rem",
      }}>
        {/* Heading */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 className="display-heading" style={{ fontSize: "2.5rem", margin: 0 }}>
            Archive
          </h1>
          <div style={{ fontSize: "0.92rem", color: "#807A7B", marginTop: "0.5rem" }}>
            Historical records and year-end documentation.
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "audit" ? "active" : ""}`}
            onClick={() => setActiveTab("audit")}
          >
            Audit log
          </button>
          <button
            className={`tab ${activeTab === "summaries" ? "active" : ""}`}
            onClick={() => setActiveTab("summaries")}
          >
            Year-end summaries
          </button>
        </div>

        {activeTab === "audit" ? <AuditLogTab /> : <YearSummariesTab />}
      </main>
    </div>
  );
}

// ============================================================
// AUDIT LOG TAB
// ============================================================
function AuditLogTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actorFilter, setActorFilter] = useState(null);
  const [fromDate, setFromDate] = useState(isoYearStart);
  const [toDate, setToDate] = useState("");

  const actorOptions = useMemo(() => {
    const set = new Set(SEED_EVENTS.map(e => e.actor));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    let events = SEED_EVENTS;
    if (fromDate) events = events.filter(e => isoDateOnly(e.timestamp) >= fromDate);
    if (toDate)   events = events.filter(e => isoDateOnly(e.timestamp) <= toDate);
    if (actorFilter) events = events.filter(e => e.actor === actorFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      events = events.filter(e =>
        e.description.toLowerCase().includes(q) ||
        e.actor.toLowerCase().includes(q) ||
        (e.subject && e.subject.toLowerCase().includes(q))
      );
    }
    return [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [searchQuery, actorFilter, fromDate, toDate]);

  const hasActiveFilters = !!(searchQuery.trim() || actorFilter || fromDate !== isoYearStart || toDate);

  const clearAllFilters = () => {
    setSearchQuery("");
    setActorFilter(null);
    setFromDate(isoYearStart);
    setToDate("");
  };

  return (
    <>
      {/* Summary row + export */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.25rem",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}>
        <div style={{ fontSize: "0.9rem", color: "#807A7B" }}>
          {filtered.length} {filtered.length === 1 ? "event" : "events"}
          {hasActiveFilters && " matching filters"}
        </div>
        <button className="btn-ghost" onClick={() => downloadAuditCsv(filtered)} disabled={filtered.length === 0}>
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1rem" }}>
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search the log…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery("")} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "0.85rem 1.25rem",
        marginBottom: "1.25rem",
      }}>
        <div>
          <span className="filter-label">Actor</span>
          <Dropdown
            value={actorFilter}
            onChange={setActorFilter}
            options={[
              { value: null, label: "All actors" },
              ...actorOptions.map(name => ({ value: name, label: name })),
            ]}
          />
        </div>
        <div>
          <span className="filter-label">From</span>
          <DatePicker value={fromDate} onChange={setFromDate} allowClear />
        </div>
        <div>
          <span className="filter-label">To</span>
          <DatePicker value={toDate} onChange={setToDate} placeholder="No upper bound" allowClear />
        </div>
      </div>

      {hasActiveFilters && (
        <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={clearAllFilters}
            style={{
              background: "transparent", border: "none", color: "#2E6E84",
              cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit",
              padding: "0.3rem 0.5rem", borderRadius: "8px",
              transition: "background 150ms",
            }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(230, 240, 244, 0.6)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}
          >
            Reset filters
          </button>
        </div>
      )}

      <div className="glass" style={{ overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "3.5rem 1.5rem", textAlign: "center", color: "#807A7B" }}>
            <div className="display-heading" style={{ fontSize: "1.15rem", color: "#231F20", marginBottom: "0.4rem" }}>
              No events match
            </div>
            <div style={{ fontSize: "0.88rem" }}>
              Try widening your filters or clearing them entirely.
            </div>
          </div>
        ) : (
          filtered.map(event => (
            <div
              key={event.id}
              className={`log-row ${event.actor === "System" ? "system" : ""}`}
            >
              <span className="ts">{fmtEventTime(event.timestamp)}</span>
              <span className="sep">·</span>
              <span className="actor">{event.actor}</span>
              <span className="sep">·</span>
              <span className="desc">{event.description}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// ============================================================
// YEAR-END SUMMARIES TAB
// ============================================================
function YearSummariesTab() {
  return (
    <>
      <p style={{
        fontSize: "0.92rem",
        color: "#807A7B",
        margin: "0 0 1.5rem",
        lineHeight: 1.55,
        maxWidth: "640px",
      }}>
        These summaries are generated automatically each January 1st when balances roll over. Each one captures the closed year: per-employee usage, forfeited days, and a full list of dates taken off.
      </p>

      <div className="glass" style={{ overflow: "hidden" }}>
        {YEAR_SUMMARIES.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#807A7B" }}>
            <div className="display-heading" style={{ fontSize: "1.15rem", color: "#231F20", marginBottom: "0.4rem" }}>
              No summaries yet
            </div>
            <div style={{ fontSize: "0.88rem" }}>
              The first year-end summary will generate on January 1st.
            </div>
          </div>
        ) : (
          YEAR_SUMMARIES.map(s => (
            <div key={s.year} className="summary-card">
              <div className="year">{s.year}</div>
              <div className="body">
                <div className="gen-meta">
                  Generated {fmtFullDate(s.generatedAt)}
                </div>
                <div className="stats-row">
                  <div className="stat">
                    <div className="stat-value">{s.employees}</div>
                    <div className="stat-label">Employees</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{s.daysUsed}</div>
                    <div className="stat-label">Days used</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{s.daysForfeited}</div>
                    <div className="stat-label">Days forfeited</div>
                  </div>
                </div>
              </div>
              <div className="actions">
                <button
                  className="btn-ghost"
                  onClick={() => downloadYearSummaryCsv(s.year)}
                  disabled={!EMPLOYEES_BY_YEAR[s.year]}
                  title={EMPLOYEES_BY_YEAR[s.year] ? "" : "Sample data not available in prototype"}
                >
                  <FileText size={14} />
                  CSV
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// ============================================================
// CUSTOM DROPDOWN
// ============================================================
function Dropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${open ? "#2E6E84" : "rgba(229, 225, 218, 0.7)"}`,
          padding: "0.55rem 1.5rem 0.55rem 0",
          fontSize: "0.92rem",
          color: selected ? "#231F20" : "#B0ABAC",
          fontFamily: "inherit",
          textAlign: "left",
          cursor: "pointer",
          outline: "none",
          position: "relative",
          transition: "border-color 200ms",
        }}
      >
        {selected ? selected.label : "Select…"}
        <ChevronDown
          size={14}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
            color: "#807A7B",
            transition: "transform 200ms",
          }}
        />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          marginTop: "4px",
          background: "#FFFFFF",
          border: "1px solid #D5D1CA",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(35, 31, 32, 0.1), 0 20px 44px rgba(35, 31, 32, 0.22)",
          zIndex: 9999, overflow: "hidden", padding: "4px",
          maxHeight: "320px", overflowY: "auto",
        }}>
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value === null ? "__null__" : opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  padding: "0.55rem 0.7rem", fontSize: "0.9rem",
                  color: isSelected ? "#2E6E84" : "#231F20",
                  background: isSelected ? "rgba(230, 240, 244, 0.95)" : "transparent",
                  fontWeight: isSelected ? 500 : 400,
                  cursor: "pointer", borderRadius: "8px",
                  transition: "background 100ms",
                }}
                onMouseOver={e => { if (!isSelected) e.currentTarget.style.background = "rgba(230, 240, 244, 0.5)"; }}
                onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// DATE PICKER
// ============================================================
const DP_MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function DatePicker({ value, onChange, placeholder, allowClear }) {
  const [open, setOpen] = useState(false);
  const todayDate = new Date();
  const [viewYear, setViewYear] = useState(value ? parseInt(value.split('-')[0], 10) : todayDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? parseInt(value.split('-')[1], 10) - 1 : todayDate.getMonth());
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (value && open) {
      const [y, m] = value.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [value, open]);

  const formatDisplay = (iso) => {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();

  const goPrevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); };
  const goNextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); };
  const goPrevYear = () => setViewYear(viewYear - 1);
  const goNextYear = () => setViewYear(viewYear + 1);

  const selectDate = (d) => {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onChange(iso);
    setOpen(false);
  };

  const clearDate = (e) => {
    e.stopPropagation();
    onChange("");
  };

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedDay = value && value.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`)
    ? parseInt(value.split('-')[2], 10) : null;

  const isToday = (d) =>
    viewYear === todayDate.getFullYear() &&
    viewMonth === todayDate.getMonth() &&
    d === todayDate.getDate();

  const navBtnStyle = {
    background: "transparent", border: "none", cursor: "pointer",
    padding: "5px", borderRadius: "6px", color: "#4A4546",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    transition: "background 150ms",
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "transparent", border: "none",
          borderBottom: `1px solid ${open ? "#2E6E84" : "rgba(229, 225, 218, 0.7)"}`,
          padding: "0.55rem 2.2rem 0.55rem 0",
          fontSize: "0.92rem",
          color: value ? "#231F20" : "#B0ABAC",
          fontFamily: "inherit", textAlign: "left",
          cursor: "pointer", outline: "none", position: "relative",
          transition: "border-color 200ms",
        }}
      >
        {value ? formatDisplay(value) : (placeholder || "Select date")}
        {value && allowClear ? (
          <span
            onClick={clearDate}
            style={{
              position: "absolute", right: "1.4rem", top: "50%", transform: "translateY(-50%)",
              padding: "3px", borderRadius: "50%", cursor: "pointer", color: "#807A7B",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(35, 31, 32, 0.06)"; e.currentTarget.style.color = "#231F20"; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#807A7B"; }}
          >
            <X size={12} />
          </span>
        ) : null}
        <CalIcon size={14} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", color: "#807A7B" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0,
          marginTop: "6px",
          background: "#FDFBF7", border: "1px solid #D5D1CA", borderRadius: "14px",
          boxShadow: "0 2px 4px rgba(35, 31, 32, 0.1), 0 20px 44px rgba(35, 31, 32, 0.22)",
          zIndex: 9999, padding: "0.95rem", width: "300px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              <button onClick={goPrevYear} style={navBtnStyle}
                onMouseOver={e => e.currentTarget.style.background = "rgba(230, 240, 244, 0.7)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <ChevronsLeft size={15} />
              </button>
              <button onClick={goPrevMonth} style={navBtnStyle}
                onMouseOver={e => e.currentTarget.style.background = "rgba(230, 240, 244, 0.7)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <ChevronLeft size={15} />
              </button>
            </div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "0.98rem", color: "#231F20" }}>
              {DP_MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div style={{ display: "flex", gap: "2px" }}>
              <button onClick={goNextMonth} style={navBtnStyle}
                onMouseOver={e => e.currentTarget.style.background = "rgba(230, 240, 244, 0.7)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <ChevronRight size={15} />
              </button>
              <button onClick={goNextYear} style={navBtnStyle}
                onMouseOver={e => e.currentTarget.style.background = "rgba(230, 240, 244, 0.7)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: "0.65rem", color: "#807A7B", fontWeight: 500, padding: "4px 0", letterSpacing: "0.04em" }}>
                {d}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const isSelected = d === selectedDay;
              const today = isToday(d);
              return (
                <button key={i} onClick={() => selectDate(d)}
                  style={{
                    width: "100%", height: "34px",
                    background: isSelected ? "#2E6E84" : "transparent",
                    color: isSelected ? "#FFFFFF" : "#231F20",
                    border: today && !isSelected ? "1px solid rgba(90, 166, 187, 0.6)" : "1px solid transparent",
                    borderRadius: "8px",
                    fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit",
                    fontWeight: isSelected || today ? 500 : 400,
                    transition: "background 100ms", padding: 0,
                  }}
                  onMouseOver={e => { if (!isSelected) e.currentTarget.style.background = "rgba(230, 240, 244, 0.65)"; }}
                  onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}