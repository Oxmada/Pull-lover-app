export default function NosMaillesLoading() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px", fontFamily: "var(--font-montserrat), sans-serif" }}>
      <style>{`@keyframes _pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>

      {/* Titre */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "36px", width: "200px", background: "#e7e5e4", borderRadius: "8px", margin: "0 auto 12px", animation: "_pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: "16px", width: "280px", background: "#e7e5e4", borderRadius: "6px", margin: "0 auto", animation: "_pulse 1.5s ease-in-out infinite" }} />
      </div>

      {/* Barre filtres */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <div style={{ height: "44px", flex: 1, maxWidth: "360px", background: "#e7e5e4", borderRadius: "10px", animation: "_pulse 1.5s ease-in-out infinite" }} />
        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: "36px", width: "90px", background: "#e7e5e4", borderRadius: "20px", animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
          ))}
        </div>
      </div>

      {/* Grille */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <div style={{ paddingBottom: "120%", background: "#e7e5e4", borderRadius: "12px", marginBottom: "12px", animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
            <div style={{ height: "16px", width: "70%", background: "#e7e5e4", borderRadius: "6px", marginBottom: "8px", animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
            <div style={{ height: "14px", width: "40%", background: "#e7e5e4", borderRadius: "6px", animation: `_pulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
