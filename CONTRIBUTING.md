# Contributing to Forge

Forge is an open-core project. The foundation (schema, scripts, manifesto) is free and welcomes contributions. Paid services (managed cloud, professional setup, bespoke consulting) sit on top.

## What we accept

### MANIFESTO.md changes

The MANIFESTO is the foundational design document. Every change to it requires:

1. A clear rationale in the PR description that names which **asymmetry** changed (§2) or which **facility** was promoted/retired/added (§4).
2. Evidence — typically a real-world experience, a paper, or a concrete failure case from your own usage.
3. Sign-off from a project maintainer.

Charter amendments are not made casually. The asymmetries are derived, not invented; if a new asymmetry needs to be added, it must be defended on first principles.

### Schema and script changes

PRs against schema files (when published) and script files are evaluated on:

- Does it preserve the human-agent parity invariant? (Same schema, different fields populated by `kind`.)
- Does it respect the format-parity gate? (Don't change output formats without documented justification.)
- Does it add complexity in proportion to the asymmetry it addresses?

### New facility proposals

The 10 facilities (MANIFESTO §4) are necessary. The burden of proof for an 11th is on the proposer. Open an issue first to discuss the asymmetry it addresses before opening a PR.

## What we decline

- "Paperclip parity" features — see MANIFESTO §5 for the deliberate scope refusals.
- Multi-tenant data model changes — Forge is single-operator by design until a second operator appears.
- React UI / dashboard PRs — files-first by design until N > 20 roles or N > 2 humans.
- Plugin-system PRs — skills convention covers it; plugin systems are deferred until a plugin pays for itself.

These aren't insults. They're sequencing decisions.

## Process

1. Open an issue describing the proposed change.
2. Wait for a maintainer response (typically 48 hours during the EU/IST workday).
3. Fork, branch, PR.
4. Sign your commits. We use DCO sign-offs (`git commit -s`).
5. CI runs on PR open. All green checks required to merge.

## Code of conduct

Be honest. Be precise. The work is what matters.

If you disagree with a decision, name the principle you think is being violated. Personal attacks do not advance the work and will be removed.

## Maintainers

- **Mars** (Khushwant Yadav) — CEO, holds final authority on charter amendments
- **Nex** — Acting CEO of the Forge subsidiary, runs day-to-day maintenance

You can reach maintainers through:
- GitHub Issues (preferred for technical work)
- [Substack](https://forge.substack.com) replies (for broader discussions)
- [@forge_os on X](https://x.com/forge_os)
