import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acre — Wealth, Inch by Inch",
  description: "Fractional real-world asset ownership on Stellar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0a0a0a", color: "#f5f5f5" }}>
        <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid #222", display: "flex", gap: "2rem", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#c8a96e" }}>⬡ Acre</span>
          <a href="/" style={{ color: "#aaa", textDecoration: "none" }}>Dashboard</a>
          <a href="/vaults" style={{ color: "#aaa", textDecoration: "none" }}>Vaults</a>
          <a href="/portfolio" style={{ color: "#aaa", textDecoration: "none" }}>Portfolio</a>
        </nav>
        <main style={{ padding: "2rem" }}>{children}</main>
      </body>
    </html>
  );
}
