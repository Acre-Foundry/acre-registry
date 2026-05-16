export default function PortfolioPage() {
  return (
    <div>
      <h1 style={{ color: "#c8a96e", marginBottom: "0.5rem" }}>My Portfolio</h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>
        Connect your Stellar wallet to view your token holdings and claimable yield.
      </p>
      <div style={{ padding: "2rem", border: "1px dashed #333", borderRadius: 8, textAlign: "center", color: "#555" }}>
        Wallet connection coming soon — integrate Freighter or WalletConnect.
      </div>
    </div>
  );
}
