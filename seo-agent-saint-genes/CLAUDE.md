

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**SEO Multi-Agent Platform + Full-Stack Website** for Auto-École Saint-Genès (Bordeaux).  
Two distinct layers live side by side:

1. **`/` (root)** — Static HTML dashboard visualizing a 4-agent SEO pipeline (no server needed)
2. **`site-final/`** — Express.js web server serving the actual rebuilt school website

---

## Running the Express server

```bash
cd site-final

# First-time setup
cp .env.example .env          # then fill in real Stripe keys if needed
npm install

# Development (auto-reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:3000` (configurable via `PORT` in `.env`).

Stripe is **optional** — the server starts cleanly without a real key; payment routes return a 503 until `STRIPE_SECRET_KEY` is set.

---

## Architecture

### Static agent dashboard (root)

| File | Role |
|---|---|
| `index.html` | Hub page linking to all 4 agents |
| `agents/agent-seo.html` | Agent SEO — keyword analysis UI |
| `agents/agent-contenu.html` | Agent Contenu — content generation UI |
| `agents/agent-design.html` | Agent Design — design spec UI |
| `agents/agent-dev.html` | Agent Dev — code generation UI |
| `assets/style.css` | Shared styles for dashboard |
| `outputs/01-seo-analysis.json` | SEO analysis output (keywords, site plan) |

All agent pages are self-contained, open via `file://`, use no external dependencies.

### Express server (`site-final/`)

```
site-final/
├── server.js              ← Entry point — routes, Stripe init, static files
├── routes/
│   ├── contact.js         ← POST /api/contact
│   ├── inscription.js     ← POST /api/inscription
│   └── paiement.js        ← POST /api/create-checkout (Stripe), GET /api/success|cancel
├── middleware/
│   └── validation.js      ← validateContact, validateInscription
├── views/                 ← HTML pages served by Express
├── public/assets/         ← style.css, main.js (served at /assets/)
└── data/                  ← JSON flat-file storage (contacts, inscriptions, commandes)
```

**Data persistence** is flat JSON files in `data/` — no database. Each route reads/writes its own file (`contacts.json`, `inscriptions.json`, `commandes.json`).

### API routes

| Method | Path | Handler |
|---|---|---|
| POST | `/api/contact` | Save contact message → `data/contacts.json` |
| POST | `/api/inscription` | Save pre-registration → `data/inscriptions.json` |
| POST | `/api/create-checkout` | Create Stripe Checkout session → `data/commandes.json` |
| GET | `/api/success` | Mark order as `paid`, redirect to `/success` |
| GET | `/api/cancel` | Redirect to `/cancel` |

### Price catalogue (in `routes/paiement.js`)

Prices are hardcoded in `CATALOGUE` as centimes (e.g. `156600` = 165.60€). Update there if prices change.

---

## SEO/GEO conventions

All content decisions reference `../outputs/01-seo-analysis.json` and `../analyse_auto_ecole.txt`.

- **Schema.org JSON-LD** on every page: `LocalBusiness`, `BreadcrumbList`, `FAQPage` where applicable
- **Target keywords** (from `01-seo-analysis.json`): "auto-école bordeaux", "permis b bordeaux", "boîte automatique bordeaux", "permis handicap bordeaux"
- Every page has a unique `<title>`, `<meta description>`, canonical URL, Open Graph tags, `lang="fr"`
- Mobile-first CSS, breakpoints at 640px / 768px / 1024px

---

## Adding a new page

1. Create `views/your-page.html` following the existing view structure
2. Add a route in `server.js`: `app.get('/your-page', sendView('your-page.html'))`
3. Add the URL to `sitemap.xml` in the parallel `site-final/` project if deploying
