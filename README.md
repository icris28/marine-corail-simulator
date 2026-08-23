# Marine Corail Énergies — Simulateur Anker SOLIX V1.5

Application statique HTML/CSS/JavaScript conçue pour GitHub Pages. Elle reste indépendante de WordPress et WooCommerce.

## Les 3 modes inclus

### 1. Version normale / PC — `index.html`
- Version générale du simulateur + caractéristiques.
- Aucune remise à zéro automatique.
- Peut être ouverte directement en double-cliquant sur `index.html`.
- Sous Windows, `LANCER-SIMULATEUR-PC.bat` ouvre directement cette version dans le navigateur par défaut.
- Sur GitHub Pages : `https://VOTRE-COMPTE.github.io/VOTRE-DEPOT/`

### 2. Mode borne — `kiosk.html`
Pensé pour une tablette sur pied ou un écran libre-service.
- Boutons Réinitialiser et Plein écran.
- Tentative de maintien de l'écran éveillé lorsque le navigateur autorise l'API Screen Wake Lock.
- Avertissement après 4 min 30 s d'inactivité.
- Remise à zéro complète après 5 min d'inactivité.
- Retour à l'étape 1 du simulateur avec la configuration par défaut.
- Sur GitHub Pages : `https://VOTRE-COMPTE.github.io/VOTRE-DEPOT/kiosk.html`

Le navigateur impose une action utilisateur pour entrer en plein écran : utiliser le bouton `Plein écran` au démarrage de la borne.

### 3. Mode application installable — `app.html`
Version PWA (Progressive Web App) pour tablette, smartphone ou ordinateur.
- Installable depuis GitHub Pages via Chrome / Edge / Android et navigateurs compatibles.
- Une fois installée, s'ouvre comme une application, sans interface de navigateur lorsque la plateforme le permet.
- Fonctionnement hors ligne après le premier chargement grâce au service worker.
- Boutons Réinitialiser et Plein écran.
- Même remise à zéro automatique que le mode borne : avertissement à 4 min 30 s, reset à 5 min d'inactivité.
- Sur iPad/iPhone : Safari → Partager → `Sur l’écran d’accueil`.
- Sur GitHub Pages : `https://VOTRE-COMPTE.github.io/VOTRE-DEPOT/app.html`

L'installation PWA nécessite HTTPS : elle fonctionne donc depuis GitHub Pages, mais pas en ouvrant simplement `app.html` avec une URL `file://`.

## Remise à zéro automatique

La remise à zéro des modes `kiosk.html` et `app.html` efface uniquement la configuration en cours dans l'interface :
- station sélectionnée ;
- batterie d'extension ;
- appareils et appareils personnalisés ;
- modes de recharge ;
- paramètres solaires ;
- niveau de batterie ;
- étape et onglet affichés.

Aucune donnée utilisateur n'est envoyée ni stockée sur un serveur par le simulateur.

Le délai est défini dans `shell-mode.js` :

```js
const IDLE_MS = 5 * 60 * 1000;
const WARNING_MS = 30 * 1000;
```

## Installation sur GitHub Pages

1. Créer un dépôt GitHub, par exemple `marine-corail-solix-simulator`.
2. Envoyer **le contenu de ce dossier** à la racine du dépôt.
3. GitHub → `Settings` → `Pages`.
4. Source : `Deploy from a branch`.
5. Branch : `main` et dossier `/ (root)`.
6. Enregistrer et attendre la publication.

Les trois URLs seront ensuite disponibles automatiquement :

```text
Version normale : https://VOTRE-COMPTE.github.io/marine-corail-solix-simulator/
Mode borne      : https://VOTRE-COMPTE.github.io/marine-corail-solix-simulator/kiosk.html
Application     : https://VOTRE-COMPTE.github.io/marine-corail-solix-simulator/app.html
```

## Installer la version App

### Android / Chrome
1. Ouvrir `app.html` depuis GitHub Pages.
2. Appuyer sur `Installer` si le bouton apparaît, ou menu Chrome → `Installer l'application` / `Ajouter à l'écran d'accueil`.
3. Lancer ensuite l'icône Marine Corail Énergies depuis l'écran d'accueil.

### Windows / Edge ou Chrome
1. Ouvrir `app.html`.
2. Utiliser l'icône d'installation dans la barre d'adresse ou le bouton `Installer`.
3. Épingler l'application au bureau / menu Démarrer si souhaité.

### iPad / iPhone
1. Ouvrir `app.html` dans Safari.
2. `Partager` → `Sur l'écran d'accueil`.

## Fichiers principaux

```text
index.html                  version normale / PC
kiosk.html                  mode borne
app.html                    mode application / PWA
styles.css                  design commun
app.js                      moteur du simulateur
shell-mode.js               plein écran, borne, PWA et reset d'inactivité
data.js                     données stations / appareils / panneaux
manifest.webmanifest        manifeste de l'application installable
sw.js                       cache hors ligne PWA
LANCER-SIMULATEUR-PC.bat    raccourci Windows local
assets/images/              logo et photos produits
assets/icons/               icônes de l'application
iframe-wordpress.html       exemple d'intégration WordPress
SOURCES.md                  sources techniques
```

## Mise à jour

Pour publier une nouvelle version : remplacer les fichiers du dépôt puis faire `Commit changes`. GitHub Pages republie automatiquement.

Le service worker utilise un nom de cache versionné. Lors d'une future mise à jour importante, augmenter `CACHE_NAME` dans `sw.js` afin de forcer le renouvellement du cache hors ligne.
