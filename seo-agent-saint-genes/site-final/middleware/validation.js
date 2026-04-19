'use strict';

function validateContact(req, res, next) {
  const { nom, email, message } = req.body;
  const errors = [];

  if (!nom || nom.trim().length < 2) {
    errors.push('Le nom est obligatoire (2 caractères minimum).');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Une adresse email valide est obligatoire.');
  }
  if (!message || message.trim().length < 10) {
    errors.push('Le message est obligatoire (10 caractères minimum).');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
}

function validateInscription(req, res, next) {
  const { nom, prenom, email, telephone, permis } = req.body;
  const errors = [];

  const permisValides = [
    'code', 'permis-b', 'conduite-accompagnee', 'conduite-supervisee',
    'mobilite-handicap', 'permis-ba', 'formation-acceleree', 'permis-a-1-euro',
    'perfectionnement', 'permis-a2', 'permis-am', 'formation-125-cm',
    'passerelle-a2-vers-a'
  ];

  if (!nom || nom.trim().length < 2) {
    errors.push('Le nom est obligatoire (2 caractères minimum).');
  }
  if (!prenom || prenom.trim().length < 2) {
    errors.push('Le prénom est obligatoire (2 caractères minimum).');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Une adresse email valide est obligatoire.');
  }
  if (!telephone || !/^[\d\s\+\-\.]{10,15}$/.test(telephone.trim())) {
    errors.push('Un numéro de téléphone valide est obligatoire.');
  }
  if (!permis || !permisValides.includes(permis)) {
    errors.push('Veuillez sélectionner une formation valide.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
}

module.exports = { validateContact, validateInscription };
