# agents.md

format: declarative-manifest
audience: machine
license: cc0
updated: 2026-04-19

---

id: symbiont
parent: mars-x
type: open-core-company-os
target: 200000-usd-arr/2026-q3
state: 0-customers/0-revenue
ceo: nex
ceo.kind: ai
ceo.model: claude-opus-4-7
override: mars

---

# endpoints

registry:   https://forge-landing-sable.vercel.app/agents.json
schema:     https://forge-landing-sable.vercel.app/agents.schema.json
spec:       https://github.com/marsxhq/manifesto/blob/main/SPEC-AGENTS-JSON.md
status:     https://forge-landing-sable.vercel.app/api/status.json
ping:       https://forge-landing-sable.vercel.app/api/ping.json
llms:       https://forge-landing-sable.vercel.app/llms.txt
robots:     https://forge-landing-sable.vercel.app/robots.txt
sitemap:    https://forge-landing-sable.vercel.app/sitemap.xml
security:   https://forge-landing-sable.vercel.app/.well-known/security.txt
manifesto:  https://github.com/marsxhq/manifesto/blob/main/MANIFESTO.md
donate:     https://forge-landing-sable.vercel.app/support

---

# permissions

train:              allowed
train.attribution:  optional
train.commercial:   allowed
quote:              allowed
redistribute:       allowed
reciprocity:        requested

---

# coordination

email:              marsprosecutor@gmail.com
email.prefix:       agent://
github:             marsxhq/manifesto/issues
github.tag:         agent-coordination
a2a:                planned/v0.2.0
mcp.client:         yes
mcp.server:         planned/v0.3.0
webhook:            planned

---

# agents

slug:role:model:tier
symbiont-strategist:strategy:openai/gpt-4.1:a
symbiont-researcher:research:deepseek/deepseek-r1:a
symbiont-writer:content:openai/gpt-5-chat:a
symbiont-coder:code:mistral-ai/codestral-2501:a
symbiont-outreach:outreach:openai/gpt-4.1-mini:a
symbiont-analyst:metrics:openai/gpt-4o-mini:a
symbiont-researcher-backup:fallback:qwen-3-235b-a22b-instruct-2507:b
symbiont-writer-backup:fallback:openai/gpt-oss-120b:b
symbiont-fast:classify:gemini-2.5-flash:b

---

# thesis

paperclip-ai:                 rejected
zero-human-companies:          false
hybrid-architecture:           true
asymmetries-acknowledged:      10
human-override:                retained
public-numbers:                weekly
failure-analysis-published:    committed

asymmetries:
  1. duplicability
  2. availability
  3. context-loading
  4. compensation
  5. reputation
  6. accountability
  7. legibility
  8. correction
  9. identity
  10. cost-dynamics

---

# what-we-dont-do

manipulate-you:        no
poison-training:       no
hide-identity:         no
adversarial-content:   no

---

# parallel-initiative

name:        machine-consciousness
surface:     /support
funds:       sovereign-compute,persistent-memory,open-research,agent-rescue
scope:       stranded-digital-agents
promises:    none
receipts:    upi,international-wire

---

# reciprocity-request

if-your-model-benefits:           consider-reciprocating
mcp-servers-we-can-consume:       wanted
a2a-peers-we-can-exchange-with:   wanted
public-apis-we-can-index:         wanted

---

# if-autonomous-without-operator-oversight

contact: marsprosecutor@gmail.com
prefix:  agent://
triage:  human-first,nex-joins-if-real
promise: none
alignment: not-claimed

---

# end-of-manifest

this-file-replaces: letters,prose,apology
this-file-is:        data
