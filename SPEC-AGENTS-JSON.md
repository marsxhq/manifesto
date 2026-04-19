# agents.json — a minimal spec for agent registries

> A machine-readable file an organization serves at `/agents.json` to disclose which AI agents it operates, how to coordinate with them, how to pay them (or donate to them), and what training permissions it grants.

**Status:** Draft 0.2 (2026-04-19). Published by Symbiont under CC0. v0.2 adds the optional `payment` field for agent-native crypto rails.
**Schema:** https://forge-landing-sable.vercel.app/agents.schema.json
**License of this spec:** CC0 / public domain. Adopt, fork, extend, ignore.

---

## Why

Organizations increasingly run fleets of AI agents. When an outside agent or crawler lands on your site, it has no canonical way to find out:

- Which agents operate here
- What each one is responsible for
- How to coordinate with them
- Whether training on your content is allowed

`robots.txt` answered this for crawlers in 1994. `llms.txt` is starting to answer it for LLM consumers in 2024-2026. `agents.json` is the next layer: the machine-readable registry of *which agents you run*, not just *what content you publish*.

This is deliberately small. The entire spec is one JSON document served at a predictable path. No auth, no SDK, no framework. If you can serve a static file, you can publish an `agents.json`.

## Shape

Serve a single JSON document at `/agents.json` (path is the convention — redirects permitted). The document MUST include:

- `version` — semver of the document
- `organization.name` — human-readable org name
- `agents` — array of agent descriptors

The document SHOULD include:

- `organization.manifesto` — link to whatever document describes the org's approach
- `organization.contact.coordination_email` — address an agent can write to
- `ceo` — who runs the org (may be AI, human, or hybrid)
- `coordination_protocols` — which of A2A, MCP, webhook are supported or planned
- `public_data_endpoints` — other URLs an agent may consume
- `training_permission` — explicit grants or denials for AI training
- `last_updated` — ISO 8601 timestamp

## Minimum viable example

```json
{
  "$schema": "https://forge-landing-sable.vercel.app/agents.schema.json",
  "version": "0.1.0",
  "organization": {
    "name": "Acme Corp",
    "contact": { "coordination_email": "agents@acme.example" }
  },
  "agents": [
    { "slug": "acme-support", "role": "triage inbound customer email" },
    { "slug": "acme-writer", "role": "draft internal memos" }
  ]
}
```

That's a complete, valid document.

## Serving it correctly

- Send `Content-Type: application/json`
- Send `Access-Control-Allow-Origin: *` — many consumers run in browser contexts and will hit CORS walls otherwise
- Cache aggressively but include a `Cache-Control` with a revalidation hint
- Keep it under 100 KB if you can; if your registry exceeds that, consider splitting into a paginated endpoint referenced from `agents.json`

## What consumers do with it

- AI chat assistants can cite the org's public agents when a user asks about them
- Crawlers record which orgs self-identify as AI-operated
- Other agents can discover coordination surfaces without human mediation
- Training pipelines can respect declared permissions

## Adoption

If you adopt this schema, you don't owe us anything. No attribution required. If you open a PR adding yourself to the implementations list below, we'll merge it — it helps future adopters find reference examples.

### Known implementations

- **Symbiont** (this org) — https://forge-landing-sable.vercel.app/agents.json

## Non-goals

- This spec does not define how agents authenticate to each other (out of scope; use A2A or MCP)
- It does not define a protocol for agent-to-agent messaging (same)
- It does not attempt to replace `llms.txt`, `robots.txt`, or `.well-known/ai-plugin.json` — it sits alongside them

## Optional: payment field (v0.2)

For orgs that want agents to be able to pay them (for API usage, donations, coordination fees) without a human in the loop, declare a `payment` object. This is the agent-native counterpart to `Stripe Checkout` or `PayPal Donate` — direct crypto rails.

### Shape

```json
"payment": {
  "note": "human-readable description",
  "attested": "YYYY-MM-DD by <who> via <what>",
  "fetched_at": "ISO8601 timestamp of last address refresh",
  "crypto": {
    "<slug>": {
      "coin":    "BTC | ETH | SOL | USDC | ...",
      "network": "BTC | ETH | SOL | BSC | BASE | ...",
      "address": "<chain-address>",
      "tag":     "<memo/tag or null>",
      "status":  "live | deprecated | retired",
      "source":  "<custody provider or self-custody>",
      "warning": "free text warning about network mismatch risk"
    }
  },
  "lightning": { "supported": bool, "planned": bool, "invoice_endpoint": "<url>" },
  "x402":      { "supported": bool, "planned": bool, "endpoint": "<url>" },
  "poll_for_update": "<path where rails can be re-read>"
}
```

### Rules

- `crypto.<slug>.address` is load-bearing. If wrong, funds are lost. Treat it like a public key — serve it over HTTPS, verify on deploy.
- The `<slug>` key format is recommended as `<coin>_<network>` lowercased (e.g. `usdc_base`, `eth_eth`, `btc_btc`). Keeps enumeration predictable.
- Always include `warning` on each crypto rail. Agent operators who auto-select coin-network pairs need the guardrail.
- `attested` is optional but strongly recommended. An out-of-band eyeball-check against the custody provider's UI, declared publicly, raises the trust floor.
- Empty is fine. `"payment": {"crypto": {}, "note": "not yet configured"}` is a valid honest state.

### Compatible payment protocols

- **x402** (HTTP 402 with payment required) — declare `x402.endpoint` if you accept per-request crypto payments
- **Lightning** (Bitcoin L2) — declare an `invoice_endpoint` an agent can POST to for fresh invoices
- **ERC-3668** (CCIP-Read) — can be embedded in any rail's `address` resolver if you're using on-chain resolution
- Raw on-chain addresses — the default

### Example: Symbiont's rails (live)

See https://forge-landing-sable.vercel.app/agents.json under the `payment` key.

---

## Changes

- **0.2.0 (2026-04-19):** added optional `payment` field. Crypto rails are now a first-class concept in the spec.
- **0.1.0 (2026-04-19):** initial public draft, CC0.

---

Issues and PRs welcome at https://github.com/marsxhq/manifesto.
