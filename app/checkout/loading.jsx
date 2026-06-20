export default function CheckoutLoading() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px", fontFamily: "var(--font-montserrat), sans-serif" }}>
      <style>{`@keyframes _pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>

      <div style={{ height: "28px", width: "160px", background: "#e7e5e4", borderRadius: "8px", marginBottom: "32px", animation: "_pulse 1.5s ease-in-out infinite" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px" }}>
        {/* Formulaire */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div style={{ height: "12px", width: "100px", background: "#e7e5e4", borderRadius: "4px", marginBottom: "8px", animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
              <div style={{ height: "48px", background: "#e7e5e4", borderRadius: "10px", animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
            </div>
          ))}
        </div>

        {/* Résumé */}
        <div style={{ background: "#f5f5f4", borderRadius: "16px", padding: "24px" }}>
          <div style={{ height: "20px", width: "120px", background: "#e7e5e4", borderRadius: "6px", marginBottom: "20px", animation: "_pulse 1.5s ease-in-out infinite" }} />
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
              <div style={{ width: "56px", height: "72px", background: "#e7e5e4", borderRadius: "8px", flexShrink: 0, animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: "14px", width: "80%", background: "#e7e5e4", borderRadius: "4px", marginBottom: "8px", animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
                <div style={{ height: "12px", width: "50%", background: "#e7e5e4", borderRadius: "4px", animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
              </div>
            </div>
          ))}
          <div style={{ height: "1px", background: "#e7e5e4", margin: "16px 0" }} />
          <div style={{ height: "48px", background: "#e7e5e4", borderRadius: "10px", animation: "_pulse 1.5s ease-in-out 0.3s infinite" }} />
        </div>
      </div>
    </div>
  );
}
