export default function AdminLoading() {
  return (
    <div style={{ padding: "32px", fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif" }}>
      <style>{`@keyframes _pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>

      {/* Topbar skeleton */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{ height: "28px", width: "180px", background: "#e7e5e4", borderRadius: "8px", animation: "_pulse 1.5s ease-in-out infinite" }} />
        <div style={{ marginLeft: "auto", height: "36px", width: "100px", background: "#e7e5e4", borderRadius: "8px", animation: "_pulse 1.5s ease-in-out infinite" }} />
      </div>

      {/* Table skeleton */}
      <div style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ height: "44px", background: "#fafaf9", borderBottom: "1px solid #e7e5e4" }} />
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            height: "56px", borderBottom: "1px solid #f5f5f4", padding: "0 20px",
            display: "flex", alignItems: "center", gap: "16px",
          }}>
            <div style={{ height: "14px", width: `${120 + (i % 3) * 40}px`, background: "#e7e5e4", borderRadius: "6px", animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
            <div style={{ height: "14px", width: "80px", background: "#e7e5e4", borderRadius: "6px", animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite`, marginLeft: "auto" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
