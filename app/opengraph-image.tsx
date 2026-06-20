import { ImageResponse } from "next/og";

export const alt = "Pull Lover — Mailles artisanales";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          Pull Lover
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#aaaaaa",
            marginTop: 28,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Mailles artisanales · Antananarivo, Madagascar
        </div>
      </div>
    ),
    { ...size }
  );
}
