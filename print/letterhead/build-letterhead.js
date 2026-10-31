// Builds thomack-letterhead.docx (US Letter) to match the business card.
// Run from anywhere:  node build-letterhead.js
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, Table, TableRow, TableCell,
  WidthType, BorderStyle, LineRuleType, AlignmentType, VerticalAlign, TabStopType, PageNumber,
} = require('docx');

const here = __dirname;
const logo = fs.readFileSync(path.join(here, '../../images/logo.png'));

const TEAL = '163A47', INK = '1D2A30', MUTED = '55666E', GOLD = 'B08D57';
const SERIF = 'Georgia';
const IN = 1440; // DXA per inch
const CONTENT_W = 6.5 * IN;

const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };
const goldRule = (side) => ({ [side]: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 6 } });
const run = (text, o = {}) => new TextRun({ text, font: SERIF, color: INK, ...o });

// ---------- First-page header: logo left, contact block right ----------
const LEFT_W = 4.05 * IN, RIGHT_W = CONTENT_W - LEFT_W;
const contactLine = (text, o = {}) =>
  new Paragraph({ spacing: { after: 0, line: 264, lineRule: LineRuleType.AUTO }, children: [run(text, { size: 17, ...o })] });

const logoTable = () => new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [LEFT_W, RIGHT_W],
      borders: noBorders,
      rows: [new TableRow({ children: [
        new TableCell({
          width: { size: LEFT_W, type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.BOTTOM,
          margins: { left: 0, right: 0 },
          children: [new Paragraph({ spacing: { before: 0, after: 0, line: 240, lineRule: LineRuleType.AUTO }, children: [new ImageRun({
            type: 'png', data: logo,
            transformation: { width: 260, height: Math.round(260 * 198 / 1000) },
            altText: { title: 'Thomack Legal Nurse Consulting', description: 'Thomack Legal Nurse Consulting logo', name: 'logo' },
          })] })],
        }),
        new TableCell({
          width: { size: RIGHT_W, type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.BOTTOM,
          margins: { left: 0.35 * IN, right: 0 },
          children: [
            contactLine('Katy Thomack, RN, MSN, CLNC', { bold: true, color: TEAL }),
            contactLine('720-254-1359'),
            contactLine('katy@thomacklnc.com'),
            contactLine('thomacklnc.com'),
          ],
        }),
      ] })],
    });
const headRule = () => new Paragraph({ border: goldRule('bottom'), spacing: { before: 60, after: 240 }, children: [] });

const firstHeader = new Header({ children: [logoTable(), headRule()] });

const makeFooter = () => new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER, border: goldRule('top'),
    children: [run('Parker, Colorado  ·  Serving plaintiff and defense attorneys nationwide', { size: 15, color: MUTED })],
  })],
});
const firstFooter = makeFooter();

// ---------- Continuation pages: slim header with page number ----------
const makeLaterHeader = () => new Header({
  children: [new Paragraph({
    border: goldRule('bottom'), spacing: { after: 360 },
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
    children: [
      run('Thomack Legal Nurse Consulting', { size: 16, color: TEAL, bold: true }),
      run('\tPage ', { size: 16, color: MUTED }),
      new TextRun({ children: [PageNumber.CURRENT], font: SERIF, size: 16, color: MUTED }),
    ],
  })],
});
const laterHeader = makeLaterHeader();
const laterFooter = new Footer({ children: [new Paragraph({ children: [] })] });

// ---------- Body: a fill-in-the-blanks letter ----------
const p = (text, o = {}) => new Paragraph({ spacing: { after: 0 }, children: [run(text, o.run)], ...o.para });
const gap = () => new Paragraph({ spacing: { after: 0 }, children: [] });
const ph = {}; // placeholders use normal text color so typed replacements aren't gray

const makeBody = () => [
  p('[Date]', { run: ph }),
  gap(),
  p('[Attorney Name], Esq.', { run: ph }),
  p('[Law Firm]', { run: ph }),
  p('[Street Address]', { run: ph }),
  p('[City, State ZIP]', { run: ph }),
  gap(),
  new Paragraph({ spacing: { after: 0 }, children: [run('Re:\t', { bold: true }), run('[Case name / matter]', ph)], tabStops: [{ type: TabStopType.LEFT, position: 0.5 * IN }] }),
  gap(),
  p('Dear [Attorney Name]:', { run: ph }),
  gap(),
  p('[Begin typing your letter here.]', { run: ph }),
  gap(),
  p('Sincerely,'),
  gap(), gap(), gap(),
  p('Katy Thomack, RN, MSN, CLNC'),
  p('Legal Nurse Consultant'),
];

const doc = new Document({
  creator: 'Thomack Legal Nurse Consulting',
  title: 'Thomack LNC Letterhead',
  styles: { default: { document: { run: { font: SERIF, size: 22, color: INK }, paragraph: { spacing: { line: 276 } } } } },
  sections: [{
    properties: {
      titlePage: true,
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1.15 * IN, bottom: 0.85 * IN, left: IN, right: IN, header: 0.5 * IN, footer: 0.45 * IN },
      },
    },
    headers: { first: firstHeader, default: laterHeader },
    footers: { first: firstFooter, default: laterFooter },
    children: makeBody(),
  }],
});

// ---------- Apple Pages version ----------
// Pages can't keep a separate first-page header or a table inside a header, so
// here the logo block sits at the top of the page-1 body, the slim header is the
// only header (hide it on page 1 in Pages: Document > Section > "Hide on first
// page of section"), and the footer appears on every page.
const pagesDoc = new Document({
  creator: 'Thomack Legal Nurse Consulting',
  title: 'Thomack LNC Letterhead (Pages)',
  styles: { default: { document: { run: { font: SERIF, size: 22, color: INK }, paragraph: { spacing: { line: 276 } } } } },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 0.85 * IN, bottom: 0.85 * IN, left: IN, right: IN, header: 0.45 * IN, footer: 0.45 * IN },
      },
    },
    headers: { default: makeLaterHeader() },
    footers: { default: makeFooter() },
    children: [logoTable(), headRule(), ...makeBody()],
  }],
});
Packer.toBuffer(pagesDoc).then((buf) => {
  fs.writeFileSync(path.join(here, 'thomack-letterhead-pages.docx'), buf);
  console.log('wrote thomack-letterhead-pages.docx');
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(path.join(here, 'thomack-letterhead.docx'), buf);
  console.log('wrote thomack-letterhead.docx');
  // Word template (.dotx): same package, different main content type.
  const { execFileSync } = require('child_process');
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dotx-'));
  execFileSync('unzip', ['-q', path.join(here, 'thomack-letterhead.docx'), '-d', tmp]);
  const ct = path.join(tmp, '[Content_Types].xml');
  fs.writeFileSync(ct, fs.readFileSync(ct, 'utf8').replace(
    'wordprocessingml.document.main+xml', 'wordprocessingml.template.main+xml'));
  const out = path.join(here, 'thomack-letterhead.dotx');
  fs.rmSync(out, { force: true });
  execFileSync('zip', ['-qX', out, '[Content_Types].xml'], { cwd: tmp }); // keep it first in the archive
  execFileSync('zip', ['-qXrD', out, '.'], { cwd: tmp });
  fs.rmSync(tmp, { recursive: true });
  console.log('wrote thomack-letterhead.dotx');
});
