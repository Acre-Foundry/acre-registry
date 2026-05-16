const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type Vault = {
  contractId: string;
  assetId: string;
  assetValue: number;
  totalTokens: number;
  spvAddress: string;
};

export async function getVaults(): Promise<Vault[]> {
  const res = await fetch(`${API}/api/vaults`, { cache: "no-store" });
  const data = await res.json();
  return data.vaults;
}

export async function getVault(contractId: string): Promise<Vault> {
  const res = await fetch(`${API}/api/vaults/${contractId}`, { cache: "no-store" });
  return res.json();
}

export async function getClaimable(contractId: string, holder: string, balance: number): Promise<string> {
  const res = await fetch(`${API}/api/distributions/${contractId}/claimable?holder=${holder}&balance=${balance}`);
  const data = await res.json();
  return data.claimable;
}
