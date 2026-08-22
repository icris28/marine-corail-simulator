# Simulateur Anker SOLIX — Marine Corail

Version **1.2** — refonte design/UX, identité Marine Corail Énergies, vraies photos produit et recherche d’appareils.

Web-app statique HTML/CSS/JavaScript, sans dépendance, prévue pour GitHub Pages puis intégration dans WordPress par iframe.

## Contenu

- `index.html` : interface.
- `styles.css` : design responsive.
- `data.js` : stations, panneaux, appareils et coefficients métier.
- `app.js` : moteur de calcul et interactions.
- `.nojekyll` : évite le traitement Jekyll sur GitHub Pages.

## Fonctionnalités V1

- C300, C1000 Gen 2, C2000 Gen 2.
- Batterie BP2000 Gen 2 sur C2000.
- Vérification puissance continue + pic de démarrage.
- Traitement conservateur des compresseurs/moteurs sur C300.
- Appareils types : froid, appareils d’apnée du sommeil (PPC/CPAP), Starlink, camping, VAE, drones, cuisine, outils.
- Appareil personnalisé.
- Recharge secteur, solaire, chargeur alternateur et prise véhicule selon station.
- Sélection de plusieurs modes de recharge pour comparaison simultanée.
- Temps de recharge recalculés en direct selon le SOC, la station, l'extension et le solaire.
- Affichage de la recharge secteur + solaire simultanée sur les modèles compatibles/documentés.
- PS60, PS100, PS200, PS400 avec contrôle tension/courant simplifié et recommandation série/parallèle.
- Estimation du temps de recharge depuis un SOC choisi.
- Estimation de production solaire journalière selon conditions.
- Recommandation d'une station plus adaptée en cas de configuration limite/non compatible.
- Responsive mobile renforcé : typographie agrandie, zones tactiles ≥ 44 px, cartes stations horizontales, grilles adaptatives, catégories horizontales et formulaire sans zoom iOS.
- Vraies photos officielles Anker SOLIX pour C300, C1000 Gen 2 et C2000 Gen 2.
- Logo Marine Corail Énergies fourni par Marine Corail.
- Recherche instantanée dans la bibliothèque d’appareils.
- Interface volontairement neutre : aucun prix, CTA commercial ou lien WooCommerce.
- Redimensionnement automatique de l'iframe WordPress via `postMessage`.

## Hypothèses importantes

Les données de stations sont isolées dans `data.js`. Les valeurs de consommation des appareils sont des profils types modifiables, volontairement prudents pour les moteurs/compresseurs.

Le profil `Starlink V5 / récent` est marqué provisoire : remplacer sa puissance par la valeur exacte du terminal effectivement commercialisé/utilisé dès que sa fiche technique est validée.

Pour la C300, les 600 W SurgePad ne sont volontairement pas utilisés comme une garantie universelle de démarrage d'un compresseur. Le moteur retient une logique prudente pour éviter de déclarer un frigo compatible à tort.

## Publication sur GitHub Pages

1. Créer un dépôt GitHub, par exemple `marine-corail-solix-simulator`.
2. Déposer les fichiers du dossier à la racine du dépôt.
3. Dans GitHub : `Settings` > `Pages`.
4. Dans `Build and deployment`, choisir `Deploy from a branch`.
5. Sélectionner la branche `main` et le dossier `/ (root)`.
6. Enregistrer.
7. GitHub fournit ensuite une URL du type :
   `https://VOTRE-COMPTE.github.io/marine-corail-solix-simulator/`

## Intégration WordPress

Créer une page WordPress et ajouter le contenu du fichier `iframe-wordpress.html` dans un bloc `HTML personnalisé`.

Le simulateur envoie automatiquement sa hauteur à la page parente avec `postMessage`, ce qui évite une iframe trop grande ou coupée, notamment sur mobile.

## Modifier une donnée

Dans `data.js`, les sections sont :

- `stations`
- `panels`
- `appliances`
- `config`

Pour ajouter une station, dupliquer un objet de `stations` et changer son `id`, ses puissances, sa capacité et ses modes de recharge.

## À valider avant mise en production publique

- Valeurs exactes des profils CPAP choisis comme exemples.
- Profil Starlink V5/référence la plus récente réellement vendue.
- Compatibilité pratique/câblage des combinaisons de plusieurs panneaux (connecteurs et câbles fournis).
- Choix définitif des coefficients de rendement et de la marge de sécurité.


## V1.3 — UX du résumé

- Le grand aperçu ne s’affiche plus avant la sélection d’un appareil.
- Sur desktop, il reste en colonne latérale et sticky une fois la simulation commencée.
- Sur tablette/mobile, il est remplacé par une barre compacte en bas avec station, autonomie et statut.
- Une note de bas de page explique les limites des estimations et précise que les saisies restent locales au navigateur.
