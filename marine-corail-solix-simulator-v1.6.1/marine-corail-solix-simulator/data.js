window.SOLIX_DATA = {
  config: {
    acUsableEnergyFactor: 0.90,
    dcUsableEnergyFactor: 0.94,
    startupSafetyFactor: 1.10,
    lowRuntimeHours: 3,
    comfortableRuntimeHours: 24,
    solarConditions: {
      excellent: { label: "Excellentes", productionFactor: 0.88, equivalentSunHours: 5.2 },
      good: { label: "Bonnes", productionFactor: 0.78, equivalentSunHours: 4.3 },
      average: { label: "Moyennes", productionFactor: 0.62, equivalentSunHours: 3.0 }
    }
  },

  stations: [
    {
      id: "c300",
      name: "Anker SOLIX C300",
      shortName: "C300",
      capacityWh: 288,
      image: "assets/images/anker-solix-c300.webp",
      useCase: "Bivouac, électronique légère et petites recharges",
      outputType: "ac-dc",
      outputTypeLabel: "CA + CC",
      continuousW: 300,
      peakW: 600,
      motorStartupLimitW: 300,
      peakLabel: "600 W via SurgePad",
      chemistry: "LFP",
      extension: null,
      solar: { maxW: 100, minV: 11, maxV: 28, lowVoltageCurrentA: 8.2, highVoltageCurrentA: null, allowedPanelIds: ["ps60", "ps100"] },
      recharge: {
        ac: { supported: true, fullMinutesEstimate: 70, manufacturerNote: "80 % en 50 min sur secteur" },
        usbC: { supported: true, inputW: 140, efficiency: 0.88, manufacturerNote: "Recharge USB-C PD 140 W compatible" },
        alternator: { supported: false },
        car: { supported: true, inputW: 100, efficiency: 0.82, manufacturerNote: "Recharge véhicule compatible" }
      },
      specs: {
        dimensions: "164 × 161 × 240 mm",
        weight: "4,13 kg",
        outputs: "230 V + USB-C 140 W + USB-A + 12 V",
        ups: "10 ms",
        solarInput: "100 W max • 11–28 V",
        rechargeHeadline: "80 % en 50 min sur secteur",
        warranty: "5 ans"
      },
      tags: ["ultra-compacte", "camping léger"],
      note: "Pour les moteurs et compresseurs, la limite de démarrage est volontairement traitée de façon conservatrice."
    },
    {
      id: "c300-dc",
      name: "Anker SOLIX C300 DC",
      shortName: "C300 DC",
      capacityWh: 288,
      image: "assets/images/anker-solix-c300-dc.webp",
      useCase: "Ultra-portable pour USB-C, 12 V et équipements basse tension",
      outputType: "dc-only",
      outputTypeLabel: "CC uniquement",
      continuousW: 300,
      peakW: 300,
      motorStartupLimitW: 300,
      peakLabel: "300 W de sortie CC totale",
      chemistry: "LFP",
      extension: null,
      solar: { maxW: 100, minV: 11, maxV: 28, lowVoltageCurrentA: 8.2, highVoltageCurrentA: null, allowedPanelIds: ["ps60", "ps100"] },
      recharge: {
        ac: { supported: false },
        usbC: { supported: true, inputW: 280, efficiency: 0.88, fullMinutesEstimate: 90, manufacturerNote: "100 % en 90 min avec deux entrées USB-C PD 140 W" },
        alternator: { supported: false },
        car: { supported: true, inputW: 100, efficiency: 0.82, manufacturerNote: "Recharge véhicule compatible" }
      },
      specs: {
        dimensions: "124 × 120 × 200 mm",
        weight: "2,8 kg",
        outputs: "CC uniquement • 2 × USB-C bidirectionnels 140 W + USB-A + 12 V",
        ups: "—",
        solarInput: "100 W max • 11–28 V",
        rechargeHeadline: "100 % en 90 min via double USB-C PD",
        warranty: "3 ans"
      },
      tags: ["2,8 kg", "USB-C", "CC uniquement"],
      note: "Pas de sortie 230 V : les appareils nécessitant une prise secteur sont signalés comme incompatibles."
    },
    {
      id: "c1000-gen2",
      name: "Anker SOLIX C1000 Gen 2",
      shortName: "C1000 Gen 2",
      capacityWh: 1024,
      image: "assets/images/anker-solix-c1000-gen2.webp",
      useCase: "Camping, froid, Starlink et appareils du quotidien",
      outputType: "ac-dc",
      outputTypeLabel: "CA + CC",
      continuousW: 2000,
      peakW: 3000,
      motorStartupLimitW: 3000,
      peakLabel: "3 000 W en pic",
      chemistry: "LFP",
      extension: null,
      solar: { maxW: 600, minV: 11, maxV: 60, lowVoltageCurrentA: 8.2, highVoltageCurrentA: 14.5, splitV: 28 },
      recharge: {
        ac: { supported: true, fullMinutesEstimate: 49, manufacturerNote: "0 à 100 % en 49 min en mode UltraFast" },
        usbC: { supported: false },
        alternator: { supported: true, inputW: 800, efficiency: 0.84, manufacturerNote: "Compatible chargeur alternateur Anker SOLIX" },
        car: { supported: true, inputW: 120, efficiency: 0.82, manufacturerNote: "Prise véhicule 12 V / 120 W max." }
      },
      specs: {
        dimensions: "384 × 208 × 244 mm",
        weight: "11,3 kg",
        outputs: "230 V + USB-C 140 W + USB-A + 12 V",
        ups: "10 ms",
        solarInput: "600 W max • 11–60 V",
        rechargeHeadline: "100 % en 49 min en UltraFast",
        warranty: "—"
      },
      tags: ["polyvalente", "camping", "secours"]
    },
    {
      id: "c2000-gen2",
      name: "Anker SOLIX C2000 Gen 2",
      shortName: "C2000 Gen 2",
      capacityWh: 2048,
      image: "assets/images/anker-solix-c2000-gen2.webp",
      useCase: "Forte autonomie, usages exigeants et alimentation de secours",
      outputType: "ac-dc",
      outputTypeLabel: "CA + CC",
      continuousW: 2400,
      peakW: 4000,
      motorStartupLimitW: 4000,
      peakLabel: "4 000 W en pic",
      chemistry: "LFP",
      extension: { id: "bp2000-gen2", name: "Anker SOLIX BP2000 Gen 2", extraWh: 2048, maxQty: 1 },
      solar: { maxW: 800, minV: 11, maxV: 60, lowVoltageCurrentA: 8.2, highVoltageCurrentA: 17, splitV: 28 },
      recharge: {
        ac: { supported: true, fullMinutesEstimate: 63, manufacturerNote: "0 à 100 % en 1 h 03" },
        usbC: { supported: false },
        alternator: { supported: true, inputW: 800, efficiency: 0.98, manufacturerNote: "0 à 100 % en 2 h 36 avec chargeur alternateur 800 W" },
        car: { supported: true, inputW: 100, efficiency: 0.88, manufacturerNote: "Recharge sur prise véhicule" }
      },
      specs: {
        dimensions: "459 × 250 × 257 mm",
        weight: "18,9 kg",
        outputs: "230 V + 2 × USB-C 140 W + USB-C 15 W + USB-A + 12 V",
        ups: "10 ms",
        solarInput: "800 W max • 11–60 V",
        rechargeHeadline: "100 % en 1 h 03 sur secteur",
        warranty: "5 ans"
      },
      tags: ["2 kWh", "forte puissance", "extensible"]
    }
  ],
  accessories: [
    {
      id: "ps60",
      category: "Panneau solaire",
      name: "Anker SOLIX PS60",
      reference: "A24383A1",
      image: "https://cdn.shopify.com/s/files/1/0650/2773/5652/files/2438_1000x.png?v=1754454395",
      headline: "Panneau solaire portable 60 W",
      keySpecs: [
        ["Puissance", "60 W"],
        ["Sortie PV", "16 V ⎓ 3,75 A"],
        ["Protection", "IP68"],
        ["Poids", "1,77 kg"]
      ],
      details: [
        ["Dimensions plié", "232 × 266 × env. 35–64 mm"],
        ["Dimensions déplié", "1 033 × 551 × 17 mm"],
        ["Connectique", "MC4 • stations avec entrée 11–60 V"],
        ["Usage", "Très compact, randonnée, bivouac et recharge légère"]
      ],
      note: "Le PS60 est utilisable dans le simulateur solaire ; la puissance réelle dépend fortement de l’ensoleillement et de l’orientation."
    },
    {
      id: "ps200",
      category: "Panneau solaire",
      name: "Anker SOLIX PS200",
      reference: "AS320011",
      image: "https://cdn.shopify.com/s/files/1/0650/2773/5652/files/AS320_EU_1000x.png?v=1768204682",
      headline: "Panneau solaire portable bifacial 200 W",
      keySpecs: [
        ["Puissance", "200 W"],
        ["Sortie PV", "48 V ⎓ 4,16 A"],
        ["Protection", "IP68"],
        ["Poids", "4,8 kg"]
      ],
      details: [
        ["Dimensions plié", "68,5 × 79,2 × 4,5 cm"],
        ["Dimensions déplié", "137,7 × 79,2 × 1,7 cm"],
        ["Cellules", "Type N • rendement > 25 %"],
        ["Particularité", "Bifacial • jusqu’à 10 % de production additionnelle selon environnement"]
      ],
      note: "La compatibilité dépend de la fenêtre MPPT de la station et du montage ; le simulateur vérifie tension, courant et puissance."
    },
    {
      id: "bp2000-gen2",
      category: "Batterie additionnelle",
      name: "Anker SOLIX BP2000 Expansion Battery (Gen 2)",
      reference: "BP2000 Gen 2",
      image: "https://cdn.shopify.com/s/files/1/0871/5465/5556/files/A1783-US_ca85885c-6d58-44dd-b563-b87862b4efa1_3840x.png?v=1772002472",
      headline: "Batterie additionnelle dédiée à la C2000 Gen 2",
      keySpecs: [
        ["Capacité", "2 048 Wh"],
        ["Technologie", "LFP"],
        ["Cycles", "4 000 cycles à 80 %"],
        ["Poids", "15,3 kg"]
      ],
      details: [
        ["Compatibilité", "Anker SOLIX C2000 Gen 2 uniquement"],
        ["Capacité totale", "4 096 Wh avec une C2000 Gen 2"],
        ["Durée de vie annoncée", "Jusqu’à 10 ans"],
        ["Garantie", "5 ans"]
      ],
      note: "Une BP2000 Gen 2 double la capacité énergétique de la C2000 Gen 2 ; elle est intégrée comme option dans le simulateur."
    },
    {
      id: "alternator-charger",
      category: "Recharge véhicule",
      name: "Chargeur d’alternateur Anker SOLIX",
      reference: "AS2002A1",
      image: "https://cdn.shopify.com/s/files/1/0650/2773/5652/files/AS200_1000x.png?v=1772002872",
      headline: "Recharge alternateur jusqu’à 800 W",
      keySpecs: [
        ["Puissance", "800 W max"],
        ["Recharge 2 kWh", "≈ 2,6 h"],
        ["Pilotage", "Bluetooth / Wi-Fi"],
        ["Fusible fourni", "100 A"]
      ],
      details: [
        ["Vitesse", "Jusqu’à 8× plus rapide qu’une prise allume-cigare"],
        ["Modes", "Recharge station • extension camping-car • recharge batterie véhicule"],
        ["Véhicules", "Compatible avec la grande majorité des camping-cars et véhicules thermiques"],
        ["Kit", "Câbles vers station et batterie, fil fusible 100 A, visserie et documentation"]
      ],
      note: "La puissance réellement disponible dépend du véhicule, de l’alternateur, de l’état de charge et du câblage."
    }
  ],

  panels: [
    { id: "ps60", name: "Anker SOLIX PS60", watts: 60, vmp: 16, voc: 18, imp: 3.75, isc: null, c300Allowed: true },
    { id: "ps100", name: "Anker SOLIX PS100", watts: 100, vmp: 21.6, voc: 27, imp: 4.63, isc: null, c300Allowed: true },
    { id: "ps200", name: "Anker SOLIX PS200", watts: 200, vmp: 48, voc: 57.6, imp: 4.16, isc: null, c300Allowed: false },
    { id: "ps400", name: "Anker SOLIX PS400", watts: 400, vmp: 48, voc: 57.6, imp: 8.33, isc: 8.75, c300Allowed: false }
  ],

  categories: [
    { id: "all", label: "Tous" },
    { id: "camping", label: "Camping" },
    { id: "cold", label: "Froid" },
    { id: "health", label: "Santé" },
    { id: "internet", label: "Internet" },
    { id: "mobility", label: "Mobilité" },
    { id: "photo", label: "Photo / drone" },
    { id: "kitchen", label: "Cuisine" },
    { id: "tools", label: "Outils" }
  ],

  appliances: [
    { id: "fridge", category: "cold", icon: "❄", name: "Réfrigérateur", subtitle: "Compresseur domestique", mode: "runtime", nominalW: 120, startupW: 800, dutyCycle: 0.30, defaultHours: 24, quantity: 1, startupSensitive: true },
    { id: "freezer", category: "cold", icon: "▣", name: "Congélateur", subtitle: "Compresseur", mode: "runtime", nominalW: 150, startupW: 1000, dutyCycle: 0.35, defaultHours: 24, quantity: 1, startupSensitive: true },
    { id: "cooler-compressor", category: "camping", icon: "❄", name: "Glacière à compresseur", subtitle: "12/24 V ou secteur", mode: "runtime", nominalW: 50, startupW: 70, dutyCycle: 0.35, defaultHours: 24, quantity: 1, startupSensitive: false },
    { id: "cooler-thermo", category: "camping", icon: "▤", name: "Glacière thermoélectrique", subtitle: "Fonctionnement quasi continu", mode: "runtime", nominalW: 50, startupW: 50, dutyCycle: 0.95, defaultHours: 24, quantity: 1 },

    { id: "cpap-basic", category: "health", icon: "✚", name: "Appareil d’apnée du sommeil", subtitle: "PPC / CPAP • sans humidificateur", mode: "runtime", nominalW: 30, startupW: 35, dutyCycle: 1, defaultHours: 8, quantity: 1, displayUnit: "nights" },
    { id: "cpap-humid", category: "health", icon: "✚", name: "Apnée du sommeil + humidificateur", subtitle: "PPC / CPAP • usage nocturne", mode: "runtime", nominalW: 60, startupW: 70, dutyCycle: 1, defaultHours: 8, quantity: 1, displayUnit: "nights" },
    { id: "cpap-heated", category: "health", icon: "✚", name: "Apnée du sommeil + circuit chauffant", subtitle: "PPC / CPAP • humidificateur + tuyau chauffant", mode: "runtime", nominalW: 90, startupW: 100, dutyCycle: 1, defaultHours: 8, quantity: 1, displayUnit: "nights" },

    { id: "starlink-mini", category: "internet", icon: "◉", name: "Starlink Mini", subtitle: "25–40 W en moyenne", mode: "runtime", nominalW: 35, startupW: 60, dutyCycle: 1, defaultHours: 8, quantity: 1 },
    { id: "starlink-standard", category: "internet", icon: "◉", name: "Starlink Standard V4", subtitle: "75–100 W en moyenne", mode: "runtime", nominalW: 90, startupW: 150, dutyCycle: 1, defaultHours: 8, quantity: 1 },
    { id: "starlink-v5", category: "internet", icon: "◉", name: "Starlink V5 / récent", subtitle: "Profil prudent modifiable", mode: "runtime", nominalW: 100, startupW: 170, dutyCycle: 1, defaultHours: 8, quantity: 1, provisional: true },
    { id: "router", category: "internet", icon: "⌁", name: "Routeur / box 4G-5G", subtitle: "Connexion locale", mode: "runtime", nominalW: 15, startupW: 20, dutyCycle: 1, defaultHours: 12, quantity: 1 },

    { id: "led", category: "camping", icon: "✦", name: "Éclairage LED", subtitle: "Lampe ou ruban LED", mode: "runtime", nominalW: 10, startupW: 10, dutyCycle: 1, defaultHours: 5, quantity: 2 },
    { id: "fan", category: "camping", icon: "◌", name: "Ventilateur", subtitle: "Ventilateur portable", mode: "runtime", nominalW: 45, startupW: 70, dutyCycle: 1, defaultHours: 8, quantity: 1 },
    { id: "laptop", category: "camping", icon: "▰", name: "Ordinateur portable", subtitle: "Bureautique / recharge", mode: "runtime", nominalW: 60, startupW: 70, dutyCycle: 1, defaultHours: 5, quantity: 1 },
    { id: "phone", category: "camping", icon: "▯", name: "Smartphone", subtitle: "Recharge complète", mode: "charge", energyWhPerCharge: 15, chargerEfficiency: 0.88, defaultCharges: 2, quantity: 1 },
    { id: "tablet", category: "camping", icon: "▭", name: "Tablette", subtitle: "Recharge complète", mode: "charge", energyWhPerCharge: 35, chargerEfficiency: 0.88, defaultCharges: 1, quantity: 1 },

    { id: "ebike-400", category: "mobility", icon: "↗", name: "VAE 400 Wh", subtitle: "Recharge batterie", mode: "charge", energyWhPerCharge: 400, chargerEfficiency: 0.86, defaultCharges: 1, quantity: 1 },
    { id: "ebike-500", category: "mobility", icon: "↗", name: "VAE 500 Wh", subtitle: "Recharge batterie", mode: "charge", energyWhPerCharge: 500, chargerEfficiency: 0.86, defaultCharges: 1, quantity: 1 },
    { id: "ebike-750", category: "mobility", icon: "↗", name: "VAE 750 Wh", subtitle: "Grande batterie", mode: "charge", energyWhPerCharge: 750, chargerEfficiency: 0.86, defaultCharges: 1, quantity: 1 },

    { id: "drone-small", category: "photo", icon: "◇", name: "Drone compact", subtitle: "Type DJI Mini", mode: "charge", energyWhPerCharge: 20, chargerEfficiency: 0.86, defaultCharges: 3, quantity: 1 },
    { id: "drone-medium", category: "photo", icon: "◇", name: "Drone intermédiaire", subtitle: "Type DJI Air", mode: "charge", energyWhPerCharge: 60, chargerEfficiency: 0.86, defaultCharges: 2, quantity: 1 },
    { id: "drone-large", category: "photo", icon: "◇", name: "Drone grande batterie", subtitle: "Type Mavic / équivalent", mode: "charge", energyWhPerCharge: 80, chargerEfficiency: 0.86, defaultCharges: 2, quantity: 1 },
    { id: "actioncam", category: "photo", icon: "▣", name: "Caméra d'action", subtitle: "GoPro / équivalent", mode: "charge", energyWhPerCharge: 7, chargerEfficiency: 0.88, defaultCharges: 3, quantity: 1 },

    { id: "coffee", category: "kitchen", icon: "☕", name: "Machine à café", subtitle: "Capsules / expresso", mode: "runtime", nominalW: 1300, startupW: 1350, dutyCycle: 1, defaultHours: 0.08, quantity: 1 },
    { id: "kettle", category: "kitchen", icon: "◒", name: "Bouilloire", subtitle: "Chauffe rapide", mode: "runtime", nominalW: 2000, startupW: 2000, dutyCycle: 1, defaultHours: 0.10, quantity: 1 },
    { id: "microwave", category: "kitchen", icon: "▦", name: "Micro-ondes", subtitle: "Puissance absorbée", mode: "runtime", nominalW: 1200, startupW: 1500, dutyCycle: 1, defaultHours: 0.15, quantity: 1 },
    { id: "induction", category: "kitchen", icon: "◎", name: "Plaque induction", subtitle: "1 foyer", mode: "runtime", nominalW: 1800, startupW: 1800, dutyCycle: 1, defaultHours: 0.35, quantity: 1 },

    { id: "air-pump", category: "tools", icon: "↯", name: "Compresseur / gonfleur", subtitle: "Petit compresseur", mode: "runtime", nominalW: 300, startupW: 900, dutyCycle: 1, defaultHours: 0.15, quantity: 1, startupSensitive: true },
    { id: "water-pump", category: "tools", icon: "≈", name: "Pompe à eau", subtitle: "Moteur électrique", mode: "runtime", nominalW: 500, startupW: 1500, dutyCycle: 1, defaultHours: 0.4, quantity: 1, startupSensitive: true },
    { id: "power-tool", category: "tools", icon: "⚒", name: "Outil électroportatif", subtitle: "Perceuse / meuleuse légère", mode: "runtime", nominalW: 500, startupW: 1000, dutyCycle: 1, defaultHours: 0.5, quantity: 1, startupSensitive: true }
  ]
};
