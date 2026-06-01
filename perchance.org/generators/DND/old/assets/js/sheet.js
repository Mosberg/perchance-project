// Moved from inline <script> in v8.html
// Map Perchance plugins to root globals for the standalone HTML environment
var root = window.root || window; // Fallback for testing outside Perchance env

const ABILITIES = [
  { key: "str", name: "Strength" },
  { key: "dex", name: "Dexterity" },
  { key: "con", name: "Constitution" },
  { key: "int", name: "Intelligence" },
  { key: "wis", name: "Wisdom" },
  { key: "cha", name: "Charisma" },
];

const SKILLS = [
  { key: "acrobatics", name: "Acrobatics", ability: "dex" },
  { key: "animalHandling", name: "Animal Handling", ability: "wis" },
  { key: "arcana", name: "Arcana", ability: "int" },
  { key: "athletics", name: "Athletics", ability: "str" },
  { key: "deception", name: "Deception", ability: "cha" },
  { key: "history", name: "History", ability: "int" },
  { key: "insight", name: "Insight", ability: "wis" },
  { key: "intimidation", name: "Intimidation", ability: "cha" },
  { key: "investigation", name: "Investigation", ability: "int" },
  { key: "medicine", name: "Medicine", ability: "wis" },
  { key: "nature", name: "Nature", ability: "int" },
  { key: "perception", name: "Perception", ability: "wis" },
  { key: "performance", name: "Performance", ability: "cha" },
  { key: "persuasion", name: "Persuasion", ability: "cha" },
  { key: "religion", name: "Religion", ability: "int" },
  { key: "sleightOfHand", name: "Sleight of Hand", ability: "dex" },
  { key: "stealth", name: "Stealth", ability: "dex" },
  { key: "survival", name: "Survival", ability: "wis" },
];

const REPEATER_KEYS = ["attacks", "items", "spells", "feats"];

// --- Helpers ---
function abilityMod(score) {
  let parsed = parseInt(score, 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.floor((parsed - 10) / 2);
}

function formatMod(value) {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function num(id, fallback = 0) {
  let el = document.getElementById(id);
  if (!el) return fallback;
  let value = parseFloat(el.value);
  return Number.isFinite(value) ? value : fallback;
}

function setValue(id, value) {
  let el = document.getElementById(id);
  if (!el) return;
  el.value = value;
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollStat() {
  let rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
  return rolls[0] + rolls[1] + rolls[2];
}

function escapeHtml(unsafe) {
  return ("" + unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// --- Build UI ---
function buildSkillsAndSaves() {
  let skillsList = document.getElementById("skillsList");
  let savesList = document.getElementById("savingThrowsList");

  skillsList.innerHTML = SKILLS.map((skill) => `
    <label class="list-row skill-row" data-skill-name="${skill.name.toLowerCase()}">
      <input type="checkbox" class="form-check-input skill-prof autosync" id="prof_${skill.key}" data-skill="${skill.key}" data-ability="${skill.ability}" title="Proficient" />
      <input type="checkbox" class="form-check-input autosync" id="exp_${skill.key}" data-expertise="${skill.key}" title="Expertise" />
      <div>
        <div>${skill.name}</div>
        <small>${skill.ability.toUpperCase()}</small>
      </div>
      <div class="score-badge" id="skill-${skill.key}">+0</div>
    </label>
  `).join("");

  savesList.innerHTML = ABILITIES.map((ab) => `
    <label class="list-row">
      <input type="checkbox" class="form-check-input save-prof autosync" id="saveProf_${ab.key}" data-ability="${ab.key}" title="Proficient" />
      <input type="checkbox" class="form-check-input autosync" id="saveExp_${ab.key}" data-save-expertise="${ab.key}" title="Expertise" />
      <div>
        <div>${ab.name}</div>
        <small>${ab.key.toUpperCase()} save</small>
      </div>
      <div class="score-badge" id="save-${ab.key}">+0</div>
    </label>
  `).join("");
}

function buildSlotsTable() {
  let tbody = document.getElementById("slotsTableBody");
  tbody.innerHTML = "";
  for (let lvl = 1; lvl <= 9; lvl += 1) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${lvl}</td>
      <td><input type="number" min="0" class="form-control autosync" id="slotCur${lvl}" value="0" /></td>
      <td><input type="number" min="0" class="form-control autosync" id="slotMax${lvl}" value="0" /></td>
    `;
    tbody.appendChild(tr);
  }
}

function createRowInput(label, field, value = "", type = "text", min = "") {
  return `
    <div class="field mb-0">
      <label>${label}</label>
      <input type="${type}" ${min !== "" ? `min="${min}"` : ""} class="form-control autosync" data-field="${field}" value="${String(value).replace(/"/g, "&quot;")}" />
    </div>
  `;
}

function createRepeaterRow(kind, data = {}) {
  let row = document.createElement("div");
  row.className = "repeat-row";

  if (kind === "attacks") {
    row.innerHTML = `
      <div class="repeat-grid-attack">
        ${createRowInput("Name", "name", data.name || "")}
        ${createRowInput("Bonus", "bonus", data.bonus || "")}
        ${createRowInput("Damage", "damage", data.damage || "")}
        ${createRowInput("Type", "type", data.type || "")}
        <button type="button" class="btn-sheet btn-danger" data-remove-row="attacks">Remove</button>
      </div>
      <div class="field mb-0">
        <label>Notes</label>
        <textarea class="form-control autosync" data-field="notes">${data.notes || ""}</textarea>
      </div>
    `;
  }

  if (kind === "items") {
    row.innerHTML = `
      <div class="repeat-grid-item">
        ${createRowInput("Item", "name", data.name || "")}
        ${createRowInput("Qty", "qty", data.qty ?? 1, "number", 0)}
        ${createRowInput("Wt Each", "weight", data.weight ?? 0, "number", 0)}
        ${createRowInput("Cost", "cost", data.cost || "")}
        <div class="field mb-0">
          <label>Total Wt</label>
          <input type="text" class="form-control" data-field="total" value="0" readonly />
        </div>
        <button type="button" class="btn-sheet btn-danger" data-remove-row="items">Remove</button>
      </div>
      <div class="field mb-0">
        <label>Description</label>
        <textarea class="form-control autosync" data-field="notes">${data.notes || ""}</textarea>
      </div>
    `;
  }

  if (kind === "spells") {
    row.innerHTML = `
      <div class="repeat-grid-spell">
        ${createRowInput("Lvl", "level", data.level ?? 0, "number", 0)}
        ${createRowInput("Spell Name", "name", data.name || "")}
        ${createRowInput("School", "school", data.school || "")}
        ${createRowInput("Cast Time", "castTime", data.castTime || "")}
        ${createRowInput("Range", "range", data.range || "")}
        ${createRowInput("Components", "components", data.components || "")}
        ${createRowInput("Duration", "duration", data.duration || "")}
        <button type="button" class="btn-sheet btn-danger" data-remove-row="spells">Remove</button>
      </div>
      <div class="repeat-flags">
        <label><input type="checkbox" class="form-check-input autosync" data-field="prepared" ${data.prepared ? "checked" : ""} /> Prepared</label>
        <label><input type="checkbox" class="form-check-input autosync" data-field="ritual" ${data.ritual ? "checked" : ""} /> Ritual</label>
        <label><input type="checkbox" class="form-check-input autosync" data-field="concentration" ${data.concentration ? "checked" : ""} /> Concentration</label>
      </div>
      <div class="field mb-0">
        <label>Description / Notes</label>
        <textarea class="form-control autosync" data-field="notes">${data.notes || ""}</textarea>
      </div>
    `;
  }

  if (kind === "feats") {
    row.innerHTML = `
      <div class="repeat-grid-feat">
        ${createRowInput("Name", "name", data.name || "")}
        ${createRowInput("Source", "source", data.source || "")}
        ${createRowInput("Summary", "summary", data.summary || "")}
        <button type="button" class="btn-sheet btn-danger" data-remove-row="feats">Remove</button>
      </div>
      <div class="field mb-0">
        <label>Details</label>
        <textarea class="form-control autosync" data-field="notes">${data.notes || ""}</textarea>
      </div>
    `;
  }

  return row;
}

function addRepeaterRow(kind, data = {}) {
  let target = document.getElementById(`${kind}Repeater`);
  if (!target) return;
  target.appendChild(createRepeaterRow(kind, data));
}

function serializeRepeater(kind) {
  let host = document.getElementById(`${kind}Repeater`);
  if (!host) return [];
  return Array.from(host.children).map((row) => {
    let obj = {};
    row.querySelectorAll("[data-field]").forEach((el) => {
      let key = el.dataset.field;
      if (el.type === "checkbox") obj[key] = el.checked;
      else obj[key] = el.value;
    });
    return obj;
  });
}

function hydrateRepeater(kind, rows) {
  let host = document.getElementById(`${kind}Repeater`);
  if (!host) return;
  host.innerHTML = "";
  let source = Array.isArray(rows) && rows.length ? rows : [{}];
  source.forEach((item) => addRepeaterRow(kind, item));
}

// Settings helpers
function getSettings() {
  return {
    theme: document.documentElement.dataset.theme || "dark",
    parchment: document.documentElement.dataset.parchment || "off",
    autoSave: !!document.getElementById("settingAutoSave")?.checked,
    autoPreset: !!document.getElementById("settingAutoPreset")?.checked,
    compactRepeaters: !!document.getElementById("settingCompactRepeaters")?.checked,
    weightUnits: document.getElementById("settingWeightUnits")?.value || "lb",
    casterType: document.getElementById("casterType")?.value || "full",
    casterLevel: parseInt(document.getElementById("casterLevel")?.value, 10) || 1,
  };
}

function applySettings(settings = {}) {
  if (!settings) return;
  if (settings.theme) document.documentElement.dataset.theme = settings.theme;
  if (settings.parchment) document.documentElement.dataset.parchment = settings.parchment;
  if (typeof settings.autoSave !== "undefined" && document.getElementById("settingAutoSave"))
    document.getElementById("settingAutoSave").checked = !!settings.autoSave;
  if (typeof settings.autoPreset !== "undefined" && document.getElementById("settingAutoPreset"))
    document.getElementById("settingAutoPreset").checked = !!settings.autoPreset;
  if (typeof settings.compactRepeaters !== "undefined" && document.getElementById("settingCompactRepeaters")) {
    document.getElementById("settingCompactRepeaters").checked = !!settings.compactRepeaters;
    document.documentElement.classList.toggle("compact-repeaters", !!settings.compactRepeaters);
  }
  if (settings.weightUnits && document.getElementById("settingWeightUnits")) document.getElementById("settingWeightUnits").value = settings.weightUnits;
  if (settings.casterType && document.getElementById("casterType")) document.getElementById("casterType").value = settings.casterType;
  if (settings.casterLevel && document.getElementById("casterLevel")) document.getElementById("casterLevel").value = settings.casterLevel;
}

async function saveSettings() {
  const s = getSettings();
  if (root.kv) {
    try {
      await root.kv.dnd5eSettings.set("ui", s);
      document.getElementById("saveStatus").textContent = "Settings saved";
      setTimeout(() => (document.getElementById("saveStatus").textContent = ""), 1500);
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem("dnd5eSettings", JSON.stringify(s));
    document.getElementById("saveStatus").textContent = "Settings saved locally";
    setTimeout(() => (document.getElementById("saveStatus").textContent = ""), 1500);
  }
}

async function loadSettingsFromStorage() {
  try {
    if (root.kv) {
      let settings = await root.kv.dnd5eSettings.get("ui");
      if (settings) applySettings(settings);
    } else {
      let stored = localStorage.getItem("dnd5eSettings");
      if (stored) applySettings(JSON.parse(stored));
    }
  } catch (e) {
    console.error("Load settings failed", e);
  }
}

// --- Sheet cloud helpers ---
async function saveSheetToCloud() {
  const data = collectSheetData();
  if (root.kv) {
    try {
      await root.kv.dnd5eSheet.set("current", data);
      document.getElementById("saveStatus").textContent = "Sheet saved to Cloud";
    } catch (e) {
      console.error("Save sheet failed", e);
      document.getElementById("saveStatus").textContent = "Sheet save failed";
    }
  } else {
    localStorage.setItem("dnd5eSheet", JSON.stringify(data));
    document.getElementById("saveStatus").textContent = "Sheet saved locally";
  }
  setTimeout(() => (document.getElementById("saveStatus").textContent = ""), 1500);
}

async function loadSheetFromCloud() {
  try {
    let data;
    if (root.kv) {
      data = await root.kv.dnd5eSheet.get("current");
    } else {
      let stored = localStorage.getItem("dnd5eSheet");
      if (stored) data = JSON.parse(stored);
    }
    if (data) applySheetData(data);
    else alert("No sheet found in storage");
  } catch (e) {
    console.error("Load sheet failed", e);
    alert("Failed to load sheet");
  }
}

function collectSheetData() {
  let data = {};
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    if (!el.id) return;
    if (el.type === "checkbox") data[el.id] = el.checked;
    else data[el.id] = el.value;
  });
  data.repeaters = {
    attacks: serializeRepeater("attacks"),
    items: serializeRepeater("items"),
    spells: serializeRepeater("spells"),
    feats: serializeRepeater("feats"),
  };
  let portraitSrc = document.getElementById("portraitImg").src;
  if (portraitSrc && portraitSrc !== window.location.href) data.portraitUrl = portraitSrc;
  data.settings = getSettings();
  return data;
}

function applySheetData(data) {
  Object.entries(data || {}).forEach(([id, value]) => {
    if (id === "repeaters" || id === "portraitUrl" || id === "settings") return;
    let el = document.getElementById(id);
    if (!el) return;
    if (el.type === "checkbox") el.checked = !!value;
    else el.value = value;
  });

  if (data.portraitUrl) {
    let img = document.getElementById("portraitImg");
    img.src = data.portraitUrl;
    img.style.display = "block";
    document.getElementById("portraitPlaceholder").style.display = "none";
  }

  if (data.settings) applySettings(data.settings);

  let repeaters = data?.repeaters || {};
  REPEATER_KEYS.forEach((key) => hydrateRepeater(key, repeaters[key]));

  syncPillsFromHiddenFields();
  recalc();
}

let saveTimeout;
async function saveToKV() {
  clearTimeout(saveTimeout);
  document.getElementById("saveStatus").textContent = "Saving...";

  saveTimeout = setTimeout(async () => {
    try {
      let data = collectSheetData();
      if (root.kv) {
        await root.kv.dnd5eSheet.set("current", data);
        document.getElementById("saveStatus").textContent = "Saved to Cloud";
      } else {
        localStorage.setItem("dnd5eSheet", JSON.stringify(data));
        document.getElementById("saveStatus").textContent = "Saved Locally";
      }
      setTimeout(() => { document.getElementById("saveStatus").textContent = ""; }, 2000);
    } catch (err) {
      console.error("Save failed", err);
      document.getElementById("saveStatus").textContent = "Save Failed";
    }
  }, 1000);
}

async function loadFromKV() {
  try {
    let data;
    if (root.kv) {
      data = await root.kv.dnd5eSheet.get("current");
    } else {
      let stored = localStorage.getItem("dnd5eSheet");
      if (stored) data = JSON.parse(stored);
    }

    if (data) {
      applySheetData(data);
      await loadSettingsFromStorage();
    } else {
      clearSheet();
    }
  } catch (err) {
    console.error("Load failed", err);
    clearSheet();
  }
}

function recalc() {
  let prof = Math.max(0, Math.floor(num("profBonus", 0)));
  let jack = document.getElementById("jackOfAllTrades")?.checked;
  let halfProf = Math.floor(prof / 2);
  let mods = {};

  ABILITIES.forEach((ab) => {
    let score = num(`${ab.key}Score`, 10);
    let mod = abilityMod(score);
    mods[ab.key] = mod;
    let out = document.getElementById(`mod-${ab.key}`);
    if (out) out.textContent = formatMod(mod);
  });

  ABILITIES.forEach((ab) => {
    let proficient = document.getElementById(`saveProf_${ab.key}`)?.checked;
    let expertise = document.getElementById(`saveExp_${ab.key}`)?.checked;
    let bonus = mods[ab.key] || 0;
    if (proficient) bonus += prof * (expertise ? 2 : 1);
    let out = document.getElementById(`save-${ab.key}`);
    if (out) out.textContent = formatMod(bonus);
  });

  SKILLS.forEach((skill) => {
    let proficient = document.getElementById(`prof_${skill.key}`)?.checked;
    let expertise = document.getElementById(`exp_${skill.key}`)?.checked;
    let bonus = mods[skill.ability] || 0;
    if (proficient) bonus += prof * (expertise ? 2 : 1);
    else if (jack) bonus += halfProf;
    let out = document.getElementById(`skill-${skill.key}`);
    if (out) out.textContent = formatMod(bonus);
  });

  let perceptionBonus = parseInt(document.getElementById("skill-perception")?.textContent, 10) || 0;
  document.getElementById("passivePerception").textContent = 10 + perceptionBonus;

  let spellAbility = document.getElementById("spellcastingAbility")?.value || "none";
  let spellMod = spellAbility === "none" ? 0 : mods[spellAbility] || 0;
  document.getElementById("spellSaveDc").textContent = 8 + prof + spellMod;

  let initiative = mods.dex || 0;
  if (jack) initiative += halfProf;
  document.getElementById("initiativeDerived").textContent = formatMod(initiative);

  let carry = Math.max(0, num("strScore", 10) * 15);
  document.getElementById("carryCapacity").textContent = `${carry} lb`;

  updateHpBar();
  updateItemWeights(carry);
  updateSpellbookSummary(spellMod);

  if (document.getElementById("settingAutoSave")?.checked) saveToKV();
}

function updateHpBar() {
  let max = Math.max(1, num("hpMax", 1));
  let current = num("hpCurrent", max);
  current = Math.min(max, Math.max(0, current));
  setValue("hpCurrent", current);

  let temp = Math.max(0, num("hpTemp", 0));
  let pct = Math.max(0, Math.min(100, (current / max) * 100));
  document.getElementById("hpFill").style.width = `${pct}%`;
  document.getElementById("hpSummary").textContent = `${current} / ${max} HP${temp ? ` (+${temp} temp)` : ""}`;
}

function updateItemWeights(carryCapacity) {
  let sum = 0;
  document.querySelectorAll("#itemsRepeater .repeat-row").forEach((row) => {
    let qty = Math.max(0, parseFloat(row.querySelector('[data-field="qty"]')?.value) || 0);
    let wt = Math.max(0, parseFloat(row.querySelector('[data-field="weight"]')?.value) || 0);
    let total = qty * wt;
    let out = row.querySelector('[data-field="total"]');
    if (out) out.value = `${total.toFixed(2).replace(/\.00$/, "")} lb`;
    sum += total;
  });

  let totalText = `${sum.toFixed(2).replace(/\.00$/, "")} lb`;
  document.getElementById("inventoryWeightTotal").textContent = totalText;

  let state = "light";
  if (sum > carryCapacity) state = "overburdened";
  else if (sum > carryCapacity * 0.66) state = "heavy";

  document.getElementById("inventoryWeightSummary").textContent = `${totalText} (${state})`;
}

function updateSpellbookSummary(spellMod) {
  let prepared = 0;
  document.querySelectorAll('#spellsRepeater [data-field="prepared"]').forEach((cb) => { if (cb.checked) prepared += 1; });

  let level = Math.max(1, Math.floor(num("level", 1)));
  let bonus = Math.floor(num("preparedBonus", 0));
  let limit = Math.max(0, level + spellMod + bonus);
  document.getElementById("preparedCount").textContent = `${prepared} / ${limit}`;

  let curTotal = 0;
  let maxTotal = 0;
  for (let lvl = 1; lvl <= 9; lvl += 1) {
    curTotal += Math.max(0, Math.floor(num(`slotCur${lvl}`, 0)));
    maxTotal += Math.max(0, Math.floor(num(`slotMax${lvl}`, 0)));
  }
  document.getElementById("slotSummary").textContent = `${curTotal} / ${maxTotal}`;
}

function exportJson() {
  let data = collectSheetData();
  let blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = `${data.charName || "character"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importJsonFile(file) {
  let reader = new FileReader();
  reader.onload = (e) => {
    try {
      let data = JSON.parse(e.target.result);
      applySheetData(data);
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

function randomizeSheet() {
  setValue("charName", rand(TABLES.names));
  setValue("race", rand(TABLES.races));
  let cls = rand(TABLES.classes);
  setValue("classLevel", `${cls} 1`);
  setValue("background", rand(TABLES.backgrounds));
  setValue("alignment", rand(TABLES.alignments));
  setValue("level", 1);

  ["str", "dex", "con", "int", "wis", "cha"].forEach((ab) => setValue(`${ab}Score`, rollStat()));

  document.querySelectorAll(".save-prof, .skill-prof").forEach((cb) => { cb.checked = Math.random() < 0.3; });
  document.querySelectorAll('[id^="exp_"], [id^="saveExp_"]').forEach((cb) => { cb.checked = Math.random() < 0.1; });

  recalc();
}

// UI helpers
function logOut(text) {
  const o = document.getElementById("aiOutput");
  if (!o) return;
  const p = document.createElement("div");
  p.style.padding = "6px 8px";
  p.style.borderBottom = "1px solid rgba(255,255,255,0.03)";
  p.innerHTML = text;
  o.prepend(p);
}

function syncPillsFromHiddenFields(reset = false) {
  document.querySelectorAll(".toggle-pill").forEach((btn) => {
    let target = document.getElementById(btn.dataset.target);
    if (!target) return;
    if (reset) target.value = "false";
    btn.classList.toggle("active", target.value === "true");
  });
}

function setupPills() {
  document.querySelectorAll(".toggle-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      let target = document.getElementById(btn.dataset.target);
      if (!target) return;
      let next = !(target.value === "true");
      target.value = String(next);
      btn.classList.toggle("active", next);
      recalc();
    });
  });
}

function setupHpButtons() {
  document.querySelectorAll("[data-hp-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      let delta = parseInt(btn.dataset.hpAction, 10) || 0;
      let max = Math.max(1, num("hpMax", 1));
      let current = Math.max(0, Math.min(max, num("hpCurrent", max) + delta));
      setValue("hpCurrent", current);
      recalc();
    });
  });
}

function activateTab(tabId, pushHash = true) {
  let panel = document.getElementById(tabId);
  if (!panel) return;

  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === tabId));

  if (pushHash && location.hash !== `#${tabId}`) {
    location.hash = tabId;
  }
}

function setupTabsHashPersistence() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab, true));
  });

  let fromHash = location.hash.replace("#", "");
  if (fromHash && document.getElementById(fromHash)?.classList.contains("tab-panel")) {
    activateTab(fromHash, false);
  } else {
    activateTab("tab-skills", true);
  }

  window.addEventListener("hashchange", () => {
    let key = location.hash.replace("#", "");
    if (document.getElementById(key)?.classList.contains("tab-panel")) {
      activateTab(key, false);
    }
  });
}

function setupSkillFilter() {
  document.getElementById("skillSearch").addEventListener("input", (e) => {
    let query = e.target.value.trim().toLowerCase();
    document.querySelectorAll(".skill-row").forEach((row) => {
      row.style.display = row.dataset.skillName.includes(query) ? "" : "none";
    });
  });
}

function setupTheme() {
  let rootEl = document.documentElement;

  document.getElementById("themeToggle").addEventListener("click", () => {
    rootEl.dataset.theme = rootEl.dataset.theme === "light" ? "dark" : "light";
    saveSettings();
  });

  document.getElementById("parchmentToggle").addEventListener("click", () => {
    rootEl.dataset.parchment = rootEl.dataset.parchment === "on" ? "off" : "on";
    saveSettings();
  });

  document.getElementById("printBtn").addEventListener("click", () => { window.print(); });
}

async function saveSettingsBtnHandler() { await saveSettings(); }

function setupImportExport() {
  document.getElementById("exportJsonBtn").addEventListener("click", exportJson);
  document.getElementById("importJsonBtn").addEventListener("click", () => { document.getElementById("importJsonFile").click(); });
  document.getElementById("importJsonFile").addEventListener("change", function () { if (this.files && this.files[0]) importJsonFile(this.files[0]); this.value = ""; });
}

function setupRepeaters() {
  document.getElementById("addAttackBtn").addEventListener("click", () => addRepeaterRow("attacks", {}));
  document.getElementById("addItemBtn").addEventListener("click", () => addRepeaterRow("items", { qty: 1, weight: 0 }));
  document.getElementById("addSpellBtn").addEventListener("click", () => addRepeaterRow("spells", { level: 0 }));
  document.getElementById("addFeatBtn").addEventListener("click", () => addRepeaterRow("feats", {}));

  document.addEventListener("click", (e) => {
    let btn = e.target.closest("[data-remove-row]");
    if (!btn) return;
    let row = btn.closest(".repeat-row");
    let kind = btn.dataset.removeRow;
    row?.remove();
    if (!document.querySelector(`#${kind}Repeater .repeat-row`)) {
      addRepeaterRow(kind, {});
    }
    recalc();
  });
}

function setupMobileCollapsibles() {
  document.querySelectorAll(".panel-collapse-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      let panel = document.getElementById(btn.dataset.collapse);
      let body = panel?.querySelector(".panel-body");
      if (!body) return;
      body.classList.toggle("is-collapsed");
      btn.textContent = body.classList.contains("is-collapsed") ? "Expand" : "Collapse";
    });
  });
}

function setupGeneralRecalc() {
  document.addEventListener("input", (e) => { if (e.target.matches("input, textarea, select")) recalc(); });
  document.addEventListener("change", (e) => { if (e.target.matches("input, textarea, select")) recalc(); });
}

function setupBulkSelection() {
  document.getElementById("selectAllSkillsBtn").addEventListener("click", () => { document.querySelectorAll(".skill-prof").forEach((cb) => (cb.checked = true)); recalc(); });
  document.getElementById("deselectAllSkillsBtn").addEventListener("click", () => { document.querySelectorAll(".skill-prof").forEach((cb) => (cb.checked = false)); recalc(); });
}

function clearSheet() {
  document.querySelectorAll("input, textarea, select").forEach((el) => { if (!el.id) return; if (el.type === "checkbox") el.checked = false; else if (el.type === "number") el.value = 0; else el.value = ""; });

  ["str", "dex", "con", "int", "wis", "cha"].forEach((ab) => setValue(`${ab}Score`, 10));
  setValue("profBonus", 2);
  setValue("hpMax", 10);
  setValue("hpCurrent", 10);
  setValue("speed", 30);
  setValue("ac", 10);
  setValue("level", 1);
  setValue("hitDice", "1d8");
  setValue("hitDiceTotal", 1);
  setValue("spellcastingAbility", "none");
  setValue("preparedBonus", 0);

  let img = document.getElementById("portraitImg");
  img.src = "";
  img.style.display = "none";
  document.getElementById("portraitPlaceholder").style.display = "block";

  REPEATER_KEYS.forEach((key) => hydrateRepeater(key, [{}]));
  syncPillsFromHiddenFields(true);
  recalc();
}

function readRow(r) {
  const o = {};
  r.querySelectorAll("[data-field]").forEach((f) => { o[f.dataset.field] = f.type === "checkbox" ? f.checked : f.value; });
  return o;
}

function applyFilters() {
  const lvl = document.getElementById("fLevel")?.value || "all";
  const sch = (document.getElementById("fSchool")?.value || "").toLowerCase();
  const prep = !!document.getElementById("fPrepared")?.checked;
  const sterm = (document.getElementById("fSearch")?.value || "").toLowerCase();
  const sort = document.getElementById("fSort")?.value || "level";
  const container = document.getElementById("spellsRepeater");
  const rows = Array.from(container.querySelectorAll(".repeat-row")).map((r) => ({ row: r, data: readRow(r) }));
  let filtered = rows.filter((o) => {
    if (lvl !== "all" && String(o.data.level || "").trim() !== String(lvl).trim()) return false;
    if (sch && sch !== "all" && sch !== "" && (o.data.school || "").toLowerCase() !== sch) return false;
    if (prep && !o.data.prepared) return false;
    if (sterm && !(String(o.data.name || "") + " " + String(o.data.notes || "")).toLowerCase().includes(sterm)) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sort === "level") return parseInt(a.data.level || 0, 10) - parseInt(b.data.level || 0, 10);
    if (sort === "school") return String(a.data.school || "").localeCompare(String(b.data.school || ""));
    return String(a.data.name || "").localeCompare(String(b.data.name || ""));
  });

  container.innerHTML = "";
  filtered.forEach((o) => container.appendChild(o.row));
}

function fullCasterSlots(lvl) {
  const table = {
    1: [2,0,0,0,0,0,0,0,0],
    2: [3,0,0,0,0,0,0,0,0],
    3: [4,2,0,0,0,0,0,0,0],
    4: [4,3,0,0,0,0,0,0,0],
    5: [4,3,2,0,0,0,0,0,0],
    6: [4,3,3,0,0,0,0,0,0],
    7: [4,3,3,1,0,0,0,0,0],
    8: [4,3,3,2,0,0,0,0,0],
    9: [4,3,3,3,1,0,0,0,0],
    10: [4,3,3,3,2,0,0,0,0],
    11: [4,3,3,3,2,1,0,0,0],
    12: [4,3,3,3,2,1,0,0,0],
    13: [4,3,3,3,2,1,1,0,0],
    14: [4,3,3,3,2,1,1,1,0],
    15: [4,3,3,3,2,1,1,1,1],
    16: [4,3,3,3,3,2,1,1,1],
    17: [4,3,3,3,3,2,2,1,1],
    18: [4,3,3,3,3,3,2,2,1],
    19: [4,3,3,3,3,3,3,2,2],
    20: [4,3,3,3,3,3,3,3,3]
  };
  return table[Math.min(20, Math.max(1, lvl))] || table[1];
}

function warlockSlots(lvl) {
  const map = {
    1: [1,0,0,0,0,0,0,0,0],
    2: [2,0,0,0,0,0,0,0,0],
    3: [2,0,0,0,0,0,0,0,0],
    4: [2,0,0,0,0,0,0,0,0],
    5: [2,0,0,0,0,0,0,0,0],
    6: [2,0,0,0,0,0,0,0,0],
    7: [2,1,0,0,0,0,0,0,0],
    8: [2,2,0,0,0,0,0,0,0],
    9: [2,2,1,0,0,0,0,0,0],
    10: [2,2,2,0,0,0,0,0,0],
    11: [2,2,2,1,0,0,0,0,0],
    12: [2,2,2,1,0,0,0,0,0],
    13: [2,2,2,1,1,0,0,0,0],
    14: [2,2,2,1,1,0,0,0,0],
    15: [2,2,2,1,1,1,0,0,0],
    16: [2,2,2,1,1,1,0,0,0],
    17: [2,2,2,1,1,1,1,0,0],
    18: [2,2,2,1,1,1,1,1,0],
    19: [2,2,2,1,1,1,1,1,1],
    20: [2,2,2,2,1,1,1,1,1]
  };
  return map[Math.min(20, Math.max(1, lvl))] || map[1];
}

function applySlotPreset() {
  const type = document.getElementById("casterType")?.value || "full";
  const level = Math.min(20, Math.max(1, parseInt(document.getElementById("casterLevel")?.value, 10) || 1));
  let slots = [];
  if (type === "full") slots = fullCasterSlots(level);
  else if (type === "half") slots = fullCasterSlots(level).map((v) => Math.floor(v / 2));
  else if (type === "third") slots = fullCasterSlots(level).map((v) => Math.floor(v / 3));
  else if (type === "warlock") slots = warlockSlots(level);

  for (let i = 1; i <= 9; i++) {
    setValue(`slotMax${i}`, slots[i - 1] || 0);
    if (document.getElementById("refillSlots")?.checked) setValue(`slotCur${i}`, slots[i - 1] || 0);
  }
  recalc();
}

document.getElementById("applyPreset")?.addEventListener("click", applySlotPreset);

// Setup and wiring executed on DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
  buildSkillsAndSaves();
  buildSlotsTable();
  setupTabsHashPersistence();
  setupSkillFilter();
  setupTheme();
  setupHpButtons();
  setupPills();
  setupImportExport();
  setupRepeaters();
  setupMobileCollapsibles();
  setupGeneralReCalc = setupGeneralRecalc; // keep old naming compatibility if needed
  setupGeneralRecalc();
  setupBulkSelection();

  if (typeof tippy !== "undefined") {
    tippy("[data-tippy]", { theme: "light-border", arrow: true, delay: [100, 50] });
  }

  document.getElementById("randomizeBtn").addEventListener("click", randomizeSheet);
  document.getElementById("newSheetBtn").addEventListener("click", clearSheet);
  document.getElementById("generatePortraitBtn").addEventListener("click", generatePortrait);
  document.getElementById("aiBackstoryBtn").addEventListener("click", generateBackstory);
  document.getElementById("aiAttackNotesBtn").addEventListener("click", generateFlavorText);

  document.getElementById("openSettingsBtn").addEventListener("click", () => { document.getElementById("settingsOverlay").style.display = "flex"; });
  document.getElementById("closeSettingsBtn").addEventListener("click", () => { document.getElementById("settingsOverlay").style.display = "none"; });
  document.getElementById("saveSettingsBtn").addEventListener("click", saveSettingsBtnHandler);
  document.getElementById("saveCloudBtn").addEventListener("click", async () => { if (root.kv) { await saveSettings(); await saveSheetToCloud(); alert("Saved settings and sheet to cloud"); } else { await saveSettings(); await saveSheetToCloud(); alert("Saved settings and sheet locally"); } });
  document.getElementById("loadCloudBtn").addEventListener("click", async () => { await loadSheetFromCloud(); await loadSettingsFromStorage(); alert("Loaded sheet and settings"); });

  document.getElementById("fLevel").addEventListener("change", applyFilters);
  document.getElementById("fSchool").addEventListener("change", applyFilters);
  document.getElementById("fPrepared").addEventListener("change", applyFilters);
  document.getElementById("fSearch").addEventListener("input", applyFilters);
  document.getElementById("fSort").addEventListener("change", applyFilters);
  document.getElementById("clearFilters").addEventListener("click", () => { document.getElementById("fLevel").value = "all"; document.getElementById("fSchool").value = "all"; document.getElementById("fPrepared").checked = false; document.getElementById("fSearch").value = ""; applyFilters(); });

  document.getElementById("importJsonFile").addEventListener("change", function () { if (this.files && this.files[0]) { importJsonFile(this.files[0]); } this.value = ""; });

  addRepeaterRow("spells", { level: 0, name: "Prestidigitation", school: "Transmutation", castTime: "1 action", range: "10 ft", components: "V,S", duration: "Instant", prepared: true, notes: "Minor magical effects" });
  addRepeaterRow("spells", { level: 1, name: "Healing Word", school: "Evocation", castTime: "Bonus action", range: "60 ft", components: "V", duration: "Instant", prepared: false, notes: "" });

  await loadFromKV();
  try { if (getSettings().autoPreset) applySlotPreset(); } catch (e) { console.warn("Auto preset failed", e); }
});

// --- AI wrappers (use Perchance plugins if available) ---
async function aiText(prompt, opts = {}) {
  try { if (root.generateText) return await root.generateText(prompt, opts); } catch (e) { console.warn("AI text plugin failed", e); }
  return "[Fallback AI] " + String(prompt).slice(0, 240) + "...";
}

async function aiImage(prompt, opts = {}) {
  try { if (root.generateImage) return await root.generateImage(prompt, opts); } catch (e) { console.warn("AI image plugin failed", e); }
  return null;
}

async function generatePortrait() {
  let btn = document.getElementById("generatePortraitBtn");
  let img = document.getElementById("portraitImg");
  let ph = document.getElementById("portraitPlaceholder");
  let name = document.getElementById("charName").value || "Hero";
  let race = document.getElementById("race").value || "Human";
  let cls = document.getElementById("classLevel").value || "Adventurer";

  btn.disabled = true; btn.textContent = "✨ Generating..."; ph.textContent = "Painting portrait...";

  try {
    if (root.generateImage) {
      let dataUrl = await root.generateImage(`Fantasy digital art portrait of a D&D character. A ${race} ${cls} named ${name}. Highly detailed, cinematic lighting.`, { resolution: "512x512" });
      img.src = dataUrl; img.style.display = "block"; ph.style.display = "none"; saveToKV();
    } else {
      ph.textContent = "AI generator unavailable.";
    }
  } catch (e) { ph.textContent = "Generation failed. Try again."; console.error(e); } finally { btn.disabled = false; btn.textContent = "✨ Generate Portrait"; }
}

async function generateBackstory() {
  let btn = document.getElementById("aiBackstoryBtn");
  let target = document.getElementById("featuresTraits");
  let name = document.getElementById("charName").value || "The Hero";
  let race = document.getElementById("race").value || "Human";
  let cls = document.getElementById("classLevel").value || "Wizard";
  let bg = document.getElementById("background").value || "Soldier";
  let trait = document.getElementById("personalityTraits").value || "brave but secretive";

  btn.disabled = true; btn.textContent = "⏳ Writing..."; target.value += "\n\nGenerating backstory...";

  try {
    if (root.generateText) {
      let story = await root.generateText(`Write a creative, engaging backstory (about 200 words) for a D&D character named ${name}, a ${race} ${cls} with the ${bg} background. Their personality is: ${trait}. Include a secret they are hiding.`);
      target.value = story; recalc();
    } else { target.value += "\nAI text generator unavailable."; }
  } catch (e) { target.value += "\nError generating backstory."; } finally { btn.disabled = false; btn.textContent = "✨ Generate Backstory"; }
}

async function generateFlavorText() {
  let btn = document.getElementById("aiAttackNotesBtn");
  let target = document.getElementById("attackNotes");

  btn.disabled = true; btn.textContent = "⏳ Writing...";
  try { if (root.generateText) { let text = await root.generateText("Write 3 creative descriptions for combat actions in D&D 5e. Keep it brief."); target.value = text; } else { target.value += "\nAI text generator unavailable."; } } catch (e) { console.error(e); } finally { btn.disabled = false; btn.textContent = "✨ Flavor Text"; }
}

// v7 high-level AI generators
async function generateAbilities(seed) {
  const prompt = 'Generate 6 ability scores (str,dex,con,int,wis,cha) as JSON with numeric values 3-18. Seed: ' + (seed || 'random');
  const txt = await aiText(prompt, { detail: 'short' });
  logOut("<strong>Abilities AI:</strong><pre>" + escapeHtml(txt) + "</pre>");
  try {
    const parsed = JSON.parse(txt);
    ["str","dex","con","int","wis","cha"].forEach((k) => { const id = k + "Score"; if (document.getElementById(id) && parsed[k] !== undefined) document.getElementById(id).value = parsed[k]; });
    recalc(); return;
  } catch (e) { console.warn("Could not parse abilities JSON", e); }
  ["str","dex","con","int","wis","cha"].forEach((k) => setValue(k + "Score", rollStat()));
  recalc();
}

async function generateClass(seed) {
  const prompt = 'Suggest a class, subclass, and starting equipment for a D&D 5e character. Output JSON: {class:"",subclass:"",level:1,startingEquipment:[]}. Seed: ' + (seed || 'none');
  const txt = await aiText(prompt);
  logOut("<strong>Class AI:</strong><pre>" + escapeHtml(txt) + "</pre>");
  try {
    const p = JSON.parse(txt);
    if (p.class) setValue("classLevel", p.class + " " + (p.level || 1));
    if (Array.isArray(p.startingEquipment)) p.startingEquipment.forEach((it) => addRepeaterRow("items", { name: it, qty: 1, weight: 0 }));
    recalc();
  } catch (e) { console.warn("Could not parse class JSON", e); }
}

async function generateSpells(seed, count = 6) {
  const prompt = "Generate " + count + " D&D 5e spells suitable for the character. Output JSON array of spells with fields: level,name,school,castTime,range,components,duration,prepared,notes. Seed:" + (seed || 'random');
  const txt = await aiText(prompt, { detail: document.getElementById("aiDetail")?.value || 'medium' });
  logOut("<strong>Spells AI:</strong><pre>" + escapeHtml(txt) + "</pre>");
  try { const arr = JSON.parse(txt); if (Array.isArray(arr)) arr.forEach((sp) => addRepeaterRow("spells", sp)); applyFilters(); } catch (e) { console.warn("Could not parse spells", e); }
}

async function generateItems(seed, count = 6) {
  const prompt = "Generate " + count + " adventuring items (name,qty,weight,cost,notes) as JSON array. Seed:" + (seed || 'random');
  const txt = await aiText(prompt);
  logOut("<strong>Items AI:</strong><pre>" + escapeHtml(txt) + "</pre>");
  try { const arr = JSON.parse(txt); if (Array.isArray(arr)) arr.forEach((it) => addRepeaterRow("items", it)); recalc(); } catch (e) { console.warn("Could not parse items", e); }
}

async function generateFeats(seed, count = 3) {
  const prompt = "Generate " + count + " feats or features (name,summary,notes) as JSON array. Seed:" + (seed || 'random');
  const txt = await aiText(prompt);
  logOut("<strong>Feats AI:</strong><pre>" + escapeHtml(txt) + "</pre>");
  try { const arr = JSON.parse(txt); if (Array.isArray(arr)) arr.forEach((f) => addRepeaterRow("feats", f)); } catch (e) { console.warn("Could not parse feats", e); }
}

async function generatePortraitSeed(seed) {
  const prompt = "Portrait: Fantasy digital art portrait of a D&D character named " + (seed || 'Adventurer') + ". Cinematic, detailed.";
  const dataUrl = await aiImage(prompt, { resolution: '512x512' });
  if (dataUrl) { const img = document.getElementById("portraitImg"); img.src = dataUrl; img.style.display = "block"; document.getElementById("portraitPlaceholder").style.display = "none"; saveToKV(); logOut("<strong>Portrait generated</strong>"); }
}

async function generateBackstorySeed(seed) {
  const prompt = "Write a vivid ~250 word backstory for a D&D character named " + (seed || document.getElementById("charName")?.value || 'the hero') + ". Include a secret and a hook.";
  const txt = await aiText(prompt, { detail: 'long' });
  logOut("<strong>Backstory AI:</strong><pre>" + escapeHtml(txt) + "</pre>");
  if (document.getElementById("featuresTraits")) document.getElementById("featuresTraits").value = txt;
}

async function generateEntireCharacter() {
  const seed = (document.getElementById("aiSeed")?.value || "").trim();
  logOut("<strong>Starting full AI generation</strong>");
  await generateAbilities(seed);
  await generateClass(seed);
  await generateSpells(seed, 8);
  await generateItems(seed, 8);
  await generateFeats(seed, 4);
  await generateBackstorySeed(seed);
  await generatePortraitSeed(seed);
  logOut("<strong>Generation complete.</strong>");
}

function mapDdbToSheet(obj) {
  if (!obj) return;
  if (obj.name) document.getElementById("charName").value = obj.name;
  if (obj.class && obj.level) document.getElementById("classLevel").value = obj.class + " " + obj.level;
  if (obj.race) document.getElementById("race").value = obj.race;
  if (obj.abilities) { ["str","dex","con","int","wis","cha"].forEach((k) => { const id = k + "Score"; if (obj.abilities[k] !== undefined && document.getElementById(id)) document.getElementById(id).value = obj.abilities[k]; }); }
  if (obj.spells && Array.isArray(obj.spells)) obj.spells.forEach((s) => addRepeaterRow("spells", s));
  if (obj.items && Array.isArray(obj.items)) obj.items.forEach((i) => addRepeaterRow("items", i));
  recalc();
}

function importDdbFile(file) {
  const r = new FileReader();
  r.onload = (e) => { try { const obj = JSON.parse(e.target.result); logOut("<strong>Imported DDB JSON</strong>"); mapDdbToSheet(obj); } catch (err) { alert("Invalid JSON"); } };
  r.readAsText(file);
}

function exportDdbJson() {
  const out = {};
  out.name = document.getElementById("charName")?.value || "";
  out.class = document.getElementById("classLevel")?.value || "";
  out.race = document.getElementById("race")?.value || "";
  out.abilities = {};
  ["str","dex","con","int","wis","cha"].forEach((k) => { const el = document.getElementById(k + "Score"); if (el) out.abilities[k] = parseInt(el.value || 0, 10); });
  out.spells = [];
  try { const spells = document.querySelectorAll("#spellsRepeater .repeat-row"); spells.forEach((r) => { const s = {}; r.querySelectorAll("[data-field]").forEach((f) => { s[f.dataset.field] = f.type === "checkbox" ? f.checked : f.value; }); out.spells.push(s); }); } catch (e) {}
  const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (out.name || "character") + "-ddb.json"; a.click(); URL.revokeObjectURL(a.href);
}

window.v7 = { generateAbilities, generateClass, generateSpells, generateItems, generateFeats, generatePortraitSeed, generateBackstorySeed, generateEntireCharacter };
