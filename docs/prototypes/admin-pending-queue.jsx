import React, { useState, useMemo } from "react";
import { Flag, X, Check, AlertCircle, Edit2, Search } from "lucide-react";

// ============================================================
// CENSIBLE OS — Admin Pending Queue
// Side-by-side: list left, details right. Full design system.
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
  nav.top .nav-link:hover { color: #231F20; }
  nav.top .nav-link.active {
    background: rgba(230, 240, 244, 0.7);
    color: #2E6E84;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
  }

  /* Buttons */
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
    cursor: pointer; font-family: inherit;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      0 2px 4px rgba(35, 31, 32, 0.15),
      0 8px 24px rgba(46, 110, 132, 0.28);
  }

  .btn-danger {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 9999px;
    font-weight: 500; font-size: 0.95rem;
    padding: 0.7rem 1.5rem;
    background: linear-gradient(180deg, #B91C1C 0%, #991B1B 100%);
    color: #FAF8F5;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(35, 31, 32, 0.12),
      0 4px 16px rgba(185, 28, 28, 0.2);
    transition: transform 200ms ease, box-shadow 200ms ease;
    cursor: pointer; font-family: inherit;
  }
  .btn-danger:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      0 2px 4px rgba(35, 31, 32, 0.15),
      0 8px 24px rgba(185, 28, 28, 0.28);
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
    gap: 0.4rem;
  }
  .btn-ghost:hover { background: rgba(255, 255, 255, 0.75); color: #231F20; }

  /* Input */
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

  /* Tabs - editorial underlined */
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
    border-top: none;
    border-left: none;
    border-right: none;
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

  .field-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: #807A7B;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.4rem;
  }

  /* List rows */
  .list-row {
    padding: 0.9rem 1.1rem;
    border-bottom: 1px solid rgba(229, 225, 218, 0.5);
    cursor: pointer;
    transition: background 150ms;
    border-left: 3px solid transparent;
  }
  .list-row:last-child { border-bottom: none; }
  .list-row:hover:not(.selected) { background: rgba(255, 255, 255, 0.4); }
  .list-row.selected {
    background: rgba(230, 240, 244, 0.85);
    border-left-color: #2E6E84;
  }

  /* Chip */
  .chip {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.22rem 0.55rem;
    border-radius: 9999px;
    font-size: 0.72rem;
    font-weight: 500;
    background: rgba(230, 240, 244, 0.85);
    color: #2E6E84;
    border: 1px solid rgba(255, 255, 255, 0.7);
  }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(35, 31, 32, 0.35);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1.5rem;
    animation: fadeIn 200ms ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .modal-panel {
    background: rgba(255, 253, 250, 0.95);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
      0 1px 2px rgba(35, 31, 32, 0.06),
      0 24px 60px rgba(35, 31, 32, 0.25);
    padding: 1.75rem;
    width: 100%;
    max-width: 460px;
  }

  /* Calendar snapshot */
  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  .cal-dow {
    text-align: center;
    color: #807A7B;
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.25rem 0;
  }
  .cal-day {
    border: 1px solid rgba(229, 225, 218, 0.7);
    background: rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    padding: 0.35rem 0.3rem 0.3rem;
    height: 70px;
    text-align: center;
    font-size: 0.78rem;
    position: relative;
    overflow: hidden;
  }
  .cal-day.empty {
    border: none;
    background: transparent;
  }
  .cal-day.requested {
    background: rgba(230, 240, 244, 0.85);
    border-color: #5AA6BB;
    box-shadow: inset 0 0 0 1px rgba(46, 110, 132, 0.15);
  }
  .cal-day-num {
    color: #4A4546;
    font-size: 0.72rem;
    font-weight: 500;
  }
  .cal-day.requested .cal-day-num { color: #2E6E84; font-weight: 600; }
  .cal-chip {
    display: block;
    margin-top: 4px;
    font-size: 0.62rem;
    background: rgba(46, 110, 132, 0.9);
    color: #FAF8F5;
    border-radius: 4px;
    padding: 1px 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Flag indicator dot in list */
  .flag-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #B91C1C;
    display: inline-block;
    flex-shrink: 0;
  }
`;

// ============================================================
// MOCK DATA
// ============================================================
const SEED_REQUESTS = [
  {
    id: 1, name: "Sarah Chen", pod: "North Pod", role: "AD",
    dates: "Jun 13–15", dateRange: ["Jun 13", "Jun 15"], days: 3,
    category: "Vacation", reason: "Family wedding",
    flagged: true, flags: [{ icon: AlertCircle, text: "Jen Liu is off Jun 15–17", short: "Pod conflict" }],
    balanceType: "vacation", balanceBefore: 7, balanceAfter: 4, balanceMax: 10,
    monthName: "June 2026", monthDays: 30, firstDayOfWeek: 1,
    requestedDays: [13,14,15],
    podAbsences: { 15: ["Jen"], 16: ["Jen"], 17: ["Jen"], 22: ["Alex"] },
    submitted: "May 28",
  },
  {
    id: 2, name: "Mike Park", pod: "South Pod", role: "AD",
    dates: "Jun 19", dateRange: ["Jun 19", "Jun 19"], days: 1,
    category: "Personal", reason: null,
    flagged: false, flags: [],
    balanceType: "personal", balanceBefore: 5, balanceAfter: 4, balanceMax: 7,
    monthName: "June 2026", monthDays: 30, firstDayOfWeek: 1,
    requestedDays: [19],
    podAbsences: { 9: ["Tom"], 26: ["Priya"] },
    submitted: "May 30",
  },
  {
    id: 3, name: "Jen Liu", pod: "North Pod", role: "AD",
    dates: "Jul 6–10", dateRange: ["Jul 6", "Jul 10"], days: 5,
    category: "Vacation", reason: "Trip to Maine",
    flagged: false, flags: [],
    balanceType: "vacation", balanceBefore: 8, balanceAfter: 3, balanceMax: 10,
    monthName: "July 2026", monthDays: 31, firstDayOfWeek: 3,
    requestedDays: [6,7,8,9,10],
    podAbsences: { 1: ["Sarah"], 25: ["Alex"] },
    submitted: "May 29",
  },
  {
    id: 4, name: "Alex Rivera", pod: "North Pod", role: "AD",
    dates: "Jun 4", dateRange: ["Jun 4", "Jun 4"], days: 0.5,
    category: "Personal", reason: null,
    flagged: true, flags: [{ icon: AlertCircle, text: "Over by 0.5 — exceeds personal balance", short: "Not enough days" }],
    balanceType: "personal", balanceBefore: 0, balanceAfter: -0.5, balanceMax: 7,
    monthName: "June 2026", monthDays: 30, firstDayOfWeek: 1,
    requestedDays: [4],
    podAbsences: { 15: ["Jen"], 16: ["Jen"], 17: ["Jen"] },
    submitted: "May 31",
  },
  {
    id: 5, name: "Jordan Kim", pod: "East Pod", role: "AD",
    dates: "Jul 4", dateRange: ["Jul 4", "Jul 4"], days: 1,
    category: "Holiday", reason: null,
    flagged: false, flags: [],
    balanceType: "holiday", balanceBefore: 4, balanceAfter: 3, balanceMax: 4,
    monthName: "July 2026", monthDays: 31, firstDayOfWeek: 3,
    requestedDays: [4],
    podAbsences: { 14: ["Casey"] },
    submitted: "Jun 1",
  },
];

// ============================================================
// COMPONENT
// ============================================================
export default function AdminPendingQueue() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pending, setPending] = useState(SEED_REQUESTS);
  const [decided, setDecided] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [denyReason, setDenyReason] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [decidedSearch, setDecidedSearch] = useState("");

  const selected = pending.find(r => r.id === selectedId);

  const decidedFiltered = useMemo(() => {
    if (!decidedSearch.trim()) return decided;
    return decided.filter(r => r.name.toLowerCase().includes(decidedSearch.toLowerCase()));
  }, [decided, decidedSearch]);

  const handleDecision = (action) => {
    if (!selected) return;
    const remaining = pending.filter(r => r.id !== selected.id);
    setDecided([...decided, {
      ...selected,
      decision: action,
      decidedOn: "Jun 1",
      ...(action === "deny" && denyReason.trim() ? { denyReason: denyReason.trim() } : {})
    }]);
    setPending(remaining);
    setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    setConfirmAction(null);
    setDenyReason("");
    setIsEditing(false);
  };

  const closeConfirm = () => {
    setConfirmAction(null);
    setDenyReason("");
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
          <div className="nav-link active">Requests</div>
          <div className="nav-link">Calendar</div>
        </div>
      </nav>

      <main style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "2rem 1.5rem 4rem",
      }}>
        <h1 className="display-heading" style={{ fontSize: "2.5rem", margin: "0 0 1.75rem" }}>
          Time off requests
        </h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending<span className="count">{pending.length}</span>
          </button>
          <button
            className={`tab ${activeTab === "decided" ? "active" : ""}`}
            onClick={() => setActiveTab("decided")}
          >
            Decided<span className="count">{decided.length}</span>
          </button>
        </div>

        {/* Layout: single column when nothing selected, two-column when reviewing */}
        <div style={{
          display: "grid",
          gridTemplateColumns: selected ? "260px 1fr" : "1fr",
          gap: "1.5rem",
          maxWidth: selected ? "none" : "640px",
          margin: selected ? "0" : "0 auto",
          transition: "max-width 200ms ease",
        }}>

          {/* LEFT - list */}
          <div className="glass" style={{ overflow: "hidden", alignSelf: "flex-start" }}>
            {activeTab === "pending" ? (
              pending.length === 0 ? (
                <AllCaughtUpInline />
              ) : (
                pending.map(r => (
                  <div
                    key={r.id}
                    className={`list-row ${selectedId === r.id ? "selected" : ""}`}
                    onClick={() => { setSelectedId(r.id); setIsEditing(false); }}
                  >
                    <div style={{ fontWeight: 500, color: "#231F20" }}>{r.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "#807A7B", marginTop: "3px" }}>
                      {r.dates} · {r.days} day{r.days === 1 ? "" : "s"} · {r.category}
                    </div>
                    {r.flagged && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        marginTop: "0.45rem",
                        fontSize: "0.78rem",
                        color: "#B91C1C",
                        fontWeight: 500,
                      }}>
                        <AlertCircle size={14} style={{ flexShrink: 0 }} />
                        <span>{r.flags[0].short}</span>
                      </div>
                    )}
                  </div>
                ))
              )
            ) : (
              <DecidedList
                items={decidedFiltered}
                searchValue={decidedSearch}
                onSearch={setDecidedSearch}
                hasAny={decided.length > 0}
              />
            )}
          </div>

          {/* RIGHT - details (only when something is selected) */}
          {selected && activeTab === "pending" && (
            <div className="glass" style={{ padding: "1.75rem", minHeight: "560px" }}>
              <DetailsPanel
                request={selected}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing(!isEditing)}
                onClose={() => { setSelectedId(null); setIsEditing(false); }}
                onApprove={() => setConfirmAction("approve")}
                onDeny={() => setConfirmAction("deny")}
              />
            </div>
          )}
        </div>
      </main>

      {/* Confirmation modal */}
      {confirmAction && selected && (
        <div className="modal-backdrop" onClick={closeConfirm}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <h2 className="display-heading" style={{ fontSize: "1.4rem", margin: "0 0 0.5rem" }}>
              {confirmAction === "approve" ? "Approve this request?" : "Deny this request?"}
            </h2>
            <p style={{ color: "#807A7B", fontSize: "0.9rem", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
              {selected.name}'s {selected.category.toLowerCase()} request for{" "}
              <strong style={{ color: "#231F20", fontWeight: 500 }}>{selected.dates}</strong>
              {" "}({selected.days} day{selected.days === 1 ? "" : "s"}).
            </p>
            {confirmAction === "deny" && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  color: "#807A7B",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "0.4rem",
                }}>
                  Reason <span style={{ textTransform: "none", letterSpacing: 0, color: "#B0ABAC", fontWeight: 400 }}>· optional</span>
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Visible to the employee in their history"
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  style={{ resize: "vertical", minHeight: "60px" }}
                  autoFocus
                />
              </div>
            )}
            <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={closeConfirm}>Cancel</button>
              {confirmAction === "approve" ? (
                <button className="btn-primary" onClick={() => handleDecision("approve")}>
                  <Check size={16} style={{ marginRight: "0.3rem" }} />
                  Approve
                </button>
              ) : (
                <button className="btn-danger" onClick={() => handleDecision("deny")}>
                  Deny
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================
function DetailsPanel({ request, isEditing, onToggleEdit, onClose, onApprove, onDeny }) {
  return (
    <>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1.5rem",
        paddingBottom: "1.25rem",
        borderBottom: "1px solid rgba(229, 225, 218, 0.6)",
      }}>
        <div>
          <h2 className="display-heading" style={{ fontSize: "1.65rem", margin: 0 }}>
            {request.name}
          </h2>
          <div style={{ fontSize: "0.85rem", color: "#807A7B", marginTop: "0.35rem" }}>
            {request.pod} · {request.role} · submitted {request.submitted}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <button className="btn-ghost" onClick={onToggleEdit}>
            <Edit2 size={14} />
            {isEditing ? "Done" : "Edit"}
          </button>
          <button
            onClick={onClose}
            aria-label="Close details"
            style={{
              background: "transparent",
              border: "none",
              padding: "0.5rem",
              borderRadius: "50%",
              cursor: "pointer",
              color: "#807A7B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 200ms, color 200ms",
              fontFamily: "inherit",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(229, 225, 218, 0.5)"; e.currentTarget.style.color = "#231F20"; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#807A7B"; }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Dates */}
      <Section label="Dates">
        {isEditing ? (
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 140px" }}>
              <span className="field-label">From</span>
              <input className="input-field" defaultValue={request.dateRange[0]} />
            </div>
            <div style={{ flex: "0 0 140px" }}>
              <span className="field-label">To</span>
              <input className="input-field" defaultValue={request.dateRange[1]} />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "1.05rem", color: "#231F20" }}>{request.dates}</span>
            <span className="chip">{request.category}</span>
            <span style={{ fontSize: "0.85rem", color: "#807A7B" }}>
              · {request.days} day{request.days === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </Section>

      {/* Reason */}
      <Section label="Reason">
        {isEditing ? (
          <input className="input-field" defaultValue={request.reason || ""} placeholder="No reason provided" />
        ) : (
          <div style={{
            fontSize: "0.95rem",
            color: request.reason ? "#231F20" : "#B0ABAC",
            fontStyle: request.reason ? "normal" : "italic",
          }}>
            {request.reason || "Not provided"}
          </div>
        )}
      </Section>

      {/* Balance */}
      <Section label={`${cap(request.balanceType)} balance`}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
          <span className="display-heading" style={{ fontSize: "1.5rem", color: "#231F20" }}>
            {request.balanceBefore}
          </span>
          <span style={{ color: "#B0ABAC", fontSize: "1rem" }}>→</span>
          <span className="display-heading" style={{
            fontSize: "1.5rem",
            color: request.balanceAfter < 0 ? "#B91C1C" : "#231F20",
          }}>
            {request.balanceAfter}
          </span>
          <span style={{ fontSize: "0.85rem", color: "#807A7B" }}>
            of {request.balanceMax} after approval
          </span>
        </div>
      </Section>

      {/* Flags */}
      {request.flags.length > 0 && (
        <Section label="Flags">
          {request.flags.map((f, i) => {
            const Icon = f.icon;
            const isDanger = f.icon === AlertCircle;
            return (
              <div key={i} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
                padding: "0.7rem 0.9rem",
                background: isDanger ? "rgba(185, 28, 28, 0.06)" : "rgba(230, 240, 244, 0.7)",
                border: `1px solid ${isDanger ? "rgba(185, 28, 28, 0.2)" : "rgba(90, 166, 187, 0.25)"}`,
                borderRadius: "12px",
                fontSize: "0.875rem",
                color: isDanger ? "#B91C1C" : "#2E6E84",
                lineHeight: 1.45,
                marginBottom: "0.4rem",
              }}>
                <Icon size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>{f.text}</span>
              </div>
            );
          })}
        </Section>
      )}

      {/* Calendar snapshot */}
      <Section label={`${request.pod} — ${request.monthName}`}>
        <CalendarSnapshot
          monthDays={request.monthDays}
          firstDayOfWeek={request.firstDayOfWeek}
          requestedDays={request.requestedDays}
          absences={request.podAbsences}
        />
      </Section>

      {/* Actions */}
      <div style={{
        display: "flex",
        gap: "0.75rem",
        marginTop: "2rem",
        paddingTop: "1.25rem",
        borderTop: "1px solid rgba(229, 225, 218, 0.6)",
      }}>
        <button className="btn-primary" onClick={onApprove}>Approve</button>
        <button className="btn-danger" onClick={onDeny}>Deny</button>
      </div>
    </>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <span className="field-label">{label}</span>
      {children}
    </div>
  );
}

function CalendarSnapshot({ monthDays, firstDayOfWeek, requestedDays, absences }) {
  const dowLabels = ["S","M","T","W","T","F","S"];
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let i = 1; i <= monthDays; i++) cells.push(i);

  return (
    <div>
      <div className="cal-grid" style={{ marginBottom: "4px" }}>
        {dowLabels.map((d, i) => (
          <div key={i} className="cal-dow">{d}</div>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`e-${i}`} className="cal-day empty" />;
          }
          const isRequested = requestedDays.includes(day);
          const dayAbsences = absences[day] || [];
          return (
            <div key={day} className={`cal-day ${isRequested ? "requested" : ""}`}>
              <div className="cal-day-num">{day}</div>
              {dayAbsences.map((name, idx) => (
                <span key={idx} className="cal-chip">{name}</span>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.72rem", color: "#807A7B", marginTop: "0.85rem", flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{
            display: "inline-block",
            width: "12px", height: "12px",
            background: "rgba(230, 240, 244, 0.85)",
            border: "1px solid #5AA6BB",
            borderRadius: "3px",
          }} />
          Requested
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span className="cal-chip" style={{ margin: 0, display: "inline-block" }}>name</span>
          Pod member off
        </span>
      </div>
    </div>
  );
}

function DecidedList({ items, searchValue, onSearch, hasAny }) {
  return (
    <>
      <div style={{ padding: "0.9rem 1.1rem", borderBottom: "1px solid rgba(229, 225, 218, 0.5)" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#807A7B",
          }} />
          <input
            className="input-field"
            placeholder="Filter by employee"
            value={searchValue}
            onChange={e => onSearch(e.target.value)}
            style={{ paddingLeft: "1.4rem", fontSize: "0.875rem" }}
          />
        </div>
      </div>
      {!hasAny ? (
        <div style={{ padding: "3rem 1rem", textAlign: "center", color: "#807A7B" }}>
          <div className="display-heading" style={{ fontSize: "1.1rem", marginBottom: "0.35rem", color: "#231F20" }}>
            Nothing yet
          </div>
          <div style={{ fontSize: "0.82rem" }}>
            Decided requests will appear here.
          </div>
        </div>
      ) : items.length === 0 ? (
        <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#807A7B", fontSize: "0.82rem" }}>
          No matches.
        </div>
      ) : (
        items.map(r => (
          <div key={r.id} className="list-row" style={{ cursor: "default" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 500, color: "#231F20" }}>{r.name}</span>
              <span style={{
                fontSize: "0.72rem",
                fontWeight: 500,
                color: r.decision === "approve" ? "#2E7D32" : "#B91C1C",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>
                {r.decision === "approve" ? "Approved" : "Denied"}
              </span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#807A7B", marginTop: "3px" }}>
              {r.dates} · {r.days} day{r.days === 1 ? "" : "s"} · {r.category}
            </div>
          </div>
        ))
      )}
    </>
  );
}

function AllCaughtUpInline() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem 1.5rem",
      textAlign: "center",
    }}>
      <div style={{
        width: "52px", height: "52px",
        borderRadius: "50%",
        background: "rgba(230, 240, 244, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1rem",
      }}>
        <Check size={24} color="#2E6E84" />
      </div>
      <h2 className="display-heading" style={{ fontSize: "1.5rem", margin: "0 0 0.4rem" }}>
        All caught up
      </h2>
      <div style={{ fontSize: "0.88rem", color: "#807A7B" }}>
        No pending requests to review.
      </div>
    </div>
  );
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);