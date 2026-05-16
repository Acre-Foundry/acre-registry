import Link from "next/link";
import type { Vault } from "@/lib/api";

export function VaultCard({ vault }: { vault: Vault }) {
  return (
    <Link href={`/vaults/${vault.contractId}`} style={{ textDecoration: "none" }}>
      <div style={{
        border: "1px solid #222",
        borderRadius: 8,
        padding: "1.25rem",
        background: "#111",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}>
        <div style={{ color: "#c8a96e", fontWeight: 600, marginBottom: "0.5rem" }}>{vault.assetId}</div>
        <div style={{ color: "#888", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
          Value: <span style={{ color: "#f5f5f5" }}>${(vault.assetValue / 100).toLocaleString()}</span>
        </div>
        <div style={{ color: "#888", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
          Tokens: <span style={{ color: "#f5f5f5" }}>{vault.totalTokens.toLocaleString()}</span>
        </div>
        <div style={{ color: "#555", fontSize: "0.75rem", marginTop: "0.75rem", fontFamily: "monospace" }}>
          {vault.contractId.slice(0, 12)}…
        </div>
      </div>
    </Link>
  );
}
