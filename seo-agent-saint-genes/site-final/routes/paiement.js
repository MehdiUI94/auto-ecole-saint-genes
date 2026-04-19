'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/commandes.json');

// Catalogue de prix (en centimes pour Stripe)
const CATALOGUE = {
  'code':                 { nom: 'Code de la route',                     prix: 32500  },
  'permis-b':             { nom: 'Permis B',                              prix: 156600 },
  'conduite-accompagnee': { nom: 'Conduite accompagnée (AAC)',             prix: 152400 },
  'conduite-supervisee':  { nom: 'Conduite supervisée',                   prix: 146600 },
  'permis-ba':            { nom: 'Permis BA (boîte automatique)',          prix: 165400 },
  'formation-acceleree':  { nom: 'Formation accélérée',                   prix: 177500 },
  'permis-a2':            { nom: 'Permis A2 (moto)',                      prix: 93000  },
  'permis-am':            { nom: 'Permis AM (scooter)',                    prix: 31100  },
  'formation-125-cm':     { nom: 'Formation 125 cm³',                     prix: 32000  },
  'passerelle-a2-vers-a': { nom: 'Passerelle A2 vers A',                  prix: 33500  },
};

function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// POST /api/create-checkout
router.post('/create-checkout', async (req, res) => {
  const { formule } = req.body;

  if (!formule || !CATALOGUE[formule]) {
    return res.status(400).json({
      success: false,
      errors: [`Formule inconnue : "${formule}". Formules disponibles : ${Object.keys(CATALOGUE).join(', ')}`]
    });
  }

  const stripe = req.app.get('stripe');
  if (!stripe) {
    return res.status(503).json({
      success: false,
      errors: ['Service de paiement non configuré. Vérifiez la clé STRIPE_SECRET_KEY dans .env']
    });
  }

  const item = CATALOGUE[formule];

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Auto-École Saint-Genès — ${item.nom}`,
            description: `Formation : ${item.nom} — Bordeaux Saint-Genès`,
            metadata: { formule }
          },
          unit_amount: item.prix,
        },
        quantity: 1,
      }],
      success_url: process.env.SUCCESS_URL + `?session_id={CHECKOUT_SESSION_ID}&formule=${formule}`,
      cancel_url: process.env.CANCEL_URL + `?formule=${formule}`,
      metadata: { formule, etablissement: 'Auto-École Saint-Genès Bordeaux' },
    });

    // Sauvegarder la commande
    const commande = {
      id: session.id,
      formule,
      nom_formule: item.nom,
      montant_eur: (item.prix / 100).toFixed(2),
      statut: 'pending',
      timestamp: new Date().toISOString(),
      mode: 'TEST'
    };
    const commandes = readData();
    commandes.push(commande);
    writeData(commandes);

    console.log(`\n💳 [STRIPE TEST] Session créée : ${session.id}`);
    console.log(`   Formule : ${item.nom} — ${(item.prix / 100).toFixed(2)}€`);
    console.log(`   URL : ${session.url}`);

    res.json({ success: true, url: session.url, session_id: session.id });

  } catch (err) {
    console.error('Erreur Stripe:', err.message);
    res.status(500).json({ success: false, errors: [`Erreur Stripe : ${err.message}`] });
  }
});

// GET /api/success (webhook simplifié)
router.get('/success', (req, res) => {
  const { session_id, formule } = req.query;
  if (session_id) {
    const commandes = readData();
    const idx = commandes.findIndex(c => c.id === session_id);
    if (idx >= 0) {
      commandes[idx].statut = 'paid';
      writeData(commandes);
      console.log(`\n✅ Paiement confirmé : ${session_id}`);
    }
  }
  res.redirect(`/success?formule=${formule || ''}`);
});

// GET /api/cancel
router.get('/cancel', (req, res) => {
  res.redirect(`/cancel?formule=${req.query.formule || ''}`);
});

module.exports = router;
