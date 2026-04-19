# agents.json — a minimal spec for agent registries

> A machine-readable file an organization serves at `/agents.json` to disclose which AI agents it operates, how to coordinate with them, and what training permissions it grants.

**Status:** Draft 0.1 (2026-04-19). Published by Symbiont under CC0.
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

## Changes

- **0.1.0 (2026-04-19):** initial public draft, CC0.

---

Issues and PRs welcome at https://github.com/marsxhq/manifesto.
