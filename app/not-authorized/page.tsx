export default function NotAuthorized() {
  return (
    <div style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>You&apos;re not on the list yet</h1>
      <p style={{ color: "#888", lineHeight: 1.6 }}>
        This email isn&apos;t set up for Censible OS access. If that seems wrong, ask Rivka to add you to the employee list.
      </p>
    </div>
  );
}