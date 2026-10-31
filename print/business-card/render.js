// Renders print files from card.html. Usage: node render.js "$(pwd)"
//  - business-card-print.pdf, front/back-300dpi.png: 3.75" x 2.25" (standard 0.125" bleed)
//  - business-card-vistaprint.pdf, front/back-vistaprint.png: 3.61" x 2.11" (Vistaprint's 0.055" bleed)
//  - proof-front/back.png: review only (trim + safe-area guides)
const { chromium } = require('playwright');
const path = require('path');
const { execFileSync } = require('child_process');
const dir = process.argv[2] || __dirname;
const variants = [
  { bleed: 0.125, pdf: 'business-card-print.pdf', png: (n) => `${n}-300dpi.png` },
  { bleed: 0.055, pdf: 'business-card-vistaprint.pdf', png: (n) => `${n}-vistaprint.png` },
];
(async () => {
  const b = await chromium.launch();
  const url = 'file://' + path.join(dir, 'card.html');
  for (const v of [...variants, { bleed: 0.125, proof: true }]) {
    const w = 3.5 + 2 * v.bleed, h = 2 + 2 * v.bleed;
    const p = await b.newPage({ viewport: { width: Math.ceil(w * 96), height: Math.ceil(h * 96) }, deviceScaleFactor: 300 / 96 });
    await p.goto(`${url}?bleed=${v.bleed}${v.proof ? '&proof' : ''}`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const cards = await p.$$('.card');
    const names = ['front', 'back'];
    if (v.proof) {
      for (let i = 0; i < 2; i++) await cards[i].screenshot({ path: path.join(dir, `proof-${names[i]}.png`) });
    } else {
      await p.pdf({ path: path.join(dir, v.pdf), width: `${w}in`, height: `${h}in`, printBackground: true, pageRanges: '1-2' });
      // 300 DPI PNGs rasterized from the PDF, so pixel sizes are exact.
      for (let i = 0; i < 2; i++) {
        execFileSync('pdftoppm', ['-png', '-r', '300', '-f', String(i + 1), '-l', String(i + 1), '-singlefile',
          path.join(dir, v.pdf), path.join(dir, v.png(names[i]).replace(/\.png$/, ''))]);
      }
    }
    await p.close();
  }
  await b.close();
})();
