"use client";
import { useState } from "react";

export function ClaimYield({ contractId }: { contractId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleClaim() {
    setStatus("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/distributions/${contractId}/claim`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ holder: "G_PLACEHOLDER", holderBalance: 0, signedXdr: "" }),
        }
      );
      const data = await res.json();
      setMessage(`Submitted: ${data.txHash}`);
      setStatus("done");
    } catch {
      setMessage("Claim failed.");
      setStatus("error");
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: "1rem", color: "#aaa", marginBottom: "0.75rem" }}>Yield</h2>
      <button
        onClick={handleClaim}
        disabled={status === "loading"}
        style={{
          background: "#c8a96e",
          color: "#0a0a0a",
          border: "none",
          borderRadius: 6,
          padding: "0.6rem 1.4rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {status === "loading" ? "Claiming…" : "Claim Yield"}
      </button>
      {message && <p style={{ marginTop: "0.75rem", color: status === "error" ? "#e55" : "#6e6" }}>{message}</p>}
    </div>
  );
}
