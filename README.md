# Zawad Haque — Cybersecurity Portfolio

Static site. No build step, no dependencies — just open `index.html` in a browser.

## Files
- `index.html` — page structure / content
- `style.css`  — all styling (warm-dark "case file" theme)
- `main.js`    — nav drawer, scroll reveals, active-nav, footer year
- `assets/`    — images and résumé referenced by the page
- `source-material/` — raw papers and lab artifacts (NOT shown on the site; reference material)

## Assets the page expects (drop real files in `assets/` with these exact names)
- `headshot.jpg`      — cover portrait (4:5 ratio looks best)
- `cert-secplus.jpg`  — full Security+ e-certificate (landscape; click-to-enlarge)
- `cert-btl1.jpg`     — full BTL1 e-certificate (landscape; click-to-enlarge)
- `diploma.jpg`       — degree / e-diploma image
- `resume.pdf`        — résumé linked from the cover

Every image has a graceful fallback, so the page looks intentional even before the files are added.

## Before going live
- Replace `your-email@example.com` in `index.html` (appears in the contact section)
- Confirm the LinkedIn and GitHub URLs are correct
- Add the real files listed above

## Highest-value next step
The case files are accurate but thin. Use the papers in `source-material/` to write up
the real methodology and findings — especially the SSL/TLS and LLM research — and expand
those cases. When a real Blue Team lab is done, add it as CASE L-05 with status "Active"
(styling already built: `.case-status.active`).

## Hosting
Free options: GitHub Pages, Netlify, or Vercel. GitHub Pages pairs well since it ties to
your GitHub presence. Custom domain (~$10/yr) is optional but looks more intentional.
