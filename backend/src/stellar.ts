import { SorobanRpc, Contract, Networks } from "@stellar/stellar-sdk";

const RPC_URL = process.env.STELLAR_RPC_URL || "https://soroban-testnet.stellar.org";
export const server = new SorobanRpc.Server(RPC_URL);
export const NETWORK_PASSPHRASE = process.env.STELLAR_NETWORK === "mainnet"
  ? Networks.PUBLIC
  : Networks.TESTNET;

export function getContract(contractId: string) {
  return new Contract(contractId);
}
