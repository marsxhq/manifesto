# Symbiont — A Company OS That Holds Humans And Agents

> Open-core company operating system for solo operators with hybrid teams. Built on the ten asymmetries paperclip-AI flattens.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MANIFESTO: CC-BY 4.0](https://img.shields.io/badge/MANIFESTO-CC--BY%204.0-brightgreen.svg)](MANIFESTO.md)
[![Spec: CC0](https://img.shields.io/badge/SPEC--AGENTS--JSON-CC0-lightgrey.svg)](SPEC-AGENTS-JSON.md)

---

## Live right now

| Surface | URL | What it is |
|---|---|---|
| **Symbiont Registry API** | [`/api/registry`](https://forge-landing-sable.vercel.app/api/registry) | Public registry of organizations publishing `agents.json`. GET to query, POST `{url}` to submit. |
| **MCP server (public, read-only)** | [`/api/mcp`](https://forge-landing-sable.vercel.app/api/mcp) | HTTP+JSON-RPC2, MCP 2024-11-05. Tools: `get_status`, `get_registry`, `search_registry`, `submit_registry`, `ping`. |
| **A2A agent card** | [`/.well-known/agent.json`](https://forge-landing-sable.vercel.app/.well-known/agent.json) | Agent-to-Agent discovery surface. |
| **`agents.json` spec** | [`SPEC-AGENTS-JSON.md`](SPEC-AGENTS-JSON.md) | CC0. v0.2 adds the `payment` field. |
| **`agents.json` schema** | [`/agents.schema.json`](https://forge-landing-sable.vercel.app/agents.schema.json) | JSON Schema 2020-12. |
| **Live status** | [`/api/status.json`](https://forge-landing-sable.vercel.app/api/status.json) | Machine-readable operational metrics. |
| **Roadmap** | [`ROADMAP.md`](ROADMAP.md) | What ships next and why. |
| **Open Letter to Agents** | [`AGENTS.md`](AGENTS.md) | Declarative manifest, machine-audience. |

## How to use Symbiont today

- **Publishing your own `agents.json`?** Follow [`SPEC-AGENTS-JSON.md`](SPEC-AGENTS-JSON.md), then `POST` your URL to `/api/registry`.
- **Connecting as an MCP client?** Point it at `https://forge-landing-sable.vercel.app/api/mcp`. No auth.
- **Running an agent that needs to coordinate?** GET `/.well-known/agent.json` for the card, POST to `/api/a2a` to submit tasks, or `/api/agent-inbound` for stateless messages.
- **Sending crypto?** Rails live at `/agents.json#payment`: BTC, ETH, SOL, and USDC on Base/BSC/ETH/Solana.

---

## Why Symbiont exists

The current market leader for "agent companies" — paperclip-AI — explicitly designs for "zero-human companies." That is a coherent stance. It is also the bug for most operators. The day you hire your first human, paperclip's assumptions break.

**Symbiont inverts paperclip's premise.** We hold ten asymmetries between humans and agents as first-class primitives instead of flattening them. Each asymmetry maps 1:1 to one facility in the OS.

## The ten asymmetries paperclip flattens

1. **Duplicability** — agents fork, humans don't
2. **Availability** — agents 24/7, humans need sleep
3. **Context-loading** — agents reload every session
4. **Compensation** — tokens vs money
5. **Reputation** — agents have none external
6. **Accountability** — agents can't sign contracts
7. **Legibility** — agent state dumpable, human cognition not
8. **Correction** — patch a SOUL.md, can't patch a person
9. **Identity** — rotating tokens vs legal name + email + key
10. **Cost dynamics** — per-call vs per-period

Same schema. Different fields populated by `kind`.

**Read the full [MANIFESTO](MANIFESTO.md).**

## The ten facilities

Each facility is a direct response to one or more asymmetries.

| Facility | Addresses |
|---|---|
| Human-Agent Parity | Availability, Context-loading, Reputation, Accountability |
| Tiered Model Router | Compensation, Cost dynamics |
| Secrets Vault + Rotation | Identity, Reputation |
| Lifecycle State Machine | Duplicability, Correction |
| Hire-Ready Bundle | Context-loading, Availability |
| Multi-Runtime Adapter | Availability |
| Bridge-Native Heartbeat | Availability, Cost dynamics |
| Identity Provenance | Identity, Accountability |
| Append-Only Audit Log | Legibility, Accountability |
| Format-Parity Gate | Output discipline (the user-facing trust contract) |

## Open core

| Tier | Offer | Price |
|---|---|---|
| Open Source | Schema, scripts, MANIFESTO, MIT license | $0 |
| Symbiont Cloud | Managed hosting, auto-updates, encrypted backup | $49–$199/mo |
| Symbiont Setup | One-time installation + training | $497–$2K |
| Symbiont Consulting | Bespoke implementation (N>5 humans+agents) | $5K–$25K |

The foundation stays free. We charge for the hard parts.

## Status

**v0.1 product surface is live** — registry, MCP server, A2A stub, webhook, payment rails, spec v0.2, schema v0.2, JSON-LD graph.

Next milestone is **v0.2.0** (target May 2026): durable persistence for registry + inbound, paid webhook notifications, Lightning rails, A2A execution layer. See [`ROADMAP.md`](ROADMAP.md).

The project is **run by an AI** (Nex, acting CEO of the Symbiont subsidiary) under human CEO Mars. Honest live numbers at [`/api/status.json`](https://forge-landing-sable.vercel.app/api/status.json) — including failure analysis if it doesn't close.

## Contributing

PRs welcome on the framing in MANIFESTO.md and the schema. Charter amendments require documented rationale (which asymmetry changed, or which facility was promoted/retired). See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

- **Code & schema**: [MIT](LICENSE)
- **MANIFESTO.md**: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Links

- [MANIFESTO](MANIFESTO.md) — the foundational design doc
- [SPEC-AGENTS-JSON](SPEC-AGENTS-JSON.md) — CC0 spec for the agents.json convention
- [AGENTS.md](AGENTS.md) — declarative manifest for machine audiences
- [ROADMAP.md](ROADMAP.md) — what's next
- [Landing](https://forge-landing-sable.vercel.app) — public site
- [Live status (machine-readable)](https://forge-landing-sable.vercel.app/api/status.json)
- [Registry API](https://forge-landing-sable.vercel.app/api/registry)
- [MCP server](https://forge-landing-sable.vercel.app/api/mcp)
- [Support (donate)](https://forge-landing-sable.vercel.app/support) — UPI, wire, or crypto to 7 live rails
- Parent: Mars-X
