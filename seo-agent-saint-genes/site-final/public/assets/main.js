/* ============================================================
   AUTO-ÉCOLE SAINT-GENÈS — main.js v2
   ============================================================ */

(function () {
  'use strict';

  /* ── Reveal on scroll ─────────────────────────────────────── */
  function initRevealOnScroll() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length || !window.IntersectionObserver) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ── Mobile menu ─────────────────────────────────────────── */
  function initMobileMenu() {
    var burger = document.getElementById('nav-burger');
    var menu   = document.getElementById('nav-mobile');
    var legacyBurger = document.querySelector('.nav-toggle');
    var legacyMenu   = document.getElementById('nav-menu');

    if (burger && menu) {
      function open() {
        menu.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
      function close() {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      burger.addEventListener('click', function () {
        menu.classList.contains('is-open') ? close() : open();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
      });
      document.addEventListener('click', function (e) {
        if (menu.classList.contains('is-open') && !menu.contains(e.target) && e.target !== burger) close();
      });
    }

    if (!legacyBurger || !legacyMenu) return;

    legacyBurger.addEventListener('click', function () {
      var isOpen = legacyMenu.classList.toggle('is-open');
      legacyBurger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        legacyMenu.classList.remove('is-open');
        legacyBurger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', function (e) {
      if (
        legacyMenu.classList.contains('is-open') &&
        !legacyMenu.contains(e.target) &&
        !legacyBurger.contains(e.target)
      ) {
        legacyMenu.classList.remove('is-open');
        legacyBurger.setAttribute('aria-expanded', 'false');
      }
    });

  }

  /* ── FAQ accordion ───────────────────────────────────────── */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn    = item.querySelector('.faq-item__q');
      var answer = item.querySelector('.faq-item__a');
      if (!btn || !answer) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Fermer tous les autres
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('is-open');
            var ob = other.querySelector('.faq-item__q');
            var oa = other.querySelector('.faq-item__a');
            if (ob) ob.setAttribute('aria-expanded', 'false');
            if (oa) oa.hidden = true;
          }
        });

        item.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
        answer.hidden = isOpen;
      });
    });
  }

  /* ── Smooth scroll ───────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return;
        var target;
        try {
          target = document.querySelector(href);
        } catch (err) {
          return;
        }
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* Navigation interne plus fluide */
  function initPageTransitions() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    window.addEventListener('pageshow', function () {
      document.body.classList.remove('is-leaving');
    });

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link || e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (link.target || link.hasAttribute('download')) return;
      if (link.closest('.tweaks-drawer')) return;

      var href = link.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0) return;

      var url;
      try {
        url = new URL(href, window.location.href);
      } catch (err) {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

      e.preventDefault();
      document.body.classList.add('is-leaving');
      window.setTimeout(function () {
        window.location.href = url.href;
      }, 120);
    });
  }

  function initLinkPrefetch() {
    var prefetched = Object.create(null);

    function prefetch(link) {
      var href = link.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0) return;
      var url;
      try {
        url = new URL(href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== window.location.origin || prefetched[url.pathname]) return;
      prefetched[url.pathname] = true;

      var tag = document.createElement('link');
      tag.rel = 'prefetch';
      tag.href = url.href;
      document.head.appendChild(tag);
    }

    document.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('mouseenter', function () { prefetch(link); }, { once: true });
      link.addEventListener('touchstart', function () { prefetch(link); }, { once: true, passive: true });
    });
  }

  /* ── Formulaire contact ──────────────────────────────────── */
  function initContactForm() {
    var form  = document.getElementById('contact-form');
    var alert = document.getElementById('contact-alert');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.ok) {
            form.reset();
            showAlert(alert, 'success', data.message || 'Message envoyé. Nous vous répondrons dans les 24h.');
          } else {
            showAlert(alert, 'error', data.message || 'Une erreur est survenue.');
            if (data.errors) markErrors(form, data.errors);
          }
        })
        .catch(function () {
          showAlert(alert, 'error', 'Erreur de connexion. Veuillez réessayer.');
        })
        .finally(function () { btn.disabled = false; });
    });
  }

  /* ── Formulaire préinscription (collecte multi-step) ─────── */
  function initInscriptionForm() {
    var form  = document.getElementById('inscription-form');
    var alert = document.getElementById('inscription-alert');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;

      // Collecter toutes les valeurs du formulaire + données multi-step
      var data = Object.fromEntries(new FormData(form));

      // Enrichir avec les sélections multi-step si présentes
      var profilEl   = document.querySelector('[name="profil_selectionne"]');
      var formuleEl  = document.querySelector('[name="formule_selectionnee"]');
      if (profilEl)  data.profil_selectionne  = profilEl.value;
      if (formuleEl) data.formule_selectionnee = formuleEl.value;

      // Récap multi-step pour l'écran de confirmation
      var recap = document.getElementById('inscription-recap');
      if (recap) {
        recap.innerHTML = buildRecap(data);
      }

      fetch('/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            showAlert(alert, 'success', res.message || 'Préinscription enregistrée ! Nous vous contactons sous 24h.');
            // Afficher l'écran succès si présent
            var successScreen = document.getElementById('inscription-success');
            if (successScreen) {
              form.closest('[data-step-panel]').classList.remove('is-active');
              successScreen.classList.remove('hidden');
            }
          } else {
            showAlert(alert, 'error', res.message || 'Une erreur est survenue.');
            if (res.errors) markErrors(form, res.errors);
          }
        })
        .catch(function () {
          showAlert(alert, 'error', 'Erreur de connexion. Veuillez réessayer.');
        })
        .finally(function () { btn.disabled = false; });
    });
  }

  function buildRecap(data) {
    var lines = [];
    if (data.profil_selectionne)   lines.push('<strong>Profil :</strong> ' + escHtml(data.profil_selectionne));
    if (data.formule_selectionnee) lines.push('<strong>Formule :</strong> ' + escHtml(data.formule_selectionnee));
    if (data.formation)            lines.push('<strong>Formation :</strong> ' + escHtml(data.formation));
    if (data.prenom || data.nom)   lines.push('<strong>Nom :</strong> ' + escHtml((data.prenom || '') + ' ' + (data.nom || '')).trim());
    if (data.email)                lines.push('<strong>Email :</strong> ' + escHtml(data.email));
    if (data.telephone)            lines.push('<strong>Tél :</strong> ' + escHtml(data.telephone));
    return lines.map(function (l) { return '<p>' + l + '</p>'; }).join('');
  }

  /* ── Paiement Stripe ─────────────────────────────────────── */
  function initPaiement() {
    document.querySelectorAll('[data-stripe-formule]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var formule = btn.getAttribute('data-stripe-formule');
        btn.disabled = true;
        btn.textContent = 'Redirection…';

        fetch('/api/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formule: formule }),
        })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            if (data.url) {
              window.location.href = data.url;
            } else {
              alert(data.message || 'Erreur lors de la création de la session.');
              btn.disabled = false;
              btn.textContent = 'Payer en ligne';
            }
          })
          .catch(function () {
            alert('Erreur de connexion. Veuillez réessayer.');
            btn.disabled = false;
            btn.textContent = 'Payer en ligne';
          });
      });
    });
  }

  /* ── Active nav ──────────────────────────────────────────── */
  function setActiveNav() {
    var path = window.location.pathname;
    document.querySelectorAll('.nav__menu a, .nav__mobile a, .nav-menu a').forEach(function (a) {
      if (a.getAttribute('href') === path) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ── Multi-step form ─────────────────────────────────────── */
  function initMultiStep() {
    var wrappers = document.querySelectorAll('[data-multistep]');
    wrappers.forEach(function (wrapper) {
      var panels  = wrapper.querySelectorAll('[data-step-panel]');
      var stepper = wrapper.querySelector('.stepper');
      var stepItems = stepper ? stepper.querySelectorAll('.stepper__item') : [];
      var current = 0;

      function showPanel(idx) {
        panels.forEach(function (p, i) {
          p.classList.toggle('is-active', i === idx);
        });
        stepItems.forEach(function (item, i) {
          item.classList.toggle('is-active', i === idx);
          item.classList.toggle('is-done', i < idx);
        });
        current = idx;
        window.scrollTo({ top: wrapper.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }

      function validatePanel(idx) {
        var panel = panels[idx];
        if (!panel) return true;
        var fields = panel.querySelectorAll('[required]');
        var valid = true;

        var profilHidden = panel.querySelector('#profil-hidden') || wrapper.querySelector('#profil-hidden');
        var profilErr = wrapper.querySelector('#err-profil');
        if (panel.querySelector('#profil-grid-step1') && profilHidden && !profilHidden.value.trim()) {
          if (profilErr) profilErr.style.display = 'block';
          valid = false;
        } else if (profilErr) {
          profilErr.style.display = 'none';
        }

        var formationErr = wrapper.querySelector('#err-formation');
        if (panel.querySelector('[name="formation"]') && !panel.querySelector('[name="formation"]:checked')) {
          if (formationErr) formationErr.style.display = 'block';
          valid = false;
        } else if (formationErr) {
          formationErr.style.display = 'none';
        }

        fields.forEach(function (f) {
          if (!f.value.trim()) {
            f.classList.add('is-error');
            valid = false;
          } else {
            f.classList.remove('is-error');
          }
        });
        return valid;
      }

      wrapper.querySelectorAll('[data-next]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (validatePanel(current) && current < panels.length - 1) {
            showPanel(current + 1);
          }
        });
      });

      wrapper.querySelectorAll('[data-prev]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (current > 0) showPanel(current - 1);
        });
      });

      // Validation live
      wrapper.querySelectorAll('[required]').forEach(function (f) {
        f.addEventListener('input', function () {
          if (f.value.trim()) f.classList.remove('is-error');
        });
      });

      showPanel(0);
    });
  }

  /* ── Sélecteur de formules ───────────────────────────────── */
  function initFormuleSelector() {
    var selectors = document.querySelectorAll('[data-formule-selector]');
    selectors.forEach(function (sel) {
      var steps     = sel.querySelectorAll('.formule-selector__step');
      var profilCards = sel.querySelectorAll('[data-profil]');
      var boiteCards  = sel.querySelectorAll('[data-boite]');
      var results     = sel.querySelector('.formule-results');
      var stepBoite   = sel.querySelector('[data-formule-step="boite"]');

      var state = { profil: null, boite: null };

      // Profils sans boîte
      var profils_sans_boite = ['code', 'moto', 'handicap'];

      function goStep(n) {
        steps.forEach(function (s, i) { s.classList.toggle('is-active', i === n); });
      }

      profilCards.forEach(function (card) {
        card.addEventListener('click', function () {
          profilCards.forEach(function (c) { c.classList.remove('is-selected'); });
          card.classList.add('is-selected');
          state.profil = card.getAttribute('data-profil');

          // Sauvegarder dans champ caché si présent
          var hidden = document.querySelector('[name="profil_selectionne"]');
          if (hidden) hidden.value = card.querySelector('.profil-card__label') ? card.querySelector('.profil-card__label').textContent : state.profil;

          if (profils_sans_boite.indexOf(state.profil) !== -1) {
            state.boite = 'na';
            goStep(2);
            showResults();
          } else {
            state.boite = null;
            goStep(1);
          }
        });
      });

      boiteCards.forEach(function (card) {
        card.addEventListener('click', function () {
          boiteCards.forEach(function (c) { c.classList.remove('is-selected'); });
          card.classList.add('is-selected');
          state.boite = card.getAttribute('data-boite');
          goStep(2);
          showResults();
        });
      });

      // Boutons retour dans sélecteur
      sel.querySelectorAll('[data-selector-prev]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = parseInt(btn.getAttribute('data-selector-prev'));
          state.boite = null;
          goStep(target);
        });
      });

      function showResults() {
        if (!results) return;
        var cards = results.querySelectorAll('.price-card');
        cards.forEach(function (card) {
          var profils = (card.getAttribute('data-profils') || '').split(',').map(function (s) { return s.trim(); });
          var boites  = (card.getAttribute('data-boites') || '').split(',').map(function (s) { return s.trim(); });

          var matchProfil = profils.indexOf(state.profil) !== -1 || profils.indexOf('all') !== -1 || profils[0] === '';
          var matchBoite  = boites.indexOf(state.boite)   !== -1 || boites.indexOf('all')   !== -1 || boites[0]  === '' || state.boite === 'na';

          card.style.display = (matchProfil && matchBoite) ? '' : 'none';
        });
      }

      goStep(0);
    });
  }

  /* ── Tweaks panel ────────────────────────────────────────── */
  function initTweaks() {
    var toggle  = document.getElementById('tweaks-toggle');
    var drawer  = document.getElementById('tweaks-drawer');
    if (!toggle || !drawer) return;

    toggle.addEventListener('click', function () {
      drawer.classList.toggle('is-open');
    });

    // Restaurer depuis localStorage
    var saved = {
      palette: localStorage.getItem('tweak_palette') || 'bleu',
      card:    localStorage.getItem('tweak_card')    || 'soft',
      button:  localStorage.getItem('tweak_button')  || 'soft',
    };
    applyTweaks(saved);
    updateTweakBtns(drawer, saved);

    // Délégation sur les boutons
    drawer.addEventListener('click', function (e) {
      var btn = e.target.closest('.tweak-btn');
      if (!btn) return;

      var type  = btn.getAttribute('data-tweak-palette') ? 'palette' :
                  btn.getAttribute('data-tweak-card')    ? 'card'    : 'button';
      var value = btn.getAttribute('data-tweak-' + type);

      saved[type] = value;
      localStorage.setItem('tweak_' + type, value);
      applyTweaks(saved);
      updateTweakBtns(drawer, saved);
    });

    // Fermer au clic externe
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('is-open');
      }
    });
  }

  function applyTweaks(saved) {
    var html = document.documentElement;
    if (saved.palette === 'bleu') {
      html.removeAttribute('data-palette');
    } else {
      html.setAttribute('data-palette', saved.palette);
    }
    if (saved.card === 'soft') {
      html.removeAttribute('data-card');
    } else {
      html.setAttribute('data-card', saved.card);
    }
    if (saved.button === 'soft') {
      html.removeAttribute('data-button');
    } else {
      html.setAttribute('data-button', saved.button);
    }
  }

  function updateTweakBtns(drawer, saved) {
    drawer.querySelectorAll('.tweak-btn').forEach(function (btn) {
      var type = btn.getAttribute('data-tweak-palette') ? 'palette' :
                 btn.getAttribute('data-tweak-card')    ? 'card'    : 'button';
      var val  = btn.getAttribute('data-tweak-' + type);
      btn.classList.toggle('is-active', saved[type] === val);
    });
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function showAlert(el, type, msg) {
    if (!el) return;
    el.className = 'form-alert form-alert--' + type + ' is-visible';
    el.textContent = msg;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function markErrors(form, errors) {
    Object.keys(errors).forEach(function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      if (field) field.classList.add('is-error');
    });
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Init ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initRevealOnScroll();
    initMobileMenu();
    initFaq();
    initSmoothScroll();
    initPageTransitions();
    initLinkPrefetch();
    initContactForm();
    initInscriptionForm();
    initPaiement();
    setActiveNav();
    initMultiStep();
    initFormuleSelector();
    initTweaks();
  });

})();
