# Letterhead

| File | Use |
|---|---|
| `thomack-letterhead.docx` | **Open in Word, type your letter, save as a new file.** US Letter. Page 1 has the full logo header and footer; later pages get a slim header with the page number automatically. |
| `thomack-letterhead.dotx` | **Word template.** Double-click to start a new, untitled letter; the template itself stays untouched. |
| `thomack-letterhead-pages.docx` | **Apple Pages version.** Logo block is at the top of page 1 (Pages can't do a separate first-page header). After opening in Pages: Document → Section → check "Hide on first page of section", then File → Save as Template. |
| `letterhead-preview.png` | Preview of page 1. |
| `build-letterhead.js` | Source. Edit, then rebuild with `node build-letterhead.js`. |

Install the .dotx once: Windows, copy it to `Documents\Custom Office Templates`, then use File → New → Personal. Mac, open it in Word and use File → Save as Template, then File → New from Template.
