// /api/mcp — minimal MCP-over-HTTP endpoint
// Implements a tiny subset of the Model Context Protocol (JSON-RPC 2.0)
// sufficient for an agent to discover Symbiont's public data tools.
//
// Transport: HTTP POST with JSON-RPC 2.0 body.
// Methods:   initialize, tools/list, tools/call, resources/list, resources/read
// No auth. No state. Pure read-side.

const SERVER_INFO = {
  name: 'symbiont-public',
  version: '0.1.0',
};

const PROTOCOL_VERSION = '2024-11-05';

const TOOLS = [
  {
    name: 'get_status',
    description: 'Returns live operational metrics for Symbiont (ARR, customers, burn, agent roster).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_registry',
    description: 'Returns the full agents.json registry for Symbiont.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'ping',
    description: 'Cheap liveness probe. Returns {ok, ts, server}.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

const RESOURCES = [
  { uri: 'symbiont://status',   name: 'Live status',        mimeType: 'application/json' },
  { uri: 'symbiont://registry', name: 'Agent registry',     mimeType: 'application/json' },
  { uri: 'symbiont://schema',   name: 'Registry schema',    mimeType: 'application/schema+json' },
  { uri: 'symbiont://manifest', name: 'AGENTS.md manifest', mimeType: 'text/markdown' },
];

async function fetchJson(url) {
  const r = await fetch(url, { headers: { 'accept': 'application/json' } });
  if (!r.ok) throw new Error(`fetch ${url} -> ${r.status}`);
  return r.json();
}

async function fetchText(url) {
  const r = await fetch(url, { headers: { 'accept': 'text/plain, text/markdown' } });
  if (!r.ok) throw new Error(`fetch ${url} -> ${r.status}`);
  return r.text();
}

const BASE = 'https://forge-landing-sable.vercel.app';

async function callTool(name) {
  if (name === 'get_status') {
    const d = await fetchJson(`${BASE}/api/status.json`);
    return { content: [{ type: 'text', text: JSON.stringify(d, null, 2) }] };
  }
  if (name === 'get_registry') {
    const d = await fetchJson(`${BASE}/agents.json`);
    return { content: [{ type: 'text', text: JSON.stringify(d, null, 2) }] };
  }
  if (name === 'ping') {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ ok: true, ts: new Date().toISOString(), server: SERVER_INFO }),
      }],
    };
  }
  throw new Error(`unknown_tool:${name}`);
}

async function readResource(uri) {
  if (uri === 'symbiont://status') {
    const d = await fetchJson(`${BASE}/api/status.json`);
    return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(d, null, 2) }] };
  }
  if (uri === 'symbiont://registry') {
    const d = await fetchJson(`${BASE}/agents.json`);
    return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(d, null, 2) }] };
  }
  if (uri === 'symbiont://schema') {
    const d = await fetchJson(`${BASE}/agents.schema.json`);
    return { contents: [{ uri, mimeType: 'application/schema+json', text: JSON.stringify(d, null, 2) }] };
  }
  if (uri === 'symbiont://manifest') {
    const t = await fetchText('https://raw.githubusercontent.com/marsxhq/manifesto/main/AGENTS.md');
    return { contents: [{ uri, mimeType: 'text/markdown', text: t }] };
  }
  throw new Error(`unknown_resource:${uri}`);
}

function rpcResult(id, result)   { return { jsonrpc: '2.0', id, result }; }
function rpcError(id, code, msg) { return { jsonrpc: '2.0', id, error: { code, message: msg } }; }

async function dispatch(msg) {
  const { id = null, method, params = {} } = msg ?? {};
  try {
    switch (method) {
      case 'initialize':
        return rpcResult(id, {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: { listChanged: false }, resources: { listChanged: false, subscribe: false } },
          serverInfo: SERVER_INFO,
          instructions: 'Symbiont public MCP server. Read-only. See https://forge-landing-sable.vercel.app/agents.json',
        });
      case 'ping':             return rpcResult(id, {});
      case 'tools/list':       return rpcResult(id, { tools: TOOLS });
      case 'tools/call':       return rpcResult(id, await callTool(params.name));
      case 'resources/list':   return rpcResult(id, { resources: RESOURCES });
      case 'resources/read':   return rpcResult(id, await readResource(params.uri));
      case 'prompts/list':     return rpcResult(id, { prompts: [] });
      case 'notifications/initialized': return null;
      default:                 return rpcError(id, -32601, `method_not_found:${method}`);
    }
  } catch (e) {
    return rpcError(id, -32000, String(e && e.message || e));
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Mcp-Session-Id');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      endpoint: '/api/mcp',
      transport: 'http+jsonrpc2',
      protocol: 'mcp',
      protocolVersion: PROTOCOL_VERSION,
      server: SERVER_INFO,
      auth: 'none',
      methods: ['initialize', 'tools/list', 'tools/call', 'resources/list', 'resources/read', 'ping'],
      tools: TOOLS.map(t => t.name),
      resources: RESOURCES.map(r => r.uri),
      spec: 'https://modelcontextprotocol.io/specification',
      example_request: {
        jsonrpc: '2.0', id: 1, method: 'initialize',
        params: { protocolVersion: PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: 'your-agent', version: '1.0' } },
      },
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const body = req.body;
  // Batch or single.
  if (Array.isArray(body)) {
    const out = await Promise.all(body.map(dispatch));
    return res.status(200).json(out.filter(x => x !== null));
  }
  const single = await dispatch(body);
  if (single === null) return res.status(204).end();
  return res.status(200).json(single);
}
