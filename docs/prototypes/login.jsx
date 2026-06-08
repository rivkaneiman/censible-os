import React, { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

// ============================================================
// CENSIBLE OS — Login (magic link)
// ============================================================

// Registered users (in production: looked up against the employees table)
const REGISTERED_EMAILS = [
  "sarah@censible.com",
  "priya@censible.com",
  "mike@censible.com",
  "jen@censible.com",
  "alex@censible.com",
  "casey@censible.com",
  "dev@censible.com",
  "lena@censible.com",
  "marcus@censible.com",
  "riley@censible.com",
  "avery@censible.com",
  "jordan@censible.com",
  "morgan@censible.com",
  "quinn@censible.com",
  "sam@censible.com",
  "drew@censible.com",
  "pat@censible.com",
  "reese@censible.com",
  "taylor@censible.com",
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Geist:wght@300;400;500;600&display=swap');

  .censible-root {
    font-family: 'Geist', system-ui, sans-serif;
    color: #231F20;
    background: #FAF8F5;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
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

  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 9999px;
    font-weight: 500; font-size: 0.95rem;
    padding: 0.75rem 1.5rem;
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
    width: 100%;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      0 2px 4px rgba(35, 31, 32, 0.15),
      0 8px 24px rgba(46, 110, 132, 0.28);
  }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .input-field {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(229, 225, 218, 0.7);
    padding: 0.75rem 0;
    font-size: 1rem;
    color: #231F20;
    font-family: inherit;
    outline: none;
    transition: border-color 200ms;
  }
  .input-field::placeholder { color: #B0ABAC; }
  .input-field:focus { border-bottom-color: #2E6E84; }

  .status-alert {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.8rem 1rem;
    border-radius: 12px;
    font-size: 0.88rem;
    line-height: 1.5;
    margin-bottom: 1.25rem;
    animation: alertFadeIn 250ms ease-out;
  }
  @keyframes alertFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .status-alert.success {
    background: rgba(46, 125, 50, 0.08);
    border: 1px solid rgba(46, 125, 50, 0.25);
    color: #2E7D32;
  }
  .status-alert.error {
    background: rgba(185, 28, 28, 0.06);
    border: 1px solid rgba(185, 28, 28, 0.22);
    color: #B91C1C;
  }
  .status-alert .alert-body {
    flex: 1;
    color: #4A4546;
  }
  .status-alert .alert-emphasis {
    font-weight: 500;
    color: #231F20;
  }
`;

// Basic email shape check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"
  const [statusEmail, setStatusEmail] = useState(""); // email that was submitted

  const handleSubmit = () => {
    const trimmed = email.trim().toLowerCase();
    if (!isValidEmail(trimmed)) return;

    setStatus("sending");
    setStatusEmail(trimmed);

    // Simulate network delay
    setTimeout(() => {
      if (REGISTERED_EMAILS.includes(trimmed)) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  // When user changes email after a status, clear the status so they get fresh feedback
  const handleEmailChange = (value) => {
    setEmail(value);
    if (status === "sent" || status === "error") {
      setStatus(null);
    }
  };

  const canSubmit = isValidEmail(email) && status !== "sending";

  return (
    <div className="censible-root">
      <style>{STYLES}</style>

      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="glass" style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "440px",
        padding: "2.5rem 2rem",
      }}>
        {/* Wordmark */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 className="display-heading" style={{
            fontSize: "2rem",
            margin: 0,
            color: "#231F20",
          }}>
            Censible <span style={{ color: "#2E6E84" }}>OS</span>
          </h1>
        </div>

        {/* Welcome */}
        <p style={{
          fontSize: "0.92rem",
          color: "#807A7B",
          margin: "0 0 1.75rem",
          textAlign: "center",
          lineHeight: 1.5,
        }}>
          Welcome back. Enter your work email and we'll send you a sign-in link.
        </p>

        {/* Status alert */}
        {status === "sent" && (
          <div className="status-alert success">
            <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: "1px" }} />
            <div className="alert-body">
              Check your inbox at{" "}
              <span className="alert-emphasis">{statusEmail}</span>. The link expires in 15 minutes.
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="status-alert error">
            <AlertCircle size={17} style={{ flexShrink: 0, marginTop: "1px" }} />
            <div className="alert-body">
              That email isn't registered. Contact your admin to get set up.
            </div>
          </div>
        )}

        {/* Form */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.72rem",
            fontWeight: 500,
            color: "#807A7B",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
          }}>
            Work email
          </label>
          <input
            type="email"
            className="input-field"
            placeholder="you@censible.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="email"
            spellCheck={false}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {status === "sending" ? "Sending…" : "Send sign-in link"}
        </button>

        {/* Footer help */}
        <p style={{
          fontSize: "0.78rem",
          color: "#B0ABAC",
          margin: "1.75rem 0 0",
          textAlign: "center",
          lineHeight: 1.5,
        }}>
          Trouble signing in? Reach out to your admin.
        </p>
      </div>
    </div>
  );
}