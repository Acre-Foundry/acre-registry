import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import vaultRoutes from "./routes/vaults";
import distributionRoutes from "./routes/distributions";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vaults", vaultRoutes);
app.use("/api/distributions", distributionRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Acre API running on :${PORT}`));
