import "./Tag.css";

export function Chip({ children, className = "", style }) {
  return (
    <span className={`chip${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <p className={`eyebrow${className ? ` ${className}` : ""}`}>
      {children}
    </p>
  );
}

export function BadgePromo({ children, className = "" }) {
  return (
    <span className={`badge-promo${className ? ` ${className}` : ""}`}>
      {children}
    </span>
  );
}
