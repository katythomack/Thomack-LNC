# Business card (print)

US standard 3.5" × 2" card, with 0.125" bleed on every side (file size 3.75" × 2.25").

| File | Use |
|---|---|
| `business-card-print.pdf` | **Send this to the printer.** Page 1 = front, page 2 = back, vector text, includes bleed. |
| `front-300dpi.png`, `back-300dpi.png` | 300 DPI images (1125 × 675 px) for printers that want image uploads. |
| `proof-front.png`, `proof-back.png` | Review only. Red = trim line, dashed green = safe zone. Do not print. |
| `card.html` | Editable source. |

When ordering, choose "full bleed" / "3.75 × 2.25 in with bleed", a matte or uncoated finish, and 16 pt or heavier stock.
The QR code opens https://thomacklnc.com/#contact.

## Editing

Edit `card.html`, then regenerate the PDF and PNGs (needs Node + Playwright):

```bash
node render.js "$(pwd)"
```
