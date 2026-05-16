import { getVaults } from "@/lib/api";
import { VaultCard } from "@/components/VaultCard";

export default async function VaultsPage() {
  const vaults = await getVaults();

  return (
    <div>
      <h1 style={{ color: "#c8a96e", marginBottom: "0.5rem" }}>Vault Explorer</h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>Browse all Acre-fied real-world assets.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {vaults.map((v) => <VaultCard key={v.contractId} vault={v} />)}
      </div>
    </div>
  );
}
