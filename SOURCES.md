# Sources techniques principales

Références utilisées pour établir la V1.4. À revalider lors de toute évolution produit.

## Stations

- C300 : https://www.ankersolix.com/fr/products/a17223z1
  - 288 Wh, 300 W, 600 W via SurgePad, solaire 100 W, 80 % en 50 min sur secteur, 80 % en 2,5 h solaire.
  - Anker indique PS60/PS100 et exclut PS200/PS400 pour ce modèle.
  - Support Anker A1722 : 164 × 161 × 240 mm ; 4,13 kg.

- C300 DC : https://www.ankersolix.com/ca-fr/products/c300-dc
  - Support : https://service.ankersolix.com/product-description/a08J1000000Y7GcIAK
  - 288 Wh, 300 W de sortie totale, CC uniquement, solaire 100 W max.
  - Deux ports USB-C bidirectionnels 140 W ; recharge complète en 90 min avec deux entrées USB-C PD 140 W (280 W au total).
  - Dimensions 124 × 120 × 200 mm ; poids net 2,8 kg.
  - La fiche officielle distingue explicitement C300 (CA + CC) et C300 DC (CC uniquement).

- C1000 Gen 2 : https://www.ankersolix.com/fr/products/c1000-gen2
  - 1 024 Wh, 2 000 W, 3 000 W en pic, recharge 49 min, solaire 600 W max.
  - MPPT : 11-28 V / 8,2 A ; 29-60 V / 14,5 A.
  - Non extensible.
  - Dimensions 384 × 208 × 244 mm ; poids 11,3 kg.

- C2000 Gen 2 : https://www.ankersolix.com/fr/c2000-gen2
  - 2 048 Wh, 2 400 W, 4 000 W en pic, solaire 800 W max.
  - MPPT : 11-28 V / 8,2 A ; 28-60 V / 17 A max.
  - Recharge secteur 1 h 03 ; solaire 3 h à 800 W ; alternateur 2 h 36 à 800 W.
  - Extension Anker SOLIX BP2000 Gen 2 : +2 048 Wh.
  - Dimensions 459 × 250 × 257 mm ; poids 18,9 kg.

## Panneaux

- PS60 : Anker Support — 60 W, Vmp 16 V, Voc 18 V, Imp 3,75 A.
- PS100 : https://www.ankersolix.com/fr/products/as310011 — 100 W, Vmp 21,6 V, Imp 4,63 A ; support Anker : Voc 27 V.
- PS200 : https://www.ankersolix.com/fr/products/as320011 — 200 W, Vmp 48 V, Imp 4,16 A ; support Anker : Voc 57,6 V.
- PS400 : support Anker — 400 W, Vmp 48 V, Voc 57,6 V, Imp 8,33 A, Isc 8,75 A.

## Starlink

- Starlink Mini : https://www.starlink.com/public-files/specification_sheet_mini.pdf
  - consommation moyenne officielle 25-40 W.
- Starlink Standard : https://www.starlink.com/public-files/specification_sheet_standard.pdf
  - consommation moyenne officielle 75-100 W.

## Profils types / hypothèses

Les valeurs de consommation des appareils d’apnée du sommeil, réfrigérateurs, congélateurs, VAE, drones, cuisine et outils ne représentent pas une fiche produit unique : elles servent de profils de simulation modifiables.

Le profil « Starlink V5 / récent » est explicitement provisoire dans l'interface et doit être remplacé lorsque la référence exacte à proposer est définie.

Pour la C300 DC, le simulateur distingue les appareils 230 V des usages USB / 12 V / CC. Les profils classés « 230 V » sont considérés incompatibles avec cette station, même si leur consommation énergétique serait faible.

## Recharge simultanée secteur + solaire

- C1000 Gen 2 : la FAQ officielle Anker confirme la recharge simultanée réseau + solaire, avec priorité au solaire. Le temps combiné affiché dans le simulateur est marqué comme estimation calculée, faute de temps 0-100 % combiné officiel trouvé.
- C2000 Gen 2 : Anker annonce jusqu'à 2 600 W en AC + solaire et 100 % en 58 min dans ses données produit. Le simulateur utilise cette valeur comme référence constructeur pour la station seule.

## Visuels intégrés

Photos produit officielles Anker SOLIX enregistrées localement dans `assets/images/` afin que le simulateur reste autonome sur GitHub Pages :

- C300 : https://cdn.shopify.com/s/files/1/0650/2773/5652/files/A17223Z1_Product_Image_02_V1_1000x.png?v=1744361757
- C300 DC : https://cdn.shopify.com/s/files/1/0703/7799/6484/files/A17260Z1_Product_Image_01_V2_1000x.png?v=1744973464
- C1000 Gen 2 : https://cdn.shopify.com/s/files/1/0650/2773/5652/files/A17633A1_ProductImage_01_V1_1_6e5bef6d-6765-4496-a3ee-d7b71acc82e5_3840x.png?v=1763005342
- C2000 Gen 2 : https://cdn.shopify.com/s/files/1/0650/2773/5652/files/A1783-DE_1_3840x.png?v=1771899620

Le logo `logo-marine-corail-energies.png` a été fourni directement par Marine Corail.

## V1.5 — fonctionnement borne / PWA

Les fonctions borne et application n'ajoutent aucune donnée technique produit. Elles utilisent uniquement les API web standards du navigateur : Web App Manifest, Service Worker, Fullscreen API et Screen Wake Lock lorsque disponibles. Les navigateurs peuvent limiter certaines fonctions selon la plateforme et les permissions.

## V1.6 — Accessoires ajoutés

- Anker SOLIX PS200 (AS320011): 200 W, 48 V / 4,16 A, 4,8 kg, IP68, dimensions plié/déplié — fiche officielle Anker SOLIX FR.
- Anker SOLIX PS60 (A24383A1): 60 W, 16 V / 3,75 A, IP68, compatible entrées MC4 11–60 V — fiche officielle Anker SOLIX FR ; dimensions et poids recoupés avec le manuel PS60.
- Anker SOLIX BP2000 Expansion Battery (Gen 2): 2 048 Wh, LFP, 4 000 cycles, 15,3 kg, 5 ans, dédiée à la C2000 Gen 2 — fiche officielle Anker SOLIX EU.
- Chargeur d’alternateur Anker SOLIX (AS2002A1): jusqu’à 800 W, station 2 kWh en environ 2,6 h, pilotage Bluetooth/Wi-Fi, fusible 100 A fourni — fiche officielle Anker SOLIX FR.
