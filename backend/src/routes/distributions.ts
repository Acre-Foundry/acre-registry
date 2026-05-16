import { Router, Request, Response } from "express";

const router = Router();

// GET /api/distributions/:contractId/claimable?holder=G...&balance=1000
router.get("/:contractId/claimable", async (req: Request, res: Response) => {
  const { holder, balance } = req.query;
  if (!holder || !balance) {
    return res.status(400).json({ error: "holder and balance required" });
  }
  // In production: call distribution contract's claimable() view function via Soroban RPC
  res.json({
    contractId: req.params.contractId,
    holder,
    claimable: "0", // placeholder — wire up Soroban RPC call
  });
});

// POST /api/distributions/:contractId/claim
router.post("/:contractId/claim", async (req: Request, res: Response) => {
  const { holder, holderBalance, signedXdr } = req.body;
  if (!holder || !holderBalance || !signedXdr) {
    return res.status(400).json({ error: "holder, holderBalance, signedXdr required" });
  }
  // In production: submit signed XDR to Stellar network
  res.json({ status: "submitted", txHash: "placeholder" });
});

export default router;
