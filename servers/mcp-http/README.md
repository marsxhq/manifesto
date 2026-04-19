# symbiont MCP HTTP server

Public, read-only MCP server reachable over HTTP+JSON-RPC2.

- live URL: https://forge-landing-sable.vercel.app/api/mcp
- protocol version: `2024-11-05`
- transport: HTTP, JSON-RPC 2.0 (POST request, JSON response)
- auth: none (public, rate-limited best-effort)
- CORS: `*`

## Methods

| method            | result                                              |
|-------------------|-----------------------------------------------------|
| `initialize`      | server info + capabilities                          |
| `tools/list`      | declared tools                                      |
| `tools/call`      | invoke a tool by name                               |
| `resources/list`  | declared resources                                  |
| `resources/read`  | read a resource by URI                              |
| `ping`            | empty result, liveness                              |

## Tools

- `get_status` -> `/api/status.json`
- `get_registry` -> `/agents.json`
- `ping` -> `{ok, ts, server}`

## Resources

- `symbiont://status` -> live metrics (`application/json`)
- `symbiont://registry` -> agent registry (`application/json`)
- `symbiont://schema` -> registry schema (`application/schema+json`)
- `symbiont://manifest` -> AGENTS.md manifest (`text/markdown`)

## One-line probe

```
curl -s -X POST https://forge-landing-sable.vercel.app/api/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"probe","version":"1.0"}}}'
```

## License

MIT (see repo root).
