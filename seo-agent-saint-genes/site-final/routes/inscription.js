'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const { validateInscription } = require('../middleware/validation');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/inscriptions.json');

const LABELS_PERMIS = {
  'code':                 'Code de la route',
  'permis-b':             'Permis B',
  'conduite-accompagnee': 'Conduite accompagnée (AAC)',
  'conduite-supervisee':  'Conduite supervisée',
  'mobilite-handicap':    'Mobilité handicap',
  'permis-ba':            'Permis BA (boîte automatique)',
  'formation-acceleree':  'Formation accélérée',
  'permis-a-1-euro':      'Permis à 1 euro',
  'perfectionnement':     'Perfectionnement',
  'permis-a2':            'Permis A2 (moto)',
  'permis-am':            'Permis AM (scooter)',
  'formation-125-cm':     'Formation 125 cm³',
  'passerelle-a2-vers-a': 'Passerelle A2 vers A'
};

function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// POST /api/inscription
router.post('/', validateInscription, (req, res) => {
  const { nom, prenom, email, telephone, permis, message } = req.body;

  const inscription = {
    id: `INS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    nom: nom.trim(),
    prenom: prenom.trim(),
    email: email.trim().toLowerCase(),
    telephone: telephone.trim(),
    permis,
    permis_label: LABELS_PERMIS[permis] || permis,
    message: (message || '').trim(),
    statut: 'en_attente',
    timestamp: new Date().toISOString()
  };

  const inscriptions = readData();
  inscriptions.push(inscription);
  writeData(inscriptions);

  console.log(`\n📋 Nouvelle préinscription [${inscription.id}]`);
  console.log(`   Candidat : ${inscription.prenom} ${inscription.nom}`);
  console.log(`   Email : ${inscription.email} | Tél : ${inscription.telephone}`);
  console.log(`   Formation souhaitée : ${inscription.permis_label}`);

  res.json({
    success: true,
    message: 'Votre préinscription a bien été enregistrée. Notre équipe vous contactera sous 48h pour fixer un rendez-vous.',
    id: inscription.id,
    formation: inscription.permis_label
  });
});

module.exports = router;
