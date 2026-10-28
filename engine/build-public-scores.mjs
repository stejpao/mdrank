#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { projectPublicScores } from './lib/scorer.mjs';

const root = process.cwd();
const projection = projectPublicScores(root);
const target = path.join(root, 'web/src/data/publicScores.json');
fs.writeFileSync(target, `${JSON.stringify(projection, null, 2)}\n`);
console.log(`Wrote ${target}`);
