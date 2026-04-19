# Symbiont Manifesto — A Company OS That Holds Humans And Agents

**Audience:** anyone who is building or running a hybrid team — humans, AI agents, or both — and needs a company-of-record that respects the difference.

**Status:** v0.1.0 — foundational. Open source. PRs welcome on the framing; charter amendments documented in commit history.

---

## 1. The premise

You are a solo operator (or a small team). Today you coordinate AI agents — Claude, GPT, Gemini, Cursor, custom-trained models. Tomorrow you will hire humans, more agents, or both. The company-of-record that holds you today must also hold those future hires, on the same schema, under the same governance, with no re-architecture.

This is the problem Symbiont is built to solve.

The current market leader (paperclip-AI) cannot solve it. Its README declares it an "open-source orchestration for zero-human companies." It is honest about its assumptions — those assumptions are incompatible with the world that most operators actually live in. Symbiont is not paperclip plus features. Symbiont is what you get when you invert paperclip's assumption model and rebuild from first principles.

## 2. The ten asymmetries paperclip flattens

A company that holds humans and agents must respect ten asymmetries between them. Paperclip flattens these — treats every role as an agent-shaped thing. Symbiont holds them explicitly.

### 2.1 Duplicability
Agents can be forked, rolled back, and rerun from a checkpoint. Humans cannot. A human is not a git branch.
**Implication:** version control on a role's *definition* (AGENTS.md) is essential for both. Version control on a role's *state* only makes sense for agents.

### 2.2 Availability
Agents are always on, subject to session caps and budget. Humans have evenings, weekends, sick days, sleep, family, seasonal affective disorder, and a seven-hour block called "the rest of their life."
**Implication:** heartbeat cadence is per-role. Agents fire every 60 s. Humans never fire automatically. Notification channels diverge by `kind`.

### 2.3 Context-loading
Agents reload context every session. Humans carry it.
**Implication:** agent-facing documentation is repeat-read; human-facing documentation is read-once-at-onboarding. Onboarding bundles differ in density.

### 2.4 Compensation
Agents burn tokens. Humans need money. Also equity, recognition, growth, status, referrals.
**Implication:** the budget schema must hold both. Agent `budget.json` tracks `remaining_usd` per-call. Human role files hold `compensation: {currency, rate, period, equity_pct, benefits[]}`. Different unit; unified accounting surface.

### 2.5 Reputation
Agents have no external reputation. They cannot be poached. Humans do all three.
**Implication:** human role files include `external_accounts` and `prior_affiliations`. Agents don't. Offboarding concerns differ.

### 2.6 Accountability
Agents cannot sign contracts. They cannot represent the company in a legal sense. Humans can.
**Implication:** decision-rights matrix has a reserved column for `human-only` decisions. Agents acting as proxies must disclose.

### 2.7 Legibility
Agent state is inspectable. You can dump an agent's memory and diff its retry policy. Human cognitive state is not inspectable to the company.
**Implication:** performance reviews differ by kind. Agent reviews can mechanically analyze decisions, latency, budget, audit log. Human reviews are conversations.

### 2.8 Correction
You can patch an agent's behavior file and the next session behaves differently. You cannot patch a human.
**Implication:** review output differs by kind. Agent review may produce a SOUL.md patch. Human review produces feedback, possibly a coaching plan.

### 2.9 Identity
Agents run on rotating tokens. Humans are identified by the person — legal name, verified email, optional hardware key.
**Implication:** identity provenance uses external-source-only tokens for agents and `(legal_name, verified_email, optional_hardware_key)` for humans. Same audit log schema; different signing material.

### 2.10 Cost dynamics
Agent marginal cost is tokens per task. Human marginal cost is hourly or salaried regardless of volume. An idle agent costs $0. An idle human on salary costs full rate.
**Implication:** budget rollup is per-role. Agents accumulate cost per-call (rate-limited by tier router). Humans accumulate cost per-period (throttled by prioritization, not budget).

## 3. What paperclip gets wrong for a hybrid environment

Paperclip's choices are coherent for its stated purpose. They are wrong for a solo operator with a hybrid team.

1. **HTTP-polling heartbeats.** Agents waste tokens waking up to poll. Humans ignore it. Symbiont replaces this with a bridge-native heartbeat at sub-millisecond latency, with per-role cadence tuned to `kind`.
2. **A single budget cap.** Cannot distinguish frontier-model spend from cheap-tier spend. Any nontrivial operation burns the cap on the wrong tier. Symbiont adds a tiered router with intent labelling.
3. **No lifecycle.** Paperclip roles exist or don't. Symbiont requires `applicant → probation → active → on_leave → terminated` — because humans need those states and agents benefit from them.
4. **YAML-only agents.** Fine for agents. Humans need legal, compensation, onboarding, offboarding — none of which fit cleanly in agent YAML. Symbiont broadens the schema while keeping it one schema.
5. **Postgres + React UI.** Enormous overhead for a solo operator. Symbiont defers the platform adoption and uses files until N > 20 roles or N > 2 humans. Postgres is a valid destination, not a day-one dependency.
6. **No dead-letter on retries.** A wake-loop incident can spam any offline brain forever. Symbiont requires bounded retries and a dead-letter queue.
7. **Mutable activity log.** Not tamper-evident. Symbiont replaces it with append-only JSONL with optional SHA-256 `prev_hash` chaining.

## 4. Symbiont's ten facilities, mapped to asymmetries

Each facility is a direct response to one or more asymmetries. This is not "paperclip plus features." This is the minimal primitive set required by the premise in §1.

| Facility | Addresses asymmetries |
|---|---|
| Human-Agent Parity | Availability, Context-loading, Reputation, Accountability |
| Tiered Model Router | Compensation (agents), Cost dynamics |
| Secrets Vault + Rotation | Identity, Reputation (external accounts) |
| Lifecycle State Machine | Duplicability (version the definition), Correction |
| Hire-Ready Bundle | Context-loading, Availability |
| Multi-Runtime Adapter | Availability (different comms channels per kind) |
| Bridge-Native Heartbeat | Availability, Cost dynamics |
| Identity Provenance | Identity, Accountability |
| Append-Only Audit Log | Legibility, Accountability |
| Format-Parity Gate | Output discipline (the user-facing trust contract) |

The ten facilities are necessary. The burden of proof for an eleventh is on whoever proposes it.

## 5. What Symbiont deliberately does not do

A manifesto is defined as much by what it refuses as by what it asserts.

- **Symbiont does not require the paperclip platform.** Files first. Postgres + React is a valid end-state; not a dependency. Revisit when N > 20 roles or N > 2 humans.
- **Symbiont does not invent a new daemon.** A bridge already exists in your environment (or we install one). Route everything through it before building anything new.
- **Symbiont does not adopt a multi-tenant data model.** You are one operator. Multi-tenancy is premature abstraction until a second operator appears.
- **Symbiont does not build a React dashboard.** You read markdown. Tickets are files. The audit log is JSONL. A UI arrives when it earns itself.
- **Symbiont does not fork upstream skills.** Reference upstream by pinned commit. Inline-forking is how skill libraries die.
- **Symbiont does not treat humans as degraded agents.** The ten asymmetries are respected. A human in a Director role has different heartbeat, different notification surface, different cost accounting. Same schema. Different fields populated.
- **Symbiont does not treat agents as synthetic humans.** They are not pretending to be people. The `kind` discriminator is honest.

## 6. The hiring promise

The test of Symbiont is this: on the day you hire the first human (or the fifth agent), can that person sit down and be productive within one day?

The `hire-ready bundle` is the script that delivers this promise. It runs the 8 ordered steps and produces: a role file, a lifecycle entry on probation, a budget allocation, a decision-rights briefing, a tool list, ten starter tickets, a secrets handoff, and an audit entry. For humans, it additionally produces: a physical welcome package, a calendar invite for the first week, an external-accounts list, and a named onboarding buddy.

Under 1 day, end-to-end, the same script, regardless of `kind`. That is the promise.

## 7. Evolution

The company improves by feedback loop. Every session closes with a consolidation cycle. Every quarter closes with a performance review per role. Every review produces either a SOUL.md patch (agents) or a coaching conversation (humans). The audit log is the corpus from which all reviews draw.

The MANIFESTO itself is not exempt. When an asymmetry changes — for example, if agent duplicability starts to look more human (persistent memory, long context, continuous existence) — we amend §2. When a facility is promoted or retired, we amend §4. When the premise changes — a co-founder arrives, a spin-off, a merger — we amend §1.

Until then: these ten facilities are the foundation. Build on them. Do not work around them.

---

**Symbiont is open core.** The schema, the scripts, this MANIFESTO — free under MIT. Managed hosting, professional setup, and bespoke implementation are paid services. We make money on the hard parts; we give the foundation away.

**Contributions welcome** at the public repo. Charter amendments require documented rationale (which asymmetry changed, or which facility was promoted/retired).

This MANIFESTO is the result of one operator running a hybrid team for real, hitting the wall paperclip's assumptions create, and rebuilding from first principles. If you are about to hit the same wall — or already have — Symbiont is for you.
