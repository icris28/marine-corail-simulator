(() => {
  "use strict";

  const path = location.pathname.toLowerCase();
  const params = new URLSearchParams(location.search);
  const requestedMode = params.get("mode") || document.body?.dataset.runMode;
  const mode = requestedMode === "kiosk" || path.endsWith("/kiosk.html")
    ? "kiosk"
    : requestedMode === "app" || path.endsWith("/app.html")
      ? "app"
      : "normal";

  const IDLE_MS = 5 * 60 * 1000;
  const WARNING_MS = 30 * 1000;
  let warningTimer = null;
  let resetTimer = null;
  let countdownTimer = null;
  let warningEndsAt = 0;
  let deferredInstallPrompt = null;
  let wakeLock = null;

  document.body.dataset.runMode = mode;
  document.body.classList.add(`run-mode-${mode}`);

  function $(selector) { return document.querySelector(selector); }

  function resetSimulator() {
    hideIdleWarning();
    if (window.MCSolix?.reset) {
      window.MCSolix.reset({ smooth: false });
    } else {
      location.href = mode === "normal" ? "./index.html" : `./${mode}.html`;
    }
    showToast("Simulateur remis à zéro");
    scheduleIdleReset();
  }

  function showToast(message) {
    let toast = $("#modeToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "modeToast";
      toast.className = "mode-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function createModeControls() {
    if (mode === "normal") return;
    const bar = document.createElement("div");
    bar.className = "mode-controls";
    bar.innerHTML = `
      <span class="mode-label">${mode === "kiosk" ? "Mode borne" : "Mode application"}</span>
      <button type="button" class="mode-control-btn" id="modeResetBtn" title="Remettre le simulateur à zéro">↻ <span>Réinitialiser</span></button>
      <button type="button" class="mode-control-btn" id="modeFullscreenBtn" title="Activer ou quitter le plein écran">⛶ <span>Plein écran</span></button>
      ${mode === "app" ? '<button type="button" class="mode-control-btn install-btn hidden" id="modeInstallBtn">＋ <span>Installer</span></button>' : ""}
    `;
    document.body.appendChild(bar);

    $("#modeResetBtn")?.addEventListener("click", resetSimulator);
    $("#modeFullscreenBtn")?.addEventListener("click", toggleFullscreen);
    $("#modeInstallBtn")?.addEventListener("click", installApp);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.({ navigationUI: "hide" });
      } else {
        await document.exitFullscreen?.();
      }
    } catch (_) {
      showToast("Le plein écran doit être autorisé par le navigateur");
    }
  }

  function createIdleWarning() {
    const overlay = document.createElement("div");
    overlay.id = "idleWarning";
    overlay.className = "idle-warning hidden";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "idleWarningTitle");
    overlay.innerHTML = `
      <div class="idle-warning-card">
        <div class="idle-warning-icon">↻</div>
        <h2 id="idleWarningTitle">Toujours en cours d’utilisation ?</h2>
        <p>Le simulateur va être remis à zéro pour protéger la configuration précédente.</p>
        <strong id="idleCountdown">30 s</strong>
        <button type="button" class="btn primary" id="idleContinueBtn">Continuer</button>
      </div>
    `;
    document.body.appendChild(overlay);
    $("#idleContinueBtn").addEventListener("click", () => {
      hideIdleWarning();
      scheduleIdleReset();
    });
  }

  function showIdleWarning() {
    const overlay = $("#idleWarning");
    if (!overlay) return;
    warningEndsAt = Date.now() + WARNING_MS;
    overlay.classList.remove("hidden");
    updateCountdown();
    clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCountdown, 250);
  }

  function updateCountdown() {
    const counter = $("#idleCountdown");
    if (!counter) return;
    const seconds = Math.max(0, Math.ceil((warningEndsAt - Date.now()) / 1000));
    counter.textContent = `${seconds} s`;
  }

  function hideIdleWarning() {
    $("#idleWarning")?.classList.add("hidden");
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  function scheduleIdleReset() {
    if (mode === "normal") return;
    clearTimeout(warningTimer);
    clearTimeout(resetTimer);
    hideIdleWarning();
    warningTimer = setTimeout(showIdleWarning, IDLE_MS - WARNING_MS);
    resetTimer = setTimeout(resetSimulator, IDLE_MS);
  }

  function bindActivityTracking() {
    if (mode === "normal") return;
    let lastActivity = 0;
    const activity = () => {
      const now = Date.now();
      if (now - lastActivity < 800) return;
      lastActivity = now;
      scheduleIdleReset();
    };
    ["pointerdown", "touchstart", "keydown", "input", "change", "wheel"].forEach(eventName => {
      document.addEventListener(eventName, activity, { passive: true, capture: true });
    });
  }

  async function requestWakeLock() {
    if (mode === "normal" || !("wakeLock" in navigator) || document.visibilityState !== "visible") return;
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => { wakeLock = null; });
    } catch (_) {
      wakeLock = null;
    }
  }

  async function installApp() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      $("#modeInstallBtn")?.classList.add("hidden");
      return;
    }
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    showToast(isIOS ? "Safari : Partager → Sur l’écran d’accueil" : "Utilisez le menu du navigateur → Installer l’application");
  }

  function bindInstallPrompt() {
    if (mode !== "app") return;
    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      deferredInstallPrompt = event;
      $("#modeInstallBtn")?.classList.remove("hidden");
    });
    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      $("#modeInstallBtn")?.classList.add("hidden");
      showToast("Application installée");
    });
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches || navigator.standalone;
    if (!isStandalone) $("#modeInstallBtn")?.classList.remove("hidden");
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  function init() {
    createModeControls();
    if (mode !== "normal") {
      createIdleWarning();
      bindActivityTracking();
      scheduleIdleReset();
      requestWakeLock();
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          requestWakeLock();
          scheduleIdleReset();
        }
      });
    }
    bindInstallPrompt();
    registerServiceWorker();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
