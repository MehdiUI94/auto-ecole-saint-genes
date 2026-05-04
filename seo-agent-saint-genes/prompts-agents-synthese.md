# Synthèse des prompts — pipeline 4 agents IA

**Projet** Auto-École Saint-Genès — Plateforme SEO multi-agents
**Modèle** `claude-sonnet-4-20250514` (Anthropic API)
**Architecture** 4 agents spécialisés, exécution séquentielle, sortie JSON stricte

---

## Vue d'ensemble du pipeline

Les 4 agents sont chaînés pour produire un site complet à partir d'un brief et de mots-clés. Chaque agent prend en entrée la sortie structurée du précédent.

| # | Agent | Rôle | Entrée | Sortie | Tokens max |
|---|---|---|---|---|---|
| 1 | **SEO** | Audit + plan de site | Texte d'analyse + URL | Mots-clés, plan de site, gaps, score | 2 000 |
| 2 | **Contenu** | Rédaction page par page | Mots-clés + page cible + ton | Meta, H1, sections H2, FAQ, CTA | 3 000 |
| 3 | **Design** | Système graphique | Marque, style, couleur, niveau A11Y | Palette, typo, espacement, CSS variables | 3 500 |
| 4 | **Dev** | Code HTML + JSON-LD | Contenu + variables CSS + framework | HTML complet + checks SEO | 8 000 |

> Toutes les sorties sont **JSON strict** (sans markdown ni backticks) pour permettre un parsing fiable d'un agent à l'autre.

---

## 01 · Agent SEO

**Profil** Expert SEO/GEO spécialisé dans le référencement local pour les PME françaises.

### Mission
Analyser un document descriptif d'auto-école locale et produire un audit SEO actionnable : mots-clés prioritaires, plan de site, gaps techniques, recommandations GEO et score de maturité.

### Prompt (template)

```
Tu es un expert SEO/GEO spécialisé dans le référencement local pour les PME françaises.
Voici le document d'analyse d'une auto-école locale :
---
{{doc}}
---
URL du site : {{url}}

Génère une analyse SEO structurée EN JSON avec exactement ce format
(réponds UNIQUEMENT en JSON, sans markdown ni backticks) :
{
  "mots_cles": {
    "prioritaires": ["mot-clé 1", ..., "mot-clé 5"],
    "secondaires":  ["mot-clé 1", ..., "mot-clé 5"],
    "longue_traine": ["requête longue 1", ..., "requête longue 4"]
  },
  "plan_site": [
    { "page": "Nom",
      "url_suggeree": "/url",
      "h1": "Titre H1 optimisé",
      "priorite": "haute",
      "raison": "pourquoi" }
  ],
  "gaps_seo": [
    { "probleme": "Description",
      "impact": "fort",
      "solution": "Comment corriger" }
  ],
  "recommandations_geo": ["Reco 1", "Reco 2", "Reco 3"],
  "score_actuel": {
    "seo_local": 45,
    "contenu_editorial": 25,
    "presence_geo": 50,
    "accessibilite": 60
  }
}

Inclus au minimum 5 pages dans plan_site et 4 gaps_seo.
Sois précis et actionnable.
```

### Points-clés du design du prompt
- **Cadrage de rôle** explicite (« expert SEO/GEO PME françaises »)
- **Format JSON strict** imposé pour pipeline machine-to-machine
- **Quantifications minimales** (5 pages, 4 gaps) pour garantir une sortie suffisamment riche
- **Score de maturité 0-100** sur 4 dimensions, pour benchmarker dans le temps

---

## 02 · Agent Contenu

**Profil** Rédacteur SEO expert pour les auto-écoles locales françaises.

### Mission
Rédiger le contenu complet d'une page (meta, H1, sections H2, FAQ, CTA) en intégrant les mots-clés de l'agent SEO, sur un ton paramétrable. Si du contenu existant est fourni, en faire l'analyse (à garder / à réécrire / à ajouter).

### Prompt (template)

```
Tu es un rédacteur SEO expert pour les auto-écoles locales françaises.
Tu rédiges pour l'Auto-École Saint-Genès à Bordeaux.

CONTEXTE DE LA MARQUE :
- Auto-école locale à Bordeaux, 40 ans d'ancienneté
- Spécialisée boîte automatique et accompagnement handicap
- Financement CPF et permis à 1€/jour
- Offres : Permis B, AAC, supervisée, boîte auto, moto, handicap

MOTS-CLÉS CIBLES : {{keywords}}
PAGE À RÉDIGER : {{pageNames[page]}}
TON : {{tone}}
{{#if existing}}CONTENU EXISTANT À ANALYSER : {{existing}}{{/if}}

Génère le contenu EN JSON avec exactement ce format
(réponds UNIQUEMENT en JSON, sans markdown) :
{
  "meta": {
    "title": "Title SEO optimisé (max 60 caractères)",
    "description": "Meta description convaincante (max 155 caractères)",
    "slug": "/url-suggeree"
  },
  "h1": "Titre H1 principal optimisé",
  "introduction": "2-3 phrases qui placent les mots-clés naturellement
                   et accrochent le visiteur.",
  "sections": [
    { "h2": "Titre de section",
      "contenu": "Paragraphe riche de 3-5 phrases, ton {{tone}},
                  mots-clés intégrés naturellement." },
    ... (≥ 3 sections)
  ],
  "faq": [
    { "question": "Question fréquente ?",
      "reponse":  "Réponse claire en 2-3 phrases." },
    ... (≥ 3 questions)
  ],
  "cta": {
    "titre":  "Call-to-action principal",
    "bouton": "Texte du bouton"
  },
  "analyse_existant": { "a_garder": [...],
                        "a_reecrire": [...],
                        "a_ajouter": [...] }
}

Rédige un contenu authentique, local, utile, qui se démarque des grosses
plateformes nationales. Place les mots-clés sans sur-optimisation.
```

### Pages prises en charge (mapping `pageNames`)
- `accueil` — Page d'accueil
- `permis-b` — Permis B
- `boite-auto` — Permis boîte automatique
- `handicap` — Mobilité handicap
- `conduite-accompagnee` — AAC
- `moto` — Permis moto
- `tarifs` — Tarifs et financement
- `faq` — FAQ globale
- `contact` — Contact

### Points-clés du design du prompt
- **Persona métier** rédacteur, pas développeur
- **Brief de marque** rappelé à chaque appel (40 ans, boîte auto, handicap, CPF)
- **Tons paramétrables** (`tone` injecté dans la consigne) → permet plusieurs versions A/B
- **Contraintes longueur** explicites (title ≤ 60c, description ≤ 155c)
- **Mode upgrade** : si `existing` est fourni, l'agent en fait l'audit en plus de la rédaction
- **Garde-fou anti-suroptimisation** explicite

---

## 03 · Agent Design

**Profil** Designer UI/UX senior spécialisé dans les sites institutionnels modernes et accessibles.

### Mission
Produire un design system complet : palette (9 couleurs typées par usage), typographie (titres + corps), échelle d'espacement, rayons, composants (button/card/input), principes d'accessibilité, et bloc CSS `:root` prêt à coller.

### Prompt (template)

```
Tu es un designer UI/UX senior spécialisé dans les sites institutionnels
modernes et accessibles.

CONTEXTE         : Site web pour l'Auto-École Saint-Genès à Bordeaux.
ÉLÉMENTS DE MARQUE : {{brand}}
STYLE DEMANDÉ    : {{style}}
COULEUR DOMINANTE : {{color}}
NIVEAU ACCESSIBILITÉ : {{a11y}} (contrastes obligatoires)

Génère un design system complet EN JSON
(réponds UNIQUEMENT en JSON, sans markdown) :
{
  "philosophie": "2-3 phrases décrivant la direction artistique",
  "couleurs": {
    "primary":         { "hex": "#…", "usage": "Boutons, liens, accents" },
    "primary_dark":    { "hex": "#…", "usage": "Hover, textes sur clair" },
    "primary_light":   { "hex": "#…", "usage": "Backgrounds, cards" },
    "secondary":       { "hex": "#…", "usage": "Accent chaleureux" },
    "success":         { "hex": "#…", "usage": "Validation, réussite" },
    "neutral_dark":    { "hex": "#1a1a1a", "usage": "Texte principal" },
    "neutral_medium":  { "hex": "#…", "usage": "Texte secondaire" },
    "neutral_light":   { "hex": "#…", "usage": "Bordures" },
    "background":      { "hex": "#…", "usage": "Fond de page" }
  },
  "typographie": {
    "font_heading": "Google Font distinctive (pas Inter ni Roboto)",
    "font_body":    "Google Font corps",
    "scale": {
      "h1":    { "size": "48px", "weight": "700", "line_height": "1.1" },
      "h2":    { "size": "32px", "weight": "700", "line_height": "1.2" },
      "h3":    { "size": "22px", "weight": "600", "line_height": "1.3" },
      "body":  { "size": "16px", "weight": "400", "line_height": "1.7" },
      "small": { "size": "14px", "weight": "400", "line_height": "1.5" }
    }
  },
  "espacement": {
    "xs":"4px","sm":"8px","md":"16px","lg":"24px","xl":"48px","xxl":"80px"
  },
  "radius": { "sm":"6px","md":"12px","lg":"20px","full":"999px" },
  "composants": {
    "button": "Description du style bouton principal",
    "card":   "Description du style cartes",
    "input":  "Description du style inputs"
  },
  "principes_accessibilite": [
    "Contraste ≥ 4.5:1 pour le texte",
    "Focus visible sur tous éléments interactifs",
    "Tailles de clic ≥ 44×44 px",
    "Police ≥ 16 px sur mobile"
  ],
  "css_variables": "---css :root { } complet---"
}

Pour css_variables, génère un :root { } CSS complet avec toutes les variables
+ classes utilitaires (.btn-primary, .card, .container).
Tous les contrastes ≥ WCAG AA.
```

### Points-clés du design du prompt
- **Choix typo dirigé** : exclusion explicite des polices banalisées (« pas Inter ni Roboto »)
- **9 rôles couleur typés** par usage métier, pas seulement par teinte
- **Échelle complète** typo / espacement / radius pour cohérence du système
- **Contrainte WCAG AA** non-négociable, vérifiée par l'agent
- **Sortie CSS prête à coller** dans le projet (gain de temps en intégration)

---

## 04 · Agent Dev

**Profil** Développeur front-end senior spécialisé SEO technique et accessibilité WCAG.

### Mission
Assembler une page HTML complète, autonome, production-ready, à partir du contenu JSON de l'agent Contenu et des variables CSS de l'agent Design. La page intègre les balises Schema.org, OG, ARIA et passe une checklist SEO interne.

### Prompt (template)

```
Tu es un développeur front-end senior spécialisé SEO technique
et accessibilité WCAG.

CONTEXTE        : Page "{{page}}" pour l'Auto-École Saint-Genès à Bordeaux.
FRAMEWORK       : {{framework}}
CONTENU (JSON)  : {{JSON.stringify(content)}}
CSS VARIABLES   : {{designCss}}

Génère une page HTML COMPLÈTE, autonome, production-ready, EN JSON :
{
  "html": "code HTML complet avec <!DOCTYPE>, <head>, <body>, tout inline",
  "seo_checks": [
    { "critere": "Title présent et optimisé", "status": "pass", "detail": "..." },
    { "critere": "Meta description",          "status": "pass", "detail": "..." },
    { "critere": "H1 unique",                  "status": "pass", "detail": "..." },
    { "critere": "Schema.org LocalBusiness",   "status": "pass", "detail": "..." },
    { "critere": "Schema.org FAQPage",         "status": "pass", "detail": "..." },
    { "critere": "Open Graph tags",            "status": "pass", "detail": "..." },
    { "critere": "Attributs alt sur images",   "status": "pass", "detail": "..." },
    { "critere": "Landmarks ARIA",             "status": "pass", "detail": "..." },
    { "critere": "Contraste WCAG AA",          "status": "pass", "detail": "..." },
    { "critere": "Responsive mobile-first",    "status": "pass", "detail": "..." }
  ],
  "recommandations_suivantes": ["Sitemap XML", "robots.txt", "Schema Review", ...]
}
```

### Exigences HTML imposées (14 points)

1. Structure sémantique HTML5 : `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
2. Meta tags complets : title, description, viewport, charset, lang, canonical
3. Open Graph + Twitter Card pour réseaux sociaux
4. Schema.org JSON-LD : `LocalBusiness` (AutoSchool) + `BreadcrumbList` + `FAQPage` si FAQ présente
5. Navigation accessible avec skip-link et ARIA landmarks
6. Images avec `alt` descriptif, `loading="lazy"`, `width`/`height`
7. CSS inline dans `<style>` utilisant les variables CSS fournies, responsive mobile-first
8. Hero section impactante avec H1 et CTA principal
9. Sections H2 bien structurées, **une seule** H1
10. FAQ en `<details>`/`<summary>` OU divs avec schema FAQPage
11. Footer avec coordonnées, horaires, mentions légales
12. Focus visible sur tous éléments interactifs
13. Format français (téléphone, adresse, date)
14. Coordonnées réelles : 05 56 96 33 20, Bordeaux Saint-Genès

### Points-clés du design du prompt
- **Auto-évaluation** : l'agent produit lui-même la checklist SEO de sa propre sortie
- **HTML standalone** : ouvrable directement dans un navigateur, sans build
- **Schémas JSON-LD obligatoires** pour visibilité dans Google AI Overviews / Perplexity
- **Coordonnées réelles** explicitement injectées pour éviter l'invention
- **Recommandations next-step** pour boucler le pipeline (sitemap, robots.txt, etc.)

---

## Architecture du chaînage

```
[ Brief client + URL ]
        │
        ▼
┌──────────────────┐
│ 01 · Agent SEO   │  → mots_cles, plan_site, gaps_seo, score_actuel
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ 02 · Agent       │  pour chaque page de plan_site :
│      Contenu     │  → meta, h1, sections, faq, cta
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ 03 · Agent       │  une seule exécution :
│      Design      │  → palette, typo, css_variables (:root)
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ 04 · Agent Dev   │  pour chaque page :
│                  │  → html standalone + seo_checks + next-steps
└──────────────────┘
        │
        ▼
[ Site web complet, déployable ]
```

## Choix de design transversaux

1. **JSON strict partout** — chaque agent renvoie un objet JSON pur (la consigne
   « réponds UNIQUEMENT en JSON, sans markdown » est répétée dans les 4 prompts).
   Le code de parsing fait `text.replace(/```json|```/g, "").trim()` en filet
   de sécurité.

2. **Persona explicite** en première ligne — chaque agent commence par
   `Tu es un {{rôle}} spécialisé dans {{domaine}}` pour ancrer le ton et le
   référentiel professionnel.

3. **Contraintes mesurables** — au lieu de « fais bien », on impose des seuils
   chiffrés : `title ≤ 60c`, `description ≤ 155c`, `contraste ≥ 4.5:1`,
   `≥ 5 pages`, `≥ 3 questions FAQ`, etc.

4. **Anti-hallucination locale** — les données vérifiables (téléphone, adresse,
   ancienneté) sont injectées dans les prompts plutôt que devinées par le modèle.

5. **Tokens calibrés par mission** — 2k pour l'audit SEO compact, 3k pour le
   contenu éditorial, 3,5k pour le design system, 8k pour le HTML qui doit être
   complet et autonome.

6. **Auto-évaluation côté Dev** — l'agent Dev produit sa propre checklist SEO,
   ce qui rend la sortie auditable sans agent supplémentaire.

---

*Document généré à partir des fichiers `agents/agent-seo.html`,
`agents/agent-contenu.html`, `agents/agent-design.html`,
`agents/agent-dev.html` du projet seo-agent-saint-genes.*
