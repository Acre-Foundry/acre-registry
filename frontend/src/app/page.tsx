import { VaultCard } from "@/components/VaultCard";
import { getVaults } from "@/lib/api";

export default async function DashboardPage() {
  const vaults = await getVaults();

  return (
    <div>
      <h1 style={{ color: "#c8a96e", marginBottom: "0.5rem" }}>Acre Registry</h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>Real-world assets, tokenized on Stellar.</p>

      <section>
        <h2 style={{ fontSize: "1rem", color: "#aaa", marginBottom: "1rem" }}>Active Vaults</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {vaults.map((v) => <VaultCard key={v.contractId} vault={v} />)}
        </div>
      </section>
    </div>
  );
}
