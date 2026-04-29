'use strict';

/**
 * Standardise le header + footer de toutes les vues HTML.
 * Remplace tout ce qui se trouve entre <body> et <main ...> par le header
 * canonique, et tout ce qui se trouve entre </main> et </body> par le footer.
 * Préserve <head>, le contenu de <main>, et tout script en bas de body.
 */

const fs = require('fs');
const path = require('path');

const VIEWS_DIR = path.join(__dirname, '..', 'views');

// ── Identifie la page courante via son nom de fichier pour gérer aria-current
function navLink(href, label, currentPath) {
  const isCurrent = href === currentPath;
  const attr = isCurrent ? ' aria-current="page"' : '';
  return `<li><a href="${href}"${attr}>${label}</a></li>`;
}

function buildHeader(currentPath) {
  return `
<a class="skip-link" href="#main">Aller au contenu</a>

<!-- NAV -->
<nav class="nav" role="navigation" aria-label="Navigation principale">
  <div class="nav__inner">
    <a href="/" class="nav__logo">
      <span class="nav__logo-badge">SG</span>
      Saint-Genès
    </a>

    <ul class="nav__menu" role="list">
      <li>
        <a href="/permis-b" aria-haspopup="true">
          Formations auto
          <svg class="nav__caret" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </a>
        <ul class="nav__dropdown" role="list">
          <li><a href="/permis-b">Permis B (boîte manuelle)</a></li>
          <li><a href="/permis-ba">Permis B boîte automatique</a></li>
          <li><a href="/conduite-accompagnee">Conduite accompagnée (AAC)</a></li>
          <li><a href="/conduite-supervisee">Conduite supervisée</a></li>
          <li><a href="/formation-acceleree">Formation accélérée</a></li>
        </ul>
      </li>
      <li>
        <a href="/permis-a2" aria-haspopup="true">
          Formations moto
          <svg class="nav__caret" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </a>
        <ul class="nav__dropdown" role="list">
          <li><a href="/permis-a2">Permis A2</a></li>
          <li><a href="/permis-am">Permis AM / BSR</a></li>
          <li><a href="/formation-125-cm">Formation 125 cm³</a></li>
          <li><a href="/passerelle-a2-vers-a">Passerelle A2 → A</a></li>
        </ul>
      </li>
      ${navLink('/code-de-la-route', 'Code en ligne', currentPath)}
      ${navLink('/mobilite-handicap', 'Handicap', currentPath)}
      ${navLink('/permis-a-1-euro', 'Financement', currentPath)}
      ${navLink('/actualites', 'Actualités', currentPath)}
      ${navLink('/contact', 'Contact', currentPath)}
    </ul>

    <div class="nav__cta">
      <a href="tel:+33556963320" class="btn btn--ghost btn--sm">05 56 96 33 20</a>
      <a href="/preinscription" class="btn btn--primary btn--sm">S'inscrire</a>
    </div>

    <button class="nav__burger" id="nav-burger" aria-expanded="false" aria-controls="nav-mobile" aria-label="Ouvrir le menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<!-- MENU MOBILE -->
<div class="nav__mobile" id="nav-mobile" role="dialog" aria-label="Menu mobile">
  <div class="nav__mobile-section">
    <p class="nav__mobile-section-title">Formations auto</p>
    <a href="/permis-b">Permis B (boîte manuelle)</a>
    <a href="/permis-ba">Permis B boîte automatique</a>
    <a href="/conduite-accompagnee">Conduite accompagnée (AAC)</a>
    <a href="/conduite-supervisee">Conduite supervisée</a>
    <a href="/formation-acceleree">Formation accélérée</a>
  </div>
  <div class="nav__mobile-section">
    <p class="nav__mobile-section-title">Formations moto</p>
    <a href="/permis-a2">Permis A2</a>
    <a href="/permis-am">Permis AM / BSR</a>
    <a href="/formation-125-cm">Formation 125 cm³</a>
    <a href="/passerelle-a2-vers-a">Passerelle A2 → A</a>
  </div>
  <div class="nav__mobile-section">
    <p class="nav__mobile-section-title">Services</p>
    <a href="/code-de-la-route">Code en ligne 24/7</a>
    <a href="/mobilite-handicap">Mobilité handicap</a>
    <a href="/permis-a-1-euro">Financement (permis 1€/jour, CPF…)</a>
    <a href="/perfectionnement">Perfectionnement</a>
  </div>
  <div class="nav__mobile-section">
    <p class="nav__mobile-section-title">Infos &amp; contact</p>
    <a href="/actualites">Actualités</a>
    <a href="/formules">Toutes les formules</a>
    <a href="/contact">Contact &amp; équipe</a>
    <a href="/plan-du-site">Plan du site</a>
  </div>
  <div class="nav__mobile-cta">
    <a href="/preinscription" class="btn btn--primary btn--full">S'inscrire — c'est gratuit</a>
    <a href="tel:+33556963320" class="btn btn--ghost btn--full">05 56 96 33 20</a>
  </div>
</div>
`;
}

const FOOTER_HTML = `
<!-- FOOTER -->
<footer class="footer">
  <div class="footer__top">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__col">
          <p class="footer__brand">Auto-École Saint-Genès</p>
          <p class="footer__tagline">Première auto-école de Bordeaux. Label Qualité, Qualiopi. Depuis 1984.</p>
        </div>
        <div class="footer__col">
          <p class="footer__heading">Formations</p>
          <ul class="footer__links">
            <li><a href="/permis-b">Permis B manuelle</a></li>
            <li><a href="/permis-ba">Permis B automatique</a></li>
            <li><a href="/conduite-accompagnee">Conduite accompagnée</a></li>
            <li><a href="/formation-acceleree">Formation accélérée</a></li>
            <li><a href="/permis-a2">Permis moto A2</a></li>
            <li><a href="/code-de-la-route">Code en ligne 24/7</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <p class="footer__heading">Infos pratiques</p>
          <ul class="footer__links">
            <li><a href="/mobilite-handicap">Mobilité handicap</a></li>
            <li><a href="/permis-a-1-euro">Permis 1€/jour</a></li>
            <li><a href="/formules">Toutes les formules</a></li>
            <li><a href="/actualites">Actualités</a></li>
            <li><a href="/contact">Contact &amp; équipe</a></li>
            <li><a href="/preinscription">Préinscription en ligne</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <p class="footer__heading">Contact</p>
          <div class="footer__contact-item">
            <span class="footer__contact-icon"></span>
            <span>182 Boulevard George V<br>33200 Bordeaux</span>
          </div>
          <a href="tel:+33556963320" class="footer__phone">05 56 96 33 20</a>
          <div class="footer__contact-item">
            <span class="footer__contact-icon"></span>
            <span>Lun–Ven 9h–12h30 &amp; 14h–19h<br>Sam 9h–12h</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="footer__bottom">
    <div class="container">
      <div class="footer__bottom-inner">
        <p class="footer__copy">© 2026 Auto-École Saint-Genès · Bordeaux · SIRET 753 311 100 33 000</p>
        <nav class="footer__legal" aria-label="Liens légaux">
          <a href="/mentions-legales">Mentions légales</a>
          <a href="/politique-confidentialite">Politique de confidentialité</a>
          <a href="/plan-du-site">Plan du site</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </div>
  </div>
</footer>

<script src="/assets/main.js"></script>
`;

// Map fichier → URL pour aria-current
const FILE_TO_URL = {
  'index.html': '/',
  'code-de-la-route.html': '/code-de-la-route',
  'permis-b.html': '/permis-b',
  'conduite-accompagnee.html': '/conduite-accompagnee',
  'conduite-supervisee.html': '/conduite-supervisee',
  'mobilite-handicap.html': '/mobilite-handicap',
  'permis-ba.html': '/permis-ba',
  'formation-acceleree.html': '/formation-acceleree',
  'permis-a-1-euro.html': '/permis-a-1-euro',
  'perfectionnement.html': '/perfectionnement',
  'permis-a2.html': '/permis-a2',
  'permis-am.html': '/permis-am',
  'formation-125-cm.html': '/formation-125-cm',
  'passerelle-a2-vers-a.html': '/passerelle-a2-vers-a',
  'formules.html': '/formules',
  'preinscription.html': '/preinscription',
  'code-en-ligne.html': '/code-en-ligne',
  'contact.html': '/contact',
  'success.html': '/success',
  'cancel.html': '/cancel',
  'mentions-legales.html': '/mentions-legales',
  'politique-confidentialite.html': '/politique-confidentialite',
  'plan-du-site.html': '/plan-du-site',
  'actualites.html': '/actualites',
  '404.html': '/404',
};

// Vues à ignorer (pas de header/footer ou layout très spécial)
const SKIP = new Set([]);

function processFile(filename) {
  if (SKIP.has(filename)) return false;
  const filePath = path.join(VIEWS_DIR, filename);
  let html = fs.readFileSync(filePath, 'utf8');

  const bodyOpenMatch = html.match(/<body[^>]*>/i);
  const mainOpenMatch = html.match(/<main\b[^>]*>/i);
  const mainCloseIdx  = html.lastIndexOf('</main>');
  const bodyCloseIdx  = html.lastIndexOf('</body>');

  if (!bodyOpenMatch || !mainOpenMatch || mainCloseIdx === -1 || bodyCloseIdx === -1) {
    console.warn(`⚠️  Skip ${filename} (structure body/main introuvable)`);
    return false;
  }

  const bodyOpenEnd = bodyOpenMatch.index + bodyOpenMatch[0].length;
  const mainOpenStart = mainOpenMatch.index;

  // Force <main id="main"> partout pour cohérence avec skip-link
  const mainOpenTagNormalized = '<main id="main">';

  const mainContent = html.substring(mainOpenStart + mainOpenMatch[0].length, mainCloseIdx);
  const beforeBodyOpen = html.substring(0, bodyOpenEnd);
  const afterBodyClose = html.substring(bodyCloseIdx);

  const currentPath = FILE_TO_URL[filename] || '/';
  const header = buildHeader(currentPath);

  const newHtml = `${beforeBodyOpen}\n${header}\n${mainOpenTagNormalized}\n${mainContent}\n</main>\n${FOOTER_HTML}\n${afterBodyClose}`;

  fs.writeFileSync(filePath, newHtml, 'utf8');
  return true;
}

function main() {
  const files = fs.readdirSync(VIEWS_DIR).filter(f => f.endsWith('.html'));
  let ok = 0, skipped = 0;
  for (const f of files) {
    const r = processFile(f);
    if (r) { console.log(`✅  ${f}`); ok++; }
    else   { skipped++; }
  }
  console.log(`\n${ok} vues mises à jour, ${skipped} ignorées.`);
}

main();
