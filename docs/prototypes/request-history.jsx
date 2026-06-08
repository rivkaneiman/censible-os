import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, ChevronDown, X, Clock, Check, AlertCircle
} from "lucide-react";

// ============================================================
// CENSIBLE OS — Request History (employee view)
// Identity: Sarah Chen
// ============================================================

const USER = { name: "Sarah Chen", firstName: "Sarah" };
const TODAY = new Date(2026, 4, 29); // May 29, 2026 — fixed for demo

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
  .btn-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 9999px;
    font-weight: 500; font-size: 0.875rem;
    padding: 0.5rem 1.1rem;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    color: #4A4546;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
    transition: background 200ms, color 200ms;
    cursor: pointer; font-family: inherit;
    gap: 0.35rem;
  }
  .btn-ghost:hover { background: rgba(255, 255, 255, 0.85); color: #231F20; }

  .btn-danger {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 9999px;
    font-weight: 500; font-size: 0.9rem;
    padding: 0.55rem 1.2rem;
    background: linear-gradient(180deg, #B91C1C 0%, #991B1B 100%);
    color: #FAF8F5;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      0 1px 2px rgba(35, 31, 32, 0.12),
      0 4px 16px rgba(185, 28, 28, 0.2);
    transition: transform 200ms ease;
    cursor: pointer; font-family: inherit;
  }
  .btn-danger:hover { transform: translateY(-1px); }

  /* Back link */
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: transparent;
    border: none;
    color: #2E6E84;
    cursor: pointer;
    font-size: 0.88rem;
    font-family: inherit;
    padding: 0.3rem 0.5rem;
    border-radius: 8px;
    transition: background 150ms;
    margin-left: -0.5rem;
  }
  .back-link:hover { background: rgba(230, 240, 244, 0.6); }

  /* Tabs */
  .tabs {
    display: flex; gap: 1.75rem;
    border-bottom: 1px solid rgba(229, 225, 218, 0.7);
    margin-bottom: 1.5rem;
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
  .tab .count {
    margin-left: 0.4rem;
    font-size: 0.78rem;
    color: #B0ABAC;
    font-weight: 400;
  }
  .tab.active .count { color: #5AA6BB; }

  /* Status pill */
  .status-pill {
    display: inline-flex; align-items: center;
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.68rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .status-pill.pending  { background: rgba(46, 110, 132, 0.12); color: #2E6E84; }
  .status-pill.approved { background: rgba(46, 125, 50, 0.12); color: #2E7D32; }
  .status-pill.denied   { background: rgba(185, 28, 28, 0.1); color: #B91C1C; }

  /* Modal */
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(35, 31, 32, 0.35);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    padding: 1.5rem;
    animation: fadeIn 200ms ease-out;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
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
    max-width: 460px;
  }
`;

// ============================================================
// MOCK DATA
// ============================================================
const SEED_REQUESTS = [
  // 2026 — PENDING
  { id: "r1", from: "2026-06-25", to: "2026-06-26", days: 2, category: "Vacation", status: "pending", submitted: "2026-05-28", reason: "Family wedding in Vermont" },
  { id: "r2", from: "2026-06-30", to: "2026-06-30", days: 1, category: "Vacation", status: "pending", submitted: "2026-05-29" },

  // 2026 — APPROVED
  { id: "r3", from: "2026-06-13", to: "2026-06-15", days: 3, category: "Vacation", status: "approved", submitted: "2026-05-20", decided: "2026-05-21", decidedBy: "Priya Singh", reason: "Long weekend with family" },
  { id: "r4", from: "2026-06-22", to: "2026-06-22", days: 1, category: "Personal", status: "approved", submitted: "2026-05-27", decided: "2026-05-28", decidedBy: "Priya Singh" },
  { id: "r5", from: "2026-04-08", to: "2026-04-08", days: 1, category: "Personal", status: "approved", submitted: "2026-04-07", decided: "2026-04-07", decidedBy: "Priya Singh" },
  { id: "r6", from: "2026-02-20", to: "2026-02-21", days: 2, category: "Vacation", status: "approved", submitted: "2026-01-28", decided: "2026-01-29", decidedBy: "Priya Singh", reason: "Long weekend in Vermont" },

  // 2026 — DENIED
  { id: "r7", from: "2026-07-15", to: "2026-07-15", days: 1, category: "Personal", status: "denied", submitted: "2026-05-28", decided: "2026-05-29", decidedBy: "Priya Singh", denyReason: "Pod is short-staffed that week — try the following week" },
  { id: "r8", from: "2026-01-10", to: "2026-01-10", days: 1, category: "Personal", status: "denied", submitted: "2026-01-09", decided: "2026-01-09", decidedBy: "Priya Singh", denyReason: "Submitted same-day; please give 24 hours notice for personal days" },

  // 2025
  { id: "r9",  from: "2025-12-22", to: "2025-12-26", days: 5, category: "Vacation", status: "approved", submitted: "2025-10-15", decided: "2025-10-17", decidedBy: "Priya Singh", reason: "Christmas with family" },
  { id: "r10", from: "2025-09-04", to: "2025-09-04", days: 1, category: "Personal", status: "approved", submitted: "2025-08-30", decided: "2025-08-31", decidedBy: "Priya Singh" },
  { id: "r11", from: "2025-07-21", to: "2025-07-25", days: 5, category: "Vacation", status: "approved", submitted: "2025-05-10", decided: "2025-05-11", decidedBy: "Priya Singh", reason: "Trip to Mexico" },
  { id: "r12", from: "2025-04-03", to: "2025-04-03", days: 1, category: "Personal", status: "denied", submitted: "2025-04-02", decided: "2025-04-02", decidedBy: "Priya Singh", denyReason: "Two people already off in your pod that day" },
  { id: "r13", from: "2025-03-15", to: "2025-03-16", days: 2, category: "Vacation", status: "approved", submitted: "2025-02-01", decided: "2025-02-02", decidedBy: "Priya Singh" },

  // 2024
  { id: "r14", from: "2024-11-27", to: "2024-11-29", days: 3, category: "Vacation", status: "approved", submitted: "2024-09-15", decided: "2024-09-17", decidedBy: "Priya Singh", reason: "Thanksgiving travel" },
  { id: "r15", from: "2024-08-12", to: "2024-08-16", days: 5, category: "Vacation", status: "approved", submitted: "2024-06-01", decided: "2024-06-03", decidedBy: "Priya Singh", reason: "Summer vacation" },
];

// ============================================================
// HELPERS
// ============================================================
const fmtDateShort = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const fmtDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// ============================================================
// MAIN
// ============================================================
export default function RequestHistory() {
  const [requests, setRequests] = useState(SEED_REQUESTS);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedYear, setSelectedYear] = useState(TODAY.getFullYear());
  const [expandedId, setExpandedId] = useState(null);
  const [pendingCancelId, setPendingCancelId] = useState(null);

  // Available years derived from data
  const availableYears = useMemo(() => {
    const years = new Set(requests.map(r => parseInt(r.from.split("-")[0], 10)));
    return [...years].sort((a, b) => b - a);
  }, [requests]);

  // Filter by year then by status
  const filteredByYear = useMemo(() =>
    requests.filter(r => r.from.startsWith(String(selectedYear))),
    [requests, selectedYear]
  );

  const counts = useMemo(() => ({
    pending:  filteredByYear.filter(r => r.status === "pending").length,
    approved: filteredByYear.filter(r => r.status === "approved").length,
    denied:   filteredByYear.filter(r => r.status === "denied").length,
  }), [filteredByYear]);

  // Sort by time-off date — pending ascending (soonest first), others descending
  const visible = useMemo(() => {
    const list = filteredByYear.filter(r => r.status === activeTab);
    if (activeTab === "pending") {
      return [...list].sort((a, b) => a.from.localeCompare(b.from));
    }
    return [...list].sort((a, b) => b.from.localeCompare(a.from));
  }, [filteredByYear, activeTab]);

  const requestToCancel = pendingCancelId ? requests.find(r => r.id === pendingCancelId) : null;

  const confirmCancel = () => {
    if (!pendingCancelId) return;
    setRequests(requests.filter(r => r.id !== pendingCancelId));
    setPendingCancelId(null);
  };

  // Reset expanded row when changing tabs/years
  useEffect(() => {
    setExpandedId(null);
  }, [activeTab, selectedYear]);

  return (
    <div className="censible-root">
      <style>{STYLES}</style>

      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <nav className="top">
        <div className="brand">Censible OS</div>
        <div className="nav-links">
          <div className="nav-link active">Time off</div>
          <div className="nav-link">Calendar</div>
        </div>
      </nav>

      <main style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "720px",
        margin: "0 auto",
        padding: "1.75rem 1.5rem 4rem",
      }}>
        {/* Back link */}
        <button className="back-link" style={{ marginBottom: "0.75rem" }}>
          <ChevronLeft size={15} />
          Back to time off
        </button>

        {/* Heading row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}>
          <h1 className="display-heading" style={{ fontSize: "2.25rem", margin: 0 }}>
            Request history
          </h1>
          <YearPicker
            value={selectedYear}
            options={availableYears}
            onChange={setSelectedYear}
          />
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending<span className="count">{counts.pending}</span>
          </button>
          <button
            className={`tab ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved<span className="count">{counts.approved}</span>
          </button>
          <button
            className={`tab ${activeTab === "denied" ? "active" : ""}`}
            onClick={() => setActiveTab("denied")}
          >
            Denied<span className="count">{counts.denied}</span>
          </button>
        </div>

        {/* Request list */}
        {visible.length === 0 ? (
          <EmptyState tab={activeTab} year={selectedYear} isCurrentYear={selectedYear === TODAY.getFullYear()} />
        ) : (
          <div className="glass" style={{ overflow: "hidden" }}>
            {visible.map((r, i) => (
              <RequestRow
                key={r.id}
                request={r}
                expanded={expandedId === r.id}
                onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                onCancel={() => setPendingCancelId(r.id)}
                isLast={i === visible.length - 1}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cancel confirmation modal */}
      {requestToCancel && (
        <CancelConfirmModal
          request={requestToCancel}
          onCancel={() => setPendingCancelId(null)}
          onConfirm={confirmCancel}
        />
      )}
    </div>
  );
}

// ============================================================
// YEAR PICKER (custom dropdown)
// ============================================================
function YearPicker({ value, options, onChange }) {
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

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          borderRadius: "9999px",
          padding: "0.5rem 0.85rem 0.5rem 1.1rem",
          fontSize: "0.88rem",
          color: "#231F20",
          fontFamily: "inherit",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
          transition: "background 200ms",
        }}
        onMouseOver={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.75)"}
        onMouseOut={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)"}
      >
        {value}
        <ChevronDown
          size={14}
          color="#807A7B"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
        />
      </button>
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "6px",
          background: "#FFFFFF",
          border: "1px solid #D5D1CA",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(35, 31, 32, 0.1), 0 20px 44px rgba(35, 31, 32, 0.22)",
          zIndex: 100,
          padding: "4px",
          minWidth: "100px",
        }}>
          {options.map(y => {
            const isSelected = y === value;
            return (
              <div
                key={y}
                onClick={() => { onChange(y); setOpen(false); }}
                style={{
                  padding: "0.5rem 0.7rem",
                  fontSize: "0.9rem",
                  color: isSelected ? "#2E6E84" : "#231F20",
                  background: isSelected ? "rgba(230, 240, 244, 0.95)" : "transparent",
                  fontWeight: isSelected ? 500 : 400,
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "background 100ms",
                  textAlign: "center",
                }}
                onMouseOver={e => { if (!isSelected) e.currentTarget.style.background = "rgba(230, 240, 244, 0.5)"; }}
                onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                {y}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// REQUEST ROW
// ============================================================
function RequestRow({ request, expanded, onToggle, onCancel, isLast }) {
  const r = request;
  const dateLabel = r.from === r.to ? fmtDate(r.from) : `${fmtDateShort(r.from)} – ${fmtDateShort(r.to)}, ${r.from.split("-")[0]}`;
  const isPending = r.status === "pending";
  const isDenied = r.status === "denied";

  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid rgba(229, 225, 218, 0.5)" }}>
      <div
        onClick={onToggle}
        style={{
          padding: "0.85rem 1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
          transition: "background 150ms",
        }}
        onMouseOver={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.45)"}
        onMouseOut={e => e.currentTarget.style.background = "transparent"}
      >
        {expanded
          ? <ChevronDown size={15} color="#807A7B" style={{ flexShrink: 0 }} />
          : <ChevronRight size={15} color="#807A7B" style={{ flexShrink: 0 }} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.95rem", color: "#231F20" }}>
            {dateLabel}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#807A7B", marginTop: "2px" }}>
            {r.days} day{r.days === 1 ? "" : "s"} · {r.category}
          </div>
        </div>
        <span className={`status-pill ${r.status}`}>{r.status}</span>
        {isPending && (
          <button
            onClick={(e) => { e.stopPropagation(); onCancel(); }}
            aria-label="Cancel request"
            title="Cancel request"
            style={{
              background: "transparent",
              border: "none",
              padding: "0.35rem",
              borderRadius: "50%",
              cursor: "pointer",
              color: "#807A7B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 150ms, color 150ms",
              flexShrink: 0,
            }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(185, 28, 28, 0.08)"; e.currentTarget.style.color = "#B91C1C"; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#807A7B"; }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Inline deny reason — always visible for denied rows */}
      {isDenied && r.denyReason && (
        <div style={{
          padding: "0 1rem 0.85rem 2.4rem",
          marginTop: "-0.3rem",
        }}>
          <div style={{
            padding: "0.6rem 0.85rem",
            background: "rgba(185, 28, 28, 0.05)",
            border: "1px solid rgba(185, 28, 28, 0.15)",
            borderRadius: "10px",
            fontSize: "0.83rem",
            color: "#4A4546",
            lineHeight: 1.5,
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem",
          }}>
            <AlertCircle size={14} color="#B91C1C" style={{ marginTop: "2px", flexShrink: 0 }} />
            <span>{r.denyReason}</span>
          </div>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          padding: "0 1rem 0.95rem 2.4rem",
          fontSize: "0.83rem",
          color: "#4A4546",
          lineHeight: 1.7,
        }}>
          <DetailLine label="Submitted" value={fmtDate(r.submitted)} />
          {r.decided && r.status === "approved" && (
            <DetailLine label="Approved" value={`${fmtDate(r.decided)} by ${r.decidedBy}`} />
          )}
          {r.decided && r.status === "denied" && (
            <DetailLine label="Denied" value={`${fmtDate(r.decided)} by ${r.decidedBy}`} />
          )}
          <DetailLine
            label="Reason"
            value={r.reason || <span style={{ fontStyle: "italic", color: "#B0ABAC" }}>None provided</span>}
          />
        </div>
      )}
    </div>
  );
}

function DetailLine({ label, value }) {
  return (
    <div style={{ display: "flex", gap: "0.65rem" }}>
      <span style={{
        color: "#807A7B",
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontSize: "0.68rem",
        minWidth: "72px",
        paddingTop: "0.1rem",
      }}>
        {label}
      </span>
      <span style={{ flex: 1 }}>{value}</span>
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================
function EmptyState({ tab, year, isCurrentYear }) {
  const messages = {
    pending: {
      title: "No pending requests",
      sub: isCurrentYear
        ? "Nothing waiting on approval right now."
        : `Nothing was waiting on approval in ${year}.`,
    },
    approved: {
      title: "Nothing approved yet",
      sub: isCurrentYear
        ? "Once an approval comes through, it'll show up here."
        : `No approved time off in ${year}.`,
    },
    denied: {
      title: "No denied requests",
      sub: isCurrentYear
        ? "Nothing has been denied this year. Good streak."
        : `No denials in ${year}.`,
    },
  };
  const m = messages[tab];

  return (
    <div className="glass" style={{
      padding: "3rem 1.5rem",
      textAlign: "center",
    }}>
      <div className="display-heading" style={{ fontSize: "1.2rem", color: "#231F20", marginBottom: "0.4rem" }}>
        {m.title}
      </div>
      <div style={{ fontSize: "0.88rem", color: "#807A7B" }}>
        {m.sub}
      </div>
    </div>
  );
}

// ============================================================
// CANCEL CONFIRMATION MODAL
// ============================================================
function CancelConfirmModal({ request, onCancel, onConfirm }) {
  const dateLabel = request.from === request.to
    ? fmtDate(request.from)
    : `${fmtDateShort(request.from)} – ${fmtDateShort(request.to)}, ${request.from.split("-")[0]}`;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <h2 className="display-heading" style={{ fontSize: "1.4rem", margin: "0 0 0.5rem" }}>
          Cancel this request?
        </h2>
        <p style={{ color: "#4A4546", fontSize: "0.92rem", margin: "0 0 0.4rem", lineHeight: 1.5 }}>
          <strong style={{ color: "#231F20", fontWeight: 500 }}>{dateLabel}</strong>
          <span style={{ color: "#807A7B" }}>
            {" — "}{request.days} day{request.days === 1 ? "" : "s"} · {request.category}
          </span>
        </p>
        <p style={{ color: "#807A7B", fontSize: "0.88rem", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
          This will withdraw the request. You'll need to submit a new one if you change your mind.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
          <button className="btn-ghost" onClick={onCancel}>Keep request</button>
          <button className="btn-danger" onClick={onConfirm}>Cancel request</button>
        </div>
      </div>
    </div>
  );
}