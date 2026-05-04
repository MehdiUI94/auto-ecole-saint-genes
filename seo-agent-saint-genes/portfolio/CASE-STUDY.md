# Case Study — Plateforme SEO Multi-Agents
## Auto-École Saint-Genès · Bordeaux

---

## Contexte du projet

**Client :** Auto-École Saint-Genès, Bordeaux (fondée en 1984)  
**Secteur :** Formation à la conduite — marché local Bordeaux/Gironde  
**Durée :** Projet école — Eugenia School Digital Marketing  
**Livrables :** Plateforme d'agents IA + site web production (25 pages)

---

## Problème identifié

L'auto-école Saint-Genès est la **première école de conduite du journal Sud-Ouest** et affiche un taux de réussite de 93 % (vs 67 % de moyenne nationale). Malgré ces atouts, l'école était **quasi-invisible sur le web local** :

| Signal | Avant le projet |
|---|---|
| Positionnement SEO local | Hors top 10 sur "auto-école bordeaux", "permis b bordeaux" |
| Présence dans les IA | Absente des réponses ChatGPT, Perplexity, Google AI Overview |
| Page boîte automatique | Inexistante (pourtant différenciateur revendiqué #1) |
| Balisage Schema.org | Absent sur l'ensemble du site |
| Score SEO local estimé | 40 / 100 |
| Score contenu éditorial | 25 / 100 |
| Score accessibilité | 55 / 100 |

**Problèmes SEO diagnostiqués :**
1. Aucune page dédiée à la spécialité boîte automatique (gap critique)
2. FAQ absente → invisible des extraits enrichis et des IA
3. Zéro balisage structuré (`LocalBusiness`, `FAQPage`, `Course`)
4. Absence de preuves locales digitales (AGEFIPH, Qualiopi, CPF)
5. Architecture de contenu non différenciante face aux concurrents

---

## Solution — Architecture multi-agents

Plutôt que de produire manuellement le contenu et le code, j'ai conçu un **pipeline SEO à 4 agents IA chaînés**, chacun spécialisé dans une étape de la chaîne de valeur SEO :

```
Audit & stratégie → Rédaction optimisée → Système design → Code HTML production
    Agent SEO           Agent Contenu        Agent Design        Agent Dev
   (2 000 tokens)       (3 000 tokens)       (3 500 tokens)      (8 000 tokens)
```

Chaque agent reçoit l'output JSON de l'agent précédent comme input. Les 4 agents communiquent **exclusivement en JSON strict** (aucun markdown, aucune prose) pour garantir la chaînabilité machine-to-machine.

---

## Détail des 4 agents

### Agent 1 — SEO · Analyste stratégie locale

**Rôle :** Auditer le contenu existant, identifier les gaps SEO/GEO, produire la stratégie de mots-clés et le plan de site.

**Input :** Texte du site actuel + URL  
**Output JSON :**
- `mots_cles` : 5 prioritaires, 5 secondaires, 4 longue traîne
- `plan_site` : 6+ pages avec H1, URL slug, priorité, justification
- `gaps_seo` : 5+ problèmes classés par impact (fort/moyen/faible) + solutions
- `recommandations_geo` : actions spécifiques citation IA et signaux locaux
- `score_actuel` : 4 scores de maturité (0-100)

**Résultat produit pour Saint-Genès :**
- Mots-clés prioritaires : "auto-école bordeaux", "permis b bordeaux", "auto ecole boite automatique bordeaux", "permis handicap bordeaux", "permis à 1 euro bordeaux"
- 6 pages prioritaires identifiées dont 3 urgentes (Permis B, Boîte Auto, Handicap)
- 5 gaps critiques documentés avec solutions actionnables

---

### Agent 2 — Contenu · Architecte rédactionnel

**Rôle :** Rédiger le contenu optimisé page par page (H1, sections H2, FAQ, CTA, méta-tags).

**Input JSON :** Mots-clés + type de page + ton éditorial + contenu existant optionnel  
**Output JSON :**
- `meta` : title ≤60 car., description ≤155 car., slug
- `h1`, `introduction`, `sections` (≥3 blocs H2)
- `faq` : ≥3 questions/réponses optimisées featured snippets
- `cta` : titre + label bouton
- `analyse_existant` : a_garder / a_reecrire / a_ajouter (refactoring progressif)

**Paramètre ton :** `professionnel-chaleureux` · `jeune-dynamique` · `rassurant-expert` · `local-proximite`  
→ Permet la génération de 4 variantes A/B d'une même page sans reprendre le brief.

---

### Agent 3 — Design · Système visuel

**Rôle :** Créer le design system complet (palette, typographie, espacements, CSS variables).

**Output JSON :**
- `philosophie` : direction artistique en 2-3 phrases
- `couleurs` : 9 rôles typés (primary, secondary, success, neutrals, backgrounds) avec hex + usage
- `typographie` : sélection Google Fonts (interdit : Inter/Roboto), échelle h1→small
- `espacement` : tokens xs→xxl (4px → 80px)
- `composants` : description `.btn-primary`, `.card`, `.input`
- `css_variables` : bloc `:root {}` complet, prêt à injecter

**Contrainte non négociable :** Tous les contrastes ≥ 4.5:1 WCAG AA. Pas de police générique.

---

### Agent 4 — Dev · Développeur front-end auto-évaluateur

**Rôle :** Assembler contenu + design en HTML production-ready, puis s'auto-auditer.

**Input JSON :** Nom de page + Agent 2 JSON + Agent 3 CSS variables  
**Output JSON :**
```json
{
  "html": "<!DOCTYPE html>...</html>",
  "seo_checks": [
    { "critere": "Title présent et optimisé", "status": "pass", "detail": "..." },
    { "critere": "Meta description", "status": "pass", "detail": "..." },
    ...
  ],
  "recommandations_suivantes": ["Sitemap XML", "robots.txt", "Schema Review"]
}
```

**14 exigences HTML non négociables** :
1. HTML5 sémantique (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
2. Meta complètes (title, description, viewport, charset, lang, canonical)
3. Open Graph + Twitter Card
4. Schema.org JSON-LD : `DrivingSchool`, `BreadcrumbList`, `FAQPage`
5. Navigation accessible : skip-link + ARIA landmarks
6. Images : `alt`, `loading="lazy"`, dimensions explicites
7. CSS inline avec variables Agent 3, mobile-first
8. Hero avec H1 + CTA principal
9. Un seul H1 par page, H2 bien structurés
10. FAQ en `<details>/<summary>` ou divs schema-compatibles
11. Footer avec coordonnées, horaires, mentions légales
12. Focus visible sur tous les éléments interactifs
13. Formatage français (téléphone, adresse, dates)
14. Données réelles injectées (anti-hallucination)

**L'auto-évaluation intégrée** (10 checks) élimine le besoin d'un agent de validation séparé.

---

## Site web production livré

En parallèle du pipeline agent, un **site Express.js complet** a été construit :

### Architecture serveur

```
site-final/
├── server.js              ← Express 4.18, routes, Stripe optionnel
├── routes/
│   ├── contact.js         ← POST /api/contact → data/contacts.json
│   ├── inscription.js     ← POST /api/inscription → data/inscriptions.json
│   └── paiement.js        ← POST /api/create-checkout (Stripe)
├── middleware/
│   └── validation.js      ← Validation inputs (tous les endpoints)
├── views/                 ← 25 pages HTML
├── public/assets/         ← CSS 88KB + JS
└── data/                  ← Persistence JSON flat-file (sans base de données)
```

### Couverture des pages (25 pages)

**Formation voiture :** Accueil, Permis B, Boîte Automatique, Conduite Accompagnée, Conduite Supervisée, Formation Accélérée, Perfectionnement  
**Formation moto :** Permis A2, AM, 125cm3, Passerelle A2→A  
**Accès & financement :** Permis à 1€/jour, CPF, Handicap & Mobilité  
**Code :** Code de la route, Code en ligne 24h/24  
**Administratif :** Préinscription, Contact, Tarifs & Formules, Actualités, Plan du site  
**Légal & UX :** Mentions légales, Politique de confidentialité, Succès, Annulation, 404

### Données réelles injectées sur chaque page

- **Adresse :** 182 Boulevard George V, 33200 Bordeaux
- **Téléphone :** 05 56 96 33 20
- **Taux de réussite :** 93%
- **Ancienneté :** Fondée en 1984 (40 ans)
- **Avis :** 4,8/5 · 248 avis vérifiés
- **Agréments :** Label Qualité, Qualiopi, CPF, AGEFIPH, Région Nouvelle-Aquitaine
- **Numéro agrément :** E 05 033 0033 0

---

## Innovations techniques clés

### 1. JSON-only pour la chaîne agentique
Tous les outputs Claude sont dépouillés du markdown (regex `/\`\`\`json|\`\`\`/g`). La communication inter-agents est du JSON pur, rendant le pipeline déterministe et résilient.

### 2. Anti-hallucination par injection de données
Les coordonnées réelles (téléphone, adresse, fondation, stats) sont hardcodées dans chaque prompt. Aucun agent ne peut inventer un numéro ou une adresse différents.

### 3. Auto-évaluation intégrée à Agent Dev
L'agent 4 produit son propre audit SEO (`seo_checks`) avant de retourner le HTML. Aucun post-traitement manuel nécessaire.

### 4. Stripe optionnel (graceful degradation)
Le serveur démarre proprement sans clé Stripe. Les routes de paiement retournent 503 "non configuré" plutôt que de crasher — idéal pour la démo → production progressive.

### 5. Catalogue de prix hardcodé
Les prix sont en centimes dans un objet `CATALOGUE` central (`routes/paiement.js`). Une seule modification met à jour toutes les sessions Stripe.

### 6. Flat-file sans base de données
Contacts, inscriptions et commandes persistent en JSON local (`data/`). Déploiement sur n'importe quel hébergeur sans configuration de base de données.

---

## Calibration des tokens par agent

| Agent | Tokens max | Justification |
|---|---|---|
| SEO | 2 000 | Analyse factuelle, pas de génération longue |
| Contenu | 3 000 | Rédaction par section, FAQ incluse |
| Design | 3 500 | Design system complet + CSS variables |
| Dev | 8 000 | HTML page complète + auto-audit (10 checks) |

Chaque budget est calibré au minimum viable : assez pour la qualité, jamais pour le remplissage.

---

## Résultats et livrables

| Livrable | Détail |
|---|---|
| Pipeline 4 agents | 4 dashboards HTML interactifs, appel direct API Anthropic |
| Analyse SEO output | `outputs/01-seo-analysis.json` — stratégie complète |
| Site web Express | 25 pages HTML, 3 routes API, Stripe optionnel |
| Système de design | Design system WCAG AA, Google Fonts, CSS 88KB |
| Logo vectoriel | `logo-saint-genes.svg` — illustration voiture + typographie |
| Documentation | `prompts-agents-synthese.md` + PDF généré (FPDF2) |

**Scores SEO estimés post-projet :**
- Schema.org : Présent sur 100% des pages
- WCAG AA : Respect des contrastes 4.5:1 sur toutes les couleurs
- FAQ structurée : ≥3 questions/réponses par page de formation
- Pages prioritaires : 6 pages ciblées sur les requêtes à fort volume

---

## Stack technique

```
Frontend Dashboard     HTML5 · CSS3 · JavaScript vanilla · Anthropic API (claude-sonnet-4)
Backend Express        Node.js 18+ · Express.js 4.18 · Stripe SDK · dotenv · cors
Données               JSON flat-file (sans BDD) — contacts, inscriptions, commandes
Styles                CSS custom properties · Google Fonts (Bricolage Grotesque, DM Sans)
PDF                   Python 3 · FPDF2 (export documentation)
Schema.org            DrivingSchool · BreadcrumbList · FAQPage · Course · Offer
```

---

## Compétences démontrées

- **Stratégie SEO locale** — audit de gaps, plan de mots-clés, architecture d'information
- **GEO (Generative Engine Optimization)** — optimisation pour citation par les IA (ChatGPT, Perplexity, Google AI Overview)
- **Orchestration d'agents IA** — chaînage séquentiel, format JSON strict, calibration de tokens
- **Développement full-stack** — Express.js, routing API, validation, intégration Stripe
- **Accessibilité web** — WCAG AA, ARIA landmarks, focus management, skip-links
- **Schema.org** — balisage structuré complet pour l'écosystème Google
- **Design system** — tokens CSS, typographie, palette accessible, composants réutilisables

---

## Pour adapter ce projet à votre portfolio

Ce fichier est conçu pour être lu par Claude Code dans le contexte d'un projet portfolio. Pour l'intégrer :

1. **Copier** ce fichier et le dossier `assets/` dans votre repo portfolio
2. **Référencer** ce case study depuis votre `CLAUDE.md` ou `index.md` portfolio
3. **Adapter** les sections "Contexte" et "Résultats" selon vos métriques réelles
4. **Utiliser** les assets SVG fournis (`pipeline-agents.svg`, `project-card.svg`) comme visuels du projet dans la présentation

Les assets sont en SVG vectoriel, redimensionnables sans perte pour tout contexte web.
