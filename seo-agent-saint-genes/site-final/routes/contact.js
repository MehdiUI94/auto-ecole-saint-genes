'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const { validateContact } = require('../middleware/validation');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/contacts.json');

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

// POST /api/contact
router.post('/', validateContact, (req, res) => {
  const { nom, email, objet, message } = req.body;

  const contact = {
    id: `CTK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    nom: nom.trim(),
    email: email.trim().toLowerCase(),
    objet: (objet || '').trim() || 'Sans objet',
    message: message.trim(),
    timestamp: new Date().toISOString(),
    lu: false
  };

  const contacts = readData();
  contacts.push(contact);
  writeData(contacts);

  console.log(`\n📬 Nouveau message contact [${contact.id}]`);
  console.log(`   De : ${contact.nom} <${contact.email}>`);
  console.log(`   Objet : ${contact.objet}`);
  console.log(`   Message : ${contact.message.substring(0, 100)}...`);

  res.json({
    success: true,
    message: 'Votre message a bien été reçu. Nous vous répondrons dans les plus brefs délais.',
    id: contact.id
  });
});

module.exports = router;
