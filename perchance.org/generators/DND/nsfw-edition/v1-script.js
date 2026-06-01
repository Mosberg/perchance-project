// Map Perchance plugins to root globals for the standalone HTML environment
const root = window.root || window; // Fallback for testing outside Perchance env

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
  let value = parseFloat(document.getElementById(id)?.value);
  return Number.isFinite(value) ? value : fallback;
}

function setValue(id, value) {
  let el = document.getElementById(id);
  if (!el) return;
  el.value = value;
}

// --- Build UI ---
function buildSkillsAndSaves() {
  let skillsList = document.getElementById("skillsList");
  let savesList = document.getElementById("savingThrowsList");

  skillsList.innerHTML = SKILLS.map(
    (skill) => `
          <label class="list-row skill-row" data-skill-name="${skill.name.toLowerCase()}">
            <input type="checkbox" class="form-check-input skill-prof autosync" id="prof_${skill.key}" data-skill="${skill.key}" data-ability="${skill.ability}" title="Proficient" />
            <input type="checkbox" class="form-check-input autosync" id="exp_${skill.key}" data-expertise="${skill.key}" title="Expertise" />
            <div>
              <div>${skill.name}</div>
              <small>${skill.ability.toUpperCase()}</small>
            </div>
            <div class="score-badge" id="skill-${skill.key}">+0</div>
          </label>
        `,
  ).join("");

  savesList.innerHTML = ABILITIES.map(
    (ab) => `
          <label class="list-row">
            <input type="checkbox" class="form-check-input save-prof autosync" id="saveProf_${ab.key}" data-ability="${ab.key}" title="Proficient" />
            <input type="checkbox" class="form-check-input autosync" id="saveExp_${ab.key}" data-save-expertise="${ab.key}" title="Expertise" />
            <div>
              <div>${ab.name}</div>
              <small>${ab.key.toUpperCase()} save</small>
            </div>
            <div class="score-badge" id="save-${ab.key}">+0</div>
          </label>
        `,
  ).join("");
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
    compactRepeaters: !!document.getElementById("settingCompactRepeaters")
      ?.checked,
    allowMature: !!document.getElementById("settingAllowMature")?.checked,
    weightUnits: document.getElementById("settingWeightUnits")?.value || "lb",
    casterType: document.getElementById("casterType")?.value || "full",
    casterLevel:
      parseInt(document.getElementById("casterLevel")?.value, 10) || 1,
  };
}

function applySettings(settings = {}) {
  if (!settings) return;
  if (settings.theme) document.documentElement.dataset.theme = settings.theme;
  if (settings.parchment)
    document.documentElement.dataset.parchment = settings.parchment;
  if (
    typeof settings.autoSave !== "undefined" &&
    document.getElementById("settingAutoSave")
  )
    document.getElementById("settingAutoSave").checked = !!settings.autoSave;
  if (
    typeof settings.autoPreset !== "undefined" &&
    document.getElementById("settingAutoPreset")
  )
    document.getElementById("settingAutoPreset").checked =
      !!settings.autoPreset;
  if (
    typeof settings.compactRepeaters !== "undefined" &&
    document.getElementById("settingCompactRepeaters")
  ) {
    document.getElementById("settingCompactRepeaters").checked =
      !!settings.compactRepeaters;
    document.documentElement.classList.toggle(
      "compact-repeaters",
      !!settings.compactRepeaters,
    );
  }
  if (
    typeof settings.allowMature !== "undefined" &&
    document.getElementById("settingAllowMature")
  )
    document.getElementById("settingAllowMature").checked = !!settings.allowMature;
  if (settings.weightUnits && document.getElementById("settingWeightUnits"))
    document.getElementById("settingWeightUnits").value = settings.weightUnits;
  if (settings.casterType && document.getElementById("casterType"))
    document.getElementById("casterType").value = settings.casterType;
  if (settings.casterLevel && document.getElementById("casterLevel"))
    document.getElementById("casterLevel").value = settings.casterLevel;
}

async function saveSettings() {
  const s = getSettings();
  if (root.kv) {
    try {
      await root.kv.dnd5eSettings.set("ui", s);
      document.getElementById("saveStatus").textContent = "Settings saved";
      setTimeout(
        () => (document.getElementById("saveStatus").textContent = ""),
        1500,
      );
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem("dnd5eSettings", JSON.stringify(s));
    document.getElementById("saveStatus").textContent =
      "Settings saved locally";
    setTimeout(
      () => (document.getElementById("saveStatus").textContent = ""),
      1500,
    );
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
      document.getElementById("saveStatus").textContent =
        "Sheet saved to Cloud";
    } catch (e) {
      console.error("Save sheet failed", e);
      document.getElementById("saveStatus").textContent = "Sheet save failed";
    }
  } else {
    localStorage.setItem("dnd5eSheet", JSON.stringify(data));
    document.getElementById("saveStatus").textContent = "Sheet saved locally";
  }
  setTimeout(
    () => (document.getElementById("saveStatus").textContent = ""),
    1500,
  );
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

// --- Collect/Hydrate sheet data ---
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
  if (portraitSrc && portraitSrc !== window.location.href)
    data.portraitUrl = portraitSrc;
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

// --- KV & Save Logic ---
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
      setTimeout(() => {
        document.getElementById("saveStatus").textContent = "";
      }, 2000);
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

// --- Calculations ---
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

  let perceptionBonus =
    parseInt(document.getElementById("skill-perception")?.textContent, 10) || 0;
  document.getElementById("passivePerception").textContent =
    10 + perceptionBonus;

  let spellAbility =
    document.getElementById("spellcastingAbility")?.value || "none";
  let spellMod = spellAbility === "none" ? 0 : mods[spellAbility] || 0;
  document.getElementById("spellSaveDc").textContent = 8 + prof + spellMod;

  let initiative = mods.dex || 0;
  if (jack) initiative += halfProf;
  document.getElementById("initiativeDerived").textContent =
    formatMod(initiative);

  let carry = Math.max(0, num("strScore", 10) * 15);
  document.getElementById("carryCapacity").textContent = `${carry} lb`;

  updateHpBar();
  updateItemWeights(carry);
  updateSpellbookSummary(spellMod);

  // Trigger Auto-save
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
  document.getElementById("hpSummary").textContent =
    `${current} / ${max} HP${temp ? ` (+${temp} temp)` : ""}`;
}

function updateItemWeights(carryCapacity) {
  let sum = 0;
  document.querySelectorAll("#itemsRepeater .repeat-row").forEach((row) => {
    let qty = Math.max(
      0,
      parseFloat(row.querySelector('[data-field="qty"]')?.value) || 0,
    );
    let wt = Math.max(
      0,
      parseFloat(row.querySelector('[data-field="weight"]')?.value) || 0,
    );
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

  document.getElementById("inventoryWeightSummary").textContent =
    `${totalText} (${state})`;
}

function updateSpellbookSummary(spellMod) {
  let prepared = 0;
  document
    .querySelectorAll('#spellsRepeater [data-field="prepared"]')
    .forEach((cb) => {
      if (cb.checked) prepared += 1;
    });

  let level = Math.max(1, Math.floor(num("level", 1)));
  let bonus = Math.floor(num("preparedBonus", 0));
  let limit = Math.max(0, level + spellMod + bonus);
  document.getElementById("preparedCount").textContent =
    `${prepared} / ${limit}`;

  let curTotal = 0;
  let maxTotal = 0;
  for (let lvl = 1; lvl <= 9; lvl += 1) {
    curTotal += Math.max(0, Math.floor(num(`slotCur${lvl}`, 0)));
    maxTotal += Math.max(0, Math.floor(num(`slotMax${lvl}`, 0)));
  }
  document.getElementById("slotSummary").textContent =
    `${curTotal} / ${maxTotal}`;
}

// --- Import/Export ---
function exportJson() {
  let data = collectSheetData();
  let blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
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

// --- Randomize ---
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollStat() {
  let rolls = Array.from(
    { length: 4 },
    () => Math.floor(Math.random() * 6) + 1,
  ).sort((a, b) => b - a);
  return rolls[0] + rolls[1] + rolls[2];
}

const TABLES = {
  names: [
    "Arin",
    "Arinel",
    "Arinor",
    "Arin Stoneward",
    "Arin of Greywatch",
    "Belwyn",
    "Belwyne",
    "Belwyn Ashroot",
    "Belwyn the Quiet",
    "Cade",
    "Caderin",
    "Cade Blackwater",
    "Cade of the Iron March",
    "Dorian",
    "Dorian Vale",
    "Dorian the Silver-Tongue",
    "Elira",
    "Elirath",
    "Elira Moonpetal",
    "Elira of the Dawn",
    "Fenric",
    "Fenrick",
    "Fenric Frostborn",
    "Fenric the Keen",
    "Galen",
    "Galenar",
    "Galen Stormbloom",
    "Hestia",
    "Hestiane",
    "Hestia Emberwake",
    "Ilya",
    "Ilyan",
    "Ilya of the Northwind",
    "Kael",
    "Kaelor",
    "Kael Nightstride",
    "Thorne",
    "Thornar",
    "Thorne Ironbriar",
    "Lyra",
    "Lyrath",
    "Lyra Dawnsong",
    "Magnus",
    "Magni",
    "Magnus the Red-Hand",
    "Seraphina",
    "Seraphine",
    "Seraphina Lightweaver",
    "Orion",
    "Orien",
    "Orion Starborn",

    // --- ELVEN (20) ---
    "Aelion",
    "Aeris",
    "Aestra",
    "Aethril",
    "Belthas",
    "Caelith",
    "Daerion",
    "Elowyn",
    "Faelar",
    "Galadrel",
    "Haelion",
    "Ithilwen",
    "Laeriel",
    "Maerion",
    "Naevys",
    "Olorin",
    "Raelith",
    "Saelihn",
    "Thaelar",
    "Vaerion",

    // --- DWARVEN (20) ---
    "Bromdur",
    "Dagnir",
    "Durgrim",
    "Falkrin",
    "Gimrak",
    "Harnor",
    "Kazgrim",
    "Logrim",
    "Morgran",
    "Nundar",
    "Orsik",
    "Ragni",
    "Storn",
    "Thaldrin",
    "Torvak",
    "Uldrim",
    "Vondar",
    "Wulfrin",
    "Yorgrim",
    "Zandor",

    // --- GNOMISH (20) ---
    "Bibble",
    "Coggle",
    "Dinkletop",
    "Fizzwick",
    "Gimble",
    "Hoppin",
    "Jibble",
    "Klinker",
    "Lopwick",
    "Mizzit",
    "Nackle",
    "Pipwick",
    "Quindle",
    "Rizzle",
    "Sprocket",
    "Tinklen",
    "Uzzle",
    "Vimble",
    "Whizzle",
    "Zibbit",

    // --- ORCISH (20) ---
    "Brakka",
    "Drogath",
    "Gorvak",
    "Hroth",
    "Kragga",
    "Loktar",
    "Morgash",
    "Nargul",
    "Orvok",
    "Ragthar",
    "Sharn",
    "Throg",
    "Urgash",
    "Varok",
    "Wargul",
    "Xarg",
    "Yorvak",
    "Zugrash",
    "Grakka",
    "Bolthar",

    // --- HUMAN MEDIEVAL (20) ---
    "Alistair",
    "Beatrice",
    "Cedric",
    "Dunstan",
    "Evelyn",
    "Fendrel",
    "Garrick",
    "Helena",
    "Isolde",
    "Jareth",
    "Kendrick",
    "Lorian",
    "Maribel",
    "Nolan",
    "Oswin",
    "Percival",
    "Rowena",
    "Selwyn",
    "Tristan",
    "Wynne",

    // --- CELESTIAL / AASIMAR (20) ---
    "Aurelia",
    "Caelus",
    "Divinia",
    "Elyndor",
    "Fayriel",
    "Gavriel",
    "Halion",
    "Illiara",
    "Jophiel",
    "Kaelis",
    "Lumina",
    "Mirael",
    "Neriah",
    "Ophira",
    "Phaelon",
    "Quorin",
    "Raviel",
    "Serion",
    "Tiriel",
    "Urielle",

    // --- INFERNAL / TIEFLING (20) ---
    "Azazel",
    "Braxia",
    "Cindros",
    "Draeva",
    "Erebus",
    "Fyria",
    "Graxus",
    "Havria",
    "Ixion",
    "Jezra",
    "Khalix",
    "Lazira",
    "Mordai",
    "Nerox",
    "Orzhira",
    "Pyrion",
    "Ravox",
    "Sazira",
    "Tyrnox",
    "Vezra",

    // --- DRACONIC / DRAGONBORN (20) ---
    "Arjhan",
    "Balasar",
    "Donaar",
    "Ghesh",
    "Heskan",
    "Kriv",
    "Medrash",
    "Nadarr",
    "Pandjed",
    "Raiann",
    "Rhogar",
    "Shamash",
    "Shedinn",
    "Tarhun",
    "Torinn",
    "Uadjit",
    "Vyth",
    "Wystan",
    "Zedaar",
    "Zorvath",
  ],
  races: [
    // --- HUMAN (11) ---
    "Human",
    "Highlander Human",
    "Desert Nomad Human",
    "Imperial Human",
    "Seafarer Human",
    "Witch‑blooded Human",
    "Frontier Settler Human",
    "Scholar‑Caste Human",
    "Raider‑Clan Human",
    "Urbanite Human",
    "Mystic‑Touched Human",

    // --- ELF (11) ---
    "Elf",
    "High Elf",
    "Wood Elf",
    "Moon Elf",
    "Sun Elf",
    "Shadow Elf",
    "Sea Elf",
    "Star Elf",
    "Ashen Elf",
    "Frost Elf",
    "Thorn Elf",

    // --- DWARF (11) ---
    "Dwarf",
    "Mountain Dwarf",
    "Hill Dwarf",
    "Deep Dwarf",
    "Ember‑Forge Dwarf",
    "Stone‑Seer Dwarf",
    "Ironbreaker Dwarf",
    "Runecarver Dwarf",
    "Frostbeard Dwarf",
    "Goldvein Dwarf",
    "Blackhammer Dwarf",

    // --- HALFLING (7) ---
    "Halfling",
    "Lightfoot Halfling",
    "Stout Halfling",
    "Riverfolk Halfling",
    "Burrow‑kin Halfling",
    "Wanderer Halfling",
    "Hearth‑born Halfling",

    // --- TIEFLING (11) ---
    "Tiefling",
    "Infernal Tiefling",
    "Abyssal Tiefling",
    "Ash‑skin Tiefling",
    "Ember‑blood Tiefling",
    "Shadow‑horn Tiefling",
    "Bone‑crowned Tiefling",
    "Iron‑tailed Tiefling",
    "Frost‑touched Tiefling",
    "Void‑marked Tiefling",
    "Gloom‑born Tiefling",

    // --- DRAGONBORN (11) ---
    "Dragonborn",
    "Red Dragonborn",
    "Blue Dragonborn",
    "Green Dragonborn",
    "Black Dragonborn",
    "White Dragonborn",
    "Brass Dragonborn",
    "Bronze Dragonborn",
    "Copper Dragonborn",
    "Gold Dragonborn",
    "Silver Dragonborn",

    // --- GNOME (9) ---
    "Gnome",
    "Rock Gnome",
    "Forest Gnome",
    "Tinker Gnome",
    "Illusionist Gnome",
    "Deep Gnome",
    "Clockwork Gnome",
    "Ember‑spark Gnome",
    "Mist‑whisper Gnome",

    // --- HALF‑ORC (7) ---
    "Half‑Orc",
    "Clan‑born Half‑Orc",
    "City‑blood Half‑Orc",
    "War‑scarred Half‑Orc",
    "Spirit‑touched Half‑Orc",
    "Iron‑jaw Half‑Orc",
    "Frost‑fang Half‑Orc",

    // --- AASIMAR (9) ---
    "Aasimar",
    "Protector Aasimar",
    "Scourge Aasimar",
    "Fallen Aasimar",
    "Dawn‑blessed Aasimar",
    "Star‑touched Aasimar",
    "Radiant‑soul Aasimar",
    "Oracle‑blood Aasimar",
    "Empyrean‑kin Aasimar",

    // --- GOLIATH (7) ---
    "Goliath",
    "Stonehide Goliath",
    "Skywatcher Goliath",
    "Frostpeak Goliath",
    "Boulder‑born Goliath",
    "Thunder‑stride Goliath",
    "Iron‑ridge Goliath",
  ],
  classes: [
    // --- FIGHTER (11) ---
    "Fighter",
    "Fighter — Champion",
    "Fighter — Battle Master",
    "Fighter — Eldritch Knight",
    "Fighter — Gladiator",
    "Fighter — Warlord",
    "Fighter — Duelist",
    "Fighter — Vanguard",
    "Fighter — Mercenary",
    "Fighter — Knight‑Errant",
    "Fighter — Monster‑Hunter",

    // --- WIZARD (11) ---
    "Wizard",
    "Wizard — Evoker",
    "Wizard — Illusionist",
    "Wizard — Necromancer",
    "Wizard — Diviner",
    "Wizard — Abjurer",
    "Wizard — Transmuter",
    "Wizard — Chronomancer",
    "Wizard — Runewright",
    "Wizard — Storm‑Mage",
    "Wizard — Void Scholar",

    // --- ROGUE (11) ---
    "Rogue",
    "Rogue — Thief",
    "Rogue — Assassin",
    "Rogue — Arcane Trickster",
    "Rogue — Scout",
    "Rogue — Swashbuckler",
    "Rogue — Shadowblade",
    "Rogue — Poisoner",
    "Rogue — Infiltrator",
    "Rogue — Gambler",
    "Rogue — Street Ghost",

    // --- CLERIC (11) ---
    "Cleric",
    "Cleric — Life Domain",
    "Cleric — Light Domain",
    "Cleric — War Domain",
    "Cleric — Tempest Domain",
    "Cleric — Grave Domain",
    "Cleric — Trickery Domain",
    "Cleric — Knowledge Domain",
    "Cleric — Forge Domain",
    "Cleric — Nature Domain",
    "Cleric — Order Domain",

    // --- BARBARIAN (11) ---
    "Barbarian",
    "Barbarian — Berserker",
    "Barbarian — Totem Warrior",
    "Barbarian — Storm Herald",
    "Barbarian — Zealot",
    "Barbarian — Beast‑Heart",
    "Barbarian — Juggernaut",
    "Barbarian — Ravager",
    "Barbarian — Frost‑blood",
    "Barbarian — Flame‑born",
    "Barbarian — Spirit‑Caller",

    // --- RANGER (11) ---
    "Ranger",
    "Ranger — Hunter",
    "Ranger — Beastmaster",
    "Ranger — Horizon Walker",
    "Ranger — Gloom Stalker",
    "Ranger — Monster Slayer",
    "Ranger — Trapper",
    "Ranger — Warden",
    "Ranger — Scout",
    "Ranger — Wildrunner",
    "Ranger — Storm‑Tracker",

    // --- PALADIN (11) ---
    "Paladin",
    "Paladin — Devotion",
    "Paladin — Vengeance",
    "Paladin — Ancients",
    "Paladin — Conquest",
    "Paladin — Redemption",
    "Paladin — Oathbreaker",
    "Paladin — Dawn‑Knight",
    "Paladin — Ironbound",
    "Paladin — Star‑Ward",
    "Paladin — Flame‑Vow",

    // --- BARD (11) ---
    "Bard",
    "Bard — College of Lore",
    "Bard — College of Valor",
    "Bard — College of Glamour",
    "Bard — College of Swords",
    "Bard — College of Whispers",
    "Bard — Satirist",
    "Bard — Skald",
    "Bard — Dream‑Singer",
    "Bard — Shadow‑Minstrel",
    "Bard — Battle‑Chanter",

    // --- WARLOCK (11) ---
    "Warlock",
    "Warlock — Fiend Patron",
    "Warlock — Archfey Patron",
    "Warlock — Great Old One Patron",
    "Warlock — Hexblade Patron",
    "Warlock — Celestial Patron",
    "Warlock — Undying Patron",
    "Warlock — Void‑Pact",
    "Warlock — Storm‑Pact",
    "Warlock — Bone‑Pact",
    "Warlock — Mirror‑Pact",

    // --- DRUID (11) ---
    "Druid",
    "Druid — Circle of the Land",
    "Druid — Circle of the Moon",
    "Druid — Circle of Dreams",
    "Druid — Circle of the Shepherd",
    "Druid — Circle of Spores",
    "Druid — Circle of Stars",
    "Druid — Circle of Wildfire",
    "Druid — Circle of Stone‑root",
    "Druid — Circle of the Tide",
    "Druid — Circle of the Sky",

    // --- MONK (11) ---
    "Monk",
    "Monk — Way of the Open Hand",
    "Monk — Way of Shadow",
    "Monk — Way of Four Elements",
    "Monk — Way of the Sun Soul",
    "Monk — Way of the Long Death",
    "Monk — Way of the Kensei",
    "Monk — Way of the Astral Self",
    "Monk — Way of the Drunken Master",
    "Monk — Way of the Iron Body",
    "Monk — Way of the Wind‑Step",

    // --- SORCERER (11) ---
    "Sorcerer",
    "Sorcerer — Draconic Bloodline",
    "Sorcerer — Wild Magic",
    "Sorcerer — Shadow Magic",
    "Sorcerer — Storm Sorcery",
    "Sorcerer — Divine Soul",
    "Sorcerer — Aberrant Mind",
    "Sorcerer — Pyromancer",
    "Sorcerer — Frost‑born",
    "Sorcerer — Bloodline Sorcery",
    "Sorcerer — Star‑Touched",
  ],
  backgrounds: [
    // --- SOLDIER (9) ---
    "Soldier",
    "Soldier — Infantry Veteran",
    "Soldier — Cavalry Scout",
    "Soldier — Siege Engineer",
    "Soldier — Banner‑Bearer",
    "Soldier — Veteran Sergeant",
    "Soldier — Mercenary Footman",
    "Soldier — War Drummer",
    "Soldier — Battlefield Medic",

    // --- SAGE (9) ---
    "Sage",
    "Sage — Archivist",
    "Sage — Arcanist",
    "Sage — Historian",
    "Sage — Linguist",
    "Sage — Astronomer",
    "Sage — Chronicler",
    "Sage — Researcher",
    "Sage — Forbidden Scholar",

    // --- CRIMINAL (9) ---
    "Criminal",
    "Criminal — Thief",
    "Criminal — Smuggler",
    "Criminal — Enforcer",
    "Criminal — Fence",
    "Criminal — Pickpocket",
    "Criminal — Burglar",
    "Criminal — Con‑Artist",
    "Criminal — Blackmailer",

    // --- NOBLE (9) ---
    "Noble",
    "Noble — Courtier",
    "Noble — Aristocrat",
    "Noble — Exiled Noble",
    "Noble — Diplomat",
    "Noble — Heir Apparent",
    "Noble — Fallen House Scion",
    "Noble — Knight‑Retainer",
    "Noble — Patron of the Arts",

    // --- HERMIT (9) ---
    "Hermit",
    "Hermit — Wilderness Hermit",
    "Hermit — Visionary",
    "Hermit — Mad Prophet",
    "Hermit — Alchemist Recluse",
    "Hermit — Cave‑Dweller",
    "Hermit — Exile",
    "Hermit — Mystic",
    "Hermit — Herbalist",

    // --- ACOLYTE (9) ---
    "Acolyte",
    "Acolyte — Temple Servant",
    "Acolyte — Choir Initiate",
    "Acolyte — Shrine Keeper",
    "Acolyte — Pilgrim",
    "Acolyte — Exorcist",
    "Acolyte — Scribe",
    "Acolyte — Relic‑Bearer",
    "Acolyte — Penitent",

    // --- OUTLANDER (9) ---
    "Outlander",
    "Outlander — Hunter",
    "Outlander — Nomad",
    "Outlander — Beast‑Rider",
    "Outlander — Forager",
    "Outlander — Trailblazer",
    "Outlander — Mountain‑born",
    "Outlander — Swamp‑walker",
    "Outlander — Desert‑runner",

    // --- CHARLATAN (9) ---
    "Charlatan",
    "Charlatan — Fortune Teller",
    "Charlatan — Fake Healer",
    "Charlatan — Card Shark",
    "Charlatan — Identity Forger",
    "Charlatan — Snake‑Oil Seller",
    "Charlatan — Trickster",
    "Charlatan — Impersonator",
    "Charlatan — Street Prophet",

    // --- FOLK HERO (9) ---
    "Folk Hero",
    "Folk Hero — Village Defender",
    "Folk Hero — Rebel",
    "Folk Hero — Farmhand",
    "Folk Hero — Local Legend",
    "Folk Hero — Monster‑Slayer",
    "Folk Hero — Shepherd",
    "Folk Hero — Carpenter’s Apprentice",
    "Folk Hero — Runaway",

    // --- GUILD ARTISAN (9) ---
    "Guild Artisan",
    "Guild Artisan — Smith",
    "Guild Artisan — Weaver",
    "Guild Artisan — Carpenter",
    "Guild Artisan — Alchemist",
    "Guild Artisan — Jeweler",
    "Guild Artisan — Cartographer",
    "Guild Artisan — Scribe",
    "Guild Artisan — Shipwright",
  ],
  alignments: [
    // --- LAWFUL GOOD (11) ---
    "Lawful Good",
    "Lawful Good — The Justicar",
    "Lawful Good — The Shield",
    "Lawful Good — The Martyr",
    "Lawful Good — The Watchman",
    "Lawful Good — The Oath‑Keeper",
    "Lawful Good — The Guardian",
    "Lawful Good — The Arbiter",
    "Lawful Good — The Saint",
    "Lawful Good — The Banner‑Bearer",
    "Lawful Good — The Protector",

    // --- NEUTRAL GOOD (11) ---
    "Neutral Good",
    "Neutral Good — The Healer",
    "Neutral Good — The Mediator",
    "Neutral Good — The Shepherd",
    "Neutral Good — The Quiet Hero",
    "Neutral Good — The Peacemaker",
    "Neutral Good — The Samaritan",
    "Neutral Good — The Mentor",
    "Neutral Good — The Advocate",
    "Neutral Good — The Altruist",
    "Neutral Good — The Lantern",

    // --- CHAOTIC GOOD (11) ---
    "Chaotic Good",
    "Chaotic Good — The Rebel",
    "Chaotic Good — The Liberator",
    "Chaotic Good — The Trickster‑Hero",
    "Chaotic Good — The Firebrand",
    "Chaotic Good — The Outlaw‑Saint",
    "Chaotic Good — The Wild‑Heart",
    "Chaotic Good — The Iconoclast",
    "Chaotic Good — The Freedom‑Fighter",
    "Chaotic Good — The Storm‑Child",
    "Chaotic Good — The Rogue‑Angel",

    // --- LAWFUL NEUTRAL (11) ---
    "Lawful Neutral",
    "Lawful Neutral — The Judge",
    "Lawful Neutral — The Magistrate",
    "Lawful Neutral — The Arbiter",
    "Lawful Neutral — The Bureaucrat",
    "Lawful Neutral — The Lawscribe",
    "Lawful Neutral — The Enforcer",
    "Lawful Neutral — The Warden",
    "Lawful Neutral — The Keeper",
    "Lawful Neutral — The Adjudicator",
    "Lawful Neutral — The Regulator",

    // --- TRUE NEUTRAL (11) ---
    "True Neutral",
    "True Neutral — The Observer",
    "True Neutral — The Druid",
    "True Neutral — The Hermit",
    "True Neutral — The Wanderer",
    "True Neutral — The Mediator",
    "True Neutral — The Stoic",
    "True Neutral — The Watcher",
    "True Neutral — The Balanced",
    "True Neutral — The Unmoved",
    "True Neutral — The Gray Sage",

    // --- CHAOTIC NEUTRAL (11) ---
    "Chaotic Neutral",
    "Chaotic Neutral — The Trickster",
    "Chaotic Neutral — The Wanderer",
    "Chaotic Neutral — The Wildcard",
    "Chaotic Neutral — The Unbound",
    "Chaotic Neutral — The Storm‑Walker",
    "Chaotic Neutral — The Madcap",
    "Chaotic Neutral — The Free Spirit",
    "Chaotic Neutral — The Rogue",
    "Chaotic Neutral — The Instigator",
    "Chaotic Neutral — The Whim‑Chaser",

    // --- LAWFUL EVIL (11) ---
    "Lawful Evil",
    "Lawful Evil — The Tyrant",
    "Lawful Evil — The Iron Fist",
    "Lawful Evil — The Schemer",
    "Lawful Evil — The Magistrate of Pain",
    "Lawful Evil — The Enslaver",
    "Lawful Evil — The Dark Judge",
    "Lawful Evil — The Contract‑Binder",
    "Lawful Evil — The Enforcer",
    "Lawful Evil — The Strategist",
    "Lawful Evil — The Black Inquisitor",

    // --- NEUTRAL EVIL (11) ---
    "Neutral Evil",
    "Neutral Evil — The Manipulator",
    "Neutral Evil — The Poisoner",
    "Neutral Evil — The Betrayer",
    "Neutral Evil — The Usurper",
    "Neutral Evil — The Whisperer",
    "Neutral Evil — The Corrupter",
    "Neutral Evil — The Grave‑Dealer",
    "Neutral Evil — The Shadow Broker",
    "Neutral Evil — The Profiteer",
    "Neutral Evil — The Viper",

    // --- CHAOTIC EVIL (11) ---
    "Chaotic Evil",
    "Chaotic Evil — The Destroyer",
    "Chaotic Evil — The Ravager",
    "Chaotic Evil — The Mad Prophet",
    "Chaotic Evil — The Bloodletter",
    "Chaotic Evil — The Anarch",
    "Chaotic Evil — The Demon‑Spawn",
    "Chaotic Evil — The Reaver",
    "Chaotic Evil — The Chaos‑Bringer",
    "Chaotic Evil — The Howling One",
    "Chaotic Evil — The World‑Eater",
  ],
};

function randomizeSheet() {
  setValue("charName", rand(TABLES.names));
  setValue("race", rand(TABLES.races));
  let cls = rand(TABLES.classes);
  setValue("classLevel", `${cls} 1`);
  setValue("background", rand(TABLES.backgrounds));
  setValue("alignment", rand(TABLES.alignments));
  setValue("level", 1);

  ["str", "dex", "con", "int", "wis", "cha"].forEach((ab) =>
    setValue(`${ab}Score`, rollStat()),
  );

  document.querySelectorAll(".save-prof, .skill-prof").forEach((cb) => {
    cb.checked = Math.random() < 0.3;
  });
  document.querySelectorAll('[id^="exp_"], [id^="saveExp_"]').forEach((cb) => {
    cb.checked = Math.random() < 0.1;
  });

  recalc();
}

// --- AI Features (Generators) ---

async function generatePortrait() {
  let btn = document.getElementById("generatePortraitBtn");
  let img = document.getElementById("portraitImg");
  let ph = document.getElementById("portraitPlaceholder");
  let name = document.getElementById("charName").value || "Hero";
  let race = document.getElementById("race").value || "Human";
  let cls = document.getElementById("classLevel").value || "Adventurer";

  btn.disabled = true;
  btn.textContent = "✨ Generating...";
  ph.textContent = "Painting portrait...";

  try {
    // aiImageGenerator Plugin equivalent: root.generateImage
    const allowMature = !!document.getElementById("settingAllowMature")?.checked;
    if (root.generateImage) {
      let prompt = `Fantasy digital art portrait of a D&D character. A ${race} ${cls} named ${name}. Highly detailed, cinematic lighting.`;
      if (allowMature) {
        // Respect policy: allow mature themes but enforce non-explicit output
        prompt = `Fantasy digital art portrait of an adult (21+) D&D character. A ${race} ${cls} named ${name}. Mature, tasteful, and cinematic; NO nudity or explicit sexual content. Clothed or implied-clothing, suggestive mood allowed but non-explicit. Highly detailed, cinematic lighting.`;
        ph.textContent = "Generating mature (non-explicit) portrait...";
      }

      try {
        let dataUrl = await root.generateImage(prompt, { resolution: "512x512" });
        if (dataUrl) {
          img.src = dataUrl;
          img.style.display = "block";
          ph.style.display = "none";
          saveToKV();
        } else {
          ph.textContent = "AI generator returned no image.";
        }
      } catch (e) {
        ph.textContent = "Generation failed. Try again.";
        console.error(e);
      }
    } else {
      ph.textContent = "AI generator unavailable.";
    }
  } catch (e) {
    ph.textContent = "Generation failed. Try again.";
    console.error(e);
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Generate Portrait";
  }
}

async function generateBackstory() {
  let btn = document.getElementById("aiBackstoryBtn");
  let target = document.getElementById("featuresTraits");
  let name = document.getElementById("charName").value || "The Hero";
  let race = document.getElementById("race").value || "Human";
  let cls = document.getElementById("classLevel").value || "Wizard";
  let bg = document.getElementById("background").value || "Soldier";
  let trait =
    document.getElementById("personalityTraits").value || "brave but secretive";

  btn.disabled = true;
  btn.textContent = "⏳ Writing...";
  target.value += "\n\nGenerating backstory...";

  try {
    const allowMature = !!document.getElementById("settingAllowMature")?.checked;
    if (root.generateText) {
      let prompt = `Write a creative, engaging backstory (about 200 words) for a D&D character named ${name}, a ${race} ${cls} with the ${bg} background. Their personality is: ${trait}. Include a secret they are hiding.`;
      if (allowMature) {
        // Allow mature themes but explicitly disallow explicit sexual content
        prompt = `Write a creative, engaging backstory (about 200 words) for a D&D character named ${name}, a ${race} ${cls} with the ${bg} background. Their personality is: ${trait}. Include mature themes (adult relationships, trauma, adult life) but DO NOT include explicit sexual descriptions or pornographic content. Keep language non-graphic.`;
      }

      try {
        let story = await root.generateText(prompt);
        target.value = story;
        recalc();
      } catch (e) {
        target.value += "\nError generating backstory.";
        console.error(e);
      }
    } else {
      target.value += "\nAI text generator unavailable.";
    }
  } catch (e) {
    target.value += "\nError generating backstory.";
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Generate Backstory";
  }
}

async function generateFlavorText() {
  let btn = document.getElementById("aiAttackNotesBtn");
  let target = document.getElementById("attackNotes");

  btn.disabled = true;
  btn.textContent = "⏳ Writing...";

  try {
    if (root.generateText) {
      let text = await root.generateText(
        "Write 3 creative descriptions for combat actions in D&D 5e. Keep it brief.",
      );
      target.value = text;
    } else {
      target.value += "\nAI text generator unavailable.";
    }
  } catch (e) {
    console.error(e);
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Flavor Text";
  }
}

// NSFW Portrait Generator Module
const PortraitGenerator = (() => {
  const VALID_GENDERS = [
    "male",
    "female",
    "sissy",
    "femboy",
    "crossdresser",
    "ladyboy",
    "futanari",
  ];
  const VALID_ACTIONS = [
    "posing",
    "masturbating",
    "bending_over",
    "riding",
    "serving",
    "sucking_dick",
    "eating_ass",
  ];

  async function generateNSFWPortrait(options = {}) {
    const {
      gender = "female",
      action = "posing",
      attributes = [],
      name = "Anonymous",
      race = "Human",
      kinks = [],
    } = options;

    // Validation
    if (!VALID_GENDERS.includes(gender.toLowerCase())) {
      throw new Error(
        `Invalid gender. Valid options: ${VALID_GENDERS.join(", ")}`,
      );
    }
    if (!VALID_ACTIONS.includes(action.toLowerCase())) {
      throw new Error(
        `Invalid action. Valid options: ${VALID_ACTIONS.join(", ")}`,
      );
    }

    try {
      if (!root?.generateImage) throw new Error("Image generator unavailable");

      const prompt = buildNSFWPrompt({
        gender,
        action,
        attributes,
        name,
        race,
        kinks,
      });
      const dataUrl = await root.generateImage(prompt, {
        resolution: "768x1024",
        nsfw: true,
      });

      return {
        success: true,
        dataUrl,
        prompt,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Generation failed:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  function buildNSFWPrompt(params) {
    const { gender, action, attributes, name, race, kinks } = params;
    const descriptor =
      attributes.length > 0 ? `with ${attributes.join(", ")}` : "";

    const kinkPhrase =
      kinks.length > 0 ? `Engaging in ${kinks.join(" and ")}. ` : "";

    return `Erotic digital portrait of ${gender} ${race} named ${name} ${action} ${descriptor}.
            ${kinkPhrase}Highly detailed anatomy, realistic skin textures, intimate framing.
            Sensual lighting, NSFW content, artistic but explicit.`;
  }

  return {
    generate: generateNSFWPortrait,
    VALID_GENDERS,
    VALID_ACTIONS,
  };
})();

// --- UI Interaction Helpers ---
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

  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
  document
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.toggle("active", p.id === tabId));

  if (pushHash && location.hash !== `#${tabId}`) {
    location.hash = tabId;
  }
}

function setupTabsHashPersistence() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab, true));
  });

  let fromHash = location.hash.replace("#", "");
  if (
    fromHash &&
    document.getElementById(fromHash)?.classList.contains("tab-panel")
  ) {
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

  document.getElementById("printBtn").addEventListener("click", () => {
    window.print();
  });
}

async function saveSettingsBtnHandler() {
  await saveSettings();
}

function setupImportExport() {
  document
    .getElementById("exportJsonBtn")
    .addEventListener("click", exportJson);
  document.getElementById("importJsonBtn").addEventListener("click", () => {
    document.getElementById("importJsonFile").click();
  });
  document
    .getElementById("importJsonFile")
    .addEventListener("change", function () {
      if (this.files && this.files[0]) importJsonFile(this.files[0]);
      this.value = "";
    });
}

function setupRepeaters() {
  document
    .getElementById("addAttackBtn")
    .addEventListener("click", () => addRepeaterRow("attacks", {}));
  document
    .getElementById("addItemBtn")
    .addEventListener("click", () =>
      addRepeaterRow("items", { qty: 1, weight: 0 }),
    );
  document
    .getElementById("addSpellBtn")
    .addEventListener("click", () => addRepeaterRow("spells", { level: 0 }));
  document
    .getElementById("addFeatBtn")
    .addEventListener("click", () => addRepeaterRow("feats", {}));

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
      btn.textContent = body.classList.contains("is-collapsed")
        ? "Expand"
        : "Collapse";
    });
  });
}

function setupGeneralRecalc() {
  document.addEventListener("input", (e) => {
    if (e.target.matches("input, textarea, select")) recalc();
  });
  document.addEventListener("change", (e) => {
    if (e.target.matches("input, textarea, select")) recalc();
  });
}

function setupBulkSelection() {
  document
    .getElementById("selectAllSkillsBtn")
    .addEventListener("click", () => {
      document
        .querySelectorAll(".skill-prof")
        .forEach((cb) => (cb.checked = true));
      recalc();
    });
  document
    .getElementById("deselectAllSkillsBtn")
    .addEventListener("click", () => {
      document
        .querySelectorAll(".skill-prof")
        .forEach((cb) => (cb.checked = false));
      recalc();
    });
}

function clearSheet() {
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    if (!el.id) return;
    if (el.type === "checkbox") el.checked = false;
    else if (el.type === "number") el.value = 0;
    else el.value = "";
  });

  ["str", "dex", "con", "int", "wis", "cha"].forEach((ab) =>
    setValue(`${ab}Score`, 10),
  );
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

// --- Spell filters + helpers ---
function readRow(r) {
  const o = {};
  r.querySelectorAll("[data-field]").forEach((f) => {
    o[f.dataset.field] = f.type === "checkbox" ? f.checked : f.value;
  });
  return o;
}

function applyFilters() {
  const lvl = document.getElementById("fLevel")?.value || "all";
  const sch = (document.getElementById("fSchool")?.value || "").toLowerCase();
  const prep = !!document.getElementById("fPrepared")?.checked;
  const sterm = (document.getElementById("fSearch")?.value || "").toLowerCase();
  const sort = document.getElementById("fSort")?.value || "level";
  const container = document.getElementById("spellsRepeater");
  const rows = Array.from(container.querySelectorAll(".repeat-row")).map(
    (r) => ({ row: r, data: readRow(r) }),
  );
  let filtered = rows.filter((o) => {
    if (
      lvl !== "all" &&
      String(o.data.level || "").trim() !== String(lvl).trim()
    )
      return false;
    if (
      sch &&
      sch !== "all" &&
      sch !== "" &&
      (o.data.school || "").toLowerCase() !== sch
    )
      return false;
    if (prep && !o.data.prepared) return false;
    if (
      sterm &&
      !(String(o.data.name || "") + " " + String(o.data.notes || ""))
        .toLowerCase()
        .includes(sterm)
    )
      return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sort === "level")
      return parseInt(a.data.level || 0, 10) - parseInt(b.data.level || 0, 10);
    if (sort === "school")
      return String(a.data.school || "").localeCompare(
        String(b.data.school || ""),
      );
    return String(a.data.name || "").localeCompare(String(b.data.name || ""));
  });

  container.innerHTML = "";
  filtered.forEach((o) => container.appendChild(o.row));
}

// --- Slot presets helpers (copied + reused from prior versions) ---
function fullCasterSlots(lvl) {
  const table = {
    1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    14: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    15: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    16: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 3, 3, 3, 3, 2, 2, 1, 1],
    18: [4, 3, 3, 3, 3, 3, 2, 2, 1],
    19: [4, 3, 3, 3, 3, 3, 3, 2, 2],
    20: [4, 3, 3, 3, 3, 3, 3, 3, 3],
  };
  return table[Math.min(20, Math.max(1, lvl))] || table[1];
}

function warlockSlots(lvl) {
  const map = {
    1: [1, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    4: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    5: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    6: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    7: [2, 1, 0, 0, 0, 0, 0, 0, 0],
    8: [2, 2, 0, 0, 0, 0, 0, 0, 0],
    9: [2, 2, 1, 0, 0, 0, 0, 0, 0],
    10: [2, 2, 2, 0, 0, 0, 0, 0, 0],
    11: [2, 2, 2, 1, 0, 0, 0, 0, 0],
    12: [2, 2, 2, 1, 0, 0, 0, 0, 0],
    13: [2, 2, 2, 1, 1, 0, 0, 0, 0],
    14: [2, 2, 2, 1, 1, 0, 0, 0, 0],
    15: [2, 2, 2, 1, 1, 1, 0, 0, 0],
    16: [2, 2, 2, 1, 1, 1, 0, 0, 0],
    17: [2, 2, 2, 1, 1, 1, 1, 0, 0],
    18: [2, 2, 2, 1, 1, 1, 1, 1, 0],
    19: [2, 2, 2, 1, 1, 1, 1, 1, 1],
    20: [2, 2, 2, 2, 1, 1, 1, 1, 1],
  };
  return map[Math.min(20, Math.max(1, lvl))] || map[1];
}

function applySlotPreset() {
  const type = document.getElementById("casterType")?.value || "full";
  const level = Math.min(
    20,
    Math.max(
      1,
      parseInt(document.getElementById("casterLevel")?.value, 10) || 1,
    ),
  );
  let slots = [];
  if (type === "full") slots = fullCasterSlots(level);
  else if (type === "half")
    slots = fullCasterSlots(level).map((v) => Math.floor(v / 2));
  else if (type === "third")
    slots = fullCasterSlots(level).map((v) => Math.floor(v / 3));
  else if (type === "warlock") slots = warlockSlots(level);

  for (let i = 1; i <= 9; i++) {
    setValue(`slotMax${i}`, slots[i - 1] || 0);
    if (document.getElementById("refillSlots")?.checked)
      setValue(`slotCur${i}`, slots[i - 1] || 0);
  }
  recalc();
}
document
  .getElementById("applyPreset")
  ?.addEventListener("click", applySlotPreset);

// --- Export / Import improved (includes settings) ---
function exportAll() {
  exportJson();
}

// --- Setup and wiring ---
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
  setupGeneralRecalc();
  setupBulkSelection();

  // Tooltip Plugin initialization (using Tippy.js loaded in head)
  if (typeof tippy !== "undefined") {
    tippy("[data-tippy]", {
      theme: "light-border",
      arrow: true,
      delay: [100, 50],
    });
  }

  // AI Buttons
  document
    .getElementById("randomizeBtn")
    .addEventListener("click", randomizeSheet);
  document.getElementById("newSheetBtn").addEventListener("click", clearSheet);
  document
    .getElementById("generatePortraitBtn")
    .addEventListener("click", generatePortrait);
  document
    .getElementById("aiBackstoryBtn")
    .addEventListener("click", generateBackstory);
  document
    .getElementById("aiAttackNotesBtn")
    .addEventListener("click", generateFlavorText);

  // Settings modal wiring
  document.getElementById("openSettingsBtn").addEventListener("click", () => {
    document.getElementById("settingsOverlay").style.display = "flex";
  });
  document.getElementById("closeSettingsBtn").addEventListener("click", () => {
    document.getElementById("settingsOverlay").style.display = "none";
  });
  document
    .getElementById("saveSettingsBtn")
    .addEventListener("click", saveSettingsBtnHandler);
  document
    .getElementById("saveCloudBtn")
    .addEventListener("click", async () => {
      if (root.kv) {
        await saveSettings();
        await saveSheetToCloud();
        alert("Saved settings and sheet to cloud");
      } else {
        await saveSettings();
        await saveSheetToCloud();
        alert("Saved settings and sheet locally");
      }
    });
  document
    .getElementById("loadCloudBtn")
    .addEventListener("click", async () => {
      await loadSheetFromCloud();
      await loadSettingsFromStorage();
      alert("Loaded sheet and settings");
    });

  // Filters wiring
  document.getElementById("fLevel").addEventListener("change", applyFilters);
  document.getElementById("fSchool").addEventListener("change", applyFilters);
  document.getElementById("fPrepared").addEventListener("change", applyFilters);
  document.getElementById("fSearch").addEventListener("input", applyFilters);
  document.getElementById("fSort").addEventListener("change", applyFilters);
  document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("fLevel").value = "all";
    document.getElementById("fSchool").value = "all";
    document.getElementById("fPrepared").checked = false;
    document.getElementById("fSearch").value = "";
    applyFilters();
  });

  // Import file input
  document
    .getElementById("importJsonFile")
    .addEventListener("change", function () {
      if (this.files && this.files[0]) {
        importJsonFile(this.files[0]);
      }
      this.value = "";
    });

  // Repeaters sample
  addRepeaterRow("spells", {
    level: 0,
    name: "Prestidigitation",
    school: "Transmutation",
    castTime: "1 action",
    range: "10 ft",
    components: "V,S",
    duration: "Instant",
    prepared: true,
    notes: "Minor magical effects",
  });
  addRepeaterRow("spells", {
    level: 1,
    name: "Healing Word",
    school: "Evocation",
    castTime: "Bonus action",
    range: "60 ft",
    components: "V",
    duration: "Instant",
    prepared: false,
    notes: "",
  });

  // Load Data from KV
  await loadFromKV();
  // Auto-apply slot preset if enabled in settings
  try {
    if (getSettings().autoPreset) applySlotPreset();
  } catch (e) {
    console.warn("Auto preset failed", e);
  }
});
