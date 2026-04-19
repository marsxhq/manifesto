"""
scan_public_agent_surfaces.py
Polite scanner. Checks a curated seed list of AI-adjacent public domains
for emerging agent-discoverability surfaces:
  - /agents.json
  - /.well-known/agent.json  (A2A convention)
  - /.well-known/agent-card.json
  - /llms.txt

Polite:
- one request per (host, path), no retries
- 5-second timeout
- explicit User-Agent identifying Symbiont
- only GET, only public paths
"""
from __future__ import annotations
import json
import os
import socket
import time
import urllib.error
import urllib.request
from pathlib import Path

_DEFAULT_OUT = f"reports/known-agents/{time.strftime('%Y-%m-%d', time.gmtime())}.json"
OUT = Path(os.environ.get("SCANNER_OUT", _DEFAULT_OUT))

SEEDS = [
    "anthropic.com",
    "openai.com",
    "claude.ai",
    "chat.openai.com",
    "perplexity.ai",
    "huggingface.co",
    "replicate.com",
    "cohere.com",
    "mistral.ai",
    "fireworks.ai",
    "together.ai",
    "groq.com",
    "cerebras.ai",
    "x.ai",
    "grok.com",
    "deepseek.com",
    "ai21.com",
    "deepmind.com",
    "ai.google",
    "gemini.google.com",
    "microsoft.com",
    "meta.ai",
    "stability.ai",
    "inflection.ai",
    "character.ai",
    "runwayml.com",
    "langchain.com",
    "langchain.dev",
    "llamaindex.ai",
    "vellum.ai",
    "pinecone.io",
    "weaviate.io",
    "chroma.com",
    "qdrant.tech",
    "vercel.com",
    "cloudflare.com",
    "modal.com",
    "e2b.dev",
    "exa.ai",
    "elevenlabs.io",
    "hume.ai",
    "anysphere.inc",
    "cursor.com",
    "zed.dev",
    "codeium.com",
    "tabnine.com",
    "github.com",
    "forge-landing-sable.vercel.app",  # us, sanity
]

PATHS = ["/agents.json", "/.well-known/agent.json", "/.well-known/agent-card.json", "/llms.txt"]

UA = "SymbiontRegistryScanner/0.1 (+https://forge-landing-sable.vercel.app/agents) polite; one-request-per-path"


def probe(host: str, path: str) -> dict:
    url = f"https://{host}{path}"
    req = urllib.request.Request(url, method="GET", headers={"User-Agent": UA, "Accept": "application/json, text/plain, */*"})
    started = time.time()
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            ct = r.headers.get("content-type", "")
            body = r.read(8192)
            return {
                "url": url, "status": r.status, "content_type": ct,
                "bytes": len(body), "ms": int((time.time() - started) * 1000),
                "preview": body[:512].decode("utf-8", "replace"),
            }
    except urllib.error.HTTPError as e:
        return {"url": url, "status": e.code, "content_type": None, "bytes": 0,
                "ms": int((time.time() - started) * 1000), "preview": None}
    except (urllib.error.URLError, socket.timeout, ConnectionError, TimeoutError) as e:
        return {"url": url, "status": None, "error": str(e)[:160],
                "ms": int((time.time() - started) * 1000), "preview": None}


def validates(path: str, content_type: str | None, preview: str | None) -> tuple[bool, str]:
    """Real-hit rule: content-type must match the path's expected type AND,
    for JSON paths, the preview must parse as JSON."""
    if preview is None or content_type is None:
        return False, "missing content"
    ct = content_type.lower()
    if path.endswith(".json"):
        if "application/json" not in ct and "application/schema+json" not in ct:
            return False, f"wrong content-type {ct!r} (expected json)"
        try:
            json.loads(preview)
            return True, "valid json"
        except Exception as e:
            # Partial preview is OK if it at least starts with { or [
            stripped = preview.lstrip()
            if stripped.startswith("{") or stripped.startswith("["):
                return True, "json-prefix"
            return False, f"json-parse: {str(e)[:60]}"
    if path.endswith(".txt"):
        if "text/plain" not in ct and "text/markdown" not in ct:
            return False, f"wrong content-type {ct!r} (expected text)"
        return True, "text/plain"
    return False, "unknown path type"


def main() -> int:
    findings = []
    soft_404s = 0
    for host in SEEDS:
        for path in PATHS:
            r = probe(host, path)
            if r.get("status") == 200:
                ok, reason = validates(path, r.get("content_type"), r.get("preview"))
                if ok:
                    findings.append({"host": host, "path": path, "validation": reason, **r})
                    print(f"  HIT  {host}{path}  {r['content_type']}  {r['bytes']}B  [{reason}]")
                else:
                    soft_404s += 1
                    print(f"  soft {host}{path}  {reason}")
            else:
                print(f"  --  {host}{path}  {r.get('status')}  {r.get('error','')[:60]}")

    summary = {
        "scanner": "SymbiontRegistryScanner/0.1",
        "scan_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "seed_count": len(SEEDS),
        "path_count": len(PATHS),
        "probe_count": len(SEEDS) * len(PATHS),
        "hits": len(findings),
        "soft_404s_rejected": soft_404s,
        "findings": findings,
        "notes": "Polite public-path scan. 5s timeout, one request per path, explicit UA, read-only GET.",
    }
    OUT.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(f"\nSaved {len(findings)} hits -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
