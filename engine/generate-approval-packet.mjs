#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildApprovalPacket, evaluatePublicationGate, formatApprovalPacketMarkdown } from './lib/publication-gate.mjs';

const input = process.argv[2];
const outDir = process.argv[3] ?? path.join(process.env.HOME, '.hermes/data/mdrank/private/approval-packets');
if (!input) {
  console.error('Usage: node engine/generate-approval-packet.mjs <candidate.json> [private-output-dir]');
  process.exit(2);
}
const candidate = JSON.parse(await fs.readFile(input, 'utf8'));
const packet = buildApprovalPacket(candidate);
const gate = evaluatePublicationGate(candidate);
const slug = candidate.url.replace(/^\//, '').replaceAll('/', '--') || 'homepage';
await fs.mkdir(outDir, { recursive: true });
const jsonPath = path.join(outDir, `${slug}.approval.json`);
const mdPath = path.join(outDir, `${slug}.approval.md`);
await Promise.all([
  fs.writeFile(jsonPath, `${JSON.stringify({ gate, packet }, null, 2)}\n`),
  fs.writeFile(mdPath, `${formatApprovalPacketMarkdown(packet)}\n`),
]);
console.log(JSON.stringify({ status: 'approval-required', gate, jsonPath, mdPath }, null, 2));
// Deliberately no publish/deploy/send side effect.
