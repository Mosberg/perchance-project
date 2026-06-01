// --- Random Helpers ---
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomElement(arr) {
  return rand(arr);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sample(arr, count) {
  return shuffle(arr).slice(0, Math.min(count, arr.length));
}

function rollStat() {
  const rolls = Array.from({ length: 4 }, () => randomInt(1, 6)).sort(
    (a, b) => b - a,
  );
  return rolls[0] + rolls[1] + rolls[2];
}

// --- Unified Data Tables ---
const TABLES = {
  names: [
    "Arin",
    "Belwyn",
    "Cade",
    "Dorian",
    "Elira",
    "Fenric",
    "Galen",
    "Hestia",
    "Ilya",
    "Kael",
    "Thorne",
    "Lyra",
    "Magnus",
    "Seraphina",
    "Orion",
    "Aelion",
    "Donaar",
    "Lysandra",
    "Morgana",
    "Velvet",
    "Scarlett",
    "Raven",
    "Jasmine",
    "Lola",
    "Candy",
    "Bambi",
    "Sienna",
    "Dahlia",
    "Violet",
    "Ruby",
    "Roxanne",
    "Chastity",
    "Faith",
    "Hope",
    "Mercy",
    "Prudence",
    "Temperance",
    "Verity",
    "Grace",
  ],

  races: [
    "Human",
    "High Elf",
    "Wood Elf",
    "Dwarf",
    "Halfling",
    "Tiefling",
    "Dragonborn",
    "Gnome",
    "Half-Orc",
    "Aasimar",
    "Goliath",
    "Fairy",
    "Nymph",
    "Succubus/Incubus",
    "Drow",
    "Half-Elf",
    "Tabaxi",
    "Kenku",
    "Demon",
    "Angel",
    "Vampire",
    "Werewolf",
    "Changeling",
    "Centaur",
    "Merfolk",
  ],

  classes: [
    "Courtesan",
    "Pleasure Slave",
    "Entertainer",
    "Bard",
    "Sorcerer",
    "Warlock",
    "Rogue",
    "Monk",
    "Cleric - Love Domain",
    "Paladin - Oath of Lust",
    "Druid",
    "Fighter",
    "Wizard",
    "Ranger",
    "Dominatrix",
    "Submissive",
    "Switch",
    "Pet",
    "Owner",
    "Master",
    "Mistress",
    "Slave",
    "Toy",
  ],

  backgrounds: [
    "Pleasure Slave",
    "Courtesan",
    "Escort",
    "Dancer",
    "Seductress/Seducer",
    "Harem Dweller",
    "Brothel Worker",
    "Street Walker",
    "Noble's Mistress",
    "Temple Prostitute",
    "Pirate's Toy",
    "Gladiator",
    "Acolyte",
    "Criminal",
    "Entertainer",
    "Outlander",
    "BDSM Practitioner",
    "Sugar Baby",
    "Porn Star",
    "Cam Model",
    "Sex Therapist",
    "Fetish Model",
  ],

  alignments: [
    "Chaotic Good",
    "Chaotic Neutral",
    "Chaotic Evil",
    "Neutral Good",
    "True Neutral",
    "Neutral Evil",
    "Lawful Good",
    "Lawful Neutral",
    "Lawful Evil",
    "Chaotic Sexual",
    "Neutral Sexual",
  ],

  genders: [
    "Female",
    "Male",
    "Futanari",
    "Femboy",
    "Sissy",
    "Crossdresser",
    "Ladyboy",
    "Shemale",
    "Transgender",
    "Genderfluid",
    "Non-binary",
    "Hermaphrodite",
    "Agender",
    "Bigender",
    "Demiboy",
    "Demigirl",
    "Two-Spirit",
    "Genderqueer",
    "Transmasc",
    "Transfem",
    "Intersex",
  ],

  bodyTypes: [
    "Slender",
    "Athletic",
    "Curvy",
    "Voluptuous",
    "Petite",
    "Muscular",
    "Hourglass",
    "Pear",
    "Apple",
    "BBW",
    "Slim-thick",
    "Chubby",
    "Bodybuilder",
    "Twink",
    "Bear",
    "Otter",
    "Wolf",
    "Thicc",
    "Stocky",
  ],

  orientations: [
    "Heterosexual",
    "Homosexual",
    "Bisexual",
    "Pansexual",
    "Lesbian",
    "Gay",
    "Demisexual",
    "Polyamorous",
    "Asexual",
    "Queer",
    "Omnisexual",
    "Sapiosexual",
    "Straight",
    "Bi",
    "Pan",
    "Ace",
  ],

  kinkLevels: [
    "Vanilla",
    "Curious",
    "Exploring",
    "Experienced",
    "Kinky",
    "Extreme",
    "Depraved",
  ],

  kinksList: [
    "BDSM",
    "Bondage",
    "Domination",
    "Submission",
    "Sadomasochism",
    "Petplay",
    "Ageplay",
    "DDLG",
    "ABDL",
    "Furries",
    "Vore",
    "Exhibitionism",
    "Voyeurism",
    "Cuckoldry",
    "Swinging",
    "Watersports",
    "Scat",
    "Necrophilia",
    "Bestiality",
    "Incest",
    "Foot Worship",
    "Breeding",
    "Praise Kink",
    "Degradation",
    "Humiliation",
    "Edgeplay",
    "Knifeplay",
    "Bloodplay",
    "Cannibalism",
    "Guro",
    "Snuff",
    "Hypnosis",
    "Mind Control",
    "Transformation",
    "Inflation",
    "Macrophilia",
    "Microphilia",
    "Pegging",
    "Shibari",
  ],

  fetishesList: [
    "Feet",
    "Latex",
    "Leather",
    "Uniforms",
    "Pregnancy",
    "Piercings",
    "Tattoos",
    "Scars",
    "Stretch Marks",
    "Body Hair",
    "Disabled",
    "Amputee",
    "Wheelchair",
  ],

  sexualActsList: [
    "Oral",
    "Anal",
    "Vaginal",
    "Fisting",
    "Pegging",
    "Double Penetration",
    "Gangbang",
    "Creampie",
    "Facials",
    "Rimming",
    "Teabagging",
    "Facesitting",
    "Cunnilingus",
    "Fellatio",
    "Anilingus",
    "Breast Play",
    "Nipple Play",
    "Genital Play",
    "Ass Play",
    "Foot Play",
    "Handjob",
    "Footjob",
    "Titjob",
    "Thighjob",
    "Edging",
    "Orgasm Denial",
    "Orgasm Control",
    "Orgasm Torture",
    "Sensory Deprivation",
    "Temperature Play",
    "Wax Play",
    "Electroplay",
    "Sound Play",
    "Figging",
  ],

  powerDynamicsList: [
    "Master/Slave",
    "Daddy/Boy",
    "Mommy/Girl",
    "Owner/Pet",
    "Teacher/Student",
    "Boss/Employee",
    "Doctor/Patient",
    "Cop/Criminal",
    "Priest/Sinner",
    "King/Subject",
    "Queen/Subject",
    "Prince/Princess",
    "Knight/Damsel",
    "Warrior/Captive",
    "Alchemist/Test Subject",
    "Dom",
    "Sub",
    "Switch",
    "Primal",
    "Handler",
    "Brat",
  ],

  equipmentsList: [
    "Vibrators",
    "Dildos",
    "Plugs",
    "Gags",
    "Cuffs",
    "Whips",
    "Crops",
    "Chastity Devices",
    "Fucking Machines",
    "Strap-ons",
    "Harnesses",
    "Collars",
    "Leashes",
    "Blindfolds",
    "Masks",
    "Latex Suits",
    "Leather Gear",
    "Corsets",
    "Stockings",
    "Heels",
    "Boots",
    "Gloves",
    "Electrostim Devices",
    "Temperature Toys",
    "Wax Tools",
    "Knives",
    "Needles",
    "Hooks",
  ],

  extremeContentsList: [
    "Guro",
    "Snuff",
    "Vore",
    "Cannibalism",
    "Amputation",
    "Dismemberment",
    "Decapitation",
    "Disfigurement",
    "Mutilation",
    "Torture",
    "Crucifixion",
    "Impalement",
    "Drowning",
    "Burning",
    "Freezing",
    "Electrocution",
    "Poisoning",
    "Drugging",
    "Mindbreak",
    "Brainwashing",
    "Stockholm Syndrome",
    "Gaslighting",
    "Manipulation",
    "Coercion",
    "Blackmail",
    "Extortion",
    "Kidnapping",
    "Rape",
    "Non-con",
    "Dub-con",
  ],

  rolesList: [
    "Daddy",
    "Mommy",
    "Babygirl",
    "Boy",
    "Pup",
    "Kitten",
    "Bunny",
    "Fox",
    "Little",
    "Caregiver",
  ],

  intensitiesList: ["Vanilla", "Soft", "Kinky", "Hardcore", "Extreme"],

  pairingsList: [
    "Monogamous",
    "Poly",
    "Open",
    "Swinging",
    "Cuckold",
    "Hotwife",
    "Gangbang",
    "Orgy",
    "Solo",
    "Group",
  ],

  fluidsList: [
    "Creampie",
    "Facials",
    "Bukkake",
    "Swallowing",
    "Spitting",
    "Squirting",
    "Watersports",
    "Scat",
    "Blood",
    "Lactation",
  ],

  sensoryPlaysList: [
    "Feathers",
    "Ice",
    "Wax",
    "Vibrations",
    "Scents",
    "Tastes",
    "Textures",
    "Sounds",
    "Lights",
    "Restriction",
  ],

  transformationStagesList: [
    "Initial Resistance",
    "Growing Curiosity",
    "First Submission",
    "Eager Participation",
    "Total Conversion",
    "Beyond Original Limits",
  ],

  corruptionLevelsList: [
    "Pure",
    "Tempted",
    "Experienced",
    "Depraved",
    "Irreversible",
    "Legendary Debauchery",
  ],

  forbiddenMagicsList: [
    "Orgasmomancy",
    "Flesh Sculpting",
    "Soul Binding",
    "Pleasure Paradox",
    "Eldritch Awakening",
  ],

  exoticFluidsList: [
    "Ichor",
    "Stardust",
    "Liquid Shadow",
    "Primordial Essence",
    "Dragon's Milk",
    "Angel's Tears",
  ],

  genitalHair: ["Shaved", "Trimmed", "Natural", "Bushy", "Styled"],

  chestCupSizes: ["A", "B", "C", "D", "DD", "E"],

  portraitTags: [
    "high detail",
    "fantasy character",
    "sensual lighting",
    "realistic textures",
    "dramatic composition",
    "ornate accessories",
    "cinematic glow",
    "soft skin shading",
    "adult fantasy",
  ],

  portraitPoses: [
    "standing",
    "kneeling",
    "reclining",
    "leaning against a wall",
    "sitting on a throne",
    "arched pose",
    "over-the-shoulder pose",
    "lounging",
  ],

  portraitClothing: ["nude", "lingerie", "partially clothed", "silk robes"],

  portraitArousal: ["low", "medium", "high"],

  spellSchools: [
    "Enchantment",
    "Transmutation",
    "Illusion",
    "Necromancy",
    "Conjuration",
  ],

  spellTypes: [
    "Touch",
    "Aura",
    "Charm",
    "Control",
    "Whisper",
    "Mark",
    "Caress",
  ],

  spellThemes: [
    "Ecstasy",
    "Submission",
    "Dominance",
    "Arousal",
    "Lust",
    "Pleasure",
  ],

  spellCastTimes: ["1 action", "1 bonus action", "1 hour"],

  spellRanges: ["Touch", "Self", "30 ft", "60 ft"],

  spellDurations: [
    "Instantaneous",
    "Concentration, up to 1 min",
    "1 hour",
  ],

  backstoryTones: {
    mild: {
      label: "sensual, romantic",
      words: 200,
      prompt:
        "Focus on desire, romance, emotional intimacy, and suggestive adult themes without graphic anatomical detail.",
    },
    explicit: {
      label: "explicit, detailed",
      words: 250,
      prompt:
        "Include explicit adult themes, notable experiences, sexual awakening, and intimate details.",
    },
    extreme: {
      label: "extremely explicit, detailed",
      words: 300,
      prompt:
        "Include highly explicit adult themes, transformative events, notable encounters, and intense erotic detail.",
    },
  },

  historyTones: {
    mild:
      "Describe their romantic and sexual history, including first loves, significant relationships, and how they discovered their sexuality.",
    explicit:
      "Include explicit details of their sexual awakening, first experiences, number and types of partners, memorable encounters, discovery of kinks, and current sexual practices.",
    extreme:
      "Include explicit details of first sexual experiences, number of partners, specific acts performed, memorable encounters, kink discovery, unusual or extreme experiences, and current sexual practices in detail.",
  },

  complicationsPrompts: [
    "addictions",
    "dangerous attractions",
    "unhealthy sexual patterns",
    "taboo desires",
    "risky behaviors",
    "social consequences",
    "emotional consequences",
  ],

  flavorCombatPrompts: [
    "sensual feint",
    "teasing dominance",
    "intoxicating magic",
    "provocative distraction",
    "alluring finishing move",
  ],
};

// --- Table Access Helpers ---
function fromTable(key) {
  return rand(TABLES[key]);
}

function manyFromTable(key, min = 1, max = 1) {
  return sample(TABLES[key], randomInt(min, max));
}

// --- Main Sheet Randomizer ---
function randomizeSheet() {
  setValue("charName", fromTable("names"));
  setValue("race", fromTable("races"));

  const cls = fromTable("classes");
  setValue("classLevel", `${cls} 1`);

  setValue("background", fromTable("backgrounds"));
  setValue("alignment", fromTable("alignments"));
  setValue("level", 1);
  setValue("gender", fromTable("genders"));
  setValue("bodyType", fromTable("bodyTypes"));
  setValue("sexualOrientation", fromTable("orientations"));
  setValue("kinkLevels", fromTable("kinkLevels"));
  setValue("kinkList", fromTable("kinksList"));
  setValue("fetishList", fromTable("fetishesList"));
  setValue("sexualActList", fromTable("sexualActsList"));
  setValue("powerDynamicList", fromTable("powerDynamicsList"));
  setValue("equipmentList", fromTable("equipmentsList"));
  setValue("extremeContentList", fromTable("extremeContentsList"));
  setValue("roleList", fromTable("rolesList"));
  setValue("intensitiesList", fromTable("intensitiesList"));
  setValue("pairingsList", fromTable("pairingsList"));
  setValue("fluidsList", fromTable("fluidsList"));
  setValue("sensoryPlaysList", fromTable("sensoryPlaysList"));
  setValue("transformationStagesList", fromTable("transformationStagesList"));
  setValue("corruptionLevelsList", fromTable("corruptionLevelsList"));
  setValue("forbiddenMagicsList", fromTable("forbiddenMagicsList"));
  setValue("exoticFluidsList", fromTable("exoticFluidsList"));

  ["str", "dex", "con", "int", "wis", "cha"].forEach((ab) => {
    setValue(`${ab}Score`, rollStat());
  });

  // NSFW-specific randomization driven entirely by TABLES
  setValue("cockSize", `${randomInt(1, 10)} inches`);
  setValue(
    "chestSize",
    `${randomInt(1, 40)}${fromTable("chestCupSizes")}`,
  );
  setValue("bodyHair", fromTable("genitalHair"));
  setValue("libido", randomInt(1, 10));
  setValue("stamina", randomInt(1, 10));

  const kinks = manyFromTable("kinksList", 2, 5);
  setValue("primaryKinks", kinks.join(", "));

  document.querySelectorAll(".save-prof, .skill-prof").forEach((cb) => {
    cb.checked = Math.random() < 0.3;
  });

  document.querySelectorAll('[id^="exp_"], [id^="saveExp_"]').forEach((cb) => {
    cb.checked = Math.random() < 0.1;
  });

  recalc();
}

// --- NSFW Portrait Generator ---
async function generateNSFWPortrait() {
  const btn = document.getElementById("generatePortraitBtn");
  const img = document.getElementById("portraitImg");
  const ph = document.getElementById("portraitPlaceholder");

  const name = document.getElementById("charName")?.value || "Beautiful Stranger";
  const race = document.getElementById("race")?.value || "Human";
  const gender = document.getElementById("gender")?.value || "Female";
  const bodyType = document.getElementById("bodyType")?.value || "Curvy";
  const kinks = document.getElementById("primaryKinks")?.value || "";
  const level = document.getElementById("settingNSFWLevel")?.value || "explicit";

  btn.disabled = true;
  btn.textContent = "✨ Generating...";
  ph.textContent = "Creating portrait...";

  try {
    if (root.generateImage) {
      const explicitLevel =
        level === "extreme"
          ? "Hardcore explicit"
          : level === "explicit"
            ? "Explicit"
            : "Suggestive";

      const tags = manyFromTable("portraitTags", 3, 3);
      const pose = fromTable("portraitPoses");

      const clothing =
        level === "extreme"
          ? "nude"
          : level === "explicit"
            ? "nude"
            : rand(TABLES.portraitClothing.filter((item) => item !== "nude"));

      const arousal = level === "mild" ? "low" : fromTable("portraitArousal");

      let prompt = `Hyper-detailed adult fantasy portrait of a ${race} ${gender} character named ${name}. `;
      prompt += `${bodyType} body type. `;
      prompt += `Pose: ${pose}. `;
      prompt += `Clothing: ${clothing}. `;
      prompt += `Mood: ${explicitLevel}. `;
      prompt += `Arousal: ${arousal}. `;

      if (kinks.trim()) {
        prompt += `Suggested themes inspired by: ${kinks}. `;
      }

      if (level === "explicit" || level === "extreme") {
        prompt += "Detailed anatomical correctness, realistic textures, dynamic lighting. ";
        prompt += `Tags: ${tags.join(", ")}. `;
      } else {
        prompt += "Suggestive composition with intimate but non-graphic presentation. ";
      }

      prompt += "High quality digital art, fantasy aesthetic, sensual lighting, adult character artwork.";

      const dataUrl = await root.generateImage(prompt, { resolution: "512x512" });

      img.src = dataUrl;
      img.style.display = "block";
      ph.style.display = "none";

      if (typeof saveToKV === "function") {
        saveToKV();
      }
    } else {
      ph.textContent = "AI generator unavailable.";
    }
  } catch (e) {
    ph.textContent = "Generation failed. Try again.";
    console.error(e);
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Generate NSFW Portrait";
  }
}

// --- Adult Spell Generator ---
async function generateAdultSpell() {
  const school = fromTable("spellSchools");
  const type = fromTable("spellTypes");
  const level = randomInt(0, 3);

  const spell = {
    level,
    school,
    name: `${type} of ${fromTable("spellThemes")}`,
    castTime: fromTable("spellCastTimes"),
    range: fromTable("spellRanges"),
    components: "V, S",
    duration: fromTable("spellDurations"),
    prepared: true,
    concentration: Math.random() > 0.5,
    ritual: false,
    notes: `Erotic spell of ${school.toLowerCase()}. Inflicts ${type.toLowerCase()} effects on targets.`,
  };

  addRepeaterRow("spells", spell);
  recalc();
}

// --- NSFW Backstory Generator ---
async function generateNSFWBackstory() {
  const btn = document.getElementById("aiBackstoryBtn");
  const target = document.getElementById("featuresTraits");

  const name = document.getElementById("charName")?.value || "The Lover";
  const race = document.getElementById("race")?.value || "Human";
  const cls = document.getElementById("classLevel")?.value || "Courtesan";
  const bg = document.getElementById("background")?.value || "Pleasure Slave";
  const gender = document.getElementById("gender")?.value || "Female";
  const orientation =
    document.getElementById("sexualOrientation")?.value || "Pansexual";
  const kinkLevel =
    document.getElementById("kinkLevels")?.value || "Experienced";
  const level = document.getElementById("settingNSFWLevel")?.value || "explicit";

  btn.disabled = true;
  btn.textContent = "⏳ Writing...";
  target.value += "\n\nGenerating backstory...";

  try {
    if (root.generateText) {
      const tone = TABLES.backstoryTones[level] || TABLES.backstoryTones.explicit;

      const instruction = `Write a ${tone.label} backstory of about ${tone.words} words for a fantasy TTRPG character named ${name}, a ${gender} ${race} ${cls} with the ${bg} background. They are ${orientation} and have ${kinkLevel} experience. Include how they discovered their desires, formative relationships, notable encounters, and how their background shaped them. ${tone.prompt}`;

      const story = await root.generateText(instruction);
      target.value = story;
      recalc();
    } else {
      target.value += "\nAI text generator unavailable.";
    }
  } catch (e) {
    target.value += "\nError generating backstory.";
    console.error(e);
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Generate NSFW Backstory";
  }
}

// --- NSFW Sexual History Generator ---
async function generateSexHistory() {
  const btn = document.getElementById("aiSexHistoryBtn");
  const target = document.getElementById("sexualHistory");

  const name = document.getElementById("charName")?.value || "Nameless";
  const gender = document.getElementById("gender")?.value || "Female";
  const race = document.getElementById("race")?.value || "Human";
  const age = document.getElementById("level")?.value || "Young";
  const kinkLevel =
    document.getElementById("kinkLevels")?.value || "Experienced";
  const level = document.getElementById("settingNSFWLevel")?.value || "explicit";

  btn.disabled = true;
  btn.textContent = "⏳ Writing...";

  try {
    if (root.generateText) {
      const toneInstruction =
        TABLES.historyTones[level] || TABLES.historyTones.explicit;

      const instruction = `Write a detailed sexual history of about 200 words for ${name}, a ${age}-year-old ${gender} ${race} who has ${kinkLevel} kink experience. ${toneInstruction}`;

      const text = await root.generateText(instruction);
      target.value = text;
    } else {
      target.value += "\nAI generator unavailable.";
    }
  } catch (e) {
    console.error(e);
    target.value += "\nError generating sexual history.";
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Generate History";
  }
}

// --- NSFW Complications Generator ---
async function generateComplications() {
  const btn = document.getElementById("aiComplicationsBtn");
  const target = document.getElementById("sexualComplications");

  btn.disabled = true;
  btn.textContent = "⏳ Writing...";

  try {
    if (root.generateText) {
      const themes = sample(TABLES.complicationsPrompts, 5).join(", ");
      const text = await root.generateText(
        `Generate 5-8 dark sexual complications or vices for a fantasy TTRPG character in an adult campaign. Include themes such as ${themes}. Be creative and character-driven.`,
      );
      target.value = text;
    } else {
      target.value += "\nAI generator unavailable.";
    }
  } catch (e) {
    console.error(e);
    target.value += "\nError generating complications.";
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Generate";
  }
}

// --- Flavor Text Generator ---
async function generateFlavorText() {
  const btn = document.getElementById("aiAttackNotesBtn");
  const target = document.getElementById("attackNotes");

  btn.disabled = true;
  btn.textContent = "⏳ Writing...";

  try {
    if (root.generateText) {
      const themes = sample(TABLES.flavorCombatPrompts, 3).join(", ");
      const text = await root.generateText(
        `Write 3 creative sensual descriptions for combat actions in an adult fantasy 5e-style campaign. Use themes such as ${themes}. Keep each description distinct and vivid.`,
      );
      target.value = text;
    } else {
      target.value += "\nAI text generator unavailable.";
    }
  } catch (e) {
    console.error(e);
    target.value += "\nError generating flavor text.";
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Flavor Text";
  }
}
