import { getVault } from "@/lib/api";
import { ClaimYield } from "@/components/ClaimYield";

export default async function VaultDetailPage({ params }: { params: { contractId: string } }) {
  const vault = await getVault(params.contractId);

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ color: "#c8a96e" }}>{vault.assetId}</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
        <tbody>
          {[
            ["Contract ID", vault.contractId],
            ["Asset Value", `$${(vault.assetValue / 100).toLocaleString()}`],
            ["Total Tokens", vault.totalTokens.toLocaleString()],
            ["SPV", vault.spvAddress],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: "1px solid #222" }}>
              <td style={{ padding: "0.5rem 0", color: "#888" }}>{label}</td>
              <td style={{ padding: "0.5rem 0" }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ClaimYield contractId={params.contractId} />
    </div>
  );
}
