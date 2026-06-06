# Security Policy

Acre Registry tokenizes real-world assets on Stellar/Soroban. Please report security issues privately so contract, API, or frontend bugs can be triaged before they affect asset ownership, token balances, or yield distribution.

## Supported versions

Acre Registry is pre-release software. Security fixes are made against `main` until a stable release line is published.

| Version | Supported |
| --- | --- |
| `main` / latest deployment branch | Yes |
| Forks, local modifications, and historical commits | No |

## How to report a vulnerability

Use GitHub's private vulnerability reporting / Security Advisory flow for this repository when available. If private reporting is not enabled, contact the maintainers through the repository owner before sharing exploit details.

Do **not** open a public issue for suspected vulnerabilities in:

- Soroban vault, token, or distribution contracts.
- SPV / RWA ownership metadata handling.
- Yield deposit, accounting, or claim logic.
- Backend routes that expose vault, distribution, or Soroban RPC data.
- Frontend flows that could misrepresent ownership, balances, or claimable yield.

Include as much of the following as possible:

- A short summary and affected component (`contracts/vault`, `contracts/token`, `contracts/distribution`, backend, frontend, or shared types).
- Impact on RWA ownership, token supply, holder balances, rent distribution, authorization, or availability.
- Reproduction steps, proof-of-concept code, transaction hashes, logs, screenshots, or failing tests.
- Expected vs. actual behavior.
- Suggested severity and any known mitigations.

## Expected response time

- Acknowledgement: within 72 hours.
- Initial triage: within 7 days.
- Critical contract-impacting issues: target mitigation or public status update within 14 days when practical.
- Lower-severity documentation, UI, or non-exploitable findings may be batched into normal releases.

## Coordinated disclosure

Please give maintainers a reasonable opportunity to investigate and patch before publishing details. Maintainers will coordinate disclosure timing with reporters when a fix, mitigation, or advisory is ready.

## Out of scope

The following are normally out of scope unless they demonstrate a concrete security impact on Acre Registry:

- Vulnerabilities in third-party services, wallets, RPC providers, browsers, or Stellar infrastructure.
- Social engineering, phishing, spam, physical attacks, or attempts to access maintainer accounts.
- Denial-of-service tests that degrade public infrastructure or third-party services.
- Automated scanner output without a reproducible impact.
- Reports about testnet-only configuration that cannot affect deployed assets, funds, or users.
- Legal, valuation, tax, or regulatory claims about the real-world assets themselves.

## Safe harbor

Good-faith research that stays within this policy, avoids privacy violations, does not access or modify data that is not yours, and does not disrupt services will be treated as authorized security research for this project.
