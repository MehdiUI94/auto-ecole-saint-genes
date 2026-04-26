'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Stripe (optionnel — ne plante pas si clé absente) ────────────────────────
let stripeClient = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_VOTRE_CLE_TEST_STRIPE') {
  try {
    stripeClient = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('✅  Stripe chargé (mode TEST)');
  } catch (e) {
    console.warn('⚠️  Stripe non disponible :', e.message);
  }
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY non configurée — paiements désactivés (copier .env.example → .env)');
}
app.set('stripe', stripeClient);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques
app.use('/public', express.static(path.join(__dirname, 'public')));
// Alias pratique pour les assets depuis les vues
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// ── Routes API ────────────────────────────────────────────────────────────────
app.use('/api/contact',     require('./routes/contact'));
app.use('/api/inscription', require('./routes/inscription'));
app.use('/api',             require('./routes/paiement'));

// ── Pages HTML (vues) ─────────────────────────────────────────────────────────
const VIEWS = path.join(__dirname, 'views');

function sendView(file) {
  return (req, res) => {
    const filePath = path.join(VIEWS, file);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).sendFile(path.join(VIEWS, '404.html'));
    }
  };
}

app.get('/',                       sendView('index.html'));
app.get('/code-de-la-route',       sendView('code-de-la-route.html'));
app.get('/permis-b',               sendView('permis-b.html'));
app.get('/conduite-accompagnee',   sendView('conduite-accompagnee.html'));
app.get('/conduite-supervisee',    sendView('conduite-supervisee.html'));
app.get('/mobilite-handicap',      sendView('mobilite-handicap.html'));
app.get('/permis-ba',              sendView('permis-ba.html'));
app.get('/formation-acceleree',    sendView('formation-acceleree.html'));
app.get('/permis-a-1-euro',        sendView('permis-a-1-euro.html'));
app.get('/perfectionnement',       sendView('perfectionnement.html'));
app.get('/permis-a2',              sendView('permis-a2.html'));
app.get('/permis-am',              sendView('permis-am.html'));
app.get('/formation-125-cm',       sendView('formation-125-cm.html'));
app.get('/passerelle-a2-vers-a',   sendView('passerelle-a2-vers-a.html'));
app.get('/formules',               sendView('formules.html'));
app.get('/preinscription',         sendView('preinscription.html'));
app.get('/code-en-ligne',          sendView('code-en-ligne.html'));
app.get('/contact',                sendView('contact.html'));
app.get('/success',                sendView('success.html'));
app.get('/cancel',                 sendView('cancel.html'));
app.get('/mentions-legales',       sendView('mentions-legales.html'));
app.get('/politique-confidentialite', sendView('politique-confidentialite.html'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(VIEWS, '404.html'));
});

// ── Démarrage ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚗  Auto-École Saint-Genès — Serveur démarré`);
  console.log(`    http://localhost:${PORT}`);
  console.log(`    Mode : ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});
