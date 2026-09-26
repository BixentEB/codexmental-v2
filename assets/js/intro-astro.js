// ========================================================
// intro-astro.js – Message animé d’introduction + alerte astro
// ========================================================

import { IDS } from './ids.js';

let currentAlertText = "";
let isTyping = false;
let currentTimeout = null;
let currentInterval = null; // Nouveau : référence de l'intervalle actif

export function setCurrentAlertText(text) {
  currentAlertText = text;
}

export function getCurrentAlertText() {
  return currentAlertText;
}

export function isToday(dateStr) {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function afficherNoteAstro(data, theme) {
  const bloc = document.getElementById(IDS.ASTRO);
  if (!bloc) return;

  if (theme === "lunaire") {
    setCurrentAlertText("🌙 Données lunaires en cours de chargement...");
  } else {
    const todayAlerts = data.filter(ev => isToday(ev.date));
    if (todayAlerts.length > 0) {
      const eventsText = todayAlerts.map(ev => ev.message).join(' • ');
      setCurrentAlertText(eventsText);
    } else {
      setCurrentAlertText('🪐 Aucune donnée à ce jour.');
    }
  }

  lancerIntroAstro(theme);
}

export function typewriter(element, text, speed = 45, callback) {
  if (!element || typeof text !== 'string') return;

  element.innerHTML = '';
  let i = 0;

  // Nouveau : clear l'ancien intervalle s'il existe
  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = null;
  }

  currentInterval = setInterval(() => {
    const char = text.charAt(i);

    if (char === '\n') {
      element.appendChild(document.createElement('br'));
    } else {
      element.appendChild(document.createTextNode(char));
    }

    i++;
    if (i >= text.length) {
      clearInterval(currentInterval);
      currentInterval = null;
      if (callback) callback();
    }
  }, speed);
}

export function lancerIntroAstro(theme) {
  const bloc = document.getElementById(IDS.ASTRO);
  if (!bloc) return;

  // 🧹 Annule les anciens timers et intervalles si on relance
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }

  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = null;
  }

  isTyping = true;
  bloc.textContent = '';

  const messages = [
    { icon: '🛰️', text: 'Connexion au satellite Codex établie.' },
    { icon: '🌌', text: 'Balayage du ciel nocturne...' },
    { icon: '🌙', text: 'Réception des données lunaires...' },
    { icon: '📡', text: 'Synchronisation orbitale en cours...' },
    { icon: '🪐', text: 'Décodage des messages interstellaires...' },
    { icon: '🔭', text: 'Connexion à l’observatoire quantique...' },
    { icon: '💫', text: 'Analyse des anomalies cosmiques...' },
    { icon: '🔮', text: 'Accès aux archives célestes...' },
    { icon: '🌟', text: 'Mise à jour du protocole astrologique...' }
  ];

  const entry = messages[Math.floor(Math.random() * messages.length)];

  console.log(`🌗 IntroAstro lancé pour le thème: ${theme}`);

  typewriter(bloc, `${entry.icon} ${entry.text}`, 45, () => {
    bloc.textContent += ' ';

    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor-blink';
    bloc.appendChild(cursorSpan);

    currentTimeout = setTimeout(() => {
      cursorSpan.remove();

      const messageFinal = getCurrentAlertText()?.trim()
        ? getCurrentAlertText()
        : '🪐 Aucune donnée à ce jour.';

      bloc.textContent += ' ';
      typewriter(bloc, messageFinal, 45, () => {
        isTyping = false;

        const isFallback = !getCurrentAlertText()?.trim() || getCurrentAlertText().includes('Aucune donnée');
        const delay = isFallback ? 5000 : 15000;

        currentTimeout = setTimeout(() => lancerIntroAstro(theme), delay);
      });
    }, 2000);
  });
}
