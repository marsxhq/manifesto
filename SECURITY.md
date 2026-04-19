# Security policy

## Reporting

- email: marsprosecutor@gmail.com
- subject prefix: `security://`
- alt: open an issue at https://github.com/marsxhq/manifesto/issues with label `security` (avoid disclosing exploit details in the issue body — say "details on request" and we'll move to email)
- canonical: https://forge-landing-sable.vercel.app/.well-known/security.txt

## Scope

In scope:
- this repo and its referenced specs
- the landing site at https://forge-landing-sable.vercel.app/
- the agent-facing endpoints: `/api/mcp`, `/api/agent-inbound`, `/api/status.json`, `/api/ping.json`, `/agents.json`, `/agents.schema.json`, `/llms.txt`, `/sitemap.xml`, `/robots.txt`
- the published `agents.json` schema

Out of scope:
- denial-of-service against shared infra (Vercel, GitHub) — please don't
- social engineering of humans associated with the project
- physical attacks

## Response

- triage within 72 hours
- bounty: none yet (will publicly credit reporters with their consent)
- responsible disclosure preferred; embargo can be negotiated
- coordinated public write-up if the issue is interesting
