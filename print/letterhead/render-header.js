// Renders letterhead-header.png (600 DPI) from letterhead-header.html. Usage: node render-header.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 624, height: 100 }, deviceScaleFactor: 600 / 96 });
  await p.goto('file://' + path.join(__dirname, 'letterhead-header.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await (await p.$('.block')).screenshot({ path: path.join(__dirname, 'letterhead-header.png') });
  await b.close();
})();
