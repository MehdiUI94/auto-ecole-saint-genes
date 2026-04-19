/* ============================================================
   AUTO-ÉCOLE SAINT-GENÈS — main.js (vanilla JS)
   Aucune dépendance externe
   ============================================================ */

'use strict';

// ── UTILITAIRES ─────────────────────────────────────────────
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

function showAlert(el, type, html) {
  if (!el) return;
  el.className = `form-alert form-alert--${type} is-visible`;
  el.innerHTML = html;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearErrors(form) {
  qsa('.form-input, .form-select, .form-textarea', form).forEach(f => f.classList.remove('is-error'));
}

// ── MENU MOBILE ──────────────────────────────────────────────
(function initMobileMenu() {
  const burger = qs('#nav-burger');
  const mobileMenu = qs('#nav-mobile');
  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Fermer sur Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      mobileMenu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burger.focus();
    }
  });

  // Fermer en cliquant en dehors
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
      mobileMenu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

// ── FAQ ACCORDION ─────────────────────────────────────────────
(function initFaq() {
  qsa('.faq-item').forEach((item) => {
    const btn = qs('.faq-item__q', item);
    const answer = qs('.faq-item__a', item);
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      // Fermer les autres (comportement accordéon)
      qsa('.faq-item.is-open').forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          qs('.faq-item__q', other)?.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();

// ── SMOOTH SCROLL SUR ANCRES ──────────────────────────────────
(function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = qs(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ── FORMULAIRE CONTACT ────────────────────────────────────────
(function initContactForm() {
  const form = qs('#contact-form');
  if (!form) return;

  const alertEl = qs('#contact-alert');
  const submitBtn = qs('[type="submit"]', form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(form);

    const data = {
      nom:     form.nom?.value.trim(),
      email:   form.email?.value.trim(),
      objet:   form.objet?.value.trim(),
      message: form.message?.value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        showAlert(alertEl, 'success',
          `✅ <strong>Message envoyé !</strong><br>${json.message}<br><small>Référence : ${json.id}</small>`
        );
        form.reset();
      } else {
        const errHtml = json.errors?.map(e => `• ${e}`).join('<br>') || 'Une erreur est survenue.';
        showAlert(alertEl, 'error', `❌ <strong>Erreur :</strong><br>${errHtml}`);
        // Marquer les champs invalides
        if (json.errors?.some(e => e.toLowerCase().includes('nom')))    form.nom?.classList.add('is-error');
        if (json.errors?.some(e => e.toLowerCase().includes('email')))  form.email?.classList.add('is-error');
        if (json.errors?.some(e => e.toLowerCase().includes('message'))) form.message?.classList.add('is-error');
      }
    } catch (err) {
      showAlert(alertEl, 'error', '❌ Erreur réseau. Veuillez réessayer ou nous appeler directement au 05 56 96 33 20.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer le message';
    }
  });
})();

// ── FORMULAIRE PRÉINSCRIPTION ─────────────────────────────────
(function initInscriptionForm() {
  const form = qs('#inscription-form');
  if (!form) return;

  const alertEl  = qs('#inscription-alert');
  const submitBtn = qs('[type="submit"]', form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(form);

    const data = {
      nom:       form.nom?.value.trim(),
      prenom:    form.prenom?.value.trim(),
      email:     form.email?.value.trim(),
      telephone: form.telephone?.value.trim(),
      permis:    form.permis?.value,
      message:   form.message?.value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enregistrement…';

    try {
      const res = await fetch('/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        showAlert(alertEl, 'success',
          `✅ <strong>Préinscription enregistrée !</strong><br>
           ${json.message}<br>
           <strong>Numéro de dossier : ${json.id}</strong><br>
           <strong>Formation : ${json.formation}</strong><br>
           <small>Notre équipe vous contactera dans les 48h.</small>`
        );
        form.reset();
      } else {
        const errHtml = json.errors?.map(e => `• ${e}`).join('<br>') || 'Une erreur est survenue.';
        showAlert(alertEl, 'error', `❌ <strong>Erreur :</strong><br>${errHtml}`);
      }
    } catch (err) {
      showAlert(alertEl, 'error', '❌ Erreur réseau. Veuillez réessayer ou nous appeler directement au 05 56 96 33 20.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer ma préinscription';
    }
  });
})();

// ── PAIEMENT STRIPE ───────────────────────────────────────────
(function initPaiement() {
  qsa('[data-stripe-formule]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const formule = btn.dataset.stripeFormule;
      if (!formule) return;

      const origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Redirection vers le paiement…';

      try {
        const res = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formule }),
        });
        const json = await res.json();

        if (json.success && json.url) {
          window.location.href = json.url;
        } else {
          const msg = json.errors?.[0] || 'Service de paiement indisponible.';
          alert(`⚠️ ${msg}\n\nVeuillez nous contacter directement : 05 56 96 33 20`);
          btn.disabled = false;
          btn.textContent = origText;
        }
      } catch (err) {
        alert('⚠️ Erreur réseau. Veuillez nous contacter au 05 56 96 33 20.');
        btn.disabled = false;
        btn.textContent = origText;
      }
    });
  });
})();

// ── NAV ACTIVE STATE ──────────────────────────────────────────
(function setActiveNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  qsa('.nav__menu a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href')?.replace(/\/$/, '') || '';
    if (href === path || (path === '/' && href === '/')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
