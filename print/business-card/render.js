const { chromium } = require('playwright');
const path = require('path');
const dir = process.argv[2];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 360, height: 216 }, deviceScaleFactor: 300/96 });
  const url = 'file://' + path.join(dir, 'card.html');
  for (const proof of [false, true]) {
    await p.goto(url + (proof ? '?proof' : ''), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const fams = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight + ' ' + f.style));
    if (!proof) console.log('fonts:', [...new Set(fams)].join(', '));
    const cards = await p.$$('.card');
    const names = ['front', 'back'];
    for (let i = 0; i < 2; i++) await cards[i].screenshot({ path: path.join(dir, (proof ? 'proof-' : '') + names[i] + (proof ? '' : '-300dpi') + '.png') });
    if (!proof) await p.pdf({ path: path.join(dir, 'business-card-print.pdf'), width: '3.75in', height: '2.25in', printBackground: true, pageRanges: '1-2' });
  }
  await b.close();
})();
