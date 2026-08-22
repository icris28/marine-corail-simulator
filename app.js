(() => {
  "use strict";

  const D = window.SOLIX_DATA;
  const state = {
    step: 1,
    stationId: "c1000-gen2",
    extension: false,
    appliances: [],
    category: "all",
    applianceQuery: "",
    soc: 20,
    chargeMethods: ["ac"],
    solarPanelId: "ps200",
    solarQty: 1,
    solarCondition: "good"
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

  const getStation = (id = state.stationId) => D.stations.find(s => s.id === id);
  const getPanel = (id = state.solarPanelId) => D.panels.find(p => p.id === id);
  const isChargeSelected = id => state.chargeMethods.includes(id);
  const totalCapacityWh = (station = getStation(), extension = state.extension) => station.capacityWh + (extension && station.extension ? station.extension.extraWh : 0);
  const usableEnergyWh = (station = getStation(), extension = state.extension) => totalCapacityWh(station, extension) * D.config.acUsableEnergyFactor;

  function applianceTemplate(base) {
    return {
      uid: `${base.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      id: base.id,
      name: base.name,
      icon: base.icon || "⚡",
      subtitle: base.subtitle || "Appareil personnalisé",
      mode: base.mode || "runtime",
      nominalW: Number(base.nominalW || 0),
      startupW: Number(base.startupW || base.nominalW || 0),
      dutyCycle: Number(base.dutyCycle ?? 1),
      hours: Number(base.defaultHours ?? 1),
      charges: Number(base.defaultCharges ?? 1),
      quantity: Number(base.quantity ?? 1),
      energyWhPerCharge: Number(base.energyWhPerCharge || 0),
      chargerEfficiency: Number(base.chargerEfficiency || .88),
      startupSensitive: Boolean(base.startupSensitive),
      displayUnit: base.displayUnit || null,
      custom: Boolean(base.custom),
      provisional: Boolean(base.provisional)
    };
  }

  function renderStations() {
    const stationGrid = $("#stationGrid");
    stationGrid.innerHTML = D.stations.map(s => `
      <button class="station-card ${state.stationId === s.id ? "selected" : ""}" data-station="${s.id}" aria-pressed="${state.stationId === s.id}">
        <div class="station-media">
          <img src="${s.image}" alt="${s.name}" loading="eager" />
          <span class="station-select" aria-hidden="true">✓</span>
        </div>
        <div class="station-card-copy">
          <div class="station-title-row"><h3>${s.shortName}</h3><span class="chemistry-badge">${s.chemistry}</span></div>
          <p class="station-usecase">${s.useCase}</p>
          <div class="station-specs">
            <div class="spec-pill"><span>Capacité</span><strong>${fmt.format(s.capacityWh)} Wh</strong></div>
            <div class="spec-pill"><span>Puissance</span><strong>${fmt.format(s.continuousW)} W</strong></div>
          </div>
        </div>
      </button>
    `).join("");

    $$("[data-station]").forEach(btn => btn.addEventListener("click", () => {
      state.stationId = btn.dataset.station;
      state.extension = false;
      normalizeSolarSelection();
      renderAll();
    }));
    renderExtension();
  }

  function renderExtension() {
    const s = getStation();
    const box = $("#extensionBox");
    if (!s.extension) {
      box.classList.add("hidden");
      return;
    }
    box.classList.remove("hidden");
    box.innerHTML = `
      <div class="extension-copy">
        <div class="extension-icon">+2K</div>
        <div><h4>Ajouter la batterie ${s.extension.name}</h4><p>+ ${fmt.format(s.extension.extraWh)} Wh • capacité totale ${fmt.format(s.capacityWh + s.extension.extraWh)} Wh</p></div>
      </div>
      <label class="switch" aria-label="Ajouter la batterie d'extension"><input id="extensionToggle" type="checkbox" ${state.extension ? "checked" : ""}><span></span></label>`;
    $("#extensionToggle").addEventListener("change", e => { state.extension = e.target.checked; updateComputedUI(); });
  }

  function renderCategories() {
    $("#categoryFilters").innerHTML = D.categories.map(c => `<button class="category-btn ${state.category === c.id ? "active" : ""}" data-category="${c.id}">${c.label}</button>`).join("");
    $$("[data-category]").forEach(btn => btn.addEventListener("click", () => { state.category = btn.dataset.category; renderApplianceGrid(); renderCategories(); }));
  }

  function renderApplianceGrid() {
    const query = state.applianceQuery.trim().toLocaleLowerCase("fr");
    const list = D.appliances.filter(a => {
      const categoryOk = state.category === "all" || a.category === state.category;
      const haystack = `${a.name} ${a.subtitle || ""}`.toLocaleLowerCase("fr");
      return categoryOk && (!query || haystack.includes(query));
    });
    $("#applianceGrid").innerHTML = list.length ? list.map(a => {
      const added = state.appliances.some(x => x.id === a.id);
      return `<button class="appliance-card ${added ? "added" : ""}" data-appliance="${a.id}" aria-pressed="${added}">
        <span class="appliance-icon">${a.icon}</span>
        <h4>${a.name}${a.provisional ? " *" : ""}</h4>
        <p>${a.subtitle}</p>
        <span class="appliance-add">${added ? "✓ Ajouté" : "+ Ajouter"}</span>
      </button>`;
    }).join("") : `<div class="appliance-no-results"><span>⌕</span><strong>Aucun appareil trouvé</strong><p>Essayez un autre mot-clé ou ajoutez un appareil personnalisé.</p></div>`;
    $$("[data-appliance]").forEach(btn => btn.addEventListener("click", () => {
      const base = D.appliances.find(a => a.id === btn.dataset.appliance);
      const existing = state.appliances.find(a => a.id === base.id);
      if (existing) state.appliances = state.appliances.filter(a => a.uid !== existing.uid);
      else state.appliances.push(applianceTemplate(base));
      renderApplianceGrid();
      renderSelected();
      updateComputedUI();
    }));
  }

  function renderSelected() {
    const el = $("#selectedAppliances");
    const count = state.appliances.length;
    $("#selectedCount").textContent = count ? `${count} appareil${count > 1 ? "s" : ""} configuré${count > 1 ? "s" : ""}` : "Aucun appareil ajouté";
    if (!count) {
      el.className = "selected-list empty-state";
      el.innerHTML = `<div><div class="empty-icon">＋</div><p>Ajoutez vos appareils pour calculer votre autonomie.</p></div>`;
      return;
    }
    el.className = "selected-list";
    el.innerHTML = state.appliances.map(a => `
      <div class="selected-item" data-uid="${a.uid}">
        <div class="selected-name"><span class="appliance-icon">${a.icon}</span><div><strong>${a.name}</strong><small>${a.mode === "charge" ? `${fmt.format(a.energyWhPerCharge)} Wh / charge` : `${fmt.format(a.nominalW)} W nominal${a.startupW > a.nominalW ? ` • pic ${fmt.format(a.startupW)} W` : ""}`}</small></div></div>
        <div class="mini-field"><label>Quantité</label><input data-field="quantity" type="number" min="1" max="20" value="${a.quantity}"></div>
        <div class="mini-field usage-field"><label>${a.mode === "charge" ? "Charges / jour" : "Heures / jour"}</label><input data-field="${a.mode === "charge" ? "charges" : "hours"}" type="number" min="0.05" ${a.mode === "runtime" ? 'max="24" step="0.05"' : 'max="20" step="1"'} value="${a.mode === "charge" ? a.charges : a.hours}"></div>
        <button class="remove-btn" data-remove aria-label="Supprimer">×</button>
      </div>`).join("");

    $$(".selected-item", el).forEach(row => {
      const uid = row.dataset.uid;
      $$("input", row).forEach(input => input.addEventListener("input", () => {
        const item = state.appliances.find(a => a.uid === uid);
        item[input.dataset.field] = Math.max(0, Number(input.value));
        updateComputedUI();
      }));
      $("[data-remove]", row).addEventListener("click", () => {
        state.appliances = state.appliances.filter(a => a.uid !== uid);
        renderApplianceGrid(); renderSelected(); updateComputedUI();
      });
    });
  }

  function energyFor(a) {
    if (a.mode === "charge") return (a.energyWhPerCharge / a.chargerEfficiency) * a.charges * a.quantity;
    return a.nominalW * a.dutyCycle * a.hours * a.quantity;
  }

  function computeLoads(station = getStation()) {
    const dailyWh = state.appliances.reduce((sum, a) => sum + energyFor(a), 0);
    const runtimeLoads = state.appliances.filter(a => a.mode === "runtime");
    const continuousW = runtimeLoads.reduce((sum, a) => sum + a.nominalW * a.quantity, 0);
    let worstPeakW = continuousW;
    let worstAppliance = null;

    runtimeLoads.forEach(a => {
      if (a.startupW > a.nominalW) {
        const oneStarting = a.startupW + a.nominalW * Math.max(0, a.quantity - 1);
        const others = continuousW - (a.nominalW * a.quantity);
        const scenario = oneStarting + others;
        if (scenario > worstPeakW) { worstPeakW = scenario; worstAppliance = a; }
      }
    });

    const capacity = usableEnergyWh(station, station.id === state.stationId ? state.extension : false);
    const runtimeDays = dailyWh > 0 ? capacity / dailyWh : Infinity;
    const runtimeHours = runtimeDays * 24;
    return { dailyWh, continuousW, worstPeakW, worstAppliance, runtimeHours, capacity };
  }

  function evaluate(station = getStation(), extension = station.id === state.stationId ? state.extension : false) {
    const loads = computeLoads(station);
    const motorLimit = station.motorStartupLimitW || station.peakW;
    const peakLimit = loads.worstAppliance?.startupSensitive ? motorLimit : station.peakW;
    const continuousRatio = loads.continuousW / station.continuousW;
    const peakRatio = loads.worstPeakW / peakLimit;
    const safePeakRatio = (loads.worstPeakW * D.config.startupSafetyFactor) / peakLimit;

    let status = "good";
    let title = "Configuration adaptée";
    let message = "La station dispose d'une marge cohérente pour les appareils sélectionnés.";

    if (!state.appliances.length) {
      status = "neutral"; title = "Prêt à simuler"; message = "Ajoutez vos appareils pour obtenir une estimation.";
    } else if (continuousRatio > 1) {
      status = "bad"; title = "Puissance continue dépassée"; message = `Les appareils peuvent demander ${fmt.format(loads.continuousW)} W alors que la station fournit ${fmt.format(station.continuousW)} W en continu.`;
    } else if (peakRatio > 1) {
      status = "bad"; title = "Pic de démarrage trop élevé"; message = `${loads.worstAppliance ? loads.worstAppliance.name : "Un appareil"} peut provoquer un pic estimé à ${fmt.format(loads.worstPeakW)} W, au-delà de la marge retenue pour cette station.`;
    } else if (safePeakRatio > 1 || continuousRatio > .9 || (loads.runtimeHours < D.config.lowRuntimeHours && loads.dailyWh > 0)) {
      status = "warn"; title = "Compatible mais limite"; message = safePeakRatio > 1 ? "La configuration est proche de la limite au démarrage. Une station plus puissante offrira davantage de marge." : "La configuration fonctionne mais offre peu de marge ou une autonomie courte.";
    } else if (loads.runtimeHours >= D.config.comfortableRuntimeHours) {
      status = "good"; title = "Configuration confortable"; message = "La puissance est compatible et la réserve énergétique couvre plus d'une journée de l'usage configuré.";
    }

    return { ...loads, status, title, message, peakLimit, continuousRatio, peakRatio };
  }

  function formatRuntime(hours) {
    if (!isFinite(hours)) return "—";
    if (hours < 1) return `≈ ${Math.max(1, Math.round(hours * 60))} min`;
    if (hours < 24) {
      const h = Math.floor(hours); const m = Math.round((hours - h) * 60 / 5) * 5;
      return `≈ ${h} h${m ? ` ${m} min` : ""}`;
    }
    const days = Math.floor(hours / 24); const remH = Math.round(hours - days * 24);
    return `≈ ${days} j${remH ? ` ${remH} h` : ""}`;
  }

  function renderSummary() {
    const s = getStation();
    const r = evaluate();
    const cap = totalCapacityWh();
    const hasConfiguredUsage = state.appliances.length > 0;
    const appLayout = $(".app-layout");
    if (appLayout) appLayout.classList.toggle("summary-hidden", !hasConfiguredUsage);
    $("#summaryStation").textContent = s.shortName + (state.extension ? " + BP2000" : "");
    $("#summaryCapacity").textContent = `${fmt.format(cap)} Wh • ${fmt.format(s.continuousW)} W`;
    const summaryImg = $("#summaryStationImage");
    if (summaryImg) { summaryImg.src = s.image; summaryImg.alt = s.name; }
    $("#summaryRuntime").textContent = state.appliances.length ? formatRuntime(r.runtimeHours) : "—";
    $("#summaryRuntimeHint").textContent = state.appliances.length ? `${fmt.format(r.dailyWh)} Wh / jour configuré` : "Ajoutez des appareils";
    const chargeOptions = chargeEstimates();
    const fastestCharge = fastestChargeEstimate(chargeOptions);
    $("#summaryChargeTime").textContent = fastestCharge ? fastestCharge.label : "—";
    $("#summaryChargeHint").textContent = fastestCharge ? fastestCharge.title : "Choisissez un mode de recharge";
    $("#summaryContinuous").textContent = `${fmt.format(r.continuousW)} / ${fmt.format(s.continuousW)} W`;
    $("#summaryPeak").textContent = `${fmt.format(r.worstPeakW)} / ${fmt.format(r.peakLimit)} W`;
    setMeter($("#continuousMeter"), r.continuousRatio);
    setMeter($("#peakMeter"), r.peakRatio);
    const status = $("#summaryStatus");
    status.className = `summary-status ${r.status}`;
    status.innerHTML = `<span>●</span><div><strong>${r.title}</strong><small>${r.message}</small></div>`;

    // Sur tablette/mobile, un résumé compact remplace le grand aperçu latéral.
    const mobileBar = $("#mobileLiveBar");
    const showMobileBar = hasConfiguredUsage && state.step !== 4;
    if (mobileBar) mobileBar.classList.toggle("visible", showMobileBar);
    document.body.classList.toggle("has-mobile-summary", showMobileBar);
    const mobileStation = $("#mobileSummaryStation");
    const mobileRuntime = $("#mobileSummaryRuntime");
    const mobileStatus = $("#mobileSummaryStatus");
    if (mobileStation) mobileStation.textContent = s.shortName + (state.extension ? " + BP2000" : "");
    if (mobileRuntime) mobileRuntime.textContent = hasConfiguredUsage ? formatRuntime(r.runtimeHours) : "—";
    if (mobileStatus) {
      mobileStatus.className = `mobile-live-status ${r.status}`;
      const shortStatus = r.status === "bad" ? "Non adapté" : r.status === "warn" ? "Limite" : r.status === "good" ? "Adapté" : "Prêt";
      mobileStatus.innerHTML = `<span>●</span><b>${shortStatus}</b>`;
    }
  }

  function setMeter(el, ratio) {
    const pct = Math.min(100, Math.max(0, ratio * 100));
    el.style.width = `${pct}%`;
    el.className = ratio > 1 ? "bad" : ratio > .85 ? "warn" : "";
  }

  function compatiblePanelsForStation(station) {
    return D.panels.filter(p => station.id !== "c300" || p.c300Allowed);
  }

  function normalizeSolarSelection() {
    const station = getStation();
    const compatible = compatiblePanelsForStation(station);
    if (!compatible.some(p => p.id === state.solarPanelId)) state.solarPanelId = compatible[0].id;
    if (station.id === "c300") state.solarQty = 1;
  }

  function renderChargeMethods() {
    const s = getStation();
    const methods = [
      { id: "ac", icon: "⚡", title: "Secteur", desc: s.recharge.ac.supported ? s.recharge.ac.manufacturerNote : "Non documenté", enabled: s.recharge.ac.supported },
      { id: "solar", icon: "☀", title: "Solaire", desc: `Jusqu'à ${fmt.format(s.solar.maxW)} W d'entrée solaire`, enabled: true },
      { id: "alternator", icon: "↻", title: "Alternateur", desc: s.recharge.alternator.supported ? "Chargeur Anker SOLIX jusqu'à 800 W" : "Non prévu sur ce modèle", enabled: s.recharge.alternator.supported },
      { id: "car", icon: "▰", title: "Prise véhicule", desc: s.recharge.car.supported ? `${fmt.format(s.recharge.car.inputW)} W environ` : "Non documenté", enabled: s.recharge.car.supported }
    ];

    const enabledIds = methods.filter(m => m.enabled).map(m => m.id);
    state.chargeMethods = state.chargeMethods.filter(id => enabledIds.includes(id));
    if (!state.chargeMethods.length) state.chargeMethods = [enabledIds[0] || "ac"];

    $("#chargeMethods").innerHTML = methods.map(m => `<button class="charge-card ${isChargeSelected(m.id) ? "selected" : ""} ${!m.enabled ? "disabled" : ""}" data-charge="${m.id}" ${!m.enabled ? "disabled" : ""} aria-pressed="${isChargeSelected(m.id)}"><span class="charge-icon">${m.icon}</span><span class="check">✓</span><h4>${m.title}</h4><p>${m.desc}</p></button>`).join("");

    $$('[data-charge]').forEach(btn => btn.addEventListener("click", () => {
      const id = btn.dataset.charge;
      if (isChargeSelected(id)) {
        if (state.chargeMethods.length > 1) state.chargeMethods = state.chargeMethods.filter(x => x !== id);
      } else {
        state.chargeMethods.push(id);
      }
      renderChargeMethods();
      updateComputedUI();
    }));
    renderSolarConfigurator();
    renderLiveChargeEstimate();
  }

  function solarSetup() {
    const station = getStation();
    const panel = getPanel();
    const qty = Number(state.solarQty);
    let wiring = "direct";
    let vmp = panel.vmp;
    let voc = panel.voc;
    let imp = panel.imp;
    let compatible = true;
    let reason = "Configuration compatible.";

    if (station.id === "c300") {
      if (!panel.c300Allowed || qty !== 1) { compatible = false; reason = "La C300 est limitée aux PS60/PS100 dans une configuration simple à un panneau."; }
    } else if (qty > 1) {
      if (panel.voc * qty <= station.solar.maxV) {
        wiring = "series";
        vmp = panel.vmp * qty; voc = panel.voc * qty; imp = panel.imp;
      } else {
        wiring = "parallel";
        vmp = panel.vmp; voc = panel.voc; imp = panel.imp * qty;
      }
    }

    if (vmp < station.solar.minV || voc > station.solar.maxV) { compatible = false; reason = `Tension hors plage MPPT (${station.solar.minV}–${station.solar.maxV} V).`; }
    const currentLimit = station.solar.splitV && vmp <= station.solar.splitV ? station.solar.lowVoltageCurrentA : (station.solar.highVoltageCurrentA || station.solar.lowVoltageCurrentA);
    if (imp > currentLimit * 1.02) {
      compatible = false;
      reason = `Courant estimé ${imp.toFixed(1)} A supérieur à la limite ${currentLimit} A dans cette plage de tension.`;
    }
    const nominalW = panel.watts * qty;
    const usableInputW = compatible ? Math.min(nominalW, station.solar.maxW, vmp * currentLimit) : 0;
    const clipping = nominalW > usableInputW + 1;
    return { station, panel, qty, wiring, vmp, voc, imp, currentLimit, compatible, reason, nominalW, usableInputW, clipping };
  }

  function renderSolarConfigurator() {
    const box = $("#solarConfigurator");
    if (!isChargeSelected("solar")) { box.classList.add("hidden"); return; }
    box.classList.remove("hidden");
    normalizeSolarSelection();
    const station = getStation();
    const panels = compatiblePanelsForStation(station);
    $("#solarPanelSelect").innerHTML = panels.map(p => `<option value="${p.id}" ${p.id === state.solarPanelId ? "selected" : ""}>${p.name} — ${p.watts} W</option>`).join("");
    $("#solarQty").value = String(state.solarQty);
    $("#solarQty").disabled = station.id === "c300";
    $("#solarCondition").value = state.solarCondition;
    const setup = solarSetup();
    const badge = $("#solarCompatibilityBadge");
    badge.className = `mini-badge ${setup.compatible ? setup.clipping ? "warn" : "good" : "bad"}`;
    badge.textContent = setup.compatible ? setup.clipping ? "Compatible • puissance limitée" : "Compatible" : "Non compatible";
    $("#solarWiringNote").textContent = setup.compatible
      ? `${setup.qty} × ${setup.panel.name} : ${fmt.format(setup.nominalW)} W installés, environ ${fmt.format(setup.usableInputW)} W exploitables. ${setup.wiring === "series" ? "Montage série retenu pour rester dans l'enveloppe MPPT." : setup.wiring === "parallel" ? "Montage parallèle retenu pour respecter la tension maximale." : "Connexion directe."}${setup.clipping ? " La station limitera la puissance excédentaire." : ""}`
      : setup.reason;
  }

  function chargeEstimate(method) {
    const station = getStation();
    const remaining = (100 - state.soc) / 100;
    const needWh = totalCapacityWh() * remaining;

    if (method === "ac") {
      let mins = station.recharge.ac.fullMinutesEstimate * remaining;
      if (state.extension && station.extension) mins *= 1.85;
      return { id: "ac", title: "Secteur", icon: "⚡", hours: mins / 60, label: formatMinutes(mins), sub: station.recharge.ac.manufacturerNote + (state.extension ? " • extension : estimation calculée" : "") };
    }
    if (method === "alternator") {
      if (!station.recharge.alternator.supported) return { id: "alternator", title: "Alternateur", icon: "↻", hours: Infinity, label: "Non disponible", sub: "Mode non pris en charge" };
      const h = needWh / (station.recharge.alternator.inputW * station.recharge.alternator.efficiency);
      return { id: "alternator", title: "Alternateur", icon: "↻", hours: h, label: formatHoursCharge(h), sub: station.recharge.alternator.manufacturerNote };
    }
    if (method === "car") {
      const h = needWh / (station.recharge.car.inputW * station.recharge.car.efficiency);
      return { id: "car", title: "Prise véhicule", icon: "▰", hours: h, label: formatHoursCharge(h), sub: station.recharge.car.manufacturerNote };
    }
    if (method === "solar") {
      const setup = solarSetup();
      if (!setup.compatible || setup.usableInputW <= 0) return { id: "solar", title: "Solaire", icon: "☀", hours: Infinity, label: "Non compatible", sub: setup.reason };
      const cond = D.config.solarConditions[state.solarCondition];
      const effectiveW = setup.usableInputW * cond.productionFactor;
      const h = needWh / effectiveW;
      const dailyHarvest = setup.usableInputW * cond.productionFactor * cond.equivalentSunHours;
      return { id: "solar", title: `Solaire • ${setup.qty}× ${setup.panel.name.replace("Anker SOLIX ", "")}`, icon: "☀", hours: h, label: formatHoursCharge(h), sub: `${fmt.format(setup.usableInputW)} W utiles • ${cond.label.toLowerCase()} • ≈ ${fmt.format(dailyHarvest)} Wh/j potentiels`, dailyHarvest };
    }
    return { id: method, title: method, icon: "", hours: Infinity, label: "—", sub: "" };
  }

  function combinedAcSolarEstimate() {
    if (!isChargeSelected("ac") || !isChargeSelected("solar")) return null;
    const station = getStation();
    const solar = chargeEstimate("solar");
    if (!isFinite(solar.hours)) return null;
    const remaining = (100 - state.soc) / 100;

    if (station.id === "c2000-gen2") {
      let mins = 58 * remaining;
      if (state.extension && station.extension) mins *= 1.85;
      return { id: "ac-solar", title: "Secteur + solaire simultanés", icon: "⚡☀", hours: mins / 60, label: formatMinutes(mins), sub: "Anker annonce jusqu'à 2 600 W combinés et 100 % en 58 min sur C2000 Gen 2 • conditions réelles variables" };
    }

    if (station.id === "c1000-gen2") {
      const ac = chargeEstimate("ac");
      const needWh = totalCapacityWh() * remaining;
      const acEffectiveW = isFinite(ac.hours) && ac.hours > 0 ? needWh / ac.hours : 0;
      const solarSetupData = solarSetup();
      const cond = D.config.solarConditions[state.solarCondition];
      const solarEffectiveW = solarSetupData.usableInputW * cond.productionFactor;
      const h = needWh / Math.max(1, acEffectiveW + solarEffectiveW);
      return { id: "ac-solar", title: "Secteur + solaire simultanés", icon: "⚡☀", hours: h, label: formatHoursCharge(h), sub: "Recharge simultanée confirmée par Anker • temps combiné estimé à partir des puissances disponibles" };
    }
    return null;
  }

  function chargeEstimates() {
    const estimates = state.chargeMethods.map(chargeEstimate);
    const combined = combinedAcSolarEstimate();
    if (combined) estimates.push(combined);
    return estimates;
  }

  function fastestChargeEstimate(estimates = chargeEstimates()) {
    return estimates.filter(x => isFinite(x.hours)).sort((a,b) => a.hours - b.hours)[0] || null;
  }

  function renderLiveChargeEstimate() {
    const box = $("#liveChargeEstimate");
    if (!box) return;
    const estimates = chargeEstimates();
    const fastest = fastestChargeEstimate(estimates);
    box.innerHTML = `<div class="live-charge-head"><div><span class="section-kicker">ESTIMATION EN DIRECT</span><h3>Temps de recharge depuis ${state.soc} %</h3></div>${fastest ? `<span class="fastest-pill">Plus rapide : ${fastest.label}</span>` : ""}</div><div class="charge-time-grid">${estimates.map(e => `<div class="charge-time-card ${fastest && e.id === fastest.id ? "fastest" : ""}"><div class="charge-time-icon">${e.icon}</div><div><span>${e.title}</span><strong>${e.label}</strong><small>${e.sub}</small></div></div>`).join("")}</div>`;
  }

  function formatMinutes(mins) {
    if (mins < 60) return `≈ ${Math.max(1, Math.round(mins))} min`;
    return formatHoursCharge(mins / 60);
  }
  function formatHoursCharge(h) {
    if (!isFinite(h)) return "—";
    if (h < 1) return `≈ ${Math.max(1, Math.round(h * 60))} min`;
    if (h < 10) {
      const hours = Math.floor(h); const mins = Math.round((h - hours) * 60 / 5) * 5;
      return `≈ ${hours} h${mins ? ` ${mins} min` : ""}`;
    }
    return `≈ ${Math.round(h)} h`;
  }

  function renderResults() {
    const s = getStation();
    const r = evaluate();
    const chargeOptions = chargeEstimates();
    const charge = fastestChargeEstimate(chargeOptions) || { label: "—", sub: "Aucun mode de recharge sélectionné" };
    const hero = $("#resultsHero");
    hero.className = `results-hero ${r.status}`;
    hero.innerHTML = `<div class="result-status-line">● ${r.title}</div><div class="result-big">${state.appliances.length ? formatRuntime(r.runtimeHours) : "Ajoutez des usages"}</div><p>${r.message}</p>`;
    $("#resultEnergy").textContent = `${fmt.format(r.dailyWh)} Wh/j`;
    $("#resultContinuous").textContent = `${fmt.format(r.continuousW)} W`;
    $("#resultContinuousSub").textContent = `sur ${fmt.format(s.continuousW)} W continus disponibles`;
    $("#resultPeak").textContent = `${fmt.format(r.worstPeakW)} W`;
    $("#resultPeakSub").textContent = `limite retenue ${fmt.format(r.peakLimit)} W${r.worstAppliance ? ` • ${r.worstAppliance.name}` : ""}`;
    $("#resultCharge").textContent = charge.label;
    $("#resultChargeSub").textContent = charge.sub;

    const rec = findRecommendation();
    const recBox = $("#recommendationBox");
    if ((r.status === "bad" || r.status === "warn") && rec) {
      recBox.classList.remove("hidden");
      recBox.innerHTML = `<div><h4>Alternative technique</h4><p>Cette configuration offre davantage de marge électrique pour les usages sélectionnés :</p></div><strong>${rec.name}${rec.extension ? " + BP2000" : ""}</strong>`;
    } else recBox.classList.add("hidden");

    const solar = isChargeSelected("solar") ? solarSetup() : null;
    $("#calculationDetails").innerHTML = `
      <ul>
        <li>Capacité nominale : <b>${fmt.format(totalCapacityWh())} Wh</b>. Énergie AC exploitable retenue : <b>${fmt.format(usableEnergyWh())} Wh</b> (coefficient ${Math.round(D.config.acUsableEnergyFactor*100)} %).</li>
        <li>Consommation journalière : somme des puissances × durées × cycles de fonctionnement, avec pertes de charge intégrées pour les batteries de VAE, drones et appareils rechargeables.</li>
        <li>Puissance continue : <b>${fmt.format(r.continuousW)} W</b>. Pic de démarrage estimé : <b>${fmt.format(r.worstPeakW)} W</b>.</li>
        <li>Une marge de sécurité de <b>${Math.round((D.config.startupSafetyFactor-1)*100)} %</b> est appliquée autour des démarrages moteurs/compresseurs.</li>
        ${getStation().id === "c300" ? `<li>Pour la C300, les 600 W SurgePad ne sont pas assimilés à une capacité universelle de démarrage moteur : le contrôle compresseur reste volontairement conservateur.</li>` : ""}
        ${solar ? `<li>Solaire : ${solar.qty} × ${solar.panel.name}, ${fmt.format(solar.usableInputW)} W exploitables après limites station. Le temps varie fortement avec soleil, température, orientation et ombrage.</li>` : ""}
        ${state.appliances.some(a => a.provisional) ? `<li>* Le profil « Starlink V5 / récent » est provisoire et volontairement prudent : il doit être ajusté à la fiche exacte du terminal utilisé.</li>` : ""}
      </ul>`;
  }

  function findRecommendation() {
    if (!state.appliances.length) return null;
    const candidates = [];
    D.stations.forEach(s => {
      [false, Boolean(s.extension)].forEach(ext => {
        if (ext && !s.extension) return;
        const oldStation = state.stationId, oldExt = state.extension;
        const load = computeLoads(s);
        const motorLimit = s.motorStartupLimitW || s.peakW;
        const peakLimit = load.worstAppliance?.startupSensitive ? motorLimit : s.peakW;
        const compatible = load.continuousW <= s.continuousW && load.worstPeakW * D.config.startupSafetyFactor <= peakLimit;
        if (compatible) {
          const cap = (s.capacityWh + (ext && s.extension ? s.extension.extraWh : 0)) * D.config.acUsableEnergyFactor;
          const runtime = load.dailyWh > 0 ? cap / load.dailyWh * 24 : Infinity;
          candidates.push({ name: s.shortName, stationId: s.id, extension: ext, capacity: cap, runtime });
        }
      });
    });
    candidates.sort((a,b) => a.capacity - b.capacity);
    const current = `${state.stationId}-${state.extension}`;
    return candidates.find(c => `${c.stationId}-${c.extension}` !== current && c.runtime >= Math.min(D.config.lowRuntimeHours, Math.max(1, evaluate().runtimeHours))) || null;
  }

  function updateComputedUI() {
    renderSummary();
    if (state.step === 4) renderResults();
    if (state.step === 3) { renderSolarConfigurator(); renderLiveChargeEstimate(); }
  }

  function setStep(step) {
    state.step = Math.max(1, Math.min(4, Number(step)));
    $$(".step-panel").forEach(p => p.classList.toggle("active", Number(p.dataset.step) === state.step));
    $$(".step-tab").forEach(t => t.classList.toggle("active", Number(t.dataset.stepTarget) === state.step));
    if (state.step === 3) renderChargeMethods();
    if (state.step === 4) renderResults();
    renderSummary();
    window.scrollTo({ top: document.querySelector(".app-layout").offsetTop - 12, behavior: "smooth" });
  }

  function bindNavigation() {
    $$('[data-next]').forEach(b => b.addEventListener('click', () => setStep(state.step + 1)));
    $$('[data-prev]').forEach(b => b.addEventListener('click', () => setStep(state.step - 1)));
    $$('[data-step-target]').forEach(b => b.addEventListener('click', () => setStep(b.dataset.stepTarget)));
    $("#restartBtn").addEventListener("click", () => { state.appliances = []; state.extension = false; state.soc = 20; state.chargeMethods = ["ac"]; state.applianceQuery = ""; const search = $("#applianceSearch"); if (search) search.value = ""; renderAll(); setStep(1); });
  }

  function bindApplianceSearch() {
    const input = $("#applianceSearch");
    if (!input) return;
    input.addEventListener("input", e => {
      state.applianceQuery = e.target.value || "";
      renderApplianceGrid();
    });
  }

  function bindRechargeControls() {
    $("#socSlider").addEventListener("input", e => { state.soc = Number(e.target.value); $("#socValue").textContent = `${state.soc} %`; updateComputedUI(); });
    $("#solarPanelSelect").addEventListener("change", e => { state.solarPanelId = e.target.value; renderSolarConfigurator(); updateComputedUI(); });
    $("#solarQty").addEventListener("change", e => { state.solarQty = Number(e.target.value); renderSolarConfigurator(); updateComputedUI(); });
    $("#solarCondition").addEventListener("change", e => { state.solarCondition = e.target.value; renderSolarConfigurator(); updateComputedUI(); });
  }

  function bindCustomDialog() {
    const dialog = $("#customDialog");
    $("#addCustomBtn").addEventListener("click", () => dialog.showModal());
    $("#customMotor").addEventListener("change", e => {
      if (e.target.checked && Number($("#customStartup").value) <= Number($("#customPower").value)) $("#customStartup").value = Number($("#customPower").value) * 3;
    });
    $("#customPower").addEventListener("input", e => {
      if (!$("#customMotor").checked) $("#customStartup").value = e.target.value;
    });
    $("#customSubmit").addEventListener("click", e => {
      e.preventDefault();
      const name = $("#customName").value.trim();
      const power = Number($("#customPower").value);
      if (!name || !power) return;
      state.appliances.push(applianceTemplate({
        id: `custom-${Date.now()}`, name, icon: "⚡", subtitle: "Appareil personnalisé", custom: true,
        nominalW: power, startupW: Number($("#customStartup").value || power), defaultHours: Number($("#customHours").value || 1),
        quantity: Number($("#customQty").value || 1), dutyCycle: 1, startupSensitive: $("#customMotor").checked
      }));
      dialog.close();
      $("#customForm").reset(); $("#customPower").value = 100; $("#customStartup").value = 100; $("#customHours").value = 2; $("#customQty").value = 1;
      renderSelected(); updateComputedUI();
    });
  }

  function renderAll() {
    renderStations();
    renderCategories();
    renderApplianceGrid();
    renderSelected();
    renderChargeMethods();
    renderSummary();
  }

  function notifyParentHeight() {
    if (window.parent === window) return;
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    window.parent.postMessage({ type: "mc-solix-height", height }, "*");
  }

  if ("ResizeObserver" in window) {
    let resizeTimer;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(notifyParentHeight, 80);
    });
    ro.observe(document.body);
  }
  window.addEventListener("load", notifyParentHeight);
  window.addEventListener("resize", notifyParentHeight);

  renderAll();
  bindNavigation();
  bindApplianceSearch();
  bindRechargeControls();
  bindCustomDialog();
})();
