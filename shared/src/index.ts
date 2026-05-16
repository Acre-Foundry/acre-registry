/** Mirrors VaultInfo from the Soroban vault contract */
export interface Vault {
  contractId: string;
  assetId: string;       // e.g. "WAREHOUSE-NYC-001"
  assetValue: number;    // USD cents
  totalTokens: number;   // 1 token = $1 of asset value
  spvAddress: string;    // Legal SPV identifier
  tokenContract: string;
  distributionContract: string;
}

export interface ClaimableResponse {
  contractId: string;
  holder: string;
  claimable: string; // i128 as string to avoid precision loss
}

export interface ClaimRequest {
  holder: string;
  holderBalance: number;
  signedXdr: string;
}

export interface ClaimResponse {
  status: "submitted" | "error";
  txHash?: string;
  error?: string;
}
