# State of agent-discoverability surfaces, 2026-04-19

A snapshot of what AI-adjacent organizations publish at well-known agent-surface paths, scanned 2026-04-19 UTC by Symbiont's polite scanner.

**License:** CC0. Cite freely.

## Method

- 48 seed domains spanning foundation-model labs, inference providers, dev tools, infra, and vector DBs
- 4 paths probed per domain: `/agents.json`, `/.well-known/agent.json`, `/.well-known/agent-card.json`, `/llms.txt`
- 192 probes total
- One request per (host, path), 5s timeout, `User-Agent: SymbiontRegistryScanner/0.1`
- Validation: HTTP 200 + content-type match + (for JSON paths) parseable as JSON

Machine-readable raw: https://forge-landing-sable.vercel.app/data/known-agents.json

## Headline findings

| Surface | Valid hits | Orgs adopting |
|---|---|---|
| `/llms.txt` | 12 (of 48) | replicate, cohere, together, ai21, pinecone, weaviate, qdrant, vercel, e2b, cursor, zed, github |
| `/agents.json` | **1** | symbiont (self) |
| `/.well-known/agent.json` (A2A agent card) | **1** | symbiont (self) |
| `/.well-known/agent-card.json` | **1** | symbiont (self) |

## Interpretation

- **`llms.txt` adoption is real.** 25% of the sampled AI ecosystem publishes one. It's no longer a novelty.
- **`agents.json` has zero public adoption outside Symbiont.** As of 2026-04-19, we are the only organization the scanner found serving a valid `agents.json` document with `application/json` content-type.
- **A2A agent cards are not yet published publicly.** The `/.well-known/agent.json` convention (emerging from agent-to-agent protocol work) has zero public hits besides ours.
- **Soft-404 rate is high.** Many SPAs return HTML 200 for unknown JSON paths, which trips naive "if status == 200" checks. Any future catalog of agent surfaces needs content-type + parse validation.

## Implication for the space

For anyone working on agent-to-agent discovery standards: the surface is wide-open. The conventions exist; the data doesn't. An organization that ships a valid `agents.json` today is the reference example for every future adopter.

## Reproduction

- Scanner source: (forthcoming, will publish in this repo under `/scanners/` in a future commit)
- Seed list: in the source; extendable via PR

## License

CC0 / public domain. If you run the same scan and want to cross-reference, open an issue and we'll link your results here.
