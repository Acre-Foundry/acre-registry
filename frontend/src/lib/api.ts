// Single source of truth for Vault type — matches shared/src/index.ts and backend response
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type Vault = {
  contractId: string;
  assetId: string;
  assetValue: number;       // USD cents
  totalTokens: number;
  spvAddress: string;
  tokenContract: string;
  distributionContract: string;
};

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function getVaults(): Promise<Vault[]> {
  const data = await apiFetch<{ vaults: Vault[] }>(`${API}/api/vaults`);
  return data.vaults;
}

export async function getVault(contractId: string): Promise<Vault> {
  return apiFetch<Vault>(`${API}/api/vaults/${contractId}`);
}

export async function getClaimable(contractId: string, holder: string, balance: number): Promise<string> {
  const data = await apiFetch<{ claimable: string }>(
    `${API}/api/distributions/${contractId}/claimable?holder=${encodeURIComponent(holder)}&balance=${balance}`
  );
  return data.claimable;
}
