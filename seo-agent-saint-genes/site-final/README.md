# Auto-École Saint-Genès — Site Web

Site web complet de l'Auto-École Saint-Genès (Bordeaux) avec backend Express.js, paiements Stripe en mode TEST, et stockage JSON.

## Démarrage rapide

```bash
cd site-final
cp .env.example .env        # puis remplir STRIPE_SECRET_KEY si besoin
npm install
npm run dev                 # serveur sur http://localhost:3000
```

## Stack technique

- **Backend** : Node.js + Express.js
- **Frontend** : HTML5 + CSS3 + Vanilla JS (aucun bundler)
- **Paiements** : Stripe Checkout (TEST mode uniquement)
- **Stockage** : JSON flat-files (`data/`)
- **Polices** : Manrope + Inter (Google Fonts)
- **SEO** : Schema.org JSON-LD sur chaque page (DrivingSchool, BreadcrumbList, Course, FAQPage)

## Structure

```
site-final/
├── server.js              ← Entry point Express
├── routes/
│   ├── contact.js         ← POST /api/contact
│   ├── inscription.js     ← POST /api/inscription
│   └── paiement.js        ← POST /api/create-checkout, GET /api/success|cancel
├── middleware/
│   └── validation.js      ← validateContact, validateInscription
├── views/                 ← 22 pages HTML
├── public/assets/         ← style.css + main.js
└── data/                  ← contacts.json, inscriptions.json, commandes.json
```

## Pages (22)

| URL | Titre | Prix |
|-----|-------|------|
| `/` | Accueil | — |
| `/permis-b` | Permis B | 1 566 € |
| `/code-de-la-route` | Code de la route | 325 € |
| `/conduite-accompagnee` | Conduite accompagnée (AAC) | 1 524 € |
| `/conduite-supervisee` | Conduite supervisée | 1 466 € |
| `/permis-ba` | Permis B boîte automatique | 1 654 € |
| `/formation-acceleree` | Formation accélérée | 1 775 € |
| `/permis-a2` | Permis A2 moto | 930 € |
| `/permis-am` | Permis AM / BSR | 311 € |
| `/formation-125-cm` | Formation 125 cm³ | 320 € |
| `/passerelle-a2-vers-a` | Passerelle A2 → A | 335 € |
| `/permis-a-1-euro` | Financement | — |
| `/perfectionnement` | Perfectionnement conduite | 65 €/h |
| `/mobilite-handicap` | Mobilité Handicap | — |
| `/code-en-ligne` | Code en ligne | — |
| `/preinscription` | Préinscription | — |
| `/contact` | Contact | — |
| `/success` | Confirmation paiement | — |
| `/cancel` | Paiement annulé | — |
| `/404` | Page introuvable | — |
| `/mentions-legales` | Mentions légales | — |
| `/politique-confidentialite` | Politique de confidentialité | — |

## API Routes

### POST `/api/contact`
Enregistre un message de contact dans `data/contacts.json`.

**Body JSON :**
```json
{ "nom": "string (2+ chars)", "email": "string (email valide)", "objet": "string", "message": "string (10+ chars)" }
```
**Réponse 201 :** `{ "success": true, "id": "CTK-1234567890-abc" }`

---

### POST `/api/inscription`
Enregistre une préinscription dans `data/inscriptions.json`.

**Body JSON :**
```json
{ "prenom": "string", "nom": "string", "email": "string", "telephone": "string (10-15 chiffres)", "permis": "code|permis-b|conduite-accompagnee|..." }
```
**Réponse 201 :** `{ "success": true, "id": "INS-1234567890-abc", "statut": "en_attente" }`

---

### POST `/api/create-checkout`
Crée une session Stripe Checkout. Redirige vers Stripe.

**Body JSON :**
```json
{ "formule": "permis-b" }
```
**Réponse 200 :** `{ "url": "https://checkout.stripe.com/..." }`

Formules disponibles : `code`, `permis-b`, `conduite-accompagnee`, `conduite-supervisee`, `permis-ba`, `formation-acceleree`, `permis-a2`, `permis-am`, `formation-125-cm`, `passerelle-a2-vers-a`

---

### GET `/api/success?session_id=XXX`
Marque la commande comme `paid`, redirige vers `/success`.

### GET `/api/cancel`
Redirige vers `/cancel`.

## Stripe — Mode TEST

Le site fonctionne en **mode TEST Stripe uniquement**. Aucun prélèvement réel.

Cartes de test Stripe :
- ✅ Paiement réussi : `4242 4242 4242 4242` — exp. future — CVC quelconque
- ❌ Paiement refusé : `4000 0000 0000 0002`

Sans `STRIPE_SECRET_KEY` dans `.env`, les routes paiement retournent une erreur 503 — le reste du site fonctionne normalement.

## Variables d'environnement

```env
PORT=3000
STRIPE_SECRET_KEY=sk_test_xxxxx     # Optionnel — mode TEST uniquement
STRIPE_WEBHOOK_SECRET=whsec_xxxxx   # Optionnel
```

## Améliorations SEO identifiées

| Page | Amélioration | Impact |
|------|-------------|--------|
| Toutes | Schema.org DrivingSchool + Course | ⭐⭐⭐ |
| index | Avis Google enrichis (AggregateRating) | ⭐⭐⭐ |
| permis-b | FAQ Schema sur 5 questions | ⭐⭐ |
| mobilite-handicap | LocalBusiness avec accesibilityFeature | ⭐⭐ |
| Toutes | sitemap.xml + robots.txt | ⭐⭐⭐ |
| Toutes | Open Graph + Twitter Card | ⭐⭐ |

## Données

Les fichiers JSON dans `data/` sont créés automatiquement au premier enregistrement. Structure :

```json
// contacts.json
[{ "id": "CTK-xxx", "date": "ISO", "nom": "...", "email": "...", "objet": "...", "message": "..." }]

// inscriptions.json  
[{ "id": "INS-xxx", "date": "ISO", "prenom": "...", "nom": "...", "email": "...", "telephone": "...", "permis": "...", "statut": "en_attente" }]

// commandes.json
[{ "id": "CMD-xxx", "date": "ISO", "formule": "...", "montant": 156600, "statut": "pending|paid", "stripeSessionId": "cs_test_..." }]
```
