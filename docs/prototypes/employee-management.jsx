import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, X, Edit2, Plus, Upload, ChevronDown, ChevronRight, ChevronLeft,
  ChevronsLeft, ChevronsRight,
  Shield, Check, AlertCircle, Calendar
} from "lucide-react";

// ============================================================
// CENSIBLE OS — Employee Management
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
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      0 2px 4px rgba(35, 31, 32, 0.15),
      0 8px 24px rgba(46, 110, 132, 0.28);
  }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

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

  /* Input */
  .input-field {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(229, 225, 218, 0.7);
    padding: 0.55rem 0;
    font-size: 0.95rem;
    color: #231F20;
    font-family: inherit;
    outline: none;
    transition: border-color 200ms;
  }
  .input-field::placeholder { color: #B0ABAC; }
  .input-field:focus { border-bottom-color: #2E6E84; }

  /* Search input with icon */
  .search-wrap {
    position: relative;
    flex: 1;
    min-width: 0;
  }

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

  /* Pod view kanban */
  .pod-card {
    background: rgba(255, 253, 250, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 0.7rem 0.85rem;
    cursor: grab;
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.65),
      0 1px 2px rgba(35, 31, 32, 0.04);
    transition: transform 150ms ease, box-shadow 150ms ease, opacity 150ms;
    user-select: none;
  }
  .pod-card:hover {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.65),
      0 2px 6px rgba(35, 31, 32, 0.08);
  }
  .pod-card:active { cursor: grabbing; }
  .pod-card.dragging { opacity: 0.4; }
  .pod-card.selected {
    background: rgba(230, 240, 244, 0.95);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
      0 0 0 1.5px #2E6E84;
  }
  .pod-card.compact {
    padding: 0.4rem 0.7rem;
  }
  .search-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 9999px;
    padding: 0.55rem 0.9rem 0.55rem 2.3rem;
    font-size: 0.88rem;
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
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    color: #807A7B;
    pointer-events: none;
  }

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

  /* Field label */
  .field-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: #807A7B;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.35rem;
  }

  /* List rows */
  .list-row {
    padding: 0.85rem 1rem;
    border-bottom: 1px solid rgba(229, 225, 218, 0.5);
    cursor: pointer;
    transition: background 150ms;
    border-left: 3px solid transparent;
  }
  .list-row:last-child { border-bottom: none; }
  .list-row:hover:not(.selected) { background: rgba(255, 255, 255, 0.5); }
  .list-row.selected {
    background: rgba(230, 240, 244, 0.85);
    border-left-color: #2E6E84;
  }
  .list-group-header {
    padding: 0.55rem 1rem 0.45rem;
    font-size: 0.68rem;
    font-weight: 500;
    color: #807A7B;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(229, 225, 218, 0.5);
  }

  /* Admin badge */
  .admin-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 1px 6px;
    border-radius: 9999px;
    font-size: 0.65rem;
    font-weight: 500;
    background: rgba(46, 110, 132, 0.12);
    color: #2E6E84;
    margin-left: 0.4rem;
  }

  /* Toggle switch */
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
  .toggle-switch.disabled { opacity: 0.4; cursor: not-allowed; }

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
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
  }

  /* Native select tweaks */
  select.input-field {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23807A7B%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 0.2rem center;
    padding-right: 1.5rem;
  }

  /* Status pill */
  .status-pill {
    display: inline-flex; align-items: center;
    padding: 0.2rem 0.55rem;
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .status-pill.pending { background: rgba(46, 110, 132, 0.12); color: #2E6E84; }
  .status-pill.approved { background: rgba(46, 125, 50, 0.12); color: #2E7D32; }
  .status-pill.denied { background: rgba(185, 28, 28, 0.1); color: #B91C1C; }

  /* Balance tile */
  .balance-tile {
    background: rgba(255, 253, 250, 0.55);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 14px;
    padding: 0.85rem 0.95rem;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.65);
  }
  .balance-tile-label {
    font-size: 0.65rem;
    font-weight: 500;
    color: #807A7B;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 0.45rem;
  }
  .balance-input {
    width: 50px;
    background: transparent;
    border: none;
    border-bottom: 1.5px solid #2E6E84;
    padding: 0 0.15rem 0.1rem;
    font-family: 'Fraunces', serif;
    font-size: 1.6rem;
    color: #231F20;
    font-weight: 400;
    outline: none;
  }
`;

// ============================================================
// MOCK DATA
// ============================================================

const SEED_EMPLOYEES = [
  // North Pod
  { id: 1,  name: "Alex Rivera",  email: "alex@censible.com",    title: "Admissions Director", pod: "North", isAdmin: false, hireDate: "2024-08-12", active: true, balances: { vacation: 4, personal: 2, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 2,  name: "Casey Wong",   email: "casey@censible.com",   title: "Admissions Director", pod: "North", isAdmin: false, hireDate: "2023-02-01", active: true, balances: { vacation: 9, personal: 6, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 3,  name: "Jen Liu",      email: "jen@censible.com",     title: "Admissions Director", pod: "North", isAdmin: false, hireDate: "2022-11-15", active: true, balances: { vacation: 8, personal: 7, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 4,  name: "Mike Park",    email: "mike@censible.com",    title: "Admissions Director", pod: "North", isAdmin: false, hireDate: "2024-05-20", active: true, balances: { vacation: 5, personal: 4, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 5,  name: "Sarah Chen",   email: "sarah@censible.com",   title: "Admissions Director", pod: "North", isAdmin: true,  hireDate: "2024-03-15", active: true, balances: { vacation: 7, personal: 5, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  // South Pod
  { id: 6,  name: "Dev Patel",    email: "dev@censible.com",     title: "Admissions Director", pod: "South", isAdmin: false, hireDate: "2023-06-10", active: true, balances: { vacation: 6, personal: 5, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 7,  name: "Lena Park",    email: "lena@censible.com",    title: "Admissions Director", pod: "South", isAdmin: false, hireDate: "2024-01-08", active: true, balances: { vacation: 9, personal: 6, holiday: 3, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 8,  name: "Marcus Hill",  email: "marcus@censible.com",  title: "Admissions Director", pod: "South", isAdmin: false, hireDate: "2023-09-22", active: true, balances: { vacation: 7, personal: 5, holiday: 4, holidayComp: 1 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 9,  name: "Priya Singh",  email: "priya@censible.com",   title: "Admissions Director", pod: "South", isAdmin: true,  hireDate: "2022-04-03", active: true, balances: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 10, name: "Riley Brooks", email: "riley@censible.com",   title: "Admissions Director", pod: "South", isAdmin: false, hireDate: "2025-01-15", active: true, balances: { vacation: 8, personal: 7, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  // East Pod
  { id: 11, name: "Avery Lopez",  email: "avery@censible.com",   title: "Admissions Director", pod: "East",  isAdmin: false, hireDate: "2023-11-30", active: true, balances: { vacation: 6, personal: 5, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 12, name: "Jordan Kim",   email: "jordan@censible.com",  title: "Admissions Director", pod: "East",  isAdmin: false, hireDate: "2024-07-08", active: true, balances: { vacation: 5, personal: 3, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 13, name: "Morgan Diaz",  email: "morgan@censible.com",  title: "Admissions Director", pod: "East",  isAdmin: false, hireDate: "2023-04-19", active: true, balances: { vacation: 4, personal: 5, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 14, name: "Quinn Foster", email: "quinn@censible.com",   title: "Admissions Director", pod: "East",  isAdmin: false, hireDate: "2024-10-05", active: true, balances: { vacation: 9, personal: 7, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  { id: 15, name: "Sam Walker",   email: "sam@censible.com",     title: "Admissions Director", pod: "East",  isAdmin: false, hireDate: "2022-08-14", active: true, balances: { vacation: 8, personal: 7, holiday: 4, holidayComp: 2 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
  // Non-pod employees
  { id: 16, name: "Drew Nakamura",email: "drew@censible.com",    title: "Billing Specialist",  pod: null, isAdmin: false, hireDate: "2024-02-12", active: true, balances: { vacation: 8, personal: 7, holiday: 0, holidayComp: 0 }, totals: { vacation: 10, personal: 7, holiday: 0, holidayComp: 0 } },
  { id: 17, name: "Pat Taylor",   email: "pat@censible.com",     title: "Office Coordinator",  pod: null, isAdmin: false, hireDate: "2023-11-01", active: true, balances: { vacation: 6, personal: 5, holiday: 0, holidayComp: 0 }, totals: { vacation: 10, personal: 7, holiday: 0, holidayComp: 0 } },
  { id: 18, name: "Reese Owens",  email: "reese@censible.com",   title: "Account Manager",     pod: null, isAdmin: false, hireDate: "2025-02-04", active: true, balances: { vacation: 9, personal: 7, holiday: 0, holidayComp: 0 }, totals: { vacation: 10, personal: 7, holiday: 0, holidayComp: 0 } },
  { id: 19, name: "Taylor Cruz",  email: "taylor@censible.com",  title: "Operations Manager",  pod: null, isAdmin: false, hireDate: "2022-05-08", active: true, balances: { vacation: 10, personal: 7, holiday: 0, holidayComp: 0 }, totals: { vacation: 10, personal: 7, holiday: 0, holidayComp: 0 } },
  // Deactivated example
  { id: 20, name: "Robin Hayes",  email: "robin@censible.com",   title: "Admissions Director", pod: null, isAdmin: false, hireDate: "2021-06-15", active: false, balances: { vacation: 0, personal: 0, holiday: 0, holidayComp: 0 }, totals: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 } },
];

// Per-employee request history mocks
const REQUEST_HISTORY = {
  5: [
    { id: "r1", from: "2026-06-13", to: "2026-06-15", days: 3, category: "Vacation", status: "pending", submitted: "2026-05-28", reason: "Family wedding" },
    { id: "r2", from: "2026-04-08", to: "2026-04-08", days: 1, category: "Personal", status: "approved", submitted: "2026-04-07", decided: "2026-04-07", decidedBy: "Priya Singh", reason: null },
    { id: "r3", from: "2026-02-20", to: "2026-02-21", days: 2, category: "Vacation", status: "approved", submitted: "2026-01-28", decided: "2026-01-29", decidedBy: "Priya Singh", reason: "Long weekend in Vermont" },
    { id: "r4", from: "2026-01-10", to: "2026-01-10", days: 1, category: "Personal", status: "denied", submitted: "2026-01-09", decided: "2026-01-09", decidedBy: "Priya Singh", reason: null },
  ],
  9: [
    { id: "r5", from: "2026-07-06", to: "2026-07-10", days: 5, category: "Vacation", status: "approved", submitted: "2026-05-15", decided: "2026-05-16", decidedBy: "Sarah Chen", reason: "Trip to Spain" },
  ],
  16: [
    { id: "r6", from: "2026-06-19", to: "2026-06-19", days: 1, category: "Personal", status: "pending", submitted: "2026-05-30", reason: null },
  ],
};

const POD_OPTIONS = ["North", "South", "East"];

const POD_COLORS = {
  "North": { color: "#5AA6BB", deep: "#2E6E84", light: "rgba(90, 166, 187, 0.18)" },
  "South": { color: "#C2876C", deep: "#8C5A45", light: "rgba(194, 135, 108, 0.18)" },
  "East":  { color: "#9BAB85", deep: "#6B7E5B", light: "rgba(155, 171, 133, 0.18)" },
  "No pod": { color: "#B0ABAC", deep: "#807A7B", light: "rgba(176, 171, 172, 0.15)" },
};

const ANNUAL_ALLOTMENTS = {
  withPod: { vacation: 10, personal: 7, holiday: 4, holidayComp: 2 },
  noPod:   { vacation: 10, personal: 7, holiday: 0, holidayComp: 0 },
};

// ============================================================
// HELPERS
// ============================================================
const fmtDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const fmtDateShort = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getQuarter = (iso) => {
  const m = parseInt(iso.split("-")[1], 10);
  if (m <= 3) return 1; if (m <= 6) return 2; if (m <= 9) return 3; return 4;
};

const prorateBalance = (hireDate, total) => {
  const q = getQuarter(hireDate);
  const factor = [1, 0.75, 0.5, 0.25][q - 1];
  return Math.round(total * factor);
};

// ============================================================
// MAIN
// ============================================================
export default function EmployeeManagement() {
  const [employees, setEmployees] = useState(SEED_EMPLOYEES);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" or "pod"
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [balanceReason, setBalanceReason] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Drag-and-drop state (for pod view)
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverPod, setDragOverPod] = useState(null);

  const active = employees.filter(e => e.active);
  const deactivated = employees.filter(e => !e.active);

  const currentList = activeTab === "active" ? active : deactivated;

  // Apply search
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return currentList;
    const q = searchQuery.toLowerCase();
    return currentList.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      (e.pod && e.pod.toLowerCase().includes(q))
    );
  }, [currentList, searchQuery]);

  // Sorted alphabetical (used by list view)
  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => a.name.localeCompare(b.name)),
    [filtered]
  );

  // Pod buckets (used by pod view)
  const podBuckets = useMemo(() => {
    const buckets = { North: [], South: [], East: [], "No pod": [] };
    sorted.forEach(e => {
      const key = e.pod || "No pod";
      buckets[key].push(e);
    });
    return buckets;
  }, [sorted]);

  const selected = employees.find(e => e.id === selectedId);

  const startEdit = () => {
    if (!selected) return;
    // Snapshot "used" so it stays constant while editing total
    const used = {};
    Object.keys(selected.balances).forEach(k => {
      used[k] = selected.totals[k] - selected.balances[k];
    });
    setEditForm({
      name: selected.name,
      email: selected.email,
      title: selected.title,
      pod: selected.pod,
      isAdmin: selected.isAdmin,
      hireDate: selected.hireDate,
      balances: { ...selected.balances },
      totals: { ...selected.totals },
      _used: used,
    });
    setBalanceReason("");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
    setBalanceReason("");
  };

  const saveEdit = () => {
    if (!selected || !editForm) return;
    const { _used, ...persistedForm } = editForm;
    setEmployees(employees.map(e =>
      e.id === selected.id ? { ...e, ...persistedForm } : e
    ));
    setIsEditing(false);
    setEditForm(null);
    setBalanceReason("");
  };

  const addEmployee = (newEmp) => {
    const nextId = Math.max(...employees.map(e => e.id)) + 1;
    setEmployees([...employees, { ...newEmp, id: nextId, active: true }]);
    setShowAddModal(false);
    setSelectedId(nextId);
  };

  const deactivate = () => {
    if (!selected) return;
    setEmployees(employees.map(e =>
      e.id === selected.id ? { ...e, active: false } : e
    ));
    setShowDeactivateModal(false);
    setSelectedId(null);
    setIsEditing(false);
  };

  const reactivate = () => {
    if (!selected) return;
    setEmployees(employees.map(e =>
      e.id === selected.id ? { ...e, active: true } : e
    ));
    setSelectedId(null);
  };

  // Drag-and-drop handlers (pod view)
  const handleDragStart = (e, employee) => {
    setDraggingId(employee.id);
    e.dataTransfer.setData("text/plain", String(employee.id));
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverPod(null);
  };
  const handleDragOver = (e, pod) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverPod !== pod) setDragOverPod(pod);
  };
  const handleDrop = (e, targetPodKey) => {
    e.preventDefault();
    const empId = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const newPod = targetPodKey === "No pod" ? null : targetPodKey;
    setEmployees(employees.map(emp =>
      emp.id === empId ? { ...emp, pod: newPod } : emp
    ));
    setDraggingId(null);
    setDragOverPod(null);
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
          <div className="nav-link active">Employees</div>
        </div>
      </nav>

      <main style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "2rem 1.5rem 4rem",
      }}>
        {/* Heading + top actions */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "1.5rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}>
          <h1 className="display-heading" style={{ fontSize: "2.5rem", margin: 0 }}>
            Employees
          </h1>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button className="btn-ghost" onClick={() => setShowImportModal(true)}>
              <Upload size={14} /> Import CSV
            </button>
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={15} /> Add employee
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => { setActiveTab("active"); setSelectedId(null); setIsEditing(false); }}
          >
            Active<span className="count">{active.length}</span>
          </button>
          <button
            className={`tab ${activeTab === "deactivated" ? "active" : ""}`}
            onClick={() => { setActiveTab("deactivated"); setSelectedId(null); setIsEditing(false); }}
          >
            Deactivated<span className="count">{deactivated.length}</span>
          </button>
        </div>

        {/* Layout: changes based on viewMode + selection */}
        <div style={{
          display: viewMode === "pod" ? "flex" : "grid",
          flexDirection: viewMode === "pod" ? "column" : undefined,
          gridTemplateColumns: viewMode === "pod" ? undefined : (selected ? "320px 1fr" : "1fr"),
          gap: "1.5rem",
          maxWidth: (!selected && viewMode === "list") ? "720px" : "none",
          margin: (!selected && viewMode === "list") ? "0 auto" : "0",
          transition: "max-width 200ms ease",
        }}>
          {/* MAIN AREA: list or pod view */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", minWidth: 0 }}>
            {/* Search + view toggle */}
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              <div className="search-wrap">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name, title, or pod"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              {activeTab === "active" && (
                <div className="segmented" style={{ flexShrink: 0 }}>
                  <button
                    className={viewMode === "list" ? "active" : ""}
                    onClick={() => setViewMode("list")}
                  >List</button>
                  <button
                    className={viewMode === "pod" ? "active" : ""}
                    onClick={() => setViewMode("pod")}
                  >Pod</button>
                </div>
              )}
            </div>

            {/* List view OR Pod view */}
            {viewMode === "list" || activeTab === "deactivated" ? (
              <div className="glass" style={{ overflow: "hidden" }}>
                {sorted.length === 0 ? (
                  <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#807A7B", fontSize: "0.88rem" }}>
                    {searchQuery ? "No matches." : (activeTab === "deactivated" ? "No deactivated employees." : "No employees yet.")}
                  </div>
                ) : (
                  sorted.map(emp => {
                    const isSelected = selectedId === emp.id;
                    return (
                      <div
                        key={emp.id}
                        className={`list-row ${isSelected ? "selected" : ""}`}
                        onClick={() => { setSelectedId(emp.id); setIsEditing(false); }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 500, color: "#231F20", display: "inline-flex", alignItems: "center" }}>
                            {emp.name}
                            {emp.isAdmin && (
                              <span className="admin-badge">
                                <Shield size={9} /> Admin
                              </span>
                            )}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#807A7B", marginTop: "3px" }}>
                          {emp.title} · {emp.pod ? `${emp.pod} Pod` : "No pod"}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <PodView
                podBuckets={podBuckets}
                selectedId={selectedId}
                draggingId={draggingId}
                dragOverPod={dragOverPod}
                onSelect={(emp) => { setSelectedId(emp.id); setIsEditing(false); }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                searchActive={!!searchQuery}
                compact={!!selected}
              />
            )}
          </div>

          {/* RIGHT: details */}
          {selected && (
            <div className="glass" style={{ padding: "1.75rem", minHeight: "560px" }}>
              <EmployeeDetail
                employee={selected}
                isEditing={isEditing}
                editForm={editForm}
                setEditForm={setEditForm}
                balanceReason={balanceReason}
                setBalanceReason={setBalanceReason}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSave={saveEdit}
                onClose={() => { setSelectedId(null); setIsEditing(false); }}
                onDeactivate={() => setShowDeactivateModal(true)}
                onReactivate={reactivate}
                requests={REQUEST_HISTORY[selected.id] || []}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddEmployeeModal
          onCancel={() => setShowAddModal(false)}
          onAdd={addEmployee}
        />
      )}
      {showImportModal && (
        <ImportCSVModal onClose={() => setShowImportModal(false)} />
      )}
      {showDeactivateModal && selected && (
        <DeactivateModal
          employee={selected}
          onCancel={() => setShowDeactivateModal(false)}
          onConfirm={deactivate}
        />
      )}
    </div>
  );
}

// ============================================================
// EMPLOYEE DETAIL PANEL
// ============================================================
function EmployeeDetail({
  employee, isEditing, editForm, setEditForm,
  balanceReason, setBalanceReason,
  onStartEdit, onCancelEdit, onSave, onClose,
  onDeactivate, onReactivate, requests,
}) {
  const current = isEditing ? editForm : employee;

  const setField = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  // Edit total - keep "used" constant, recompute available
  const setTotal = (key, newTotal) => {
    const used = editForm._used[key];
    setEditForm({
      ...editForm,
      totals: { ...editForm.totals, [key]: newTotal },
      balances: { ...editForm.balances, [key]: Math.max(0, newTotal - used) },
    });
  };

  const balanceKeys = current.pod
    ? ["vacation", "personal", "holiday", "holidayComp"]
    : ["vacation", "personal"];
  const balanceLabels = {
    vacation: "Vacation",
    personal: "Personal",
    holiday: "Holiday",
    holidayComp: "Holiday comp",
  };

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
        gap: "1rem",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <input
                value={editForm.name}
                onChange={e => setField("name", e.target.value)}
                placeholder="Employee name"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.6rem",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#231F20",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(229, 225, 218, 0.7)",
                  padding: "0.15rem 0",
                  outline: "none",
                  width: "auto",
                  minWidth: "260px",
                  flex: "0 1 auto",
                  transition: "border-color 200ms",
                }}
                onFocus={e => e.target.style.borderBottomColor = "#2E6E84"}
                onBlur={e => e.target.style.borderBottomColor = "rgba(229, 225, 218, 0.7)"}
              />
              <Checkbox
                checked={editForm.isAdmin}
                onChange={(v) => setField("isAdmin", v)}
                label="Admin access"
              />
            </div>
          ) : (
            <h2 className="display-heading" style={{ fontSize: "1.7rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {current.name}
              {current.isAdmin && (
                <span className="admin-badge" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                  <Shield size={11} /> Admin
                </span>
              )}
            </h2>
          )}
          <div style={{ fontSize: "0.88rem", color: "#807A7B", marginTop: "0.45rem" }}>
            {current.title} · {current.pod ? `${current.pod} Pod` : "No pod"}
            {!employee.active && " · Deactivated"}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexShrink: 0 }}>
          {employee.active && !isEditing && (
            <button className="btn-ghost" onClick={onStartEdit}>
              <Edit2 size={14} /> Edit
            </button>
          )}
          {isEditing && (
            <>
              <button className="btn-ghost" onClick={onCancelEdit}>Cancel</button>
              <button className="btn-primary" onClick={onSave}>
                <Check size={14} /> Save
              </button>
            </>
          )}
          {!isEditing && (
            <button
              onClick={onClose}
              aria-label="Close details"
              style={{
                background: "transparent", border: "none",
                padding: "0.5rem", borderRadius: "50%",
                cursor: "pointer", color: "#807A7B",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(229, 225, 218, 0.5)"; e.currentTarget.style.color = "#231F20"; }}
              onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#807A7B"; }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Field grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
        <Field label="Email">
          {isEditing ? (
            <input className="input-field" value={editForm.email} onChange={e => setField("email", e.target.value)} />
          ) : (
            <span style={{ fontSize: "0.95rem" }}>{current.email}</span>
          )}
        </Field>
        <Field label="Hire date">
          {isEditing ? (
            <DatePicker value={editForm.hireDate} onChange={(v) => setField("hireDate", v)} />
          ) : (
            <span style={{ fontSize: "0.95rem" }}>{fmtDate(current.hireDate)}</span>
          )}
        </Field>
        <Field label="Title">
          {isEditing ? (
            <input className="input-field" value={editForm.title} onChange={e => setField("title", e.target.value)} placeholder="Job title" />
          ) : (
            <span style={{ fontSize: "0.95rem" }}>{current.title}</span>
          )}
        </Field>
        <Field label="Pod">
          {isEditing ? (
            <Dropdown
              value={editForm.pod}
              onChange={(v) => setField("pod", v)}
              options={[
                { value: null, label: "No pod" },
                ...POD_OPTIONS.map(p => ({ value: p, label: `${p} Pod` })),
              ]}
            />
          ) : (
            <span style={{ fontSize: "0.95rem" }}>{current.pod ? `${current.pod} Pod` : "No pod"}</span>
          )}
        </Field>
      </div>

      {/* Balances */}
      <div style={{ marginBottom: "1.75rem" }}>
        <span className="field-label" style={{ marginBottom: "0.7rem" }}>Balances ({new Date().getFullYear()})</span>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${balanceKeys.length}, 1fr)`, gap: "0.7rem" }}>
          {balanceKeys.map(key => {
            const total = current.totals[key];
            const value = current.balances[key];
            return (
              <div key={key} className="balance-tile">
                <div className="balance-tile-label">{balanceLabels[key]}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                  <span className="display-heading" style={{ fontSize: "1.7rem", lineHeight: 1 }}>{value}</span>
                  <span style={{ fontSize: "0.8rem", color: "#807A7B" }}>/</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={total}
                      min={0}
                      step={0.5}
                      onChange={e => setTotal(key, parseFloat(e.target.value) || 0)}
                      style={{
                        width: "44px",
                        background: "rgba(255, 255, 255, 0.7)",
                        border: "1px solid rgba(46, 110, 132, 0.3)",
                        borderRadius: "6px",
                        padding: "2px 4px",
                        fontSize: "0.88rem",
                        color: "#2E6E84",
                        fontFamily: "inherit",
                        fontWeight: 500,
                        outline: "none",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "0.8rem", color: "#807A7B" }}>{total}</span>
                  )}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#231F20", marginTop: "0.3rem" }}>available</div>
              </div>
            );
          })}
        </div>
        {isEditing && (
          <div style={{ marginTop: "0.85rem" }}>
            <input
              className="input-field"
              placeholder="Reason for balance change (optional — added to audit log)"
              value={balanceReason}
              onChange={e => setBalanceReason(e.target.value)}
              style={{ fontSize: "0.85rem" }}
            />
          </div>
        )}
      </div>

      {/* Request history */}
      <div style={{ marginBottom: "1rem" }}>
        <span className="field-label" style={{ marginBottom: "0.6rem" }}>Request history</span>
        <RequestHistory requests={requests} />
      </div>

      {/* Footer actions */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "1.75rem",
        paddingTop: "1.25rem",
        borderTop: "1px solid rgba(229, 225, 218, 0.6)",
      }}>
        {employee.active ? (
          <button
            onClick={onDeactivate}
            style={{
              background: "transparent",
              border: "none",
              color: "#B91C1C",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              fontWeight: 500,
              padding: "0.4rem 0.6rem",
              borderRadius: "8px",
            }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(185, 28, 28, 0.08)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}
          >
            Deactivate employee
          </button>
        ) : (
          <button className="btn-primary" onClick={onReactivate}>
            <Check size={14} /> Reactivate
          </button>
        )}
      </div>
    </>
  );
}

// ============================================================
// REQUEST HISTORY (expandable rows)
// ============================================================
function RequestHistory({ requests }) {
  const [expandedId, setExpandedId] = useState(null);

  if (requests.length === 0) {
    return (
      <div style={{ padding: "1.5rem 1rem", textAlign: "center", color: "#807A7B", fontSize: "0.85rem", background: "rgba(255, 255, 255, 0.4)", borderRadius: "12px" }}>
        No requests yet.
      </div>
    );
  }

  // Sort: pending first, then by date desc
  const sorted = [...requests].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (b.status === "pending" && a.status !== "pending") return 1;
    return b.submitted.localeCompare(a.submitted);
  });

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.4)",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.5)",
    }}>
      {sorted.map((r, i) => {
        const expanded = expandedId === r.id;
        return (
          <div key={r.id} style={{ borderBottom: i < sorted.length - 1 ? "1px solid rgba(229, 225, 218, 0.5)" : "none" }}>
            <div
              onClick={() => setExpandedId(expanded ? null : r.id)}
              style={{
                padding: "0.7rem 0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.7rem",
                transition: "background 150ms",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)"}
              onMouseOut={e => e.currentTarget.style.background = "transparent"}
            >
              {expanded ? <ChevronDown size={14} color="#807A7B" /> : <ChevronRight size={14} color="#807A7B" />}
              <div style={{ flex: 1, fontSize: "0.88rem" }}>
                <span style={{ color: "#231F20" }}>
                  {r.from === r.to ? fmtDateShort(r.from) : `${fmtDateShort(r.from)} – ${fmtDateShort(r.to)}`}
                </span>
                <span style={{ color: "#807A7B", marginLeft: "0.5rem", fontSize: "0.82rem" }}>
                  {r.days} day{r.days === 1 ? "" : "s"} · {r.category}
                </span>
              </div>
              <span className={`status-pill ${r.status}`}>{r.status}</span>
            </div>
            {expanded && (
              <div style={{
                padding: "0.4rem 0.95rem 0.95rem 2.4rem",
                fontSize: "0.82rem",
                color: "#4A4546",
                lineHeight: 1.6,
              }}>
                <div><strong style={{ color: "#807A7B", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "0.7rem" }}>Submitted</strong> &nbsp; {fmtDate(r.submitted)}</div>
                {r.decided && (
                  <div><strong style={{ color: "#807A7B", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "0.7rem" }}>{r.status === "approved" ? "Approved" : "Denied"}</strong> &nbsp; {fmtDate(r.decided)} by {r.decidedBy}</div>
                )}
                <div><strong style={{ color: "#807A7B", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "0.7rem" }}>Reason</strong> &nbsp; {r.reason || <span style={{ fontStyle: "italic", color: "#B0ABAC" }}>None provided</span>}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// FIELD WRAPPER
// ============================================================
function Field({ label, children }) {
  return (
    <div>
      <span className="field-label">{label}</span>
      {children}
    </div>
  );
}

// ============================================================
// ADD EMPLOYEE MODAL
// ============================================================
function AddEmployeeModal({ onCancel, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "Admissions Director",
    pod: "North",
    isAdmin: false,
    hireDate: new Date().toISOString().slice(0, 10),
    totals: { ...ANNUAL_ALLOTMENTS.withPod },
  });

  // When hire date or pod changes, auto-fill totals (prorated)
  React.useEffect(() => {
    const allotments = form.pod ? ANNUAL_ALLOTMENTS.withPod : ANNUAL_ALLOTMENTS.noPod;
    const newTotals = {};
    Object.entries(allotments).forEach(([k, v]) => {
      newTotals[k] = prorateBalance(form.hireDate, v);
    });
    setForm(f => ({ ...f, totals: newTotals }));
  }, [form.hireDate, form.pod]);

  const setField = (field, value) => setForm({ ...form, [field]: value });
  const setTotal = (key, value) => setForm({ ...form, totals: { ...form.totals, [key]: value } });

  const balanceKeys = form.pod
    ? ["vacation", "personal", "holiday", "holidayComp"]
    : ["vacation", "personal"];
  const balanceLabels = { vacation: "Vacation", personal: "Personal", holiday: "Holiday", holidayComp: "Holiday comp" };

  const canSubmit = form.name.trim() && form.email.trim() && form.title.trim() && form.hireDate;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <h2 className="display-heading" style={{ fontSize: "1.5rem", margin: "0 0 1.25rem" }}>
          Add employee
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem 1.25rem", marginBottom: "1.25rem" }}>
          <Field label="Name">
            <input className="input-field" value={form.name} onChange={e => setField("name", e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Email">
            <input className="input-field" type="email" value={form.email} onChange={e => setField("email", e.target.value)} placeholder="name@censible.com" />
          </Field>
          <Field label="Title">
            <input className="input-field" value={form.title} onChange={e => setField("title", e.target.value)} />
          </Field>
          <Field label="Pod">
            <Dropdown
              value={form.pod}
              onChange={(v) => setField("pod", v)}
              options={[
                { value: null, label: "No pod" },
                ...POD_OPTIONS.map(p => ({ value: p, label: `${p} Pod` })),
              ]}
            />
          </Field>
          <Field label="Hire date">
            <DatePicker value={form.hireDate} onChange={(v) => setField("hireDate", v)} />
          </Field>
        </div>

        <div style={{ marginBottom: "1.25rem", padding: "0.25rem 0" }}>
          <Checkbox
            checked={form.isAdmin}
            onChange={(v) => setField("isAdmin", v)}
            label="Grant admin access"
          />
        </div>

        {/* Balances preview */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span className="field-label" style={{ marginBottom: "0.5rem" }}>
            Initial balances (prorated from hire date)
          </span>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${balanceKeys.length}, 1fr)`, gap: "0.6rem" }}>
            {balanceKeys.map(key => (
              <div key={key} className="balance-tile" style={{ padding: "0.7rem 0.8rem" }}>
                <div className="balance-tile-label">{balanceLabels[key]}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                  <span className="display-heading" style={{ fontSize: "1.7rem", lineHeight: 1 }}>{form.totals[key]}</span>
                  <span style={{ fontSize: "0.8rem", color: "#807A7B" }}>/</span>
                  <input
                    type="number"
                    value={form.totals[key]}
                    min={0}
                    step={0.5}
                    onChange={e => setTotal(key, parseFloat(e.target.value) || 0)}
                    style={{
                      width: "44px",
                      background: "rgba(255, 255, 255, 0.7)",
                      border: "1px solid rgba(46, 110, 132, 0.3)",
                      borderRadius: "6px",
                      padding: "2px 4px",
                      fontSize: "0.88rem",
                      color: "#2E6E84",
                      fontFamily: "inherit",
                      fontWeight: 500,
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.7rem", color: "#231F20", marginTop: "0.3rem" }}>available</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className="btn-primary"
            onClick={() => onAdd({ ...form, balances: { ...form.totals } })}
            disabled={!canSubmit}
          >
            Add employee
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// IMPORT CSV MODAL
// ============================================================
function ImportCSVModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: "460px" }}>
        <h2 className="display-heading" style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>
          Import CSV
        </h2>
        <p style={{ color: "#807A7B", fontSize: "0.88rem", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
          Bulk-add employees from a spreadsheet. Use the template below for column names.
        </p>

        <div style={{
          padding: "0.7rem 0.85rem",
          background: "rgba(230, 240, 244, 0.5)",
          border: "1px solid rgba(90, 166, 187, 0.25)",
          borderRadius: "10px",
          fontSize: "0.78rem",
          color: "#2E6E84",
          fontFamily: "monospace",
          marginBottom: "1.25rem",
          lineHeight: 1.6,
        }}>
          name, email, title, pod, hire_date, vacation, personal, holiday, holiday_comp, is_admin
        </div>

        <div style={{
          border: "2px dashed rgba(229, 225, 218, 0.9)",
          borderRadius: "14px",
          padding: "2rem 1rem",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.3)",
          marginBottom: "1.25rem",
        }}>
          <Upload size={28} color="#807A7B" style={{ marginBottom: "0.5rem" }} />
          <div style={{ fontSize: "0.9rem", color: "#4A4546", marginBottom: "0.25rem" }}>
            Drag a CSV here, or click to browse
          </div>
          <div style={{ fontSize: "0.78rem", color: "#807A7B" }}>
            We'll preview before importing
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "#2E6E84",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            Download template
          </button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DEACTIVATE MODAL
// ============================================================
function DeactivateModal({ employee, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: "460px" }}>
        <h2 className="display-heading" style={{ fontSize: "1.45rem", margin: "0 0 0.5rem" }}>
          Deactivate {employee.name}?
        </h2>
        <p style={{ color: "#807A7B", fontSize: "0.9rem", margin: "0 0 1.5rem", lineHeight: 1.55 }}>
          They'll no longer appear in active lists, can't log in, and will be removed from weekend rotation. Their request history will be preserved, and you can reactivate them from the Deactivated tab.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Deactivate</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// POD VIEW (kanban with drag-and-drop)
// ============================================================
function PodView({
  podBuckets, selectedId, draggingId, dragOverPod,
  onSelect, onDragStart, onDragEnd, onDragOver, onDrop,
  searchActive, compact,
}) {
  const podOrder = ["North", "South", "East", "No pod"];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "0.85rem",
      alignItems: "start",
    }}>
      {podOrder.map(podKey => {
        const podColor = POD_COLORS[podKey];
        const employees = podBuckets[podKey] || [];
        const isOver = dragOverPod === podKey;
        return (
          <div
            key={podKey}
            onDragOver={(e) => onDragOver(e, podKey)}
            onDrop={(e) => onDrop(e, podKey)}
            style={{
              background: isOver ? podColor.light : "rgba(255, 253, 250, 0.35)",
              border: `${isOver ? "2px" : "1px"} solid ${isOver ? podColor.color : `${podColor.color}30`}`,
              borderRadius: "16px",
              padding: isOver ? "0.4rem" : "0.45rem",
              minHeight: compact ? "160px" : "260px",
              transition: "background 150ms, border-color 150ms, border-width 150ms, min-height 200ms",
            }}
          >
            {/* Pod header */}
            <div style={{
              padding: "0.55rem 0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: podColor.light,
              borderRadius: "10px",
              marginBottom: "0.5rem",
            }}>
              <span style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: podColor.color,
                boxShadow: `0 0 0 2px ${podColor.color}30`,
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "0.95rem",
                color: podColor.deep,
                letterSpacing: "-0.005em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {podKey === "No pod" ? "No pod" : `${podKey} Pod`}
              </span>
              <span style={{
                marginLeft: "auto",
                fontSize: "0.72rem",
                color: podColor.deep,
                opacity: 0.65,
                fontWeight: 500,
                flexShrink: 0,
              }}>
                {employees.length}
              </span>
            </div>

            {/* Employee cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: compact ? "0.3rem" : "0.4rem", padding: "0 0.1rem" }}>
              {employees.length === 0 && !searchActive && (
                <div style={{
                  padding: compact ? "0.5rem 0.5rem" : "1rem 0.5rem",
                  textAlign: "center",
                  color: "#B0ABAC",
                  fontSize: "0.78rem",
                  fontStyle: "italic",
                }}>
                  Drop someone here
                </div>
              )}
              {employees.map(emp => {
                const isSelected = selectedId === emp.id;
                const isDragging = draggingId === emp.id;
                const compactTitle = emp.title === "Admissions Director" ? "AD" : emp.title;
                return (
                  <div
                    key={emp.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, emp)}
                    onDragEnd={onDragEnd}
                    onClick={() => onSelect(emp)}
                    className={`pod-card ${isSelected ? "selected" : ""} ${isDragging ? "dragging" : ""} ${compact ? "compact" : ""}`}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.4rem",
                    }}>
                      <span style={{
                        fontWeight: 500,
                        fontSize: compact ? "0.85rem" : "0.88rem",
                        color: "#231F20",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}>
                        {emp.name}
                      </span>
                      {compact && (
                        <span style={{
                          fontSize: "0.72rem",
                          color: "#807A7B",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          flex: 1,
                          minWidth: 0,
                        }}>
                          {compactTitle}
                        </span>
                      )}
                      {!compact && <span style={{ flex: 1 }} />}
                      {emp.isAdmin && (
                        <Shield size={11} color={podColor.deep} style={{ flexShrink: 0, alignSelf: "center" }} />
                      )}
                    </div>
                    {!compact && (
                      <div style={{
                        fontSize: "0.72rem",
                        color: "#807A7B",
                        marginTop: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {emp.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// CUSTOM DROPDOWN (matches .input-field editorial style)
// ============================================================
function Dropdown({ value, onChange, options, placeholder }) {
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
          fontSize: "0.95rem",
          color: selected ? "#231F20" : "#B0ABAC",
          fontFamily: "inherit",
          textAlign: "left",
          cursor: "pointer",
          outline: "none",
          position: "relative",
          transition: "border-color 200ms",
        }}
      >
        {selected ? selected.label : (placeholder || "Select…")}
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
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          marginTop: "4px",
          background: "#FFFFFF",
          border: "1px solid #D5D1CA",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(35, 31, 32, 0.1), 0 20px 44px rgba(35, 31, 32, 0.22)",
          zIndex: 9999,
          overflow: "hidden",
          padding: "4px",
        }}>
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value === null ? "__null__" : opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  padding: "0.55rem 0.7rem",
                  fontSize: "0.9rem",
                  color: isSelected ? "#2E6E84" : "#231F20",
                  background: isSelected ? "rgba(230, 240, 244, 0.95)" : "transparent",
                  fontWeight: isSelected ? 500 : 400,
                  cursor: "pointer",
                  borderRadius: "8px",
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
// CHECKBOX
// ============================================================
function Checkbox({ checked, onChange, label, disabled }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.55rem",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.6 : 1,
        userSelect: "none",
      }}
      onClick={(e) => {
        if (disabled) return;
        e.preventDefault();
        onChange(!checked);
      }}
    >
      <span style={{
        width: "18px",
        height: "18px",
        borderRadius: "5px",
        background: checked ? "#2E6E84" : "rgba(255, 255, 255, 0.7)",
        border: checked ? "1.5px solid #2E6E84" : "1.5px solid rgba(176, 171, 172, 0.6)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 150ms",
        flexShrink: 0,
        boxShadow: checked ? "0 1px 2px rgba(46, 110, 132, 0.2)" : "inset 0 1px 0 rgba(255,255,255,0.6)",
      }}>
        {checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </span>
      {label && <span style={{ fontSize: "0.9rem", color: "#231F20" }}>{label}</span>}
    </label>
  );
}

// ============================================================
// DATE PICKER (custom, matches design system)
// ============================================================
const DP_MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function DatePicker({ value, onChange, placeholder }) {
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
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const goNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };
  const goPrevYear = () => setViewYear(viewYear - 1);
  const goNextYear = () => setViewYear(viewYear + 1);

  const selectDate = (d) => {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onChange(iso);
    setOpen(false);
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
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "6px",
    color: "#4A4546",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 150ms",
  };

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
          fontSize: "0.95rem",
          color: value ? "#231F20" : "#B0ABAC",
          fontFamily: "inherit",
          textAlign: "left",
          cursor: "pointer",
          outline: "none",
          position: "relative",
          transition: "border-color 200ms",
        }}
      >
        {value ? formatDisplay(value) : (placeholder || "Select date")}
        <Calendar
          size={14}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#807A7B",
          }}
        />
      </button>
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          marginTop: "6px",
          background: "#FDFBF7",
          border: "1px solid #D5D1CA",
          borderRadius: "14px",
          boxShadow: "0 2px 4px rgba(35, 31, 32, 0.1), 0 20px 44px rgba(35, 31, 32, 0.22)",
          zIndex: 9999,
          padding: "0.95rem",
          width: "300px",
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              <button onClick={goPrevYear} style={navBtnStyle} aria-label="Previous year"
                onMouseOver={e => e.currentTarget.style.background = "rgba(230, 240, 244, 0.7)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <ChevronsLeft size={15} />
              </button>
              <button onClick={goPrevMonth} style={navBtnStyle} aria-label="Previous month"
                onMouseOver={e => e.currentTarget.style.background = "rgba(230, 240, 244, 0.7)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <ChevronLeft size={15} />
              </button>
            </div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "0.98rem", color: "#231F20" }}>
              {DP_MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div style={{ display: "flex", gap: "2px" }}>
              <button onClick={goNextMonth} style={navBtnStyle} aria-label="Next month"
                onMouseOver={e => e.currentTarget.style.background = "rgba(230, 240, 244, 0.7)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <ChevronRight size={15} />
              </button>
              <button onClick={goNextYear} style={navBtnStyle} aria-label="Next year"
                onMouseOver={e => e.currentTarget.style.background = "rgba(230, 240, 244, 0.7)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: "0.65rem", color: "#807A7B", fontWeight: 500, padding: "4px 0", letterSpacing: "0.04em" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const isSelected = d === selectedDay;
              const today = isToday(d);
              return (
                <button
                  key={i}
                  onClick={() => selectDate(d)}
                  style={{
                    width: "100%",
                    height: "34px",
                    background: isSelected ? "#2E6E84" : "transparent",
                    color: isSelected ? "#FFFFFF" : "#231F20",
                    border: today && !isSelected ? "1px solid rgba(90, 166, 187, 0.6)" : "1px solid transparent",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: isSelected || today ? 500 : 400,
                    transition: "background 100ms",
                    padding: 0,
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