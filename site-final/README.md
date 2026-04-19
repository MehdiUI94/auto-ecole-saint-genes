# Auto-École Saint-Genès Bordeaux — Site Web Refait

Projet de cours de digital marketing — Refonte complète du site [autoecolesaintgenes.com](https://autoecolesaintgenes.com) avec corrections SEO/GEO basées sur l'analyse stratégique.

---

## Structure du site

```
site-final/
├── index.html              ← Accueil (priorité 1)
├── permis-b.html           ← Page Permis B (priorité 2)
├── boite-automatique.html  ← Page Boîte Automatique (priorité 3)
├── handicap-mobilite.html  ← Page Handicap & Mobilité (priorité 4)
├── tarifs-financement.html ← Page Tarifs & Financement (priorité 5)
├── faq.html                ← Page FAQ (priorité 6)
├── 404.html                ← Page d'erreur
├── sitemap.xml             ← Plan du site pour les moteurs de recherche
├── robots.txt              ← Instructions pour les robots d'indexation
└── assets/
    └── style.css           ← Design system complet (CSS variables, mobile-first)
```

---

## Améliorations SEO/GEO apportées vs l'ancien site

### 1. Pages dédiées et ultra-optimisées (gap critique comblé)
L'ancien site n'avait pas de pages standalone suffisamment optimisées pour les requêtes clés. Chaque nouvelle page cible précisément une intention de recherche :
- `/permis-b` → cible "permis B Bordeaux" (forte volumétrie, ancienne faiblesse)
- `/boite-automatique` → cible "auto école boîte auto Bordeaux" (différenciateur #1 non exploité)
- `/handicap-mobilite` → cible "auto école handicap Bordeaux" (différenciateur #2)
- `/tarifs-financement` → cible intention transactionnelle (prix, CPF, 1€/jour)
- `/faq` → cible les questions longue-traîne et alimente les PAA Google

### 2. Schema.org JSON-LD sur toutes les pages
- **LocalBusiness (AutoDealer)** sur toutes les pages : NAP complet, horaires, coordonnées, aggregateRating
- **FAQPage** sur toutes les pages avec une FAQ : exploitable par Google (PAA) et les IA (Perplexity, ChatGPT)
- **BreadcrumbList** sur toutes les pages internes : meilleure compréhension de la structure par Google
- **amenityFeature** sur la page handicap : signaux spécifiques d'accessibilité pour les IA

### 3. Données factuelles citables par les IA (GEO)
L'ancien site avait du contenu générique. Le nouveau contient des preuves précises :
- "40 ans d'ancienneté" / "fondée en 1984"
- "Meilleur taux de réussite de Bordeaux et du Sud-Ouest"
- "248 avis clients, note 4,8/5"
- "Citée en #1 par Perplexity AI sur la requête boîte automatique Bordeaux"
- Types d'aménagements détaillés (commandes volant, transfert pédale, boule volant...)

### 4. Structure éditoriale search-friendly
Remplacement des gros blocs de texte dense par :
- H1 / H2 / H3 hiérarchisés et optimisés
- Listes à puces (feature-list)
- Blocs FAQ courts et factuels
- CTA clairs et répétés
- Bannières d'info (trust signals)

### 5. Méta-données complètes
- Title et description uniques par page, optimisés avec mots-clés principaux
- Open Graph et Twitter Card sur toutes les pages
- Canonical URLs pour éviter le contenu dupliqué
- lang="fr" sur toutes les pages

### 6. Sitemap et robots.txt
- `sitemap.xml` avec toutes les URLs, lastmod et priority
- `robots.txt` avec référence au sitemap et directives claires

---

## Principes d'accessibilité respectés (WCAG 2.1 AA)

| Critère | Implémentation |
|---------|---------------|
| Skip link | `<a href="#main-content" class="skip-link">` visible au focus |
| Focus visible | `outline: 3px solid var(--color-accent)` sur tous les éléments focusables |
| Contraste couleurs | Bleu primaire #0c4a6e sur blanc : 12.3:1 (dépasse AAA) |
| Structure sémantique | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` |
| ARIA | `aria-label`, `aria-current`, `aria-expanded`, `aria-controls`, `hidden` utilisés correctement |
| Images | `alt` descriptif sur toutes les images, `width` et `height` définis, `loading="lazy"` |
| Navigation mobile | `aria-expanded` sur le toggle, fermeture sur Escape, focus renvoyé au toggle |
| FAQ accordion | `aria-expanded` + `hidden` (pas de `display:none` seul) pour les lecteurs d'écran |
| Langue | `lang="fr"` sur toutes les pages |
| Viewport | Pas de `user-scalable=no` (zoom autorisé) |
| Liens externes | `rel="external noopener" target="_blank"` sur tous les liens tiers |

---

## Prochaines étapes recommandées

### Priorité 1 — À faire immédiatement après mise en ligne
1. **Soumettre le sitemap à Google Search Console** : `https://autoecolesaintgenes.com/sitemap.xml`
2. **Vérifier et compléter la fiche Google Business Profile** : NAP identique au site, horaires, photos réelles, catégorie "Auto-école"
3. **Remplacer les images placeholder** par des photos réelles de l'auto-école, des moniteurs, des véhicules
4. **Configurer Google Analytics 4** pour suivre les conversions (appels téléphoniques, formulaires)

### Priorité 2 — Dans le premier mois
5. **Obtenir des avis Google** : envoyer un lien de demande d'avis aux élèves récents ayant obtenu leur permis
6. **Uniformiser le NAP sur tous les annuaires** : Pages Jaunes, Yelp, Tripadvisor, Kompass, permisecole.com
7. **Contacter des médias locaux bordelais** : SudOuest.fr, Bordeaux Gazette, Actu.fr Bordeaux pour des mentions/articles

### Priorité 3 — Dans les 3 premiers mois
8. **Créer une section blog/actualités** : guide "comment choisir son auto-école à Bordeaux", "boîte auto vs manuelle", "comment utiliser son CPF pour le permis"
9. **Demande de citation dans des guides comparatifs** : Cercle Auto, Permis de conduire, guides locaux Bordeaux
10. **Mise en place d'un formulaire de contact** avec tracking des conversions
11. **Optimisation Google Business Profile** : ajouter les services détaillés, les photos, répondre aux avis

### Priorité 4 — Suivi continu
12. **Suivi du positionnement SEO** : surveiller mensuellement le classement sur "auto école Bordeaux", "permis B Bordeaux", "boîte automatique Bordeaux"
13. **Suivi de la présence GEO** : tester régulièrement les réponses de ChatGPT, Perplexity, Google AI sur les requêtes cibles
14. **Mise à jour du contenu** : actualiser les tarifs, les taux de réussite, les avis clients

---

## Technologies utilisées

- HTML5 sémantique, CSS3 custom properties, JavaScript vanilla
- Google Fonts : Manrope (titres) + Inter (corps)
- Schema.org JSON-LD pour le balisage structuré
- Mobile-first responsive (breakpoints : 640px, 768px, 1024px)
- Aucune dépendance JavaScript externe
- Compatible avec ouverture directe en local (file://)

---

*Projet réalisé dans le cadre du cours de Digital Marketing — Eugenia School. Analyse SEO/GEO basée sur le document `analyse_auto_ecole.txt`.*
