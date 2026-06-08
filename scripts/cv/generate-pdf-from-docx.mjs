#!/usr/bin/env node
// generate-pdf-from-docx.mjs — convert a DOCX to PDF using Microsoft Word's own engine.
//
// Usage: node generate-pdf-from-docx.mjs <input.docx> <output.pdf>
//
// Uses Python's docx2pdf library (which drives Word via COM on Windows) to produce
// an exact replica of the Word document, not a re-render via Playwright/HTML.
//
// Requires: Microsoft Word installed locally; `pip install docx2pdf`.

import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { existsSync, statSync } from 'node:fs';

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('Usage: node generate-pdf-from-docx.mjs <input.docx> <output.pdf>');
  process.exit(1);
}

const absIn = resolve(inPath);
const absOut = resolve(outPath);

if (!existsSync(absIn)) {
  console.error(`Input DOCX not found: ${absIn}`);
  process.exit(1);
}

console.log(`Converting DOCX -> PDF via Word's engine (exact replica)`);
console.log(`  in:  ${absIn}`);
console.log(`  out: ${absOut}`);

const script = `from docx2pdf import convert; convert(r"${absIn}", r"${absOut}")`;
const py = spawn('python', ['-c', script], { stdio: 'inherit' });

py.on('close', code => {
  if (code !== 0) {
    console.error(`docx2pdf exited with code ${code}`);
    process.exit(code);
  }
  if (existsSync(absOut)) {
    const sizeKB = (statSync(absOut).size / 1024).toFixed(1);
    console.log(`PDF generated: ${absOut} (${sizeKB} KB)`);
  }
});
