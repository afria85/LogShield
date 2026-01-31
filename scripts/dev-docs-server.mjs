#!/usr/bin/env node

/**
 * Minimal static server for the /docs site.
 *
 * Why this exists:
 * - VSCode Live Server doesn't always work across your LAN.
 * - You may want to preview the site on a phone/tablet.
 *
 * Usage:
 *   npm run dev            # localhost only
 *   npm run dev:lan        # bind 0.0.0.0 (LAN)
 *
 * Optional flags:
 *   --host 0.0.0.0
 *   --port 4173
 *   --dir docs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

function parseArgs(argv) {
  const out = { host: '127.0.0.1', port: 4173, dir: 'docs' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--host') out.host = argv[++i] || out.host;
    else if (a === '--port') out.port = Number(argv[++i]) || out.port;
    else if (a === '--dir') out.dir = argv[++i] || out.dir;
  }
  return out;
}

const { host, port, dir } = parseArgs(process.argv.slice(2));
const rootDir = path.resolve(process.cwd(), dir);

const CONTENT_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
]);

function safeJoin(base, requestPath) {
  // decode URI and strip query/hash
  const clean = requestPath.split('?')[0].split('#')[0];
  const decoded = decodeURIComponent(clean);

  // Normalize and prevent directory traversal.
  const joined = path.join(base, decoded);
  const normalized = path.normalize(joined);

  if (!normalized.startsWith(base)) return null;
  return normalized;
}

function listLanIps() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) ips.push(net.address);
    }
  }
  return ips;
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  // Default route
  const reqPath = req.url === '/' ? '/index.html' : req.url;

  const filePath = safeJoin(rootDir, reqPath);
  if (!filePath) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  let finalPath = filePath;
  if (stat.isDirectory()) {
    finalPath = path.join(filePath, 'index.html');
  }

  try {
    const data = fs.readFileSync(finalPath);
    const ext = path.extname(finalPath).toLowerCase();
    const ct = CONTENT_TYPES.get(ext) || 'application/octet-stream';

    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'no-store');
    res.statusCode = 200;
    res.end(data);
  } catch {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(port, host, () => {
  console.log(`\nLogShield docs dev server\n`);
  console.log(`Serving: ${rootDir}`);
  console.log(`Listening: http://${host}:${port}/`);

  if (host === '0.0.0.0') {
    const ips = listLanIps();
    if (ips.length) {
      console.log('\nLAN preview (same Wi-Fi):');
      for (const ip of ips) {
        console.log(`  http://${ip}:${port}/`);
      }
      console.log('\nTip: allow Node through Windows Firewall if prompted.');
    }
  }
});
