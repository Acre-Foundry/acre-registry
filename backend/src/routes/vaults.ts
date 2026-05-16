import { Router, Request, Response } from "express";

const router = Router();

// GET /api/vaults — list all vaults (from DB or indexed events)
// Must be registered BEFORE /:contractId to avoid Express swallowing it
router.get("/", async (_req: Request, res: Response) => {
  res.json({
    vaults: [
      {
        contractId: process.env.VAULT_CONTRACT_ID || "CXXX",
        assetId: "WAREHOUSE-NYC-001",
        assetValue: 100_000_000,
        totalTokens: 1_000_000,
        spvAddress: "SPV-NYC-001",
        tokenContract: process.env.TOKEN_CONTRACT_ID || "",
        distributionContract: process.env.DISTRIBUTION_CONTRACT_ID || "",
      },
    ],
  });
});

// GET /api/vaults/:contractId
router.get("/:contractId", async (req: Request, res: Response) => {
  try {
    // TODO: call get_vault() on-chain via Soroban RPC and decode scVal response
    res.json({
      contractId: req.params.contractId,
      assetId: "WAREHOUSE-NYC-001",
      assetValue: 100_000_000,
      totalTokens: 1_000_000,
      spvAddress: "SPV-NYC-001",
      tokenContract: process.env.TOKEN_CONTRACT_ID || "",
      distributionContract: process.env.DISTRIBUTION_CONTRACT_ID || "",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
