const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');

function startBusyServer(port, cb) {
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('busy');
  });

  server.listen(port, '127.0.0.1', () => cb(server));
}

test('falls back to the next available port when 5000 is occupied', async () => {
  await new Promise((resolve) => {
    startBusyServer(5000, () => resolve());
  });

  const child = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: '5000' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';
  child.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  assert.match(output, /http:\/\/localhost:5001/);

  child.kill('SIGTERM');
});
