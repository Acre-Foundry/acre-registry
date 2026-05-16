# Acre Registry — "Wealth, Inch by Inch."

Acre tokenizes real-world assets (RWAs) into fractional ownership on **Stellar (Soroban)**. Each asset is wrapped in an **Acre-Vault**, minting `$ACRE-*` tokens that stream rent yield to holders automatically.

## Architecture

```
acre-registry/
├── contracts/          # Soroban smart contracts (Rust)
│   ├── vault/          # Wraps an RWA; stores metadata + SPV link
│   ├── token/          # SEP-41 fungible token ($ACRE-*)
│   └── distribution/   # Accepts rent deposits; pro-rata yield claims
├── backend/            # Node/Express API (TypeScript)
│   └── src/
│       ├── routes/vaults.ts        # GET /api/vaults, /api/vaults/:id
│       ├── routes/distributions.ts # GET claimable, POST claim
│       └── stellar.ts              # Soroban RPC client
├── frontend/           # Next.js 14 App Router (TypeScript)
│   └── src/
│       ├── app/        # Dashboard, Vault Explorer, Portfolio
│       └── components/ # VaultCard, ClaimYield
└── shared/             # Shared TypeScript types
```

## Smart Contracts

| Contract | Purpose |
|---|---|
| `vault` | Registers an RWA with asset metadata, valuation, and SPV address |
| `token` | SEP-41 fungible token representing fractional ownership |
| `distribution` | Accepts stablecoin rent; holders claim pro-rata yield |

### Key Flow

1. Admin calls `vault::initialize()` with asset metadata and SPV identifier
2. Admin calls `token::initialize()` minting `asset_value` tokens to the vault admin
3. Tokens are distributed to investors (transfers on-chain)
4. Rent arrives → admin calls `distribution::deposit_rent(amount, total_supply)`
5. Holders call `distribution::claim(holder, balance)` to receive yield

## Getting Started

### Prerequisites
- Rust + `wasm32-unknown-unknown` target
- Stellar CLI (`stellar`)
- Node.js 20+, Yarn

### Install

```bash
yarn install
```

### Build Contracts

```bash
yarn contracts:build
```

### Run Backend

```bash
cp backend/.env.example backend/.env
# Fill in contract IDs after deployment
yarn dev:backend
```

### Run Frontend

```bash
yarn dev:frontend
```

### Deploy Contracts (Testnet)

```bash
stellar contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/acre_vault.wasm \
  --network testnet
```

Repeat for `acre_token` and `acre_distribution`, then populate `backend/.env`.

## Legal Bridge

Each vault maps to a real-world **SPV (Special Purpose Vehicle)**. The `spv_address` field in the vault contract acts as the on-chain pointer to the legal entity, making the smart contract the authoritative shareholder registry.
